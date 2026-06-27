<?php

namespace App\Http\Resources\Inventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'product' => [

                'id' => $this->stock->product->id,
                'name' => $this->stock->product->name,
                'sku' => $this->stock->product->sku,
                'unit' => $this->stock->product->unit?->value,

                // futuro
                'barcode' => $this->stock->product->barcode,
                'description' => $this->stock->product->description,
                'category' => $this->stock->product->category?->name,

                // futuro
                'images' => [],

            ],

            'stock' => [

                'id' => $this->stock->id,

                'project' => [
                    'id' => $this->stock->project_id,
                    'name' => $this->stock->project?->name,
                ],

                'sector' => [
                    'id' => $this->stock->sector_id,
                    'name' => $this->stock->sector?->name,
                ],

                'location' => $this->stock->location,

                'batch' => $this->stock->batch,

                'serial_number' => $this->stock->serial_number,

            ],

            'invoice' => [

                'id' => null,
                'number' => null,
                'supplier' => null,
                'issued_at' => null,

            ],

            'count' => [
                'system_quantity' => (float) $this->system_quantity,
                'counted_quantity' => $this->counted_quantity,
                'difference' => $this->difference,
                'notes' => $this->notes,
                'counted_at' => $this->counted_at,
                'operator' => [
                    'id' => $this->countedBy?->id,
                    'name' => $this->countedBy?->name,
                ],
                'permissions' => [
                    'can_count' => $this->inventory->status->canCount(),
                    'readonly' => ! $this->inventory->status->canCount(),
                ],

            ],

            'status' => [
                'counted' => $this->hasBeenCounted(),
                'needs_adjustment' => $this->needsAdjustment(),
                'label' => $this->status->label(),
                'badge' => $this->status->badge(),
            ],

        ];
    }
}
