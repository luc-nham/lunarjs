import { NewMoonPhase, Option } from "../types";
import { Converter } from "./Converter";
import { JdToGreg } from "./JdToGreg";

/**
 * Average number of days for the Moon to complete 1 revolution around the Earth (1 cycle)
 */
const SYN_MOON = 29.53058868;

/**
 * Abstract converter for calculates New moon phase
 */
export abstract class ToNewMoon<
  Input,
  Output extends NewMoonPhase | undefined,
  O extends Option,
> extends Converter<Input, Output, O> {
  /**
   * Convert degrees to radian
   */
  protected _degtorad(deg: number) {
    return (deg * Math.PI) / 180;
  }

  /**
   * The first filter to calculate Julian day numebr of New moon
   *
   * @param number jdn
   * @param number total
   */
  protected _meanphase(jdn: number, total: number): number {
    const jt = (jdn - 2415020.5) / 36525;
    const t2 = jt * jt;
    const t3 = t2 * jt;

    return (
      2415020.75933 +
      SYN_MOON * total +
      0.0001178 * t2 -
      0.000000155 * t3 +
      0.00033 * Math.sin(this._degtorad(166.56 + 132.87 * jt - 0.009173 * t2))
    );
  }

  /**
   * converts a known total number of new moon cycles into the corresponding Julian day number, with
   * totals starting at 0 since 1900-01-01
   * @param total
   * @returns
   */
  protected _truephase(total: number): number {
    const t = total / 1236.85;
    const t2 = t * t;
    const t3 = t2 * t;

    let pt =
      2415020.75933 +
      SYN_MOON * total +
      0.0001178 * t2 -
      0.000000155 * t3 +
      0.00033 * Math.sin(this._degtorad(166.56 + 132.87 * t - 0.009173 * t2));

    const m = 359.2242 + 29.10535608 * total - 0.0000333 * t2 - 0.00000347 * t3;
    const mprime =
      306.0253 + 385.81691806 * total + 0.0107306 * t2 + 0.00001236 * t3;
    const f = 21.2964 + 390.67050646 * total - 0.0016528 * t2 - 0.00000239 * t3;

    pt +=
      (0.1734 - 0.000393 * t) * Math.sin(this._degtorad(m)) +
      0.0021 * Math.sin(this._degtorad(2 * m)) -
      0.4068 * Math.sin(this._degtorad(mprime)) +
      0.0161 * Math.sin(this._degtorad(2 * mprime)) -
      0.0004 * Math.sin(this._degtorad(3 * mprime)) +
      0.0104 * Math.sin(this._degtorad(2 * f)) -
      0.0051 * Math.sin(this._degtorad(m + mprime)) -
      0.0074 * Math.sin(this._degtorad(m - mprime)) +
      0.0004 * Math.sin(this._degtorad(2 * f + m)) -
      0.0004 * Math.sin(this._degtorad(2 * f - m)) -
      0.0006 * Math.sin(this._degtorad(2 * f + mprime)) +
      0.001 * Math.sin(this._degtorad(2 * f - mprime)) +
      0.0005 * Math.sin(this._degtorad(m + 2 * mprime));

    return pt;
  }

  /**
   * Get the total New moon phase corresponds with input JDN. The start total begin 0 at 1900-01-01
   */
  protected _total(jdn: number) {
    const sdate = jdn + 1;
    const { year, month } = new JdToGreg(sdate - 45).getOutput();

    let k1 = Math.floor((year + (month - 1) * (1 / 12) - 1900) * 12.3685);
    let nt1 = this._meanphase(Math.floor(sdate - 45), k1);
    let adate = nt1;

    while (true) {
      const k2 = k1 + 1;
      adate += SYN_MOON;

      let nt2 = this._meanphase(Math.floor(adate), k2);

      if (Math.abs(nt2 - sdate) < 0.75) {
        nt2 = this._truephase(k2);
      }

      if (nt1 <= sdate && nt2 > sdate) {
        break;
      }

      nt1 = nt2;
      k1 = k2;
    }

    return k1;
  }
}
