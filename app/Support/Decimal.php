<?php

namespace App\Support;

use Brick\Math\BigDecimal;
use Brick\Math\RoundingMode;

class Decimal
{
    public static function of(string|int|float $value): BigDecimal
    {
        return BigDecimal::of((string) $value);
    }

    public static function sum(array $values): BigDecimal
    {
        return array_reduce($values, function ($carry, $item) {
            return $carry->plus(self::of($item));
        }, self::of(0));
    }

    public static function format(BigDecimal $value, int $scale = 2): string
    {
        return $value->toScale($scale, RoundingMode::HALF_UP);
    }

    public static function compare(BigDecimal $a, BigDecimal $b): int
    {
        return $a->compareTo($b); // -1, 0, 1
    }
}