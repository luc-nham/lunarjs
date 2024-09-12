import { BasedOnOffset, LunarUnsafeInput, SimpleDateTime } from "../types";
import { Converter } from "./Converter";
import { JdToGreg } from "./JdToGreg";
import { LunarToJd } from "./LunarToJd";

/**
 * Converter converts a Lunar date time to Gregorian date time.
 */
export class LunarToGreg extends Converter<
  Partial<LunarUnsafeInput>,
  SimpleDateTime,
  BasedOnOffset
> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(input: Partial<LunarUnsafeInput>): SimpleDateTime {
    const options = this.getOption();

    return new LunarToJd(input, options).forward((jd) =>
      new JdToGreg(jd, options).getOutput(),
    );
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
  protected _defaultInput(): Partial<LunarUnsafeInput> {
    return {};
  }
}
