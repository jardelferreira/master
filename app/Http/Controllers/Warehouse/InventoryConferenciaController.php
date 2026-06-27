<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Resources\Inventory\InventoryItemShowResource;
use App\Http\Resources\Inventory\InventoryShowResource;
use App\Models\Inventory;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryConferenciaController extends BaseController
{
    /**
     * Lista os inventários vinculados ao usuário logado (guard stock).
     */
    public function index()
    {
        $userId = Auth::guard('warehouse')->id();

        $inventories = Inventory::query()
            ->with(['project:id,name', 'items'])
            ->whereHas(
                'users',
                fn($q) => $q->where('users.id', $userId)
            )
            ->latest()
            ->get()
            ->map(function (Inventory $inventory) {
                $items   = $inventory->items;
                $total   = $items->count();
                $counted = $items->filter->hasBeenCounted()->count();

                return [
                    'id'      => $inventory->id,
                    'name'    => $inventory->name,
                    'project' => [
                        'id'   => $inventory->project?->id,
                        'name' => $inventory->project?->name,
                    ],
                    'due_date' => $inventory->due_date?->format('d/m/Y'),
                    'status'   => [
                        'value' => $inventory->status->value,
                        'label' => $inventory->status->label(),
                        'badge' => $inventory->status->badgeClass(),
                    ],
                    'progress' => [
                        'total'   => $total,
                        'counted' => $counted,
                        'pending' => $total - $counted,
                        'percent' => $total > 0
                            ? (int) round(($counted / $total) * 100)
                            : 0,
                    ],
                ];
            });

        return Inertia::render('warehouse/inventories/InventoryIndex', [
            'inventories' => $inventories, 
        ]);
    }

    /**
     * Painel de conferência de um inventário específico.
     */
    public function show(Inventory $inventory)
    {
        $userId = Auth::guard('warehouse')->id();

        abort_unless(
            $inventory->users()->where('users.id', $userId)->exists(),
            403,
        );

        $inventory->load([
            'project:id,name',
            'items.stock.product',
            'items.stock.sector',
            'items.countedBy',
        ]);

        return Inertia::render('warehouse/inventories/InventoryConferencia', [
            'inventory' => InventoryShowResource::make($inventory)->resolve(),
        ]);
    }

    /**
     * Registra a contagem de um item (PUT — chamado via axios).
     */
    public function updateItem(
        Request $request,
        InventoryItem $inventoryItem,
    ) {
        $userId = Auth::guard('stock')->id();

        abort_unless(
            $inventoryItem->inventory
                ->users()
                ->where('users.id', $userId)
                ->exists(),
            403,
        );

        $validated = $request->validate([
            'counted_quantity' => ['required', 'numeric', 'min:0'],
            'notes'            => ['nullable', 'string'],
        ]);

        $inventoryItem->fill([
            'counted_quantity' => $validated['counted_quantity'],
            'notes'            => $validated['notes'] ?? null,
            'counted_at'       => now(),
            'counted_by'       => $userId,
        ]);

        $inventoryItem->difference =
            $inventoryItem->counted_quantity -
            $inventoryItem->system_quantity;

        $inventoryItem->save();

        $inventoryItem->load([
            'stock.product',
            'stock.sector',
            'countedBy',
        ]);

        $inventory = $inventoryItem->inventory->fresh(['items']);

        return response()->json([
            'item'       => InventoryItemShowResource::make($inventoryItem)->resolve(),
            'statistics' => [
                'total'       => $inventory->items->count(),
                'counted'     => $inventory->items->filter->hasBeenCounted()->count(),
                'pending'     => $inventory->items->reject->hasBeenCounted()->count(),
                'adjustments' => $inventory->items->filter->needsAdjustment()->count(),
            ],
        ]);
    }
}