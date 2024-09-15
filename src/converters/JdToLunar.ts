import {
  BasedOnOffset,
  LunarLeapMonth,
  NewMoonPhase,
  SimpleLunarDateTime,
  ToFixedOuput,
} from "../types";
import { Converter } from "./Converter";
import { JdToMidnightJd } from "./JdToMidnightJd";
import { JdToNm } from "./JdToNm";
import { JdToTime } from "./JdToTime";
import { LunarFirstNmToLeapNm } from "./LunarFirstNmToLeapNm";
import { NewMoonNavigator } from "./NewMoonNavigator";
import { NmToLunarFirstNm } from "./NmToLunarFirstNm";

/**
 * Conveter that converts a Julian day number to Lunar date time.
 */
export class JdToLunar extends Converter<
  number,
  Required<SimpleLunarDateTime>,
  ToFixedOuput & BasedOnOffset
> {
  /**
   * Calulate month number
   *
   * @param nm   current new moon phase
   * @param fnm  Lunar first month (01) new moon phase
   * @param lnm  Lunar leap month new moon phase
   */
  private _month(nm: NewMoonPhase, fnm: NewMoonPhase, lnm?: LunarLeapMonth) {
    if (nm.total === fnm.total) {
      return 1;
    }

    const month = nm.total - fnm.total;

    if (!lnm || nm.total < lnm.total) {
      return month + 1;
    }

    return month;
  }

  /**
   * @inheritdoc
   */
  protected _makeOuput(input: number): Required<SimpleLunarDateTime> {
    const opt = this.getOption();
    const mjdc = new JdToMidnightJd(undefined, opt);

    const { fnm, lnm, mjd, nm } = new JdToNm(input, opt).fw((nm) => {
      return new NmToLunarFirstNm(nm, opt).fw((fnm) => {
        return new LunarFirstNmToLeapNm(fnm, opt).fw((lnm) => {
          return {
            /**
             * Julian day number corresponds to local midnight time
             */
            mjd: mjdc.in(input).out(),

            /**
             * New moon phase corresponds to input
             */
            nm: mjdc.in(nm.jd).fw((jd) => ({ ...nm, ...{ jd } })),

            /**
             * New moon phase of first month of Lunar calendar
             */
            fnm: mjdc.in(fnm.jd).fw((jd) => ({ ...fnm, ...{ jd } })),

            /**
             * New moon phase of leap month, may or may not be
             */
            lnm: lnm && mjdc.in(lnm?.jd).fw((jd) => ({ ...lnm, ...{ jd } })),
          };
        });
      });
    });

    const nm2 = new NewMoonNavigator(nm, opt).fw((nm) =>
      mjdc.in(nm.jd).fw((jd) => ({ ...nm, ...{ jd } })),
    );

    return new JdToTime(input, opt).forward((time) => ({
      day: Math.floor(mjd - nm.jd + 1),
      month: this._month(nm, fnm, lnm),
      year: fnm.year,
      leap: {
        current: Boolean(lnm && lnm.total === nm.total),
        month: lnm ? lnm.month : 0,
      },
      days: nm2.jd - nm.jd,
      jd: input,
      ...time,
    }));
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
  protected _defaultInput(): number {
    return 2440587.5;
  }
}
