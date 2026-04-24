<?php

namespace App\Services;

use App\Enum\InvoiceItemMovementEnum;
use App\Models\InvoiceItem;
use App\Models\InvoiceItemMovement;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceItemService
{
    public function approve(InvoiceItem $item, float $quantity, ?int $userId = null)
    {
        return DB::transaction(function () use ($item, $quantity, $userId) {

            if ($quantity > $item->quantity) {
                throw new Exception('Quantidade inválida.');
            }

            InvoiceItemMovement::create([
                'uuid' => Str::uuid(),
                'invoice_item_id' => $item->id,
                'user_id' => $userId,
                'quantity' => $quantity,
                'type' => InvoiceItemMovementEnum::APPROVED->value,
                'is_approved' => true,
                'performed_at' => now(),
            ]);

            return true;
        });
    }
}