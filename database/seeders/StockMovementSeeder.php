<?php

namespace Database\Seeders;

use App\Enum\InvoiceMovementEnum;
use App\Enum\InvoiceStatusEnum;
use App\Models\InvoiceItemMovement;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StockMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 🔥 pega apenas movimentos aprovados
        $movements = InvoiceItemMovement::with(['invoiceItem.invoice'])
            ->where('type', InvoiceMovementEnum::APPROVED->value)
            ->get();

        foreach ($movements as $movement) {

            $item = $movement->invoiceItem;
            $invoice = $item->invoice;

            // 🔍 verifica se já existe estoque para esse item
            $stock = Stock::where('invoice_item_id', $item->id)->first();

            if (!$stock) {
                // 📦 cria estoque
                $stock = Stock::create([
                    'uuid' => Str::uuid(),

                    'product_id' => $item->product_id,
                    'project_id' => $invoice->project_id,
                    'sector_id' => $invoice->sector_id,

                    'invoice_id' => $invoice->id,
                    'invoice_item_id' => $item->id,

                    'stock_quantity' => $movement->quantity,

                    'stock_location' => 'Almoxarifado Central',

                    'active' => true,
                    'performed_at' => now(),
                ]);

                $balance = $movement->quantity;
            } else {
                // ➕ incrementa estoque existente
                $stock->quantity += $movement->quantity;
                $stock->save();

                $balance = $stock->quantity;
            }

            // 📊 cria movement
            StockMovement::create([
                'uuid' => Str::uuid(),

                'stock_id' => $stock->id,
                'product_id' => $stock->product_id,

                'project_id' => $stock->project_id,
                'sector_id' => $stock->sector_id,

                'invoice_item_id' => $item->id,

                'quantity' => $movement->quantity,

                'type' => 'in',
                'direction' => 'in',

                'balance_after' => $balance,

                'performed_at' => $movement->performed_at,

                'notes' => 'Entrada via aprovação de item da NF',
            ]);
        }
    }
}
