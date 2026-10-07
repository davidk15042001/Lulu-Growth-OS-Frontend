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

function roundDivide(numerator: bigint, divisor: bigint): bigint {
  if (divisor <= 0n) throw new Error("Decimal money divisor must be positive");
  const quotient = numerator / divisor;
  const remainder = numerator < 0n ? -(numerator % divisor) : numerator % divisor;
  return remainder * 2n >= divisor ? quotient + (numerator < 0n ? -1n : 1n) : quotient;
}

function unitsToDecimal(units: bigint, scale: number): string {
  const negative = units < 0n;
  const absolute = (negative ? -units : units).toString().padStart(scale + 1, "0");
  if (scale === 0) return `${negative ? "-" : ""}${absolute}`;
  const whole = absolute.slice(0, -scale) || "0";
  const fraction = absolute.slice(-scale);
  return `${negative ? "-" : ""}${whole}.${fraction}`;
}

function rescale(units: bigint, fromScale: number, toScale: number): bigint {
  if (fromScale === toScale) return units;
  if (fromScale < toScale) return units * 10n ** BigInt(toScale - fromScale);
  return roundDivide(units, 10n ** BigInt(fromScale - toScale));
}

/** Normalize an input to a canonical fixed-scale decimal string. */
export function normalizeDecimalMoney(value: DecimalMoneyValue, scale = 2): string {
  if (!Number.isInteger(scale) || scale < 0 || scale > 18) throw new Error("Invalid decimal money scale");
  return unitsToDecimal(scaledInteger(value, scale), scale);
}

/** Return null for user-entered values that are not valid decimal money. */
export function tryNormalizeDecimalMoney(value: DecimalMoneyValue | null | undefined, scale = 2): string | null {
  if (value == null) return null;
  try { return normalizeDecimalMoney(value, scale); } catch { return null; }
}

export function compareDecimalMoney(left: DecimalMoneyValue, right: DecimalMoneyValue, scale = 2): -1 | 0 | 1 {
  const leftUnits = scaledInteger(left, scale);
  const rightUnits = scaledInteger(right, scale);
  return leftUnits < rightUnits ? -1 : leftUnits > rightUnits ? 1 : 0;
}

export function addDecimalMoney(left: DecimalMoneyValue, right: DecimalMoneyValue, scale = 2): string {
  return unitsToDecimal(scaledInteger(left, scale) + scaledInteger(right, scale), scale);
}

export function sumDecimalMoney(values: readonly DecimalMoneyValue[], scale = 2): string {
  return unitsToDecimal(values.reduce<bigint>((total, value) => total + scaledInteger(value, scale), 0n), scale);
}

/** Convert an integer minor-unit value (for example cents) to major units. */
export function minorUnitsToDecimalMoney(value: DecimalMoneyValue, minorScale = 2): string {
  if (!Number.isInteger(minorScale) || minorScale < 0 || minorScale > 18) throw new Error("Invalid minor money scale");
  return unitsToDecimal(scaledInteger(value, 0), minorScale);
}

/** Calculate a percentage using integer arithmetic, rounded to the requested scale. */
export function percentageDecimalMoney(value: DecimalMoneyValue, percentage: DecimalMoneyValue, scale = 2): string {
  const calculationScale = Math.max(scale + 4, 6);
  const product = scaledInteger(value, calculationScale) * scaledInteger(percentage, calculationScale);
  const productUnits = roundDivide(product, 10n ** BigInt(calculationScale) * 100n);
  return unitsToDecimal(rescale(productUnits, calculationScale, scale), scale);
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
