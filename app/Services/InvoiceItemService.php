<?php

namespace App\Services;

use App\Enum\InvoiceItemDeliveryStatusEnum;
use App\Enum\InvoiceItemMovementEnum;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\InvoiceItemMovement;
use App\Models\StockMovement;
use App\Services\ServiceResult;
use App\Services\StockService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceItemService
{
    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */
    public function create(Invoice $invoice, array $data, int $userId): ServiceResult
    {
        if (!$invoice->status->canMoveItems()) {
            return ServiceResult::fail('Nota não liberada.');
        }

        return DB::transaction(function () use ($invoice, $data, $userId) {

            $item = InvoiceItem::create([
                ...$data,
                'invoice_id' => $invoice->id,
                'quantity_available' => $data['quantity'],
                'delivery_status' => InvoiceItemDeliveryStatusEnum::PENDING->value,
                'uuid' => Str::uuid(),
                'user_id' => $userId,
            ]);

            // $this->movement($item, InvoiceItemMovementEnum::SHIPPED, $item->quantity, $userId);

            return ServiceResult::ok($item);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | RECEIVE
    |--------------------------------------------------------------------------
    */
    public function receive(InvoiceItem $item, float $quantity, int $userId): ServiceResult
    {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            if (!$item->invoice->status->canMoveItems()) {
                return ServiceResult::fail('Nota não liberada.');
            }

            $received = $this->sum($item, InvoiceItemMovementEnum::RECEIVED);

            if (($received + $quantity) > $item->quantity) {
                return ServiceResult::fail('Excede total do item.');
            }

            $this->updateDeliveryStatus($item, $received + $quantity);

            $this->movement($item, InvoiceItemMovementEnum::RECEIVED, $quantity, $userId);

            return ServiceResult::ok();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | INSPECT
    |--------------------------------------------------------------------------
    */
    public function inspect(InvoiceItem $item, float $quantity, int $userId): ServiceResult
    {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $received = $this->sum($item, InvoiceItemMovementEnum::RECEIVED);
            $inspected = $this->sum($item, InvoiceItemMovementEnum::INSPECTED);

            if (($inspected + $quantity) > $received) {
                return ServiceResult::fail('Inspeção maior que recebidos.');
            }

            $this->movement($item, InvoiceItemMovementEnum::INSPECTED, $quantity, $userId);

            return ServiceResult::ok();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | APPROVE
    |--------------------------------------------------------------------------
    */
    public function approve(InvoiceItem $item, float $quantity, int $userId): ServiceResult
    {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $inspected = $this->sum($item, InvoiceItemMovementEnum::INSPECTED);
            $approved  = $this->sum($item, InvoiceItemMovementEnum::APPROVED);

            if (($approved + $quantity) > $inspected) {
                return ServiceResult::fail('Aprovação maior que inspecionado.');
            }

            if (($approved + $quantity) > $item->quantity) {
                return ServiceResult::fail('Excede quantidade total do item.');
            }

            $this->movement($item, InvoiceItemMovementEnum::APPROVED, $quantity, $userId);

            return ServiceResult::ok();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | REJECT
    |--------------------------------------------------------------------------
    */
    public function reject(InvoiceItem $item, float $quantity, int $userId): ServiceResult
    {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $inspected = $this->sum($item, InvoiceItemMovementEnum::INSPECTED);
            $approved  = $this->sum($item, InvoiceItemMovementEnum::APPROVED);
            $rejected  = $this->sum($item, InvoiceItemMovementEnum::REJECTED);

            if (($approved + $rejected + $quantity) > $inspected) {
                return ServiceResult::fail('Rejeição inválida.');
            }

            $this->movement($item, InvoiceItemMovementEnum::REJECTED, $quantity, $userId);

            return ServiceResult::ok();
        });
    }

    /*
|--------------------------------------------------------------------------
| SHIP
|--------------------------------------------------------------------------
*/
    public function ship(InvoiceItem $item, float $quantity, int $userId): ServiceResult
    {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            if (! $item) {
                return ServiceResult::fail('Item não encontrado.');
            }

            if (! $item->invoice->status->canMoveItems()) {
                return ServiceResult::fail('Nota não liberada.');
            }

            $alreadyShipped = $this->sum(
                $item,
                InvoiceItemMovementEnum::SHIPPED
            );

            if (($alreadyShipped + $quantity) > $item->quantity) {
                return ServiceResult::fail(
                    'Quantidade enviada excede total do item.'
                );
            }

            $this->movement(
                $item,
                InvoiceItemMovementEnum::SHIPPED,
                $quantity,
                $userId
            );

            $totalShipped = $alreadyShipped + $quantity;

            $item->update([
                'delivery_status' => $totalShipped < $item->quantity
                    ? InvoiceItemDeliveryStatusEnum::IN_TRANSIT->value
                    : InvoiceItemDeliveryStatusEnum::OUT_FOR_DELIVERY->value,
            ]);

            return ServiceResult::ok();
        });
    }

    /*
    |--------------------------------------------------------------------------
    | SEND TO STOCK (VALIDADO)
    |--------------------------------------------------------------------------
    */
    public function sendToStock(InvoiceItem $item, float $quantity, int $userId): ServiceResult
    {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $approved = $this->sum($item, InvoiceItemMovementEnum::APPROVED);
            $entered = StockMovement::where('type', 'entry')
                ->whereIn('stock_id', $item->stocks->pluck('id'))
                ->sum('quantity');

            $availableToEnter = $approved - $entered;

            if ($availableToEnter <= 0) {
                return ServiceResult::fail('Nenhuma quantidade disponível para entrada.');
            }

            if ($quantity > $availableToEnter) {
                return ServiceResult::fail(
                    "Quantidade excede disponível para entrada. Disponível: {$availableToEnter}"
                );
            }

            $stockService = app(StockService::class);

            $result = $stockService->addFromInvoiceItem($item, $quantity, $userId);

            if (!$result->success) {
                return $result;
            }
            $item->decrement("quantity_available", $quantity);
            return ServiceResult::ok($result->data);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | FORCE SEND TO STOCK
    |--------------------------------------------------------------------------
    */
    public function forceSendToStock(InvoiceItem $item, float $quantity, int $userId): ServiceResult
    {
        if ($quantity <= 0) {
            return ServiceResult::fail('Quantidade inválida.');
        }

        return DB::transaction(function () use ($item, $quantity, $userId) {

            $item = InvoiceItem::lockForUpdate()->find($item->id);

            $approved = $this->sum($item, InvoiceItemMovementEnum::APPROVED);
            $inspected = $this->sum($item, InvoiceItemMovementEnum::INSPECTED);
            $received = $this->sum($item, InvoiceItemMovementEnum::RECEIVED);

            $toReceive = max(0, $quantity - $received);
            $toInspect = max(0, $quantity - $inspected);
            $toApprove = max(0, $quantity - $approved);

            // fluxo completo automático
            $this->movement($item, InvoiceItemMovementEnum::RECEIVED, $toReceive, $userId);
            $this->movement($item, InvoiceItemMovementEnum::INSPECTED, $toInspect, $userId);
            $this->movement($item, InvoiceItemMovementEnum::APPROVED, $toApprove, $userId);

            $balance = $quantity - $approved;
            $stockService = app(StockService::class);

            return $stockService->addFromInvoiceItem($item, $balance, $userId);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */
    private function movement(InvoiceItem $item, InvoiceItemMovementEnum $type, float $quantity, int $userId): void
    {
        InvoiceItemMovement::create([
            'uuid' => Str::uuid(),
            'invoice_item_id' => $item->id,
            'user_id' => $userId,
            'quantity' => $quantity,
            'type' => $type->value,
            'performed_at' => now(),
        ]);
    }

    private function sum(InvoiceItem $item, InvoiceItemMovementEnum $type): float
    {
        return (float) $item->movements()
            ->where('type', $type->value)
            ->sum('quantity');
    }

    private function updateDeliveryStatus(InvoiceItem $item, float $received): void
    {
        if ($received == 0) return;

        $item->update([
            'delivery_status' => $received < $item->quantity
                ? InvoiceItemDeliveryStatusEnum::PARTIALLY_DELIVERED->value
                : InvoiceItemDeliveryStatusEnum::DELIVERED->value
        ]);
    }
}
