import { LunarFirstNewMoonPhase, LunarLeapMonth, NewMoonPhase } from "../types";
import { BaseNewMoonPhase } from "./BaseNewMoonPhase";
import { JdnToLocalMidnightJdn } from "./JdnToLocalMidnightJdn";
import { JdnToSunlongitude } from "./JdnToSunlongitude";

/**
 * Bộ chuyển điểm Sóc tháng 01 năm Âm lịch thành điểm Sóc của tháng nhuận cùng năm (nếu có)
 */
export class LunarFirstNmpToLeapMonthNmp extends BaseNewMoonPhase<
  LunarFirstNewMoonPhase,
  LunarLeapMonth | undefined
> {
  /**
   * Tạo một đối tượng pha Trăng mới từ tổng số pha
   */
  private _create(phases: number, offset: number): NewMoonPhase {
    return {
      jdn: this._truephase(phases),
      total: phases,
      offset,
    };
  }

  /**
   * Chuyển đổi điểm Sóc tháng 01 năm Âm lịch thành điểm Sóc tháng nhuận Âm lịch cùng năm. Nếu
   * năm đó không nhuận, trả về undefined
   */
  convert(input: LunarFirstNewMoonPhase): LunarLeapMonth | undefined {
    /**
     * Phương pháp tính toán như sau:
     *
     * 1. Từ điểm Sóc của tháng 01 năm Âm lịch, cộng thêm 2 điểm Sóc nữa và bắt đầu tính từ vị trí
     * này. Bởi vì tháng nhuận phải là tháng sau tháng 2 thường. Như vậy sẽ còn 9 tháng cần phải
     * tính toán để xác định tháng nào là tháng nhuận.
     *
     * 2. Sử dụng điểm Sóc (1) và điểm Sóc của tháng kế với nó để so sánh với nhau.
     *
     * 3. Tính toán góc Kinh độ Mặt trời của cả 2 điểm Sóc (2), nhưng lưu ý là sử dụng thời điểm nửa
     * đêm của giờ địa phương (bắt đầu 1 ngày mới), chứ không sử dụng thời điểm chính xác của điểm
     * bắt đầu pha Trăng mới. Chẳng hạn, một pha Trăng mới có thể bắt đầu vào bất kỳ giờ nào trong
     * ngày, nhưng luôn sử dụng thời điểm 00:00 cùng ngày hôm đó để tính toán góc Kinh độ Mặt trời.
     *
     * 4. Tháng nhuận là tháng Âm lịch mà nó không có chứa Trung khí nào trong 12 Trung khí đã biết
     * (Xuân Phân, Cốc Vũ...). Góc Kinh độ Mặt trời nằm trong phạm vi 0.xxx - 359.xxx, mỗi Trung khí
     * tương ứng với 30 độ. Để thuận tiện so sánh, hãy lấy góc Kinh độ chia cho 30 và làm tròn kết
     * quả (vd: 180.54321 / 30 = 6).
     *
     * 5. Sử dụng phương pháp (4) để so sánh góc KDMT của hai điểm Sóc (2) để so sánh với nhau, nếu
     * chúng cho ra giá trị bằng nhau thì tháng đó là tháng nhuận. Chẳng hạn, góc KDMT của điểm Sóc
     * 1 là 150.123 (150.123 / 30 = 5), điểm Sóc của tháng kế tiếp nó là 179.321 (179.321 / 30 = 5).
     *
     * 6. Trường hợp trong 1 năm có nhiều tháng không chứa Trung khí (5), nếu tháng sau tháng 11
     * thường là tháng nhuận, thì năm đó nhuận tháng 11, nếu không, thì dùng tháng đầu tiên đáp
     * ứng điều kiện.
     */

    if (!input.leap) {
      return undefined;
    }

    const { offset } = input;
    const slc = new JdnToSunlongitude();
    const mjc = new JdnToLocalMidnightJdn();
    const result: LunarLeapMonth[] = [];

    let phases = input.total + 2;
    let month = 1;
    let nmp = this._create(phases, offset);

    for (let i = 0; i <= 9; i++) {
      phases++;
      month++;

      const nextNmp = this._create(phases, offset);
      const nextSl = Math.floor(slc.convert(mjc.convert(nextNmp)) / 30);
      const sl = Math.floor(slc.convert(mjc.convert(nmp)) / 30);

      if (nextSl === sl) {
        result.push({ ...nmp, ...{ month: month } });
      }

      nmp = nextNmp;
    }

    let leap = result.find((l) => l.month === 11);

    if (!leap) {
      leap = result[0];
    }

    return leap;
  }
}
