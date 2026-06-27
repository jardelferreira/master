<?php

namespace App\Enum;

enum InventoryItemStatusEnum: string
{
    case PENDING = 'pending';
    case COUNTED = 'counted';

    /*
    |--------------------------------------------------------------------------
    | Regras de domínio
    |--------------------------------------------------------------------------
    */

    public function isCounted(): bool
    {
        return $this === self::COUNTED;
    }

    /*
    |--------------------------------------------------------------------------
    | UI / Apresentação
    |--------------------------------------------------------------------------
    */

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pendente',
            self::COUNTED => 'Contado',
        };
    }

    public function badge(): string
    {
        return match ($this) {
            self::PENDING => 'bg-slate-100 text-slate-600',
            self::COUNTED => 'bg-emerald-100 text-emerald-600',
        };
    }
}