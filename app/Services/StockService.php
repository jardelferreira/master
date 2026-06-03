<?php

namespace App\Services;

use App\Models\InvoiceItem;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Services\ServiceResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockService
{
    /*
    |--------------------------------------------------------------------------
    | ENTRY FROM INVOICE ITEM
    |--------------------------------------------------------------------------
    */
    public function addFromInvoiceItem(
        InvoiceItem $item,
        float $quantity,
        ?int $userId = null
    ): ServiceResult {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $invoice = $item->invoice;

            $stock = Stock::lockForUpdate()
                ->where('invoice_item_id', $item->id)
                ->first();

            if (!$stock) {
                $stock = Stock::create([
                    'uuid' => Str::uuid(),
                    'product_id' => $item->product_id,
                    'project_id' => $invoice->project_id,
                    'sector_id' => $invoice->sector_id,
                    'invoice_id' => $invoice->id,
                    'invoice_item_id' => $item->id,
                    'stock_quantity' => 0,
                    'performed_at' => now(),
                ]);
            }

            $stock->increment('stock_quantity', $quantity);
            

            $movement = $this->logMovement(
                stock: $stock,
                quantity: $quantity,
                direction: 'in',
                type: 'entry',
                userId: $userId,
                meta: [
                    'source' => 'invoice_item',
                    'invoice_item_id' => $item->id,
                ]
            );

            return ServiceResult::ok($movement);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | BULK ENTRY
    |--------------------------------------------------------------------------
    */
    public function receiveFromInvoiceItems(array $items, ?int $userId = null): ServiceResult
    {
        if (empty($items)) {
            return ServiceResult::fail('Nenhum item informado.');
        }

        return DB::transaction(function () use ($items, $userId) {

            $movements = [];

            foreach ($items as $entry) {

                $invoiceItem = InvoiceItem::find($entry['invoice_item_id']);

                if (!$invoiceItem) {
                    return ServiceResult::fail("Item não encontrado.");
                }

                $result = $this->addFromInvoiceItem(
                    $invoiceItem,
                    (float) $entry['quantity'],
                    $userId
                );

                if (!$result->success) {
                    return $result;
                }

                $movements[] = $result->data;
            }

            return ServiceResult::ok($movements);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CONSUME
    |--------------------------------------------------------------------------
    */
    public function consume(
        Stock $stock,
        float $quantity,
        ?int $userId = null,
        array $meta = []
    ): ServiceResult {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($stock, $quantity, $userId, $meta) {

            $stock = Stock::lockForUpdate()->find($stock->id);

            if ($stock->stock_quantity < $quantity) {
                return ServiceResult::fail('Estoque insuficiente.');
            }

            $stock->decrement('stock_quantity', $quantity);

            $movement = $this->logMovement(
                stock: $stock,
                quantity: $quantity,
                direction: 'out',
                type: 'consumption',
                userId: $userId,
                meta: $meta
            );

            return ServiceResult::ok($movement);
        });
    }

    public function consumeMultiple(
        array $consumptions,
        ?int $userId = null,
        array $meta = []
    ): ServiceResult {

        if (empty($consumptions)) {
            return ServiceResult::fail('Nenhum item informado para baixa.');
        }

        return DB::transaction(function () use ($consumptions, $userId, $meta) {

            $movements = [];

            foreach ($consumptions as $stockId => $quantity) {

                if ($quantity <= 0) {
                    continue;
                }

                $stock = Stock::lockForUpdate()->find($stockId);

                if (!$stock) {
                    return ServiceResult::fail("Stock #{$stockId} não encontrado.");
                }

                if ($stock->stock_quantity < $quantity) {
                    return ServiceResult::fail(
                        "Estoque insuficiente para {$stock->product->name}. " .
                            "Disponível: {$stock->stock_quantity}"
                    );
                }

                // 🔥 decrementa estoque
                $stock->decrement('stock_quantity', $quantity);

                // 🔥 registra movimento
                $movement = $this->logMovement(
                    stock: $stock,
                    quantity: $quantity,
                    direction: 'out',
                    type: 'consumption',
                    userId: $userId,
                    meta: array_merge(['source' => 'manual'], $meta)
                );

                $movements[] = $movement;
            }

            return ServiceResult::ok($movements);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | MOVEMENT
    |--------------------------------------------------------------------------
    */
    private function logMovement(
        Stock $stock,
        float $quantity,
        string $direction,
        string $type,
        ?int $userId = null,
        array $meta = []
    ): StockMovement {
        return StockMovement::create([
            'uuid' => Str::uuid(),
            'stock_id' => $stock->id,
            'product_id' => $stock->product_id,
            'project_id' => $stock->project_id,
            'sector_id' => $stock->sector_id,
            'quantity' => $quantity,
            'type' => $type,
            'direction' => $direction,
            'balance_after' => $stock->stock_quantity,
            'performed_at' => now(),
            'user_id' => $userId,
            'meta' => $meta,
        ]);
    }
}
