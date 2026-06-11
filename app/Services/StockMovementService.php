<?php

namespace App\Services;

use App\DTO\StockMovementContext;
use App\Enum\StockMovementTypeEnum;
use App\Models\Sector;
use App\Models\Stock;
use App\Models\StockMovement;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockMovementService
{
    /*
    |--------------------------------------------------------------------------
    | ENTRADA
    |--------------------------------------------------------------------------
    */

    public function entry(
        Stock $stock,
        float $quantity,
        ?int $userId = null,
        ?string $notes = null,
        array $meta = []
    ): StockMovement {
        return DB::transaction(function () use (
            $stock,
            $quantity,
            $userId,
            $notes,
            $meta,
        ) {
            $stock = $this->lockStock($stock);

            $this->assertPositiveQuantity($quantity);

            $stock->increment('stock_quantity', $quantity);
            $stock->refresh();

            return $this->createMovement(
                stock: $stock,
                quantity: $quantity,
                type: StockMovementTypeEnum::ENTRY,
                direction: 'in',
                userId: $userId,
                notes: $notes,
                meta: $meta
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CONSUMO
    |--------------------------------------------------------------------------
    */

    public function consume(
        Stock $stock,
        float $quantity,
        ?int $userId = null,
        ?string $notes = null,
        ?StockMovementContext $context = null,
        array $meta = []
    ): StockMovement {
        return DB::transaction(function () use (
            $stock,
            $quantity,
            $userId,
            $notes,
            $context,
            $meta,
        ) {
            $stock = $this->lockStock($stock);

            $this->assertPositiveQuantity($quantity);
            $this->assertSufficientStock($stock, $quantity);

            $stock->decrement('stock_quantity', $quantity);
            $stock->refresh();
            return $this->createMovement(
                stock: $stock,
                quantity: $quantity,
                type: StockMovementTypeEnum::CONSUMPTION,
                direction: 'out',
                userId: $userId,
                notes: $notes,
                context: $context,
                meta: $meta,
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | TRANSFERÊNCIA
    |--------------------------------------------------------------------------
    */

    public function transfer(
        Stock $source,
        Sector $sector,
        float $quantity,
        StockMovementContext $context,
        ?int $userId = null,
        ?string $notes = null,
        array $meta = []
    ): array {
        return DB::transaction(function () use (
            $source,
            $sector,
            $quantity,
            $userId,
            $context,
            $notes,
            $meta,
        ) {
            $source = $this->lockStock($source);
            $destination = $source->replicate(['stock_quantity']);

            $destination->uuid = Str::uuid();
            $destination->project_id = $sector->project_id;
            $destination->sector_id = $sector->id;
            $destination->stock_quantity = 0;
            $destination->save();

            $this->assertPositiveQuantity($quantity);
            $this->assertSufficientStock($source, $quantity);
            $this->assertSameProduct($source, $destination);

            $source->decrement('stock_quantity', $quantity);
            $source->refresh();

            $outMovement = $this->createMovement(
                stock: $source,
                quantity: $quantity,
                type: StockMovementTypeEnum::TRANSFER,
                direction: 'out',
                userId: $userId,
                notes: $notes,
                context: $context,
                sourceStockId: $source->id,
                destinationStockId: $destination->id,
                meta: $meta
            );

            $destination->increment('stock_quantity', $quantity);
            $destination->refresh();

            $inMovement = $this->createMovement(
                stock: $destination,
                quantity: $quantity,
                type: StockMovementTypeEnum::TRANSFER,
                direction: 'in',
                userId: $userId,
                context: $context,
                notes: $notes,
                sourceStockId: $source->id,
                destinationStockId: $destination->id,
                meta: $meta
            );

            return [
                'out' => $outMovement,
                'in' => $inMovement,
            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | ATRIBUIÇÃO
    |--------------------------------------------------------------------------
    */

    public function assignToUser(
        Stock $stock,
        float $quantity,
        StockMovementContext $context,
        ?int $userId = null,
        ?string $notes = null,
        array $meta = []
    ): StockMovement {
        return DB::transaction(function () use (
            $stock,
            $quantity,
            $context,
            $userId,
            $notes,
            $meta
        ) {
            $stock = $this->lockStock($stock);

            $this->assertPositiveQuantity($quantity);
            $this->assertSufficientStock($stock, $quantity);

            $stock->decrement('stock_quantity', $quantity);
            $stock->refresh();

            return $this->createMovement(
                stock: $stock,
                quantity: $quantity,
                type: StockMovementTypeEnum::ASSIGNMENT,
                direction: 'out',
                userId: $userId,
                notes: $notes,
                context: $context,
                meta: $meta
            );
        });
    }

    public function returnFromUser(
        Stock $stock,
        float $quantity,
        StockMovementContext $context,
        ?int $userId = null,
        ?string $notes = null,
        array $meta = []
    ): StockMovement {

        return DB::transaction(function () use (
            $stock,
            $quantity,
            $userId,
            $notes,
            $context,
            $meta
        ) {

            $stock = $this->lockStock(
                $stock
            );

            $this->assertPositiveQuantity(
                $quantity
            );

            $stock->increment(
                'stock_quantity',
                $quantity
            );

            $stock->refresh();

            return $this->createMovement(
                stock: $stock,
                quantity: $quantity,
                type: StockMovementTypeEnum::ASSIGNMENT_RETURN,
                direction: 'in',
                userId: $userId,
                notes: $notes,
                context: $context,
                meta: $meta,
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | AJUSTE
    |--------------------------------------------------------------------------
    */

    public function adjust(
        Stock $stock,
        float $newQuantity,
        ?int $userId = null,
        ?string $notes = null,
        array $meta = []
    ): StockMovement {
        return DB::transaction(function () use (
            $stock,
            $newQuantity,
            $userId,
            $notes,
            $meta,
        ) {
            $stock = $this->lockStock($stock);

            if ($newQuantity < 0) {
                throw new DomainException(
                    'A quantidade não pode ser negativa.'
                );
            }

            $difference = $newQuantity - $stock->stock_quantity;

            if ($difference == 0) {
                throw new DomainException(
                    'Nenhuma alteração detectada.'
                );
            }

            $stock->update([
                'stock_quantity' => $newQuantity,
            ]);

            $stock->refresh();

            return $this->createMovement(
                stock: $stock,
                quantity: abs($difference),
                type: StockMovementTypeEnum::ADJUST,
                direction: $difference > 0 ? 'in' : 'out',
                userId: $userId,
                notes: $notes,
                meta: $meta
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | PERDA
    |--------------------------------------------------------------------------
    */

    public function loss(
        Stock $stock,
        float $quantity,
        ?int $userId = null,
        ?string $notes = null,
        array $meta = []
    ): StockMovement {
        return DB::transaction(function () use (
            $stock,
            $quantity,
            $userId,
            $notes,
            $meta,
        ) {
            $stock = $this->lockStock($stock);

            $this->assertPositiveQuantity($quantity);
            $this->assertSufficientStock($stock, $quantity);

            $stock->decrement('stock_quantity', $quantity);
            $stock->refresh();

            return $this->createMovement(
                stock: $stock,
                quantity: $quantity,
                type: StockMovementTypeEnum::LOSS,
                direction: 'out',
                userId: $userId,
                notes: $notes,
                meta: $meta
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | DEVOLUÇÃO
    |--------------------------------------------------------------------------
    */

    public function returnToStock(
        StockMovement $movement,
        float $quantity,
        StockMovementContext $context,
        ?int $userId = null,
        ?string $notes = null,
        array $meta = []
    ): StockMovement {

        return DB::transaction(function () use (
            $movement,
            $quantity,
            $context,
            $userId,
            $notes,
            $meta,
        ) {

            if (! $movement->canReceiveReturns()) {
                throw new DomainException(
                    'Esta movimentação não aceita devoluções.'
                );
            }

            $this->assertPositiveQuantity(
                $quantity
            );

            $available =
                $movement->getNetQuantity();

            if ($quantity > $available) {
                throw new DomainException(
                    sprintf(
                        'Quantidade disponível para devolução: %.3f',
                        $available,
                    ),
                );
            }

            $stock = $this->lockStock(
                $movement->stock
            );

            $stock->increment(
                'stock_quantity',
                $quantity,
            );

            $stock->refresh();

            return $this->createMovement(
                stock: $stock,

                quantity: $quantity,

                type: StockMovementTypeEnum::RETURN,

                direction: 'in',

                userId: $userId,

                notes: $notes,

                parentMovementId: $movement->id,

                context: $context,

                meta: $meta,
            );
        });
    }
    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    private function lockStock(Stock $stock): Stock
    {
        return Stock::query()
            ->lockForUpdate()
            ->findOrFail($stock->id);
    }

    private function assertPositiveQuantity(float $quantity): void
    {
        if ($quantity <= 0) {
            throw new DomainException(
                'A quantidade deve ser maior que zero.'
            );
        }
    }

    private function assertSufficientStock(
        Stock $stock,
        float $quantity
    ): void {
        if ($stock->stock_quantity < $quantity) {
            throw new DomainException(
                'Estoque insuficiente.'
            );
        }
    }

    private function assertSameProduct(
        Stock $source,
        Stock $destination
    ): void {
        if ($source->product_id !== $destination->product_id) {
            throw new DomainException(
                'Transferência entre produtos diferentes não é permitida.'
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | PERSISTÊNCIA
    |--------------------------------------------------------------------------
    */

    private function createMovement(
        Stock $stock,
        float $quantity,
        StockMovementTypeEnum $type,
        string $direction,
        ?int $userId,
        ?string $notes = null,
        ?int $sourceStockId = null,
        ?int $destinationStockId = null,
        ?int $parentMovementId = null,
        ?StockMovementContext $context = null,
        array $meta = []
    ): StockMovement {
        $movementMeta = array_merge(
            $context?->meta ?? [],
            $meta
        );
        return StockMovement::create([
            'uuid' => Str::uuid(),

            'stock_id' => $stock->id,
            'product_id' => $stock->product_id,

            'project_id' => $stock->project_id,
            'sector_id' => $stock->sector_id,

            'employee_id' =>
            $context?->employeeId,

            'team_id' =>
            $context?->teamId,

            'leader_employee_id' =>
            $context?->leaderEmployeeId,

            'application_area_id' =>
            $context?->applicationAreaId,

            'parent_movement_id' =>
            $parentMovementId,

            'quantity' => $quantity,

            'type' => $type->value,

            'direction' => $direction,

            'source_stock_id' =>
            $sourceStockId,

            'destination_stock_id' =>
            $destinationStockId,

            'destination_user_id' =>
            $context?->destinationUserId,

            'balance_after' =>
            $stock->stock_quantity,

            'performed_at' => now(),

            'user_id' => $userId,

            'notes' => $notes,

            'meta' => $movementMeta,
        ]);
    }
}
