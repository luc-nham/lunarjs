import {
  BasedOnOffset,
  LunarFirstNewMoonPhase,
  LunarLeapMonth,
  NewMoonPhase,
  ToFixedOuput,
} from "../types";
import { JdToLs } from "./JdToLs";
import { JdToMidnightJd } from "./JdToMidnightJd";
import { NewMoonNavigator } from "./NewMoonNavigator";
import { ToNewMoon } from "./ToNewMoon";

/**
 * The converter helps calculate the new moon phase of the leap month of a lunar leap year.
 */
export class LunarFirstNmToLeapNm extends ToNewMoon<
  LunarFirstNewMoonPhase,
  LunarLeapMonth | undefined,
  ToFixedOuput & BasedOnOffset
> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(
    input: LunarFirstNewMoonPhase,
  ): LunarLeapMonth | undefined {
    if (!input.leap) {
      return undefined;
    }

    const nmNav = new NewMoonNavigator(input, { quantity: 2 });
    const lsc = new JdToLs();
    const mjdc = new JdToMidnightJd(undefined, {
      offset: this.getOption("offset"),
    });
    const nmToLs = (nm: NewMoonPhase) => {
      return mjdc
        .setInput(nm.jd)
        .forward((jd) => Math.floor(lsc.setInput(jd).getOutput() / 30));
    };

    const result: LunarLeapMonth[] = [];

    let phases = 2;
    let month = 1;
    let nm1 = nmNav.getOutput();

    for (let i = 0; i <= 9; i++) {
      phases++;
      month++;

      const nm2 = nmNav.setOption({ quantity: phases }).getOutput();
      const ls2 = nmToLs(nm2);
      const ls1 = nmToLs(nm1);

      if (ls1 === ls2) {
        result.push({ ...nm1, ...{ month: month } });
      }

      nm1 = nm2;
    }

    let leap = result.find((l) => l.month === 11);

    if (!leap) {
      leap = result[0];
    }

    return leap;
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
  protected _defaultInput(): LunarFirstNewMoonPhase {
    // The new moon phase of 1970-01-01 Lunar calendar
    return {
      jd: 2440623.8015,
      leap: false,
      total: 867,
      year: 1970,
    };
  }
}
