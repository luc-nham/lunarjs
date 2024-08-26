import { Jdn, NewMoonPhase } from "../types";
import { BaseNewMoonPhase } from "./BaseNewMoonPhase";

export class JdnToNewMoonPhase extends BaseNewMoonPhase<Jdn, NewMoonPhase> {
  /**
   * @inheritdoc
   */
  convert(input: Jdn): NewMoonPhase {
    const total = this._totalphase(input);

    return {
      jdn: this._truephase(total),
      offset: input.offset,
      total,
    };
  }
}
