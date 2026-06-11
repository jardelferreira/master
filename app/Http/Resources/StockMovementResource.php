<?php

namespace App\Http\Resources;

use App\Enum\StockMovementTypeEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMovementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // $typeEnum = StockMovementTypeEnum::from($this->type);

        return [
            'id' => $this->id,

            'type' => $this->type,
            'direction' => $this->direction,

            'label' => $this->type->label(),
            'display_type' => $this->type->isEntry() ? 'in' : 'out',

            'product' => [
                'id' => $this->product_id,
                'name' => $this->product?->name,
                'unit' => $this->product?->unit,
            ],

            'quantity' => (float) $this->quantity,

            'project' => [
                'id' => $this->project_id,
                'name' => $this->project?->name,
            ],

            'sector' => [
                'id' => $this->sector_id,
                'name' => $this->sector?->name,
            ],

            'user' => [
                'id' => $this->user_id,
                'name' => $this->user?->name,
            ],

            'performed_at' => $this->performed_at,
            'performed_at_human' => $this->performed_at?->diffForHumans(),

            'meta' => $this->meta,
        ];
    }
}
