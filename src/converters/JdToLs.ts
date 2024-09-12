import { Converter } from "./Converter";
import { toFloat } from "../helper";
import { ToFixedOuput, ToFloorOuput } from "../types";

/**
 * Converter that converts Julian day number into corresponding Solar longitude angle measurements
 */
export class JdToLs extends Converter<
  number,
  number,
  ToFixedOuput & ToFloorOuput
> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(input: number): number {
    const T = (input - 2451545) / 36525;
    const dr = Math.PI / 180;
    const L = 280.46 + 36000.77 * T;
    const G = 357.528 + 35999.05 * T;
    const ec = 1.915 * Math.sin(dr * G) + 0.02 * Math.sin(dr * 2 * G);
    const lambda = L + ec;
    const sl = lambda - 360 * Math.floor(lambda / 360);

    return this.isOptionEqual("floor", true)
      ? Math.floor(sl)
      : toFloat(sl, this.getOption("fixed"));
  }

  /**
   * @inheritdoc
   */
  protected _defaultOptions(): object & { fixed: number } & { floor: boolean } {
    return {
      fixed: 6,
      floor: true,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultInput(): number {
    return 2440587.5; // 1970-01-01
  }
}
