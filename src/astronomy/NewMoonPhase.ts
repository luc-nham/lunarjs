import { GregoryDateTimeStorage } from "../storages/GregoryDateTimeStorage";
import { BaseJdn } from "./BaseJdn";

/**
 * Số ngày trung bình Mặt trăng hoàn thành 1 vòng quay quanh Trái đất (1 chu kỳ)
 */
const SYN_MOON = 29.53058868;

/**
 * Lớp tính toán pha Trăng mới - hay còn gọi điểm Sóc. Điểm bắt đầu pha Trăng mới được sử dụng để
 * xác định ngày đầu tiên (01) của tháng Âm lịch.
 *
 * Một năm Âm lịch thông thường có 12 điểm Sóc, đối với năm nhuận là 13.
 */
export class NewMoonPhase extends BaseJdn {
  /**
   * Tổng số chu kỳ trăng đã qua kể từ 1900-01-01T00:00+0000 cho đến điểm đang tính
   */
  private totalPhases?: number;

  /**
   * Số ngày Julian tương ứng với điểm Sóc
   */
  private newMoonPhaseJdn?: number;

  /**
   * @inheritdoc
   */
  protected reset(): void {
    this.totalPhases = undefined;
    this.newMoonPhaseJdn = undefined;

    super.reset();
  }

  /**
   * Chuyển đổi số đo góc thành radian
   */
  protected deg2rad(deg: number) {
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
  protected meanphase(jdn: number, k: number): number {
    const jt = (jdn - 2415020.0) / 36525;
    const t2 = jt * jt;
    const t3 = t2 * jt;

    return (
      2415020.75933 +
      SYN_MOON * k +
      0.0001178 * t2 -
      0.000000155 * t3 +
      0.00033 * Math.sin(this.deg2rad(166.56 + 132.87 * jt - 0.009173 * t2))
    );
  }

  /**
   * Với "k" là tổng số chu kỳ Trăng đã qua kể từ 1900-01-01T00:00+0000, trả về số ngày Julian tương
   * ứng với vị trí Trăng mới cần tính.
   *
   * @param float k
   */
  protected truephase(k: number): number {
    const t = k / 1236.85;
    const t2 = t * t;
    const t3 = t2 * t;

    let pt =
      2415020.75933 +
      SYN_MOON * k +
      0.0001178 * t2 -
      0.000000155 * t3 +
      0.00033 * Math.sin(this.deg2rad(166.56 + 132.87 * t - 0.009173 * t2));

    const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
    const mprime =
      306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
    const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;

    pt +=
      (0.1734 - 0.000393 * t) * Math.sin(this.deg2rad(m)) +
      0.0021 * Math.sin(this.deg2rad(2 * m)) -
      0.4068 * Math.sin(this.deg2rad(mprime)) +
      0.0161 * Math.sin(this.deg2rad(2 * mprime)) -
      0.0004 * Math.sin(this.deg2rad(3 * mprime)) +
      0.0104 * Math.sin(this.deg2rad(2 * f)) -
      0.0051 * Math.sin(this.deg2rad(m + mprime)) -
      0.0074 * Math.sin(this.deg2rad(m - mprime)) +
      0.0004 * Math.sin(this.deg2rad(2 * f + m)) -
      0.0004 * Math.sin(this.deg2rad(2 * f - m)) -
      0.0006 * Math.sin(this.deg2rad(2 * f + mprime)) +
      0.001 * Math.sin(this.deg2rad(2 * f - mprime)) +
      0.0005 * Math.sin(this.deg2rad(m + 2 * mprime));

    return parseFloat(pt.toFixed(6));
  }

  /**
   * Trả về tổng số pha Trăng mới đã qua kể từ 00:00 ngày 01 tháng 01 năm 1990 (UTC) cho đến thời
   * điểm đầu vào.
   */
  getTotalPhases() {
    if (this.totalPhases === undefined) {
      const sdate = super.getJdn() + 1;
      const gre = GregoryDateTimeStorage.fromDate(
        new BaseJdn(sdate - 45, this.getOffset()).toGregorian(),
      );

      let k1 = Math.floor(
        (gre.year() + (gre.month() - 1) * (1 / 12) - 1900) * 12.3685,
      );
      let nt1 = this.meanphase(Math.floor(sdate - 45), k1);
      let adate = nt1;

      while (true) {
        const k2 = k1 + 1;
        adate += SYN_MOON;

        let nt2 = this.meanphase(Math.floor(adate), k2);

        if (Math.abs(nt2 - sdate) < 0.75) {
          nt2 = this.truephase(k2);
        }

        if (nt1 <= sdate && nt2 > sdate) {
          break;
        }

        nt1 = nt2;
        k1 = k2;
      }

      this.totalPhases = k1;
    }

    return this.totalPhases;
  }

  /**
   * Trả về số ngày Julian tương ứng với vị trí pha Trăng mới của điểm đầu vào.
   */
  getJdn(): number {
    if (this.newMoonPhaseJdn === undefined) {
      this.newMoonPhaseJdn = this.truephase(this.getTotalPhases());
    }

    return this.newMoonPhaseJdn;
  }
}
