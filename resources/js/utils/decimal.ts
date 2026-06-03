import Big from 'big.js';

export type DecimalValue = string | number | Big;

export const Decimal = {
    of(value: DecimalValue): Big {
        return value instanceof Big ? value : new Big(value);
    },

    sum(values: DecimalValue[]): Big {
        return values.reduce<Big>((acc, v) => {
            return acc.plus(Decimal.of(v));
        }, new Big(0));
    },

    format(value: DecimalValue, scale = 2): string {
        return Decimal.of(value).toFixed(scale);
    },

    compare(a: DecimalValue, b: DecimalValue): number {
        return Decimal.of(a).cmp(Decimal.of(b));
    }
};