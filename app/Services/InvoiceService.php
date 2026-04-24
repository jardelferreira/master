<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceMovement;
use App\Enum\InvoiceStatusEnum;
use App\Enum\InvoiceMovementEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceService
{
    /*
    |--------------------------------------------------------------------------
    | Criar nova invoice
    |--------------------------------------------------------------------------
    */
    public function create(array $data, ?int $userId = null): Invoice
    {
        return DB::transaction(function () use ($data, $userId) {

            // gerar número se não vier
            $number = $data['number'] ?? fake()->unique()->numerify('######');
            $series = $data['series'] ?? fake()->numerify('###');

            // data de emissão
            $issuedAt = $data['issued_at'] ?? now();

            // 💰 valores base
            $total = $data['total'] ?? 0;
            $taxes = $data['taxes'] ?? 0;
            $discount = $data['discount'] ?? 0;

            // cria invoice
            $invoice = Invoice::create([
                'uuid' => (string) Str::uuid(),
                'slug' => Str::slug("nf-{$number}-{$series}-" . uniqid()),

                'project_id' => $data['project_id'],
                'sector_id' => $data['sector_id'],
                'provider_id' => $data['provider_id'],
                'user_id' => $userId ?? $data['user_id'] ?? null,

                'number' => $number,
                'series' => $series,
                'access_key' => $data['access_key'] ?? null,

                'type' => $data['type'],
                'status' => InvoiceStatusEnum::ISSUED->value, // estado inicial

                'total' => $total,
                'taxes' => $taxes,
                'discount' => $discount,

                'issued_at' => $issuedAt,
                'due_at' => $data['due_at'] ?? null,

                'meta' => $data['meta'] ?? [],
            ]);

            // registra movimento inicial
            InvoiceMovement::create([
                'uuid' => Str::uuid(),
                'invoice_id' => $invoice->id,
                'user_id' => $userId,
                'type' => InvoiceMovementEnum::ISSUED->value,
                'performed_at' => now(),
                'meta' => [
                    'auto' => true,
                ],
            ]);

            return $invoice;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Regras de domínio
    |--------------------------------------------------------------------------
    */

    public function canMoveItems(Invoice $invoice): bool
    {
        return InvoiceStatusEnum::from($invoice->status)->canMoveItems();
    }

    public function isEditable(Invoice $invoice): bool
    {
        return !InvoiceStatusEnum::from($invoice->status)->isFinal();
    }

    /*
    |--------------------------------------------------------------------------
    | Validações auxiliares
    |--------------------------------------------------------------------------
    */

    public function ensureEditable(Invoice $invoice): void
    {
        if (!$this->isEditable($invoice)) {
            throw new \Exception('Nota não pode mais ser editada.');
        }
    }
}