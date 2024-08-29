import {
  Converter,
  Jdn,
  LunarDateTime,
  LunarLeapMonth,
  NewMoonPhase,
  SimpleDateTime,
} from "../types";
import { GregorianToJdn } from "./GregorianToJdn";
import { JdnToLocalMidnightJdn } from "./JdnToLocalMidnightJdn";
import { JdnToNewMoonPhase } from "./JdnToNewMoonPhase";
import { LunarFirstNmpToLeapMonthNmp } from "./LunarFirstNmpToLeapMonthNmp";
import { NmpToLunarFirstNmp } from "./NmpToLunarFirstNmp";

export class GregorianToLunarDateTime
  implements Converter<SimpleDateTime, LunarDateTime>
{
  /**
   * Tính toán số tháng Âm lịch dựa trên 3 tham số:
   * - Điểm Sóc hiện tại
   * - Điểm Sóc tháng 01 Âm lịch
   * - Điểm Sóc tháng nhuận (nếu có)
   */
  private _month(nmp: NewMoonPhase, fnmp: NewMoonPhase, leap?: LunarLeapMonth) {
    if (nmp.total === fnmp.total) {
      return 1;
    }

    const month = nmp.total - fnmp.total;

    if (!leap || nmp.total < leap.total) {
      return month + 1;
    }

    return month;
  }

  /**
   * Xác định ngày Âm lịch
   *
   * @param jdn Số ngày Julian của điểm đầu vào
   * @param nmp Điểm Sóc của thời điểm đầu vào
   */
  private _day(jdn: Jdn, nmp: Jdn) {
    const j2mj = new JdnToLocalMidnightJdn();
    const cj = j2mj.convert(jdn);
    const nj = j2mj.convert(nmp);

    return cj.jdn - nj.jdn + 1;
  }

  /**
   * Trả về tổng số ngày trong một tháng âm lịch, có thể là 29 (thiếu) hoặc 30 (đủ)
   *
   * @param nmp Điểm Sóc tương ứng thời điểm đầu vào
   */
  private _dayOfMonth(nmp: NewMoonPhase) {
    const jd2mljd = new JdnToLocalMidnightJdn();
    const nextNmp = new JdnToNewMoonPhase().convert({
      jdn: nmp.jdn + 30,
      offset: nmp.offset,
    });

    const j1 = jd2mljd.convert(nmp);
    const j2 = jd2mljd.convert(nextNmp);

    return j2.jdn - j1.jdn;
  }

  /**
   * Chuyển đổi một mốc thời gian Dương lịch - Gregory sang Âm lịch tương ứng
   */
  convert(input: SimpleDateTime): LunarDateTime {
    const jdn = new GregorianToJdn().convert(input);
    const nmp = new JdnToNewMoonPhase().convert(jdn);
    const fnmp = new NmpToLunarFirstNmp().convert(nmp);
    const lnmp = new LunarFirstNmpToLeapMonthNmp().convert(fnmp);

    return {
      day: this._day(jdn, nmp),
      month: this._month(nmp, fnmp, lnmp),
      year: fnmp.year,
      hour: input.hour ? input.hour : 0,
      minute: input.minute ? input.minute : 0,
      second: input.second ? input.second : 0,
      isLeapYear: fnmp.leap,
      isLeapMonth: Boolean(lnmp && lnmp.total === nmp.total),
      jdn: nmp.jdn,
      offset: nmp.offset,
      dayOfMonth: this._dayOfMonth(nmp),
      leapMonth: lnmp ? lnmp.month : 0,
    };
  }
}
