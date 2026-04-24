<?php

namespace App\Enum;

enum InvoiceItemDeliveryStatusEnum: string
{
    case PENDING = 'pending';                 // aguardando envio
    case SCHEDULED = 'scheduled';             // envio agendado
    case IN_TRANSIT = 'in_transit';           // em transporte
    case OUT_FOR_DELIVERY = 'out_for_delivery'; // saiu para entrega

    case DELIVERED = 'delivered';             // entregue totalmente
    case PARTIALLY_DELIVERED = 'partially_delivered'; // entrega parcial

    case DELAYED = 'delayed';                 // atraso logístico
    case FAILED = 'failed';                   // falha na entrega
    case RETURNED = 'returned';               // devolvido ao fornecedor

    /*
    |--------------------------------------------------------------------------
    | Regras de domínio
    |--------------------------------------------------------------------------
    */

    public function isFinal(): bool
    {
        return in_array($this, [
            self::DELIVERED,
            self::PARTIALLY_DELIVERED,
            self::RETURNED,
            self::FAILED,
        ]);
    }

    public function isInProgress(): bool
    {
        return in_array($this, [
            self::SCHEDULED,
            self::IN_TRANSIT,
            self::OUT_FOR_DELIVERY,
        ]);
    }

    public function canReceive(): bool
    {
        return in_array($this, [
            self::IN_TRANSIT,
            self::OUT_FOR_DELIVERY,
            self::PARTIALLY_DELIVERED,
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
            self::PENDING => 'Aguardando envio',
            self::SCHEDULED => 'Agendado',
            self::IN_TRANSIT => 'Em transporte',
            self::OUT_FOR_DELIVERY => 'Saiu para entrega',

            self::DELIVERED => 'Entregue',
            self::PARTIALLY_DELIVERED => 'Entrega parcial',

            self::DELAYED => 'Atrasado',
            self::FAILED => 'Falha na entrega',
            self::RETURNED => 'Devolvido',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'bg-gray-500/20 text-gray-300',
            self::SCHEDULED => 'bg-blue-500/20 text-blue-300',
            self::IN_TRANSIT => 'bg-indigo-500/20 text-indigo-300',
            self::OUT_FOR_DELIVERY => 'bg-cyan-500/20 text-cyan-300',

            self::DELIVERED => 'bg-emerald-500/20 text-emerald-300',
            self::PARTIALLY_DELIVERED => 'bg-yellow-500/20 text-yellow-300',

            self::DELAYED => 'bg-orange-500/20 text-orange-300',
            self::FAILED => 'bg-red-500/20 text-red-300',
            self::RETURNED => 'bg-purple-500/20 text-purple-300',
        };
    }
}