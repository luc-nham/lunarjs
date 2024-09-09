import { toFloat } from "../helper";
import { BasedOnOffset, SimpleDateTime } from "../types";
import { Converter } from "./Converter";

/**
 * Converter that converts a Julian day number to Gregorian date time
 */
export class JdToGreg extends Converter<number, SimpleDateTime, BasedOnOffset> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(input: number): SimpleDateTime {
    const jdn = input + toFloat(this.getOption("offset") / 86400, 6);

    let j = Math.floor(jdn);

    if (jdn - j >= 0.5) {
      j += 1;
    }

    j -= 1721119;

    let year = Math.floor((4 * j - 1) / 146097);

    j = 4 * j - 1 - 146097 * year;

    let day = Math.floor(j / 4);
    j = Math.floor((4 * day + 3) / 1461);
    day = 4 * day + 3 - 1461 * j;
    day = Math.floor((day + 4) / 4);
    let month = Math.floor((5 * day - 3) / 153);
    day = 5 * day - 3 - 153 * month;
    day = Math.floor((day + 5) / 5);
    year = 100 * year + j;

    if (month < 10) {
      month += 3;
    } else {
      month -= 9;
      year += 1;
    }

    let totalSec =
      (input - Math.floor(input)) * 86400 + this.getOption("offset") + 43200;

    totalSec =
      totalSec - Math.floor(totalSec) < 0.5
        ? Math.floor(totalSec)
        : Math.ceil(totalSec);

    const hour = Math.floor(totalSec / 3600) % 24;
    const minute = Math.floor(totalSec / 60) % 60;
    const second = Math.floor(totalSec % 60);

    return {
      day,
      month,
      year,
      hour,
      minute,
      second,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultOptions(): BasedOnOffset {
    return {
      offset: 0,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultInput(): number {
    return 2440587.5; // Equal with 1970-01-01 00:00 +0000
  }
}
