<?php

namespace App\Enum;

enum InvoiceItemMovementReasonEnum: string
{
    case DAMAGED = 'damaged';
    case WRONG = 'wrong';
    case DIVERGENCE = 'divergence';
    case EXPIRED = 'expired';
    case QUALITY = 'quality';
    case CONFORM = 'conform';

    public function label(): string
    {
        return match($this){
            self::DAMAGED => "Item danificado",
            self::WRONG => "Item com problema",
            self::DIVERGENCE => "Item divergente",
            self::EXPIRED => "Item Vencido ou expirado",
            self::QUALITY => "Problema com qualidade",
            self::CONFORM => "Item conforme"
        };
    }
}
