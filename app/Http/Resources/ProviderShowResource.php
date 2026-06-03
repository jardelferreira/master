<?php

namespace App\Http\Resources;

use App\Enum\InvoiceMovementEnum;
use App\Enum\InvoiceStatusEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderShowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Provider $provider */
        $provider = $this->resource;

        $invoices = $provider->invoices()
            ->with(['project', 'sector', 'movements'])
            ->withCount('items')
            ->latest('issued_at')
            ->get();

        // dd($invoices);

        $totalValue   = $invoices->sum('total');
        $paidValue     = $invoices->whereIn('status', [
            InvoiceStatusEnum::PAID,
            InvoiceStatusEnum::COMPLETED,
        ])->sum('total');

        $canceledValue = $invoices->where('status', InvoiceStatusEnum::CANCELLED)->sum('total');

        $pendingValue  = $totalValue - ($paidValue + $canceledValue);
        $pendingValue = $totalValue - ($paidValue + $canceledValue);

        return [
            'provider' => [
                'id'           => $provider->id,
                'uuid'         => $provider->uuid,
                'name'         => $provider->name,
                'trade_name'   => $provider->trade_name,
                'document'     => $provider->document,
                'email'        => $provider->email,
                'phone'        => $provider->phone,
                'website'      => $provider->website,
                'contact_name' => $provider->contact_name,
                'city'         => $provider->city,
                'state'        => $provider->state,
                'active'       => $provider->active,
                'meta'         => $provider->meta,
                'deleted_at'   => $provider->deleted_at?->toISOString(),
                'created_at'   => $provider->created_at->toISOString(),
                'updated_at'   => $provider->updated_at->toISOString(),
            ],

            'stats' => [
                'total_invoices' => $invoices->count(),
                'total_value'    => (float) $totalValue,
                'paid_value'     => (float) $paidValue,
                'pending_value'  => (float) $pendingValue,
            ],

            'invoices' => $invoices->map(fn($inv) => [
                'id'         => $inv->id,
                'number'     => $inv->number,
                'series'     => $inv->series,

                'type' => [
                    'value' => $inv->type->value,
                    'label' => $inv->type->label(),
                ],

                'status' => [
                    'value' => $inv->status->value,
                    'label' => $inv->status->label(),
                    'color' => $inv->status->color(),
                ],

                'total'    => (float) $inv->total,
                'taxes'    => (float) $inv->taxes,
                'discount' => (float) $inv->discount,

                'issued_at' => $inv->issued_at?->toISOString(),
                'due_at'    => $inv->due_at?->toISOString(),
                'paid_at'   => $inv->paid_at?->toISOString(),

                'project' => $inv->project ? [
                    'id'   => $inv->project->id,
                    'name' => $inv->project->name,
                ] : null,

                'sector' => $inv->sector ? [
                    'id'   => $inv->sector->id,
                    'name' => $inv->sector->name,
                ] : null,

                'items_count' => $inv->items_count,
            ]),
        ];
    }
}
