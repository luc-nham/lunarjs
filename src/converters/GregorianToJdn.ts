import {
  Converter,
  Jdn,
  RequiredSimpleDateTime,
  SimpleDateTime,
} from "../types";

export class GregorianToJdn implements Converter<SimpleDateTime, Jdn> {
  /**
   * Giải thuật chuyển đổi mốc ngày tháng lịch Gregory sang số ngày Julian
   */
  protected gregoriantojd(input: RequiredSimpleDateTime) {
    const a = Math.floor((14 - input.month) / 12);
    const y = input.year + 4800 - a;
    const m = input.month + 12 * a - 3;
    const j =
      input.day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;

    const f = parseFloat(
      (
        (((input.hour - 12) % 24) * 3600 + input.minute * 60 + input.second) /
        86400
      ).toFixed(6),
    );

    let jdn = j + f;

    if (input.offset !== 0) {
      jdn -= parseFloat((input.offset / 86400).toFixed(6));
    }

    return jdn;
  }

  /**
   * @inheritdoc
   */
  convert(input: SimpleDateTime): Jdn {
    const i: RequiredSimpleDateTime = {
      ...{
        day: 1,
        month: 1,
        year: 1970,
        hour: 0,
        minute: 0,
        second: 0,
        offset: 0,
      },
      ...input,
    };

    return {
      jdn: this.gregoriantojd(i),
      offset: i.offset,
    };
  }
}
