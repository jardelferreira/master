<?php

namespace App\DTO\Inventory;

use App\Enum\StockMovementTypeEnum;
use App\Models\Stock;
use App\Models\User;

final readonly class StockAdjustmentData
{
    public function __construct(
        public Stock $stock,
        public float $newQuantity,
        public User $user,
        public StockMovementTypeEnum $movementType,
        public array $meta = [],
    ) {}
}