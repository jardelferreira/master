<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $status = $this->status; // já é enum

        return [
            'id' => $this->id,

            'number' => $this->number,
            'series' => $this->series,

            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
                'color' => $this->status->color(),
            ],

            'total' => (float) $this->total,

            'provider' => [
                'id' => $this->provider_id,
                'trade_name' => $this->provider?->trade_name,
            ],

            'project' => [
                'id' => $this->project_id,
                'name' => $this->project?->name,
            ],

            'sector' => [
                'id' => $this->sector_id,
                'name' => $this->sector?->name,
            ],

            'created_at' => $this->created_at,
        ];
    }
}
