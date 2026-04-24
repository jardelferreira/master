<?php

namespace App\Services;

use App\Models\InvoiceItem;
use App\Models\Stock;
use App\Models\StockMovement;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockService
{
    public function addFromInvoiceItem(
        InvoiceItem $item,
        float $quantity,
        ?int $userId = null
    ): Stock {

        return DB::transaction(function () use ($item, $quantity, $userId) {

            // 🔒 lock no item (consistência)
            $item = InvoiceItem::lockForUpdate()->find($item->id);

            if ($quantity <= 0) {
                throw new Exception('Quantidade inválida.');
            }

            $invoice = $item->invoice;

            // 🔍 tenta encontrar estoque existente
            $stock = Stock::lockForUpdate()
                ->where('invoice_item_id', $item->id)
                ->first();

            if (!$stock) {
                // 🆕 cria novo estoque
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

            // 📊 atualiza quantidade
            $stock->increment('stock_quantity', $quantity);
            
            // 📈 registra movimento
            StockMovement::create([
                'uuid' => Str::uuid(),

                'stock_id' => $stock->id,
                'product_id' => $stock->product_id,

                'project_id' => $stock->project_id,
                'sector_id' => $stock->sector_id,

                'invoice_item_id' => $item->id,

                'quantity' => $quantity,
                'type' => 'entry',
                'direction' => 'in',

                'balance_after' => $stock->stock_quantity,

                'performed_at' => now(),
                'user_id' => $userId,
            ]);

            return $stock;
        });
    }
}
