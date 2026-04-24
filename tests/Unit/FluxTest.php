<?php

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Project;
use App\Models\Provider;
use App\Models\Sector;
use App\Models\User;
use App\Services\InvoiceItemService;
use App\Services\InvoiceService;
use App\Services\StockMovementService;
use App\Services\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('full stock flow works correctly', function () {

    // 🔧 Setup
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $project = Project::factory()->create();

    $sector = Sector::factory()->create([
        'project_id' => $project->id
    ]);

    $provider = Provider::factory()->create();

    // 🧾 Invoice
    $invoice = Invoice::factory()->create([
        'project_id' => $project->id,
        'sector_id' => $sector->id,
        'provider_id' => $provider->id,
        'status' => 'open'
    ]);

    // 📦 Item
    $item = InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'product_id' => $product->id,
        'quantity' => 10,
        'unit_price' => 100
    ]);

    // 🔄 Services
    $itemService = app(InvoiceItemService::class);
    $invoiceService = app(InvoiceService::class);
    $stockService = app(StockService::class);
    $movementService = app(StockMovementService::class);

    // ✔️ Aprovar item
    $itemService->approve($item, 10, $user->id);

    expect(
        \App\Models\InvoiceItemMovement::where('invoice_item_id', $item->id)->count()
    )->toBeGreaterThan(0);

    // ✔️ Aprovar invoice
    $invoiceService->approve($invoice, $user->id);

    expect(
        \App\Models\InvoiceMovement::where('invoice_id', $invoice->id)->exists()
    )->toBeTrue();

    // ✔️ Criar estoque
    $stock = $stockService->createFromInvoiceItem($item);

    expect($stock->stock_quantity)->toBe(10);

    // ✔️ Consumir estoque
    $movementService->consume($stock, 4, $user->id);

    $stock->refresh();

    expect($stock->stock_quantity)->toBe(6);

    // ✔️ Transferência
    $newStock = $stock->replicate();
    $newStock->save();

    $movementService->transfer($stock, $newStock, 2, $user->id);

    $stock->refresh();
    $newStock->refresh();

    expect($stock->stock_quantity)->toBe(4);
    expect($newStock->stock_quantity)->toBe(2);

    // ✔️ Histórico
    expect(\App\Models\StockMovement::count())->toBeGreaterThan(0);
});