import { Converter, Jdn, RequiredSimpleDateTime } from "../types";

export class JdnToGregorian implements Converter<Jdn, RequiredSimpleDateTime> {
  /**
   * Chuyển đổi một mốc ngày Julian thành lịch Gregory giờ địa phương. Phương thức này cho phép các
   * lớp mở rộng có thể sử dụng linh hoạt khi cần thực hiện các phép chuyển đổi.
   *
   * @param jdn      số ngày Julian - tuân thủ theo nguyên tắc: ngày mới bắt đầu vào 12 giờ trưa UTC
   * @param offset  phần bù chênh lệch giờ địa phương so với UTC, tính bằng giây
   * @returns       đối tượng chứa các thông tin về thời gian lịch Gregory
   */
  protected _togregorian(input: Jdn) {
    const storage: RequiredSimpleDateTime = {
      day: 1,
      month: 1,
      year: 1970,
      hour: 0,
      minute: 0,
      second: 0,
      offset: input.offset,
    };

    const jdn = input.jdn + parseFloat((input.offset / 86400).toFixed(6));

    // Ngày tháng năm
    let j = Math.floor(jdn);

    if (jdn - j >= 0.5) {
      j += 1;
    }

    j -= 1721119;

    let y = Math.floor((4 * j - 1) / 146097);
    j = 4 * j - 1 - 146097 * y;

    let d = Math.floor(j / 4);
    j = Math.floor((4 * d + 3) / 1461);
    d = 4 * d + 3 - 1461 * j;
    d = Math.floor((d + 4) / 4);
    let m = Math.floor((5 * d - 3) / 153);
    d = 5 * d - 3 - 153 * m;
    d = Math.floor((d + 5) / 5);
    y = 100 * y + j;

    if (m < 10) {
      m += 3;
    } else {
      m -= 9;
      y += 1;
    }

    storage.day = d;
    storage.month = m;
    storage.year = y;

    // Giờ phút giây
    const totalSec = Math.ceil(
      (input.jdn - Math.floor(input.jdn)) * 86400 + input.offset + 43200,
    );

    const h = Math.floor(totalSec / 3600) % 24;
    const i = Math.floor(totalSec / 60) % 60;
    const s = Math.floor(totalSec % 60);

    storage.hour = h;
    storage.minute = i;
    storage.second = s;
    storage.offset = input.offset;

    return storage;
  }

  /**
   * @inheritdoc
   */
  convert(input: Jdn): RequiredSimpleDateTime {
    return this._togregorian(input);
  }
}
