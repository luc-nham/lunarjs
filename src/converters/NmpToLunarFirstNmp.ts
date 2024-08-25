import { LunarFirstNewMoonPhase, NewMoonPhase } from "../types";
import { BaseNewMoonPhase } from "./BaseNewMoonPhase";
import { JdnToGregorian } from "./JdnToGregorian";

/**
 * Chuyển đổi một pha Trăng mới bất kỳ thành điểm Trăng mới đầu tiên (01/01) năm Âm lịch, thỏa mãn
 * điều kiện pha Trăng mới đầu vào tương ứng với một tháng thuộc năm Âm lịch đó.
 */
export class NmpToLunarFirstNmp extends BaseNewMoonPhase<
  NewMoonPhase,
  LunarFirstNewMoonPhase
> {
  /**
   * Trả về true nếu năm Âm lịch nhuận, false nếu không
   */
  protected _leap(y: number) {
    return [0, 3, 6, 9, 11, 14, 17].includes(y % 19);
  }

  /**
   * Từ một điểm Trăng mới đầu vào, tính toán và chuyển đổi đầu ra thành điểm Trăng mới đầu tiên
   * của năm Âm lịch tương ứng - tức tháng 01 Âm lịch.
   *
   * @param input pha trăng mới - Sóc
   */
  convert(input: NewMoonPhase): LunarFirstNewMoonPhase {
    /**
     * Phương pháp chuyển đổi:
     * 1. Chuyển điểm Sóc đầu vào thành lịch Gregory để lấy được số năm
     * 2. Tính số năm khác biệt từ mốc 1900-01-01 dương lịch bằng cách lấy (1) trừ đi 1900.
     * 3. Mỗi năm Âm lịch có 12 kỳ trăng, lấy số năm (2) nhân với 12 để lấy được tổng số pha Trăng
     * mới cho năm Âm lịch cần tính.
     * 4. Mỗi 19 năm Âm lịch có 7 năm nhuận, lấy (2) chia cho 19 được số vòng nhuận của mỗi 19 năm
     * 5. Lấy (4) nhân với 7 được số kỳ Trăng mới cần cộng thêm cho các năm nhuận.
     * 6. Tại thời điểm 1900-01-01, số pha Trăng mới là 0, tuy nhiên Âm lịch tương ứng sẽ rơi vào
     * tháng 12 năm 1899, khi đó cần bù thêm 1 pha nữa sẽ nhận được tổng số pha Trăng mới của điểm
     * bắt đầu tháng 01 năm Âm lịch.
     */
    const gre = new JdnToGregorian().convert(input); // 1
    const diff = gre.year - 1900; // 2
    let total = Math.round(diff * 12 + (diff / 19) * 7 + 1); // 3, 4, 5, 6
    let year = gre.year;

    /**
     * Trường hợp điểm Sóc đầu vào có tổng chu kỳ nhỏ hơn tổng chu kỳ cần thiết tương ứng với năm
     * đầu vào, tức Dương lịch đã qua năm mới, nhưng Âm lịch vẫn đang ở năm cũ, thì cần trừ lùi lại
     * 12 hoặc 13 (đối với năm nhuận) điểm Sóc nữa xác định được tổng chu kỳ mong muốn.
     */
    if (input.total < total) {
      /**
       * Nếu điểm Sóc đầu vào nằm trong tháng 12 Dương lịch, thì số năm Âm và Dương là bằng nhau.
       * Nếu rơi vào tháng 01 hoặc 02, thì số năm Dương lịch sẽ đi trước năm Âm lịch 1 đơn vị, khi
       * đó cần trừ lùi 1 năm để lấy được số năm Âm lịch cần tính.
       */
      if (gre.month !== 12) {
        year -= 1;
      }

      /**
       * Khi năm cần tính là năm trước đó, nếu năm đó không nhuận thì lùi lại 12, nếu nhuận cần
       * lùi lại 13 điểm Sóc.
       */
      total = this._leap(year) ? total - 13 : total - 12;
    }

    return {
      jdn: this._truephase(total),
      offset: input.offset,
      leap: this._leap(year),
      total,
      year,
    };
  }
}
