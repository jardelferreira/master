export function formatCurrency(
  value: number | string | null | undefined,
  options?: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    locale = "pt-BR",
    currency = "BRL",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options || {};

  const numericValue =
    typeof value === "string"
      ? Number(value.replace(",", "."))
      : value ?? 0;

  if (isNaN(numericValue as number)) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(0);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericValue as number);
}

export function formatQuantity(
  value: number | string | null | undefined,
  fractionDigits = 1
): string {
  const numeric =
    typeof value === "string"
      ? Number(value)
      : value ?? 0;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric);
}