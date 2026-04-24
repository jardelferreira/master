<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceMovement;
use App\Enum\InvoiceMovementEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class InvoiceMovementService
{
    /*
    |--------------------------------------------------------------------------
    | TRANSIÇÃO DE STATUS
    |--------------------------------------------------------------------------
    */
    public function changeStatus(
        Invoice $invoice,
        InvoiceMovementEnum $to,
        int $userId ,
        ?array $meta = []
    ): Invoice {

        return DB::transaction(function () use ($invoice, $to, $userId, $meta) {

            $from = InvoiceMovementEnum::from($invoice->status->value);

            // 🔒 valida transição
            $this->validateTransition($from, $to);

            // 📊 registra movimento
            InvoiceMovement::create([
                'uuid' => Str::uuid(),
                'invoice_id' => $invoice->id,
                'user_id' => $userId,
                'type' => $to->value, // 🔥 movement segue o status
                'performed_at' => now(),
                'meta' => $meta,
            ]);

            $invoice = Invoice::lockForUpdate()->find($invoice->id);
            // 🔒 aqui ninguém mais consegue alterar até terminar

            // 🔄 atualiza status atual
            $invoice->update([
                'status' => $to->value
            ]);

            return $invoice;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDAÇÃO DE TRANSIÇÃO
    |--------------------------------------------------------------------------
    */
    private function validateTransition(
        InvoiceMovementEnum $from,
        InvoiceMovementEnum $to
    ): void {

        $allowed = match ($from) {

            InvoiceMovementEnum::ISSUED => [
                InvoiceMovementEnum::PAID,
                InvoiceMovementEnum::OBSERVATION,
                InvoiceMovementEnum::CANCELLED,
            ],

            InvoiceMovementEnum::PAID => [
                InvoiceMovementEnum::COMPLETED,
                InvoiceMovementEnum::OBSERVATION,
                InvoiceMovementEnum::RETURNED,
            ],

            InvoiceMovementEnum::OBSERVATION => [
                InvoiceMovementEnum::PAID,
                InvoiceMovementEnum::CANCELLED,
            ],

            InvoiceMovementEnum::RETURNED => [
                InvoiceMovementEnum::ISSUED,
                InvoiceMovementEnum::CANCELLED,
            ],

            InvoiceMovementEnum::COMPLETED => [
                // 🔒 estado final (não deveria mudar)
            ],

            InvoiceMovementEnum::CANCELLED => [
                // 🔒 estado final
            ],

        };

        if (!in_array($to, $allowed)) {
            throw new Exception("Transição inválida: {$from->value} → {$to->value}");
        }
    }

    /*
    |--------------------------------------------------------------------------
    | HELPERS DE DOMÍNIO
    |--------------------------------------------------------------------------
    */

    public function markAsPaid(Invoice $invoice, ?int $userId = null): Invoice
    {
        return $this->changeStatus(
            $invoice,
            InvoiceMovementEnum::PAID,
            $userId
        );
    }

    public function complete(Invoice $invoice, ?int $userId = null): Invoice
    {
        return $this->changeStatus(
            $invoice,
            InvoiceMovementEnum::COMPLETED,
            $userId
        );
    }

    public function cancel(Invoice $invoice, ?int $userId = null): Invoice
    {
        return $this->changeStatus(
            $invoice,
            InvoiceMovementEnum::CANCELLED,
            $userId
        );
    }

    public function returnToProvider(Invoice $invoice, ?int $userId = null): Invoice
    {
        return $this->changeStatus(
            $invoice,
            InvoiceMovementEnum::RETURNED,
            $userId
        );
    }

    public function markAsObservation(
        Invoice $invoice,
        ?int $userId = null,
        ?string $reason = null
    ): Invoice {
        return $this->changeStatus(
            $invoice,
            InvoiceMovementEnum::OBSERVATION,
            $userId,
            ['reason' => $reason]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | REGRAS DE CONSULTA
    |--------------------------------------------------------------------------
    */

    public function canMoveItems(Invoice $invoice): bool
    {
        return InvoiceMovementEnum::from($invoice->status->value)->canMoveItems();
    }

    public function isFinal(Invoice $invoice): bool
    {
        return InvoiceMovementEnum::from($invoice->status->value)->isFinal();
    }
}