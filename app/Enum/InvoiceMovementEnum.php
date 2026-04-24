<?php

namespace App\Enum;

enum InvoiceMovementEnum: string
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
            self::COMPLETED => 'Realizada',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ISSUED      => 'bg-gray-500/20 text-gray-300',
            self::PAID        => 'bg-blue-500/20 text-blue-300',
            self::OBSERVATION => 'bg-purple-500/20 text-purple-300',
            self::RETURNED    => 'bg-orange-500/20 text-orange-300',
            self::CANCELLED   => 'bg-red-500/20 text-red-300',
            self::COMPLETED   => 'bg-emerald-500/20 text-emerald-300',
        };
    }
}