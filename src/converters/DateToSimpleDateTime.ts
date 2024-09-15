import { SimpleDateTime } from "../types";
import { Converter } from "./Converter";

/**
 * Converter that converts a Javascript Date object to Simple Date Time object
 */
export class DateToSimpleDateTime extends Converter<
  Date | undefined,
  SimpleDateTime & { offset: number },
  object
> {
  /**
   * @inheritdoc
   */
  protected _makeOuput(
    input: Date | undefined,
  ): SimpleDateTime & { offset: number } {
    const i = input ? input : new Date();

    return {
      day: i.getDate(),
      month: i.getMonth() + 1,
      year: i.getFullYear(),
      hour: i.getHours(),
      minute: i.getMinutes(),
      second: i.getSeconds(),
      offset: i.getTimezoneOffset() * -60,
    };
  }

  /**
   * @inheritdoc
   */
  protected _defaultOptions(): object {
    return {};
  }

  /**
   * @inheritdoc
   */
  protected _defaultInput(): Date | undefined {
    return undefined;
  }
}
