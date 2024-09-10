import { BasedOnOffset, SimpleDateTime } from "../types";
import { Converter } from "./Converter";

type Ouput = Pick<SimpleDateTime, "hour" | "minute" | "second">;

/**
 * /converter that converts a Julian day number to corresponding hours, minutes and seconds.
 */
export class JdToTime extends Converter<number, Ouput, BasedOnOffset> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(input: number): Ouput {
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
    return 2440587.5; // 1970-01-01 00:00 +0000 Gregorian
  }
}
