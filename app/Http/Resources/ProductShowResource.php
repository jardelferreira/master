<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductShowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Product $product */
        $product = $this->resource;

        return [
            'product' => [
                'id' => $product->id,
                'uuid' => $product->uuid,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'sku' => $product->sku,
                'active' => $product->active,
                'meta' => $product->meta,

                'unit' => $product->unit ? [
                    'value' => $product->unit->value,
                    'label' => $product->unit->label(),
                ] : null,

                'stock_quantity' => $product->stock_quantity,

                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,

                'created_at' => $product->created_at?->toISOString(),
                'updated_at' => $product->updated_at?->toISOString(),
                'deleted_at' => $product->deleted_at?->toISOString(),
            ],

            'stats' => [
                'stock_quantity' => $product->stock_quantity,

                'invoice_items_count' => $product->invoiceItems->count(),

                'stocks_count' => $product->stocks->count(),

                'stock_movements_count' => $product->stockMovements->count(),

                'stock_minimals_count' => $product->stockMinimals->count(),

                'global_min_stock' => $product->getGlobalMinStock(),
            ],

            'invoice_items' => $product->invoiceItems
                ->take(10)
                ->map(fn($item) => [
                    'id' => $item->id,
                    'invoice_id' => $item->invoice_id,
                    'quantity' => (float) $item->quantity,
                    'approved_quantity' => (float) $item->approved_quantity,
                    'received_quantity' => (float) $item->received_quantity,
                ]),

            'stock_minimals' => $product->stockMinimals
                ->map(fn($minimal) => [
                    'id' => $minimal->id,
                    'uuid' => $minimal->uuid,

                    'scope' => $minimal->isGlobal()
                        ? 'global'
                        : ($minimal->isForProject()
                            ? 'project'
                            : 'sector'),

                    'project' => $minimal->project ? [
                        'id' => $minimal->project->id,
                        'name' => $minimal->project->name,
                    ] : null,

                    'sector' => $minimal->sector ? [
                        'id' => $minimal->sector->id,
                        'name' => $minimal->sector->name,
                    ] : null,

                    'min_quantity' => (float) $minimal->min_quantity,

                    'created_at' => $minimal->created_at?->toISOString(),
                    'updated_at' => $minimal->updated_at?->toISOString(),
                ])
                ->values(),
        ];
    }
}
