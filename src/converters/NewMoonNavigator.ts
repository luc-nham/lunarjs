import { NewMoonNavigationOuputOption, NewMoonPhase } from "../types";
import { ToNewMoon } from "./ToNewMoon";

/**
 * The converter helps calculate the next or previous new moon phases from an input new moon phase.
 */
export class NewMoonNavigator extends ToNewMoon<
  NewMoonPhase,
  NewMoonPhase,
  NewMoonNavigationOuputOption
> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(input: NewMoonPhase): NewMoonPhase {
    const to = this.getOption("quantity");
    const total = this.isOptionEqual("navigation", "next")
      ? input.total + to
      : input.total - to;
    const jd = this._truephase(total);

    return {
      jd: parseFloat(jd.toFixed(this.getOption("fixed"))),
      total,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultOptions(): NewMoonNavigationOuputOption {
    return {
      fixed: 6,
      quantity: 1,
      navigation: "next",
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultInput(): NewMoonPhase {
    // Equal 1900-01-01
    return {
      total: 0,
      jd: 2415021.076721,
    };
  }
}
