<?php

namespace App\Enum;

enum StockMovementTypeEnum: string
{
    case ENTRY = 'entry';             // entrada (ex: recebimento, ajuste positivo)
    case CONSUMPTION = 'consumption'; // saída por uso
    case TRANSFER = 'transfer';       // transferência entre estoques
    case ASSIGNMENT = 'assignment';   // entrega para usuário (posse)
    case ASSIGNMENT_RETURN = 'assignment_return';
    case ADJUST = 'adjust';           // ajuste manual
    case INVENTORY_ADJUSTMENT = 'inventory_adjust';
    case RETURN = 'return';           // devolução para o estoque
    case LOSS = 'loss';               // perda / descarte
    case EXIT = 'exit';

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
            self::ASSIGNMENT_RETURN,
        ]);
    }

    public function isOutput(): bool
    {
        return in_array($this, [
            self::CONSUMPTION,
            self::TRANSFER,
            self::ASSIGNMENT,
            self::LOSS,
            self::EXIT,
        ]);
    }

    public function isAdjust(): bool
    {
        return $this === self::ADJUST || $this === self::INVENTORY_ADJUSTMENT;
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
            self::EXIT => 'Saída',
            self::CONSUMPTION => 'Consumo',
            self::TRANSFER => 'Transferência',
            self::ASSIGNMENT => 'Atribuição / Posse',
            self::ASSIGNMENT_RETURN => 'Devolução / retorno',
            self::ADJUST => 'Ajuste',
            self::INVENTORY_ADJUSTMENT => "Ajuste de inventário",
            self::RETURN => 'Devolução',
            self::LOSS => 'Perda / Descarte',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ENTRY => 'bg-emerald-500/20 text-emerald-300',
            self::CONSUMPTION => 'bg-red-500/20 text-red-300',
            self::EXIT => 'bg-red-500/20 text-red-300',
            self::TRANSFER => 'bg-blue-500/20 text-blue-300',
            self::ASSIGNMENT => 'bg-purple-500/20 text-purple-300',
            self::ASSIGNMENT_RETURN => 'bg-bue-500/20 text-bue-300',
            self::ADJUST => 'bg-yellow-500/20 text-yellow-300',
            self::INVENTORY_ADJUSTMENT => 'bg-yellow-500/20 text-yellow-300',
            self::RETURN => 'bg-cyan-500/20 text-cyan-300',
            self::LOSS => 'bg-orange-500/20 text-orange-300',
        };
    }
}