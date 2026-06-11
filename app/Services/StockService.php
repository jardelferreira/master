<?php

namespace App\Services;

use App\DTO\StockMovementContext;
use App\Models\InvoiceItem;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Services\ServiceResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockService
{

    public function __construct(
        private readonly StockMovementService $movementService,
    ) {}
    /*
    |--------------------------------------------------------------------------
    | ENTRY FROM INVOICE ITEM
    |--------------------------------------------------------------------------
    */
    public function addFromInvoiceItem(
        InvoiceItem $item,
        float $quantity,
        int $userId,
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

            $movement =
                $this->movementService
                ->entry(
                    stock: $stock,
                    quantity: $quantity,
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
        StockMovementContext $context,
        int $userId,
        ?string $notes,
        array $meta = []
    ): ServiceResult {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($stock, $quantity, $userId, $meta, $context, $notes) {

            $stock = Stock::lockForUpdate()->find($stock->id);

            if ($stock->stock_quantity < $quantity) {
                return ServiceResult::fail('Estoque insuficiente.');
            }

            $movement =
                $this->movementService
                ->consume(
                    stock: $stock,
                    quantity: $quantity,
                    userId: $userId,
                    context: $context,
                    notes: $notes,
                    meta: $meta,
                );

            return ServiceResult::ok($movement);
        });
    }

    public function consumeMultiple(
        array $consumptions,
        int $userId,
        StockMovementContext $context,
        ?string $notes = null,
        array $meta = []
    ): ServiceResult {

        if (empty($consumptions)) {
            return ServiceResult::fail('Nenhum item informado para baixa.');
        }

        return DB::transaction(function () use ($consumptions, $userId, $context, $meta, $notes) {

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

                // 🔥 registra movimento
                $movement =
                    $this->movementService
                    ->consume(
                        stock: $stock,
                        quantity: $quantity,
                        userId: $userId,
                        context: $context,
                        notes: $notes,
                        meta: array_merge(
                            [
                                'source' => 'manual',
                            ],
                            $meta,
                        ),
                    );

                $movements[] = $movement;
            }

            return ServiceResult::ok($movements);
        });
    }
}
