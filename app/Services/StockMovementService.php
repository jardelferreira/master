<?php

namespace App\Services;

use App\Models\Stock;
use App\Models\StockMovement;
use App\Enum\StockMovementTypeEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class StockMovementService
{
    /*
    |--------------------------------------------------------------------------
    | ENTRADA
    |--------------------------------------------------------------------------
    */
    public function entry(Stock $stock, float $quantity, ?int $userId = null, array $meta = [])
    {
        return DB::transaction(function () use ($stock, $quantity, $userId, $meta) {

            $stock = Stock::lockForUpdate()->find($stock->id);

            if ($quantity <= 0) {
                throw new Exception('Quantidade inválida.');
            }

            $stock->increment('stock_quantity', $quantity);

            return $this->createMovement(
                stock: $stock,
                quantity: $quantity,
                type: StockMovementTypeEnum::ENTRY,
                direction: 'in',
                userId: $userId,
                meta: $meta
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | SAÍDA (consumo)
    |--------------------------------------------------------------------------
    */
    public function consume(Stock $stock, float $quantity, ?int $userId = null, array $meta = [])
    {
        return DB::transaction(function () use ($stock, $quantity, $userId, $meta) {

            $stock = Stock::lockForUpdate()->find($stock->id);

            if ($quantity <= 0) {
                throw new Exception('Quantidade inválida.');
            }

            if ($stock->stock_quantity < $quantity) {
                throw new Exception('Estoque insuficiente.');
            }

            $stock->decrement('stock_quantity', $quantity);

            return $this->createMovement(
                stock: $stock,
                quantity: $quantity,
                type: StockMovementTypeEnum::CONSUMPTION,
                direction: 'out',
                userId: $userId,
                meta: $meta
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | TRANSFERÊNCIA ENTRE ESTOQUES
    |--------------------------------------------------------------------------
    */
    public function transfer(
        Stock $source,
        Stock $destination,
        float $quantity,
        ?int $userId = null
    ) {
        return DB::transaction(function () use ($source, $destination, $quantity, $userId) {

            $source = Stock::lockForUpdate()->find($source->id);
            $destination = Stock::lockForUpdate()->find($destination->id);

            if ($quantity <= 0) {
                throw new Exception('Quantidade inválida.');
            }

            if ($source->stock_quantity < $quantity) {
                throw new Exception('Estoque insuficiente.');
            }

            // 🔻 saída
            $source->decrement('stock_quantity', $quantity);

            $this->createMovement(
                stock: $source,
                quantity: $quantity,
                type: StockMovementTypeEnum::TRANSFER,
                direction: 'out',
                userId: $userId,
                extra: [
                    'source_stock_id' => $source->id,
                    'destination_stock_id' => $destination->id,
                ]
            );

            // 🔺 entrada
            $destination->increment('stock_quantity', $quantity);

            return $this->createMovement(
                stock: $destination,
                quantity: $quantity,
                type: StockMovementTypeEnum::TRANSFER,
                direction: 'in',
                userId: $userId,
                extra: [
                    'source_stock_id' => $source->id,
                    'destination_stock_id' => $destination->id,
                ]
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | ATRIBUIR PARA USUÁRIO (POSSE)
    |--------------------------------------------------------------------------
    */
    public function assignToUser(
        Stock $stock,
        float $quantity,
        int $destinationUserId,
        ?int $userId = null
    ) {
        return DB::transaction(function () use ($stock, $quantity, $destinationUserId, $userId) {

            $stock = Stock::lockForUpdate()->find($stock->id);

            if ($stock->stock_quantity < $quantity) {
                throw new Exception('Estoque insuficiente.');
            }

            $stock->decrement('stock_quantity', $quantity);

            return $this->createMovement(
                stock: $stock,
                quantity: $quantity,
                type: StockMovementTypeEnum::ASSIGNMENT,
                direction: 'out',
                userId: $userId,
                extra: [
                    'destination_user_id' => $destinationUserId
                ]
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | AJUSTE
    |--------------------------------------------------------------------------
    */
    public function adjust(Stock $stock, float $newQuantity, ?int $userId = null)
    {
        return DB::transaction(function () use ($stock, $newQuantity, $userId) {

            $stock = Stock::lockForUpdate()->find($stock->id);

            $difference = $newQuantity - $stock->stock_quantity;

            $stock->update([
                'stock_quantity' => $newQuantity
            ]);

            return $this->createMovement(
                stock: $stock,
                quantity: abs($difference),
                type: StockMovementTypeEnum::ADJUST,
                direction: $difference >= 0 ? 'in' : 'out',
                userId: $userId
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CENTRALIZADOR DE MOVIMENTO
    |--------------------------------------------------------------------------
    */
    private function createMovement(
        Stock $stock,
        float $quantity,
        StockMovementTypeEnum $type,
        string $direction,
        ?int $userId,
        array $meta = [],
        array $extra = []
    ): StockMovement {

        return StockMovement::create(array_merge([
            'uuid' => Str::uuid(),

            'stock_id' => $stock->id,
            'product_id' => $stock->product_id,

            'project_id' => $stock->project_id,
            'sector_id' => $stock->sector_id,

            'quantity' => $quantity,
            'type' => $type->value,
            'direction' => $direction,

            'balance_after' => $stock->stock_quantity,

            'performed_at' => now(),
            'user_id' => $userId,

            'meta' => $meta,
        ], $extra));
    }
}