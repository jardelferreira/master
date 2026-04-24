<?php

namespace App\Enum;

enum ProductUnitEnum: string
{
    case UNIT = 'un';
    case PIECE = 'pc';
    case BOX = 'cx';
    case KIT = 'kit';

    case TON = 'ton';
    case KG = 'kg';
    case G = 'g';

    case M = 'm';
    case M2 = 'm2';
    case M3 = 'm3';
    case CM = 'cm';

    case L = 'l';
    case ML = 'ml';

    case PAIR = 'par';
    case DOZEN = 'dz';

    case PACK = 'pkg';


    public function label(): string
    {
        return match ($this) {
            self::UNIT   => 'Unidade',
            self::PIECE  => 'Peça',
            self::BOX    => 'Caixa',
            self::KIT    => 'Kit',
            self::KG     => 'Quilograma',
            self::G      => 'Grama',
            self::M      => 'Metro',
            self::CM     => 'Centímetro',
            self::L      => 'Litro',
            self::ML     => 'Mililitro',
            self::PAIR   => 'Par',
            self::DOZEN  => 'Dúzia',
            self::PACK   => 'Pacote',
            self::M2     => 'Metro Quadrado',
            self::M3     => 'Metro Cúbico',
            self::TON   => 'Toneladas',
        };
    }
}
