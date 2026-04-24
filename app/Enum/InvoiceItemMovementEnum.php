<?php

namespace App\Enum;

enum InvoiceItemMovementEnum: string
{
    case SHIPPED = 'shipped';       // enviado pelo fornecedor
    case RECEIVED = 'received';     // recebido fisicamente
    case INSPECTED = 'inspected';   // conferido

    case APPROVED = 'approved';     // aprovado após inspeção
    case REJECTED = 'rejected';     // reprovado

    case RETURNED = 'returned';     // devolvido ao fornecedor
    case ADJUSTED = 'adjusted';     // ajuste (quantidade/divergência)

    /*
    |--------------------------------------------------------------------------
    | Helpers de domínio
    |--------------------------------------------------------------------------
    */

    public function isFinal(): bool
    {
        return in_array($this, [
            self::APPROVED,
            self::REJECTED,
            self::RETURNED,
        ]);
    }

    public function isInbound(): bool
    {
        return in_array($this, [
            self::SHIPPED,
            self::RECEIVED,
            self::INSPECTED,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    public function label(): string
    {
        return match ($this) {
            self::SHIPPED => "Enviado",
            self::RECEIVED => "Recebido",
            self::INSPECTED => "Inspecionado",

            self::APPROVED => "Aprovado",
            self::REJECTED => "Rejeitado",

            self::RETURNED => "Devolvido",
            self::ADJUSTED => "Ajustado",
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::SHIPPED => 'bg-blue-500/20 text-blue-300',
            self::RECEIVED => 'bg-cyan-500/20 text-cyan-300',
            self::INSPECTED => 'bg-indigo-500/20 text-indigo-300',

            self::APPROVED => 'bg-emerald-500/20 text-emerald-300',
            self::REJECTED => 'bg-red-500/20 text-red-300',

            self::RETURNED => 'bg-purple-500/20 text-purple-300',
            self::ADJUSTED => 'bg-yellow-500/20 text-yellow-300',
        };
    }
}