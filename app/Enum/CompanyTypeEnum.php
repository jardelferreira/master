<?php

namespace App\Enum;

enum CompanyTypeEnum: string
{
    case OWN = "own";
    case THIRD_PARTY = "third_party";

    public function label(): string
    {
        return match($this){
            self::OWN => 'Própria',
            self::THIRD_PARTY => 'Terceira',
        };
    }
}
