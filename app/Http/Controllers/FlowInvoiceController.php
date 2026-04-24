<?php

namespace App\Http\Controllers;

use App\Enum\InvoiceStatusEnum;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Provider;
use App\Models\Sector;
use App\Models\User;
use App\Services\InvoiceItemMovementService;
use App\Services\InvoiceMovementService;
use App\Services\InvoiceService;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FlowInvoiceController extends Controller
{
    public function run(
        InvoiceService $invoiceService,
        InvoiceMovementService $movementService,
        InvoiceItemMovementService $itemService,
        StockService $stockService
    ) {
        $log = [];

        /*
        |--------------------------------------------------------------------------
        | 1. Criar base
        |--------------------------------------------------------------------------
        */
        $user = User::inRandomOrder()->first();
        $provider = Provider::inRandomOrder()->first();
        $sector = Sector::inRandomOrder()->first();
        $product = Product::inRandomOrder()->first();

        $log[] = "👤 Usuário: {$user->id}";
        $log[] = "🏢 Fornecedor: {$provider->id}";
        $log[] = "📦 Produto: {$product->name}";

        /*
        |--------------------------------------------------------------------------
        | 2. Criar Invoice
        |--------------------------------------------------------------------------
        */
        $invoice = $invoiceService->create([
            'project_id' => $sector->project_id,
            'sector_id' => $sector->id,
            'provider_id' => $provider->id,
            'type' => 'nf',
            'total' => 1000,
        ], $user->id);

        $log[] = "🧾 Invoice criada: {$invoice->id} (status: {$invoice->status->value})";

        /*
        |--------------------------------------------------------------------------
        | 3. Criar Item da Invoice
        |--------------------------------------------------------------------------
        */
        $item = InvoiceItem::create([
            'uuid' => Str::uuid(),
            'invoice_id' => $invoice->id,
            'product_id' => $product->id,
            'provider_id' => $provider->id,
            'user_id' => $user->id,
            'product_name' => $product->name,
            'description' => 'Item de teste',
            'quantity' => 10,
            'unit_price' => 100,
            'total' => 1000,
            'unit' => $product->unit,
        ]);

        $log[] = "📦 Item criado (QTD: {$item->quantity})";

        /*
|--------------------------------------------------------------------------
| 4. Fluxo financeiro
|--------------------------------------------------------------------------
*/
        $invoice = $movementService->markAsPaid($invoice, $user->id); // captura retorno
        $log[] = "💰 Invoice paga";

        $invoice = $movementService->complete($invoice, $user->id); // captura retorno
        $log[] = "✅ Invoice COMPLETED (liberada para movimentação)";

        /*
|--------------------------------------------------------------------------
| 5. Fluxo logístico
|--------------------------------------------------------------------------
*/
        $itemService->ship($item, $user->id);
        $item->refresh(); // 👈 refresca o item, não a invoice
        $log[] = "🚚 Item enviado";

        $itemService->receive($item, 5, $user->id);
        $item->refresh(); // 👈
        $log[] = "📥 Recebido parcial: 5";

        $itemService->inspect($item, 5, $user->id);
        $item->refresh(); // 👈
        $log[] = "🔍 Inspecionado: 5";

        $itemService->approve($item, 5, $user->id);
        $item->refresh(); // 👈
        $log[] = "✅ Aprovado parcial: 5 (estoque deve ser criado)";

        $itemService->receive($item, 5, $user->id);
        $item->refresh(); // 👈

        $itemService->inspect($item, 5, $user->id);
        $item->refresh(); // 👈

        $itemService->approve($item, 5, $user->id);
        $item->refresh(); // 👈
        $log[] = "✅ Segunda aprovação concluída";

        /*
        |--------------------------------------------------------------------------
        | 6. Verificar estoque
        |--------------------------------------------------------------------------
        */
        $stock = \App\Models\Stock::where('invoice_item_id', $item->id)->first();

        if ($stock) {
            $log[] = "📊 Estoque final: {$stock->stock_quantity}";
        } else {
            $log[] = "❌ Estoque não criado";
        }

        /*
        |--------------------------------------------------------------------------
        | Output
        |--------------------------------------------------------------------------
        */
        return response()->json([
            'message' => 'Fluxo executado',
            'log' => $log
        ]);
    }
}
