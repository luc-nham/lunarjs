import {
  BasedOnOffset,
  LunarUnsafeInput,
  SimpleDateTime,
  SimpleLunarDateTime,
  ToFixedOuput,
} from "../types";
import { Converter } from "./Converter";
import { GregToJd } from "./GregToJd";
import { JdToLunar } from "./JdToLunar";
import { JdToMidnightJd } from "./JdToMidnightJd";
import { JdToNm } from "./JdToNm";
import { LunarFirstNmToLeapNm } from "./LunarFirstNmToLeapNm";
import { NewMoonNavigator } from "./NewMoonNavigator";
import { NmToLunarFirstNm } from "./NmToLunarFirstNm";

type Input = SimpleDateTime & {
  leapMonth: boolean;
};

/**
 * The converter converts an unsafe, missing, or incorrect Lunar date time input into the correct
 * Lunar date time output.
 */
export class LunarUnsafeToLunar extends Converter<
  Partial<Input>,
  SimpleLunarDateTime,
  ToFixedOuput & BasedOnOffset
> {
  protected _fillInput(inp: LunarUnsafeInput): Required<LunarUnsafeInput> {
    return {
      ...{
        day: 1,
        month: 1,
        year: 1970,
        hour: 0,
        minute: 0,
        second: 0,
        leapMonth: false,
      },
      ...inp,
    };
  }

  /**
   * @inheritdoc
   */
  protected _makeOuput(input: LunarUnsafeInput): SimpleLunarDateTime {
    const { day, leapMonth, month, year } = this._fillInput(input);

    const opt = this.getOption();
    const fnm = new GregToJd({ day: 31, month: 12, year }, opt).fw((jd) => {
      return new JdToNm(jd, opt).fw((nm) => {
        return new NmToLunarFirstNm(nm, opt).fw((fnm) => {
          return new JdToMidnightJd(fnm.jd, opt).fw((jd) => ({
            ...fnm,
            ...{ jd },
          }));
        });
      });
    });

    const lnm = new LunarFirstNmToLeapNm(fnm, opt).out();
    let trueLeap = leapMonth; // To check if input is correct leap month

    if (leapMonth) {
      if (!lnm) {
        trueLeap = false;
      } else {
        if (month !== lnm.month) {
          trueLeap = false;
        }
      }
    }

    let quantity = month - 1;

    if (lnm) {
      if (trueLeap || month > lnm.month) {
        quantity += 1;
      }
    }

    const nm = new NewMoonNavigator(fnm, { quantity }).fw((nm) => {
      return new JdToMidnightJd(nm.jd, opt).fw((jd) => ({ ...nm, ...{ jd } }));
    });

    const jd = nm.jd + day - 1;

    return new JdToLunar(jd, opt).getOutput();
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
  protected _defaultInput(): Partial<Input> {
    return {};
  }
}
