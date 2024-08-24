import { Converter, Jdn, SimpleDateTime } from "../types";

export class GregorianToJdn
  implements Converter<Required<SimpleDateTime>, Jdn>
{
  /**
   * Giải thuật chuyển đổi mốc ngày tháng lịch Gregory sang số ngày Julian
   */
  protected gregoriantojd(date: Required<SimpleDateTime>) {
    const a = Math.floor((14 - date.month) / 12);
    const y = date.year + 4800 - a;
    const m = date.month + 12 * a - 3;
    const j =
      date.day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;

    const f = parseFloat(
      (
        (((date.hour - 12) % 24) * 3600 + date.minute * 60 + date.second) /
        86400
      ).toFixed(6),
    );

    let jdn = j + f;

    if (date.offset !== 0) {
      jdn -= parseFloat((date.offset / 86400).toFixed(6));
    }

    return jdn;
  }

  /**
   * @inheritdoc
   */
  convert(input: Required<SimpleDateTime>): Jdn {
    return {
      jdn: this.gregoriantojd(input),
      offset: input.offset,
    };
  }
}
