<?php

namespace App\Http\Resources\Inventory;

use App\Http\Resources\Inventory\InventoryItemShowResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryShowResource extends JsonResource
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

            'name' => $this->name,

            'notes' => $this->notes,

            'blind_count' => $this->blind_count,

            'due_date' => $this->due_date->format('d/m/Y H:i'),

            'created_at' => [
                'value' => $this->created_at,
                'formatted' => $this->created_at?->format('d/m/Y H:i'),
            ],

            'finished_at' => [
                'value' => $this->finished_at,
                'formatted' => $this->finished_at?->format('d/m/Y H:i'),
            ],

            'approved_at' => [
                'value' => $this->approved_at,
                'formatted' => $this->approved_at?->format('d/m/Y H:i'),
            ],

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
                'badge' => $this->status->badgeClass(),
                'permissions' => $this->status->permissions(),
            ],

            /*
            |--------------------------------------------------------------------------
            | Projeto / Setor
            |--------------------------------------------------------------------------
            */

            'project' => [
                'id' => $this->project?->id,
                'name' => $this->project?->name,
            ],

            'sector' => [
                'id' => $this->sector?->id,
                'name' => $this->sector?->name,
            ],

            /*
            |--------------------------------------------------------------------------
            | Usuários
            |--------------------------------------------------------------------------
            */

            'creator' => [
                'id' => $this->creator?->id,
                'name' => $this->creator?->name,
            ],

            'approver' => [
                'id' => $this->approver?->id,
                'name' => $this->approver?->name,
            ],

            'users' => $this->whenLoaded('users', function () {
                return $this->users->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                ]);
            }),

            /*
            |--------------------------------------------------------------------------
            | Estatísticas
            |--------------------------------------------------------------------------
            */

            'statistics' => [
                'items' => $this->whenLoaded('items', fn() => $this->items->count()),

                'counted' => $this->whenLoaded(
                    'items',
                    fn() => $this->items
                        ->filter
                        ->hasBeenCounted()
                        ->count()
                ),

                'pending' => $this->whenLoaded(
                    'items',
                    fn() => $this->items
                        ->reject
                        ->hasBeenCounted()
                        ->count()
                ),

                'adjustments' => $this->whenLoaded(
                    'items',
                    fn() => $this->items
                        ->filter
                        ->needsAdjustment()
                        ->count()
                ),
            ],

            /*
            |--------------------------------------------------------------------------
            | Itens
            |--------------------------------------------------------------------------
            */

            'items' => InventoryItemShowResource::collection(
                $this->whenLoaded('items')
            )->resolve(),

        ];
    }
}
