import {
  BasedOnOffset,
  LunarFirstNewMoonPhase,
  NewMoonPhase,
  ToFixedOuput,
} from "../types";
import { JdToGreg } from "./JdToGreg";
import { ToNewMoon } from "./ToNewMoon";

/**
 * The converter helps calculate the new moon phase corresponding to January of the lunar year
 * compared to the input new moon phase
 */
export class NmToLunarFirstNm extends ToNewMoon<
  NewMoonPhase,
  LunarFirstNewMoonPhase,
  ToFixedOuput & BasedOnOffset
> {
  /**
   * Check if a lunar year be leap year
   */
  protected _leap(y: number) {
    return [0, 3, 6, 9, 11, 14, 17].includes(y % 19);
  }

  protected _makeOuput(input: NewMoonPhase): LunarFirstNewMoonPhase {
    const { year: gy, month } = new JdToGreg(input.jd, {
      offset: this.getOption("offset"),
    }).getOutput();

    const diff = gy - 1900;
    const sub = diff / 19;
    const abssub = Math.abs(sub);

    let total = Math.round(diff * 12 + sub * 7 + 1);
    let year = gy;

    /**
     * In each of the 19 lunar years, when encountering non-leap years in positions 2, 5, and 13,
     * errors need to be corrected to get correct results.
     */
    const diff2 = parseFloat((abssub - Math.floor(abssub)).toFixed(2));
    const correction = [0.05, 0.63, 0.21];

    if (correction.includes(diff2)) {
      total += 1;
    }

    if (input.total < total) {
      if (month !== 12) {
        year -= 1;
      }

      total = this._leap(year) ? total - 13 : total - 12;
    }

    return {
      jd: parseFloat(this._truephase(total).toFixed(this.getOption("fixed"))),
      leap: this._leap(year),
      total,
      year,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultOptions(): object & { fixed: number } & { offset: number } {
    return {
      fixed: 6,
      offset: 0,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultInput(): NewMoonPhase {
    // Equal 1900-01-01 (Gregorian)
    return {
      total: 0,
      jd: 2415021.076721,
    };
  }
}
