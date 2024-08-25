import { Converter, Jdn } from "../types";
import { JdnToGregorian } from "./JdnToGregorian";

/**
 * Số ngày trung bình Mặt trăng hoàn thành 1 vòng quay quanh Trái đất (1 chu kỳ)
 */
const SYN_MOON = 29.53058868;

export abstract class BaseNewMoonPhase<I, O> implements Converter<I, O> {
  /**
   * @inheritdoc
   */
  abstract convert(input: I): O;

  /**
   * Chuyển đổi số đo góc thành radian
   */
  protected _degtorad(deg: number) {
    return (deg * Math.PI) / 180;
  }

  /**
   * Tính toán thời gian của điểm Sóc từ một mốc ngày Julian
   *
   * @param number   jdn
   * @param number k Tham số này chỉ số tháng đồng bộ được tính toán trước, theo công thức
   *                 K = (năm dương lịch - 1990) * 12.3685
   * @return number
   */
  protected _meanphase(jdn: number, k: number): number {
    const jt = (jdn - 2415020.0) / 36525;
    const t2 = jt * jt;
    const t3 = t2 * jt;

    return (
      2415020.75933 +
      SYN_MOON * k +
      0.0001178 * t2 -
      0.000000155 * t3 +
      0.00033 * Math.sin(this._degtorad(166.56 + 132.87 * jt - 0.009173 * t2))
    );
  }

  /**
   * Với "k" là tổng số chu kỳ Trăng đã qua kể từ 1900-01-01T00:00+0000, trả về số ngày Julian tương
   * ứng với vị trí Trăng mới cần tính.
   *
   * @param float k
   */
  protected _truephase(k: number): number {
    const t = k / 1236.85;
    const t2 = t * t;
    const t3 = t2 * t;

    let pt =
      2415020.75933 +
      SYN_MOON * k +
      0.0001178 * t2 -
      0.000000155 * t3 +
      0.00033 * Math.sin(this._degtorad(166.56 + 132.87 * t - 0.009173 * t2));

    const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
    const mprime =
      306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
    const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;

    pt +=
      (0.1734 - 0.000393 * t) * Math.sin(this._degtorad(m)) +
      0.0021 * Math.sin(this._degtorad(2 * m)) -
      0.4068 * Math.sin(this._degtorad(mprime)) +
      0.0161 * Math.sin(this._degtorad(2 * mprime)) -
      0.0004 * Math.sin(this._degtorad(3 * mprime)) +
      0.0104 * Math.sin(this._degtorad(2 * f)) -
      0.0051 * Math.sin(this._degtorad(m + mprime)) -
      0.0074 * Math.sin(this._degtorad(m - mprime)) +
      0.0004 * Math.sin(this._degtorad(2 * f + m)) -
      0.0004 * Math.sin(this._degtorad(2 * f - m)) -
      0.0006 * Math.sin(this._degtorad(2 * f + mprime)) +
      0.001 * Math.sin(this._degtorad(2 * f - mprime)) +
      0.0005 * Math.sin(this._degtorad(m + 2 * mprime));

    return parseFloat(pt.toFixed(6));
  }

  /**
   * Trả về tổng số pha Trăng mới đã qua kể từ 00:00 ngày 01 tháng 01 năm 1990 (UTC) cho đến thời
   * điểm đầu vào.
   *
   * @param jdn     số ngày Julian theo quy ước ngày mới bắt đầu vào 12 giờ trưa UTC
   * @param offset  phần bù chênh lệnh giờ địa phương so với UTC, tính bằng giây
   */
  protected _totalphase(input: Jdn) {
    const { jdn, offset } = input;

    const sdate = jdn + 1;
    const gre = new JdnToGregorian().convert({ jdn: sdate - 45, offset });

    let k1 = Math.floor(
      (gre.year + (gre.month - 1) * (1 / 12) - 1900) * 12.3685,
    );
    let nt1 = this._meanphase(Math.floor(sdate - 45), k1);
    let adate = nt1;

    while (true) {
      const k2 = k1 + 1;
      adate += SYN_MOON;

      let nt2 = this._meanphase(Math.floor(adate), k2);

      if (Math.abs(nt2 - sdate) < 0.75) {
        nt2 = this._truephase(k2);
      }

      if (nt1 <= sdate && nt2 > sdate) {
        break;
      }

      nt1 = nt2;
      k1 = k2;
    }

    return k1;
  }
}
