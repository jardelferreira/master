<?php

namespace App\Services;

use App\Models\InvoiceItem;
use App\Models\InvoiceItemMovement;
use App\Enum\InvoiceItemMovementEnum;
use App\Enum\InvoiceItemDeliveryStatusEnum;
use App\Events\InvoiceItemApproved;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class InvoiceItemMovementService
{
    /*
    |--------------------------------------------------------------------------
    | ENVIO (fornecedor)
    |--------------------------------------------------------------------------
    */
    public function ship(InvoiceItem $item, int $userId): void
    {
        DB::transaction(function () use ($item, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $this->ensureInvoiceReleased($item);

            $item->update([
                'delivery_status' => InvoiceItemDeliveryStatusEnum::IN_TRANSIT->value
            ]);

            $this->createMovement($item, InvoiceItemMovementEnum::SHIPPED, $item->quantity, $userId);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | RECEBIMENTO (pode ser parcial)
    |--------------------------------------------------------------------------
    */
    public function receive(InvoiceItem $item, float $quantity, int $userId): void
    {
        DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $this->ensureInvoiceReleased($item);

            $received = $this->getQuantity($item, InvoiceItemMovementEnum::RECEIVED);

            if (($received + $quantity) > $item->quantity) {
                throw new Exception('Quantidade recebida excede o total.');
            }

            $this->createMovement($item, InvoiceItemMovementEnum::RECEIVED, $quantity, $userId);

            $newTotal = $received + $quantity;

            $item->update([
                'delivery_status' =>
                    $newTotal == $item->quantity
                        ? InvoiceItemDeliveryStatusEnum::DELIVERED->value
                        : InvoiceItemDeliveryStatusEnum::PARTIALLY_DELIVERED->value
            ]);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | INSPEÇÃO
    |--------------------------------------------------------------------------
    */
    public function inspect(InvoiceItem $item, float $quantity, int $userId): void
    {
        DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $received = $this->getQuantity($item, InvoiceItemMovementEnum::RECEIVED);
            $inspected = $this->getQuantity($item, InvoiceItemMovementEnum::INSPECTED);

            if (($inspected + $quantity) > $received) {
                throw new Exception('Não é possível inspecionar mais do que foi recebido.');
            }

            $this->createMovement($item, InvoiceItemMovementEnum::INSPECTED, $quantity, $userId);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | APROVAÇÃO
    |--------------------------------------------------------------------------
    */
    public function approve(InvoiceItem $item, float $quantity, int $userId): void
    {

        DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $inspected = $this->getQuantity($item, InvoiceItemMovementEnum::INSPECTED);
            $approved = $this->getQuantity($item, InvoiceItemMovementEnum::APPROVED);

            if (($approved + $quantity) > $inspected) {
                throw new Exception('Não é possível aprovar mais do que foi inspecionado.');
            }

            $this->createMovement($item, InvoiceItemMovementEnum::APPROVED, $quantity, $userId);
            // dispara evento
            event(new InvoiceItemApproved($item,$quantity,$userId));
        });
    }

    /*
    |--------------------------------------------------------------------------
    | REJEIÇÃO
    |--------------------------------------------------------------------------
    */
    public function reject(InvoiceItem $item, float $quantity, ?int $userId = null): void
    {
        DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $inspected = $this->getQuantity($item, InvoiceItemMovementEnum::INSPECTED);
            $rejected = $this->getQuantity($item, InvoiceItemMovementEnum::REJECTED);

            if (($rejected + $quantity) > $inspected) {
                throw new Exception('Quantidade rejeitada inválida.');
            }

            $this->createMovement($item, InvoiceItemMovementEnum::REJECTED, $quantity, $userId);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | DEVOLUÇÃO
    |--------------------------------------------------------------------------
    */
    public function return(InvoiceItem $item, float $quantity, ?int $userId = null): void
    {
        DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $this->createMovement($item, InvoiceItemMovementEnum::RETURNED, $quantity, $userId);

            $item->update([
                'delivery_status' => InvoiceItemDeliveryStatusEnum::RETURNED->value
            ]);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    private function ensureInvoiceReleased(InvoiceItem $item): void
    {
        if (!$item->invoice->status->canMoveItems()) {
            throw new Exception('Nota não liberada.');
        }
    }

    private function createMovement(
        InvoiceItem $item,
        InvoiceItemMovementEnum $type,
        float $quantity,
        ?int $userId
    ): void {
        InvoiceItemMovement::create([
            'uuid' => Str::uuid(),
            'invoice_item_id' => $item->id,
            'user_id' => $userId,
            'quantity' => $quantity,
            'type' => $type->value,
            'performed_at' => now(),
        ]);
    }

    private function getQuantity(InvoiceItem $item, InvoiceItemMovementEnum $type): float
    {
        return $item->movements()
            ->where('type', $type->value)
            ->sum('quantity');
    }
}