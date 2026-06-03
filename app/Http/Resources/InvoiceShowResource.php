<?php

namespace App\Http\Resources;

use App\Enum\InvoiceStatusEnum;
use App\Enum\InvoiceTypeEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $status = $this->status;

        return [
            'id' => $this->id,
            'number' => $this->number,
            'series' => $this->series,

            'status' => [
                'value' => $status->value,
                'label' => $status->label(),
                'color' => $status->color(),
            ],

            'can' => [
                'pay' => in_array($status, [
                    InvoiceStatusEnum::ISSUED,
                    InvoiceStatusEnum::OBSERVATION,
                ]),
                'complete' => $status === InvoiceStatusEnum::PAID,
                'cancel' => ! $status->isFinal(),
                'return' => $status === InvoiceStatusEnum::PAID,
                'move_items' => $status->canMoveItems(),
            ],

            'total' => (float) $this->total,
            'amount' => (float) $this->items->sum('total'),

            'provider' => [
                'id' => $this->provider_id,
                'trade_name' => $this->provider?->trade_name,
                'name' => $this->provider->name,
            ],

            'project' => [
                'id' => $this->project_id,
                'name' => $this->project?->name,
            ],

            'sector' => [
                'id' => $this->sector_id,
                'name' => $this->sector?->name,
            ],

            'items' => $this->items->map(function ($item) {

                $received = (float) $item->movements
                    ->where('type', \App\Enum\InvoiceItemMovementEnum::RECEIVED)
                    ->sum('quantity');

                $inspected = (float) $item->movements
                    ->where('type', \App\Enum\InvoiceItemMovementEnum::INSPECTED)
                    ->sum('quantity');

                $approved = (float) $item->movements
                    ->where('type', \App\Enum\InvoiceItemMovementEnum::APPROVED)
                    ->sum('quantity');

                $rejected = (float) $item->movements
                    ->where('type', \App\Enum\InvoiceItemMovementEnum::REJECTED)
                    ->sum('quantity');

                $stocked = (float) $item->movements
                    ->where('type', \App\Enum\InvoiceItemMovementEnum::ADJUSTED)
                    ->sum('quantity');

                $total = (float) $item->quantity;

                $workflow = [
                    'received' => $received,
                    'inspected' => $inspected,
                    'approved' => $approved,
                    'rejected' => $rejected,
                    'stocked' => $stocked,

                    'receivable' => max(0, $total - $received),

                    'inspectable' => max(0, $received - $inspected),

                    'decidable' => max(0, $inspected - $approved - $rejected),

                    'stockable' => max(0, $approved - $stocked),

                    'completed' => ($approved + $rejected) >= $total,
                ];

                return [
                    'id' => $item->id,
                    'name' => $item->product->name,
                    'quantity' => $total,

                    'unit_price' => (float) $item->unit_price,

                    'delivery_status' => [
                        'value' => $item->delivery_status->value,
                        'label' => $item->delivery_status->label(),
                        'color' => $item->delivery_status->color(),
                    ],

                    'workflow' => $workflow,

                    'actions' => [
                        'can_receive' => $workflow['receivable'] > 0,
                        'can_inspect' => $workflow['inspectable'] > 0,
                        'can_decide' => $workflow['decidable'] > 0,
                        'can_stock' => $workflow['stockable'] > 0,
                    ],

                    'movements' => $item->movements
                        ->sortByDesc('performed_at')
                        ->values()
                        ->map(function ($m) {
                            return [
                                'id' => $m->id,

                                'type' => [
                                    'value' => $m->type->value,
                                    'label' => $m->type->label(),
                                ],

                                'quantity' => (float) $m->quantity,

                                'user' => $m->user?->name,

                                'date' => $m->performed_at?->format('d/m/Y H:i'),
                                'date_human' => $m->performed_at?->diffForHumans(),
                            ];
                        }),
                ];
            }),

            //  HISTÓRICO
            'movements' => $this->movements->map(fn($m) => [
                'id' => $m->id,
                'type' => [
                    'value' => $m->type->value,
                    'label' => $m->type->label(),
                    'color' => $m->type->color(),
                ],
                'user' => $m->user?->name,
                'date' => $m->performed_at->format('d/m/Y H:i'),
                'date_human' => $m->performed_at->diffForHumans(),
            ]),
            'invoice_status' => collect(InvoiceStatusEnum::cases())
                ->map(fn($s) => [
                    'value' => $s->value,
                    'label' => $s->label(),
                    'color' => $s->color(),
                ]),
            'invoice_types' => collect(InvoiceTypeEnum::cases())
                ->map(fn($s) => [
                    'value' => $s->value,
                    'label' => $s->label(),
                ]),
        ];
    }
}
