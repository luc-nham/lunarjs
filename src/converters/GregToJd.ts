import { toFloat } from "../helper";
import { BasedOnOffset, SimpleDateTime, ToFixedOuput } from "../types";
import { Converter } from "./Converter";

/**
 * Converter that converts a Gregorian date to the corresponding of Julian day number (JDN).
 *
 * - The default ouput value is JDN of 1970-01-01 00:00 +0000
 * - The JDN output is standard-compliant: the new Julian day starts at 12 noon GMT+0.
 *
 * Options:
 * - 'fixed': the number of decimal parts of the output result, default 6 numbers.
 * - 'offset': local time difference from UTC, in seconds. This option will affect the number of
 * Julian days output. Default value is 0 mean UTC.
 */
export class GregToJd extends Converter<
  Partial<SimpleDateTime>,
  number,
  ToFixedOuput & BasedOnOffset
> {
  /**
   * Add missing fields of input with date 1970-01-01 00:00
   */
  protected _fillInput(input: Partial<SimpleDateTime>) {
    return {
      ...{
        day: 1,
        month: 1,
        year: 1970,
        hour: 0,
        minute: 0,
        second: 0,
      },
      ...input,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultOptions(): ToFixedOuput & BasedOnOffset {
    return {
      fixed: 6,
      offset: 0,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultInput(): Partial<SimpleDateTime> {
    return {};
  }

  /**
   * @inheritdoc
   */
  protected _makeOuput(input: Partial<SimpleDateTime>): number {
    const { day, hour, minute, month, second, year } = this._fillInput(input);

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    let j =
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;

    j += toFloat(
      (((hour - 12) % 24) * 3600 + minute * 60 + second) / 86400,
      this.getOption("fixed"),
    );

    if (!this.isOptionEqual("offset", 0)) {
      j -= toFloat(this.getOption("offset") / 86400, this.getOption("fixed"));
    }

    return j;
  }
}
