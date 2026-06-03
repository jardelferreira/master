<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceCreateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'projects' => collect($this['projects'])->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'sectors' => $p->sectors->map(function ($s) {
                        return [
                            'id' => $s->id,
                            'name' => $s->name,
                        ];
                    }),
                ];
            }),

            'providers' => collect($this['providers'])->map(function ($p) {
                return [
                    'id' => $p->id,
                    'trade_name' => $p->trade_name,
                ];
            }),

            'types' => collect($this['types'])->map(function ($t) {
                return [
                    'value' => $t->value,
                    'label' => $t->label(),
                    'color' => $t->color(),
                ];
            }),

            'status' => collect($this['status'])->map(function ($s) {
                return [
                    'value' => $s->value,
                    'label' => $s->label(),
                    'color' => $s->color(),
                ];
            }),
        ];
    }
}
