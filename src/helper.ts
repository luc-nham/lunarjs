/**
 * Fix the decimal part of a floating number.
 *
 * @param num   Target number
 * @param quan  Output decimal amount, default 6
 */
export function toFloat(num: number, quan: number = 6) {
  return parseFloat(num.toFixed(quan));
}

/**
 * Pad the character before (to the left of) a number
 *
 * @param char Character to pad
 * @param num  Target number
 * @param q    Number of characters
 */
export function padLeft(char: string, num: number, q: number) {
  const num2 = Math.abs(num);
  const out = (char + num2).slice(q * -1);

  return num < 0 ? `-${out}` : out;
}

/**
 * Pad zero before (to the left of) a number
 *
 * @param num Target number
 * @param q   Quantity of zero, defaut 2
 */
export function padZeroLeft(num: number, q: number = 2) {
  return padLeft("0", num, q);
}
