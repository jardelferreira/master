<?php

namespace App\Enum;

enum StockMovementTypeEnum: string
{
    case ENTRY = 'entry';             // entrada (ex: recebimento, ajuste positivo)
    case CONSUMPTION = 'consumption'; // saída por uso
    case TRANSFER = 'transfer';       // transferência entre estoques
    case ASSIGNMENT = 'assignment';   // entrega para usuário (posse)
    case ADJUST = 'adjust';           // ajuste manual
    case RETURN = 'return';           // devolução
    case LOSS = 'loss';               // perda / descarte

    /*
    |--------------------------------------------------------------------------
    | Regras de domínio
    |--------------------------------------------------------------------------
    */

    public function isEntry(): bool
    {
        return in_array($this, [
            self::ENTRY,
            self::RETURN,
        ]);
    }

    public function isOutput(): bool
    {
        return in_array($this, [
            self::CONSUMPTION,
            self::TRANSFER,
            self::ASSIGNMENT,
            self::LOSS,
        ]);
    }

    public function isAdjust(): bool
    {
        return $this === self::ADJUST;
    }

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    public function label(): string
    {
        return match ($this) {
            self::ENTRY => 'Entrada',
            self::CONSUMPTION => 'Consumo',
            self::TRANSFER => 'Transferência',
            self::ASSIGNMENT => 'Atribuição / Posse',
            self::ADJUST => 'Ajuste',
            self::RETURN => 'Devolução',
            self::LOSS => 'Perda / Descarte',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ENTRY => 'bg-emerald-500/20 text-emerald-300',
            self::CONSUMPTION => 'bg-red-500/20 text-red-300',
            self::TRANSFER => 'bg-blue-500/20 text-blue-300',
            self::ASSIGNMENT => 'bg-purple-500/20 text-purple-300',
            self::ADJUST => 'bg-yellow-500/20 text-yellow-300',
            self::RETURN => 'bg-cyan-500/20 text-cyan-300',
            self::LOSS => 'bg-orange-500/20 text-orange-300',
        };
    }
}