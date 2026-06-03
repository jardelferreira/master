<?php

namespace App\Http\Controllers\Admin;

use App\Enum\ProductUnitEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceItemRequest;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Provider;
use App\Services\InvoiceItemService;
use App\Support\FlashMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceItemController extends Controller
{
    use FlashMessage;

    public function __construct(
        private InvoiceItemService $service
    ) {}

    /*
    |--------------------------------------------------------------------------
    | ACTIONS
    |--------------------------------------------------------------------------
    */

    public function receive(Request $request, InvoiceItem $item)
    {
        $data = $request->validate([
            'quantity' => 'required|numeric|min:0.001',
        ]);

        return $this->handle(
            $this->service->receive($item, $data['quantity'], Auth::id()),
            "Item recebido."
        );
    }

    public function inspect(Request $request, InvoiceItem $item)
    {
        $data = $request->validate([
            'quantity' => 'required|numeric|min:0.001',
        ]);

        return $this->handle(
            $this->service->inspect($item, $data['quantity'], Auth::id()),
            "Item inspecionado."
        );
    }

    public function approve(Request $request, InvoiceItem $item)
    {
        $data = $request->validate([
            'quantity' => 'required|numeric|min:0.001',
        ]);

        return $this->handle(
            $this->service->approve($item, $data['quantity'], Auth::id()),
            "Item aprovado."
        );
    }

    public function reject(Request $request, InvoiceItem $item)
    {
        $data = $request->validate([
            'quantity' => 'required|numeric|min:0.001',
        ]);

        return $this->handle(
            $this->service->reject($item, $data['quantity'], Auth::id()),
            "Item rejeitado."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | STOCK
    |--------------------------------------------------------------------------
    */

    public function sendToStock(Request $request, InvoiceItem $item)
    {
        $data = $request->validate([
            'quantity' => 'required|numeric|min:0.001',
        ]);

        return $this->handle(
            $this->service->sendToStock($item, $data['quantity'], Auth::id()),
            "Item enviado para o estoque."
        );
    }

    public function forceSendToStock(Request $request, InvoiceItem $item)
    {
        $data = $request->validate([
            'quantity' => 'required|numeric|min:0.001',
        ]);

        return $this->handle(
            $this->service->forceSendToStock($item, $item->quantity_available, Auth::id()),
            "Item enviado para o estoque (forçado)."
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    public function create(Invoice $invoice)
    {
        return Inertia::render('dashboard/invoices/InvoiceItemsCreate', [
            'invoice' => $invoice,
            'products' => Product::all(),
            'providers' => Provider::all(),
            'units' => collect(ProductUnitEnum::cases())->map(fn($unit) => [
                'value' => $unit->value,
                'label' => $unit->label(),
            ]),
        ]);
    }

    public function store(Invoice $invoice, StoreInvoiceItemRequest $request)
    {
        $items = $request->input('items', []);
        $userId = Auth::id();

        foreach ($items as $item) {

            $result = $this->service->create($invoice, $item, $userId);

            if (!$result->success) {
                return $this->error($result->message);
            }
        }

        return $this->successRedirect(
            "Itens cadastrados com sucesso",
            'admin.invoices.show',
            ["invoice" => $invoice->id]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | HELPER
    |--------------------------------------------------------------------------
    */

    private function handle($result, string $successMessage)
    {
        if (!$result->success) {
            return $this->error($result->message);
        }

        return $this->success($successMessage);
    }
}