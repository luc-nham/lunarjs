import { BasedOnOffset, ToFixedOuput } from "../types";
import { Converter } from "./Converter";

/**
 * Converter that converts a Julian day number at any time of day to a Julian day number at midnight
 * (00:00) local time.
 */
export class JdToMidnightJd extends Converter<
  number,
  number,
  ToFixedOuput & BasedOnOffset
> {
  protected _makeOuput(input: number): number {
    const offset = this.getOption("offset");
    const diff = parseFloat((input - Math.floor(input)).toFixed(6));
    const utcMidnight =
      diff >= 0.5 ? Math.floor(input) + 0.5 : Math.floor(input) - 0.5;

    if (offset === 0) {
      return utcMidnight;
    }

    const diff2 = parseFloat((offset / 86400).toFixed(this.getOption("fixed")));

    if (diff === 0.5 - diff2) {
      return input;
    }

    const decimal = 1 - diff2;

    const midnight =
      input >= utcMidnight + decimal
        ? utcMidnight + decimal
        : utcMidnight + decimal - 1;

    return parseFloat(midnight.toFixed(this.getOption("fixed")));
  }

  protected _defaultOptions(): object & { fixed: number } & { offset: number } {
    return {
      fixed: 6,
      offset: 0,
    };
  }
  protected _defaultInput(): number {
    return 2440587.5; // Equal with 1970-01-01 00:00 +0000
  }
}
