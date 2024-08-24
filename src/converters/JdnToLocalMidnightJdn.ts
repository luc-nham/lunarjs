import { Converter, Jdn } from "../types";

/**
 * Bộ chuyển số ngày Julian thành số ngày Julian tương ứng với thời điểm 00:00 theo giờ địa phương.
 * - Vào thời gian 1970-01-01 +07:00 (Việt Nam) và ở bất kỳ giờ nào, trả về số ngày Julian tương ứng
 * với thời điểm 1969-12-31 17:00 UTC.
 * - Vào thời gian 1970-01-01 +12:00 và ở bất kỳ giờ nào trong ngày, trả về số ngày Julian tương ứng
 * với thời điểm 1970-01-01 12:00 UTC.
 */
export class JdnToLocalMidnightJdn implements Converter<Jdn, Jdn> {
  /**
   * Chuyển đổi số ngày Julian tại thời điểm bất kỳ trong ngày thành số ngày Julian tương ứng với
   * thời điểm 00:00 (nửa đêm) theo giờ địa phương (dựa trên phần bù chênh lệnh UTC)
   */
  protected _toLocalMidnightJdn(input: Jdn) {
    const { jdn, offset } = input;

    const diff = jdn - Math.floor(jdn);
    const u = diff < 0.5 ? Math.floor(jdn) - 1 : Math.floor(jdn);
    const m = u - offset / 86400 + 0.5;

    return parseFloat(m.toFixed(6));

    // const utcMidnight =
    //   diff >= 0.5 ? Math.floor(jdn) + 0.5 : Math.floor(jdn) - 0.5;

    // if (offset === 0) {
    //   return utcMidnight;
    // }

    // const decimal = parseFloat((1 - offset / 86400).toFixed(6));

    // const midnight =
    //   jdn >= utcMidnight + decimal
    //     ? utcMidnight + decimal
    //     : utcMidnight + decimal - 1;

    // return midnight;
  }

  /**
   * @inheritdoc
   */
  convert(input: Jdn): Jdn {
    return {
      jdn: this._toLocalMidnightJdn(input),
      offset: input.offset,
    };
  }
}
