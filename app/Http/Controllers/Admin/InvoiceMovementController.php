<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\InvoiceMovementService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class InvoiceMovementController extends Controller
{
    public function pay(Invoice $invoice, InvoiceMovementService $service)
    {
        $service->markAsPaid($invoice, Auth::id());
        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Nota marcada como paga.',
            'type' => 'toast',
            'id' => Str::uuid(),
        ]);

    }

    public function complete(Invoice $invoice, InvoiceMovementService $service)
    {
        $service->complete($invoice, Auth::id());

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Nota Finalizada',
            'type' => 'toast',
            'id' => Str::uuid(),
        ]);

    }

    public function cancel(Invoice $invoice, InvoiceMovementService $service)
    {
        $service->cancel($invoice, Auth::id());

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Nota Cancelada',
            'type' => 'toast',
            'id' => Str::uuid(),
        ]);
    }
}
