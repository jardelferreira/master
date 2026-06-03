<?php

namespace App\Enum;

enum InvoiceStatusEnum: string
{
    case ISSUED = 'issued';           // emissão (criação da nota)
    case PAID = 'paid';               // pagamento confirmado
    case OBSERVATION = 'observation'; // problema / bloqueio
    case RETURNED = 'returned';       // devolvida ao fornecedor
    case CANCELLED = 'cancelled';     // cancelada
    case COMPLETED = 'completed';     // 🔥 liberada para movimentação

    /*
    |--------------------------------------------------------------------------
    | Regras de domínio
    |--------------------------------------------------------------------------
    */

    public function canMoveItems(): bool
    {
        return $this === self::COMPLETED;
    }

    public function isFinal(): bool
    {
        return in_array($this, [
            self::COMPLETED,
            self::CANCELLED,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UI / Apresentação
    |--------------------------------------------------------------------------
    */

    public function label(): string
    {
        return match ($this) {
            self::ISSUED => 'Emitida',
            self::PAID => 'Paga',
            self::OBSERVATION => 'Observação',
            self::RETURNED => 'Retornada',
            self::CANCELLED => 'Cancelada',
            self::COMPLETED => 'Finalizada',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ISSUED => 'bg-slate-100 text-slate-600',
            self::PAID => 'bg-blue-100 text-blue-600',
            self::OBSERVATION => 'bg-purple-100 text-purple-600',
            self::RETURNED => 'bg-orange-100 text-orange-600',
            self::CANCELLED => 'bg-red-100 text-red-600',
            self::COMPLETED => 'bg-emerald-100 text-emerald-600',
        };
    }
}
