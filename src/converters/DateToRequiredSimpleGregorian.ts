import { Converter, SimpleDateTime } from "../types";

/**
 * Bộ chuyển đổi một đối tượng Date của Javascript thành SimpleDateTime, được sử dụng để cung cấp
 * cho các bộ chuyển đổi mà đầu vào yêu cầu lịch Gregory.
 */
export class DateToRequiredSimpleGregorian
  implements Converter<Date, Required<SimpleDateTime>>
{
  /**
   * @inheritdoc
   */
  convert(input: Date): Required<SimpleDateTime> {
    return {
      day: input.getDate(),
      hour: input.getHours(),
      minute: input.getMinutes(),
      month: input.getMonth() + 1,
      offset: input.getTimezoneOffset() * -60,
      second: input.getSeconds(),
      year: input.getFullYear(),
    };
  }
}
