export type DecimalMoneyValue = string | number | bigint;

function scaledInteger(value: DecimalMoneyValue, scale: number): bigint {
  const raw = typeof value === "bigint" ? value.toString() : typeof value === "number" ? (Number.isFinite(value) ? value.toString() : "") : value.trim();
  const match = raw.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
  if (!match) throw new Error("Invalid decimal money value");
  const sourceFraction = match[3] ?? "";
  const source = BigInt(`${match[2]}${sourceFraction}`) * (match[1] === "-" ? -1n : 1n);
  if (sourceFraction.length <= scale) return source * 10n ** BigInt(scale - sourceFraction.length);
  const divisor = 10n ** BigInt(sourceFraction.length - scale);
  const quotient = source / divisor;
  const remainder = source < 0n ? -(source % divisor) : source % divisor;
  return remainder * 2n >= divisor ? quotient + (source < 0n ? -1n : 1n) : quotient;
}

export function isPositiveDecimal(value: DecimalMoneyValue | null | undefined): boolean {
  if (value == null) return false;
  try { return scaledInteger(value, 6) > 0n; } catch { return false; }
}

export function formatDecimalMoney(value: DecimalMoneyValue, currency: string, locale: string): string {
  const cents = scaledInteger(value, 2);
  const negative = cents < 0n;
  const absolute = negative ? -cents : cents;
  const digits = absolute.toString().padStart(3, "0");
  const whole = digits.slice(0, -2);
  const fraction = digits.slice(-2);
  const formatter = new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parts = formatter.formatToParts(negative ? -1 : 0);
  const groupedWhole = new Intl.NumberFormat(locale, { useGrouping: true, maximumFractionDigits: 0 }).format(BigInt(whole));
  const digitFormatter = new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 0 });
  const localizedFraction = [...fraction].map((digit) => digitFormatter.format(BigInt(digit))).join("");
  return parts.map((part) => {
    if (part.type === "integer") return groupedWhole;
    if (part.type === "fraction") return localizedFraction;
    return part.value;
  }).join("");
}
