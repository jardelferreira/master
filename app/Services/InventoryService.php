<?php

namespace App\Services;

use App\Enum\InventoryStatusEnum;
use App\Models\Inventory;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    private StockMovementService $stockMovementService;

    public function __construct(StockMovementService $stockMovementService)
    {
        $this->stockMovementService = $stockMovementService;
    }

    public function create(array $data, int $createdBy): Inventory
    {
        return DB::transaction(function () use ($data, $createdBy) {

            $inventory = Inventory::create([
                'name'        => $data['name'],
                'project_id'  => $data['project_id'],
                'due_date'    => $data['due_date'] ?? null,
                'notes'       => $data['notes'] ?? null,
                'blind_count' => $data['blind_count'] ?? false,
                'created_by'  => $createdBy,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Usuários responsáveis
            |--------------------------------------------------------------------------
            */

            $inventory->users()->attach(
                collect($data['user_ids'])
                    ->mapWithKeys(fn($id) => [
                        $id => ['assigned_at' => now()],
                    ])
                    ->toArray()
            );

            /*
            |--------------------------------------------------------------------------
            | Itens do inventário (snapshot da quantidade atual)
            |--------------------------------------------------------------------------
            */

            $stocks = Stock::query()
                ->whereIn('id', $data['stock_ids'])
                ->get();

            foreach ($stocks as $stock) {
                $inventory->items()->create([
                    'stock_id'        => $stock->id,
                    'system_quantity' => $stock->stock_quantity,
                ]);
            }

            return $inventory->load(['users', 'items']);
        });
    }

    public function finish(Inventory $inventory): Inventory
    {
        
        $this->ensureStatus(
            $inventory,
            fn($status) => $status->canFinish(),
            'O inventário não pode ser finalizado.',
        );

        if ($this->hasPendingItems($inventory)) {
            throw ValidationException::withMessages([
                'inventory' => 'Ainda existem itens pendentes.',
            ]);
        }

        $inventory->update([
            'status'      => InventoryStatusEnum::FINISHED,
            'finished_at' => now(),
        ]);

        return $inventory->refresh();
    }

    public function approve(
        Inventory $inventory,
        User $approvedBy,
    ): Inventory {
        $this->ensureStatus(
            $inventory,
            fn($status) => $status->canApprove(),
            'O inventário não pode ser aprovado.',
        );

        return DB::transaction(function () use ($inventory, $approvedBy) {

            $items = $this->adjustments($inventory);

            $this->applyAdjustments($items, $approvedBy);

            $this->markAsApproved($inventory, $approvedBy);

            return $inventory->refresh();
        });
    }

    public function cancel(Inventory $inventory): Inventory
    {
        $this->ensureStatus(
            $inventory,
            fn($status) => $status->canCancel(),
            'O inventário não pode ser cancelado.',
        );

        $inventory->update([
            'status' => InventoryStatusEnum::CANCELLED,
        ]);

        return $inventory->refresh();
    }

    /*
    |--------------------------------------------------------------------------
    | Privados
    |--------------------------------------------------------------------------
    */

    private function applyAdjustments(
        Collection $items,
        User $approvedBy,
    ): void {
        foreach ($items as $item) {
            $this->stockMovementService->adjust(
                stock: $item->stock,
                newQuantity: $item->newQuantity(),
                userId: $approvedBy->id,
                notes: sprintf(
                    'Ajuste realizado pelo inventário "%s".',
                    $item->inventory->name,
                ),
                meta: $item->movementMeta(),
            );
        }
    }

    private function markAsApproved(
        Inventory $inventory,
        User $approvedBy,
    ): void {
        $inventory->update([
            'status'      => InventoryStatusEnum::APPROVED,
            'approved_by' => $approvedBy->id,
            'approved_at' => now(),
        ]);
    }

    private function adjustments(Inventory $inventory): Collection
    {
        return $inventory
            ->items()
            ->with(['stock', 'inventory'])
            ->get()
            ->filter
            ->needsAdjustment()
            ->values();
    }

    private function ensureStatus(
        Inventory $inventory,
        callable $callback,
        string $message,
    ): void {
        if (! $callback($inventory->status)) {
            throw ValidationException::withMessages([
                'inventory' => $message,
            ]);
        }
    }

    private function hasPendingItems(Inventory $inventory): bool
    {
        return $inventory
            ->items()
            ->whereNull('counted_at')
            ->exists();
    }
}