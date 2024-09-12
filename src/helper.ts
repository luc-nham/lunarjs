/**
 * Fix the decimal part of a floating number.
 *
 * @param num   Target number
 * @param quan  Output decimal amount, default 6
 */
export function toFloat(num: number, quan: number = 6) {
  return parseFloat(num.toFixed(quan));
}
