import {
  BasedOnOffset,
  SimpleDateTime,
  SimpleLunarDateTime,
  ToFixedOuput,
} from "../types";
import { Converter } from "./Converter";
import { GregToJd } from "./GregToJd";
import { JdToLunar } from "./JdToLunar";

/**
 * Converter that converts Gregorian calendar dates to Lunar calendar dates
 */
export class GregToLunar extends Converter<
  Partial<SimpleDateTime>,
  SimpleLunarDateTime,
  BasedOnOffset & ToFixedOuput
> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(
    input: Partial<SimpleDateTime>,
  ): Required<SimpleLunarDateTime> {
    const opt = this.getOption();
    return new GregToJd(input, opt).forward((jd) => {
      return new JdToLunar(jd, opt).fw((lunar) => {
        lunar.hour = input.hour ? input.hour : 0;
        lunar.minute = input.minute ? input.minute : 0;
        lunar.second = input.second ? input.second : 0;

        return lunar;
      });
    });
  }

  /**
   * @inheritdoc
   */
  protected _defaultOptions(): object & { offset: number } & { fixed: number } {
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
}
