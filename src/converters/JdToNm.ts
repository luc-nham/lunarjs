import { NewMoonPhase, ToFixedOuput } from "../types";
import { ToNewMoon } from "./ToNewMoon";

/**
 * Converter that converts a Julian day number to a new moon object with properties:
 * - jd: the Julian day number of corresponds to the day on which the new moon phase begins.
 * - total: number of new moon phases that have passed since 1900-01-01 (start with 0) until the new
 * moon phase is being calculated.
 */
export class JdToNm extends ToNewMoon<number, NewMoonPhase, ToFixedOuput> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(input: number): NewMoonPhase {
    const total = this._total(input);
    const jd = this._truephase(total);

    return {
      jd: parseFloat(jd.toFixed(this.getOption("fixed"))),
      total,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultOptions(): object & {
    fixed: number;
  } {
    return {
      fixed: 6,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultInput(): number {
    return 2415021; // 1900-01-01
  }
}
