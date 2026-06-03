<?php

namespace App\Http\Controllers\Admin;

use App\Enum\InvoiceStatusEnum;
use App\Enum\InvoiceTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\InvoiceShowResource;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Provider;
use App\Services\InvoiceMovementService;
use App\Services\InvoiceService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::query()
            ->with(['provider', 'project', 'sector'])
            ->latest()
            ->get();

        return inertia('dashboard/invoices/InvoicesIndex', [
            'invoices' => InvoiceResource::collection($invoices)->resolve(),
        ]);
    }

    public function show(Invoice $invoice)
    {
        $invoice->load([
            'movements.item.product',
            'provider',
            'project',
            'sector',
            'movements.user',
        ]);

        // dd(new InvoiceShowResource($invoice)->resolve(), $invoice);
        return inertia('dashboard/invoices/InvoiceShow', [
            'invoice' => new InvoiceShowResource($invoice)->resolve(),
        ]);
    }

    public function store(StoreInvoiceRequest $request, InvoiceService $service)
    {
        $invoice = $service->create($request->all(), Auth::id());

        return redirect()->route('admin.invoices.show', $invoice->id)->with('feedback', [
            'status' => 'success',
            'message' => 'Nota cadastrada com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/invoices/InvoiceCreate', [
            'projects' => Project::with('sectors')->get()->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sectors' => $p->sectors->map(fn($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                ]),
            ]),
            'providers' => Provider::select('id', 'trade_name', 'name')->get(),
            'types' => collect(InvoiceTypeEnum::cases())->map(fn($t) => [
                'value' => $t->value,
                'label' => $t->label(),
            ]),
            'status' => collect(InvoiceStatusEnum::cases())->map(fn($t) => [
                'value' => $t->value,
                'label' => $t->label(),
            ]),
        ]);
    }
}
