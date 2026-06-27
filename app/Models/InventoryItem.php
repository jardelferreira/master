<?php

namespace App\Models;

use App\DTO\Inventory\StockAdjustmentData;
use App\Enum\InventoryItemStatusEnum;
use App\Enum\StockMovementTypeEnum;
use App\Models\Inventory;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = [
        'inventory_id',

        'stock_id',

        'system_quantity',
        'counted_quantity',

        'difference',

        'counted_by',
        'counted_at',

        'notes',

        'status',
    ];

    protected $casts = [
        'system_quantity' => 'decimal:3',
        'counted_quantity' => 'decimal:3',
        'difference' => 'decimal:3',

        'counted_at' => 'datetime',

        'status' => InventoryItemStatusEnum::class,
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function inventory()
    {
        return $this->belongsTo(
            Inventory::class
        );
    }

    public function stock()
    {
        return $this->belongsTo(
            Stock::class
        );
    }

    public function countedBy()
    {
        return $this->belongsTo(
            User::class,
            'counted_by'
        );
    }

    public function needsAdjustment(): bool
    {
        if ($this->counted_quantity === null) {
            return false;
        }

        return bccomp(
            (string) $this->system_quantity,
            (string) $this->counted_quantity,
            3,
        ) !== 0;
    }

    public function hasBeenCounted(): bool
    {
        return $this->counted_at !== null;
    }

    public function difference(): ?float
    {
        if (! $this->hasBeenCounted()) {
            return null;
        }

        return (float) bcsub(
            (string) $this->counted_quantity,
            (string) $this->system_quantity,
            3
        );
    }

    public function newQuantity(): float
    {
        return (float) $this->counted_quantity;
    }

    public function adjustmentType(): StockMovementTypeEnum
    {
        return $this->difference() > 0
            ? StockMovementTypeEnum::ENTRY
            : StockMovementTypeEnum::EXIT;
    }

    public function movementMeta(): array
    {
        return [
            'origin' => 'inventory',
            'inventory' => [
                'id' => $this->inventory->id,
                'name' => $this->inventory->name,
            ],
            'system_quantity' => $this->system_quantity,
            'counted_quantity' => $this->counted_quantity,
            'difference' => $this->difference(),
        ];
    }

    public function toStockAdjustmentData(
        User $approvedBy,
    ): StockAdjustmentData {
        return new StockAdjustmentData(
            stock: $this->stock,

            newQuantity: $this->newQuantity(),

            user: $approvedBy,

            movementType: StockMovementTypeEnum::INVENTORY_ADJUSTMENT,

            meta: $this->movementMeta(),
        );
    }
}
