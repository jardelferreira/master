<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStockRequest;
use App\Http\Requests\UpdateStockRequest;
use App\Models\InvoiceItem;
use App\Models\Project;
use App\Models\Stock;
use App\Services\InvoiceItemMovementService;
use App\Services\StockService;
use App\Support\FlashMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StockController extends Controller
{
    use FlashMessage;
    public function __construct(
        protected StockService $stockService,
        protected InvoiceItemMovementService $invoiceItemMovementService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockRequest $request, Stock $stock)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        //
    }

    /**
     * Lista items pendentes de entrada no estoque.
     */
    public function pendingEntries(Project $project)
    {
        $items = InvoiceItem::query()
            ->whereHas(
                'invoice',
                fn($q) =>
                $q->where('project_id', $project->id)->where('quantity_available', ">", 0)
            )
            ->with([
                'invoice:id,number,series,provider_id,project_id',
                'invoice.provider:id,name',
                'product:id,name,unit',
                'movements',
                'stocks:id,invoice_item_id,stock_quantity',
            ])
            ->get();

        $pendingItems = $items
            ->map(function ($item) {

                $approved = (float) $item->movements
                    ->where('type', 'approved')
                    ->sum('quantity');

                if ($approved <= 0) {
                    return null;
                }

                $entered = \App\Models\StockMovement::query()
                    ->where('type', 'entry')
                    ->whereIn('stock_id', $item->stocks->pluck('id'))
                    ->sum('quantity');

                $pending = round($approved - $entered, 3);

                if ($pending <= 0) {
                    return null;
                }

                return [
                    'id' => $item->id,
                    'uuid' => $item->uuid,

                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'unit' => $item->product->unit?->value,
                    ],

                    'invoice' => [
                        'id' => $item->invoice->id,
                        'number' => $item->invoice->number,
                        'series' => $item->invoice->series,
                        'provider_name' => $item->invoice->provider->name,
                    ],

                    'quantity_available' => (float) $item->quantity_available,
                    'quantity' => (float) $item->quantity,
                    'approved_quantity' => $approved,
                    'entered_quantity' => $entered,
                    'pending_quantity' => $pending,
                ];
            })
            ->filter()
            ->values();
        // dd($pendingItems);
        return Inertia::render('dashboard/projects/StockEntry', [
            'pendingItems' => $pendingItems,
            'project' => $project
        ]);
    }

    /**
     * Receber items no estoque.
     */
    public function receiveEntries(Request $request)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.invoice_item_id' => ['required', 'integer', 'exists:invoice_items,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
        ]);

        $result = $this->stockService->receiveFromInvoiceItems(
            items: $data['items'],
            userId: Auth::id()
        );

        if (!$result->success) {
            return $this->error($result->message);
        }

        return $this->success(
            sprintf('%d item(s) recebido(s) no estoque', count($result->data))
        );
    }

    /**
     * Baixa/consumo de múltiplos stocks.
     */
    public function consume(Request $request)
    {
        $data = $request->validate([
            'consumptions' => ['required', 'array', 'min:1'],
            'consumptions.*.stock_id' => ['required', 'integer', 'exists:stocks,id'],
            'consumptions.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $consumptions = collect($data['consumptions'])
            ->pluck('quantity', 'stock_id')
            ->toArray();

        $result = $this->stockService->consumeMultiple(
            consumptions: $consumptions,
            userId: Auth::id(),
            meta: ['notes' => $data['notes'] ?? null]
        );

        if (!$result->success) {
            return $this->error($result->message);
        }

        return $this->success('Baixa registrada com sucesso');
    }
}
