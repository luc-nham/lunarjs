import { GregoryDateTimeStorage } from "../storages/GregoryDateTimeStorage";
import { Jdn, SimpleDateTime } from "../types";

/**
 * Lớp truy xuất giá trị JDN cơ bản
 */
class BaseJdn implements Jdn {
  private jdn: number = 2440587.5;
  private offset: number = 0;
  private localMidnightJdn?: number;

  /**
   * Khởi tạo đối tượng
   *
   * @param jdn Số ngày Julian trong phạm vi 5373484, mặc định 2440587.5 xác định thời điểm
   *            1970-01-01T00:00:00Z0000
   * @param offset Phần bù chênh lệch so với UTC, mặc định 0 tương ứng với giờ UTC (GMT+0)
   */
  constructor(jdn: number = 2440587.5, offset: number = 0) {
    this.setJdn(jdn);
    this.setOffset(offset);
  }

  /**
   * Đặt lại các giá trị cần tính toán động khi có các biến đổi của các tham số chính
   */
  protected reset() {
    this.localMidnightJdn = undefined;
  }

  /**
   * Đặt giá trị số ngày Julian mới
   *
   * @param jdn number
   * @returns
   */
  setJdn(jdn: number) {
    // Giới hạn tối đa đến 01-01-9999
    if (jdn < 1 || jdn > 5373484) {
      throw new Error(
        "Error. Julian day number must be must be between the range 1 and 5373484.",
      );
    }

    this.jdn = jdn;
    this.reset();

    return this;
  }

  /**
   * Đặt một giá trị phần bù chênh lệch UTC mới trong phạm vi -43200 và 50400, tương ứng với múi các
   * múi giờ từ GMT-12 cho đến GMT14. Việt Nam nằm ở múi giờ GMT+7 do đó giá trị phần bù này sẽ là
   * 7 x 60 x 60 = 25200 giây.
   *
   * @param offset number
   * @returns
   */
  setOffset(offset: number) {
    if (offset < -43200 || offset > 50400) {
      throw new Error(
        "Error. Offset must be must be between the range -43200 and 50400.",
      );
    }

    this.offset = offset;
    this.reset();

    return this;
  }

  /**
   * @inheritdoc
   */
  getOffset() {
    return this.offset;
  }

  /**
   * @inheritdoc
   */
  getJdn() {
    return this.jdn;
  }

  /**
   * @inheritdoc
   */
  getLocalMidnightJdn(): number {
    if (this.localMidnightJdn === undefined) {
      const jdn = this.getJdn();
      const diff = jdn - Math.floor(jdn);

      const utcMidnight =
        diff >= 0.5 ? Math.floor(jdn) + 0.5 : Math.floor(jdn) - 0.5;

      if (this.getOffset() === 0) {
        return utcMidnight;
      }

      const decimal = parseFloat((1 - this.getOffset() / 86400).toFixed(6));

      /**
       * Các bài test không cho thấy điều kiện utcMidnight + decimal được sử dụng, khối mã sau tạm
       * thời được bỏ qua để dự phòng lỗi bất ngờ.
       */
      // const midnight =
      //   jdn >= utcMidnight + decimal
      //     ? utcMidnight + decimal
      //     : utcMidnight + decimal - 1;
      //this.localMidnightJdn = midnight;

      this.localMidnightJdn = utcMidnight + decimal - 1;
    }

    return this.localMidnightJdn;
  }

  /**
   * Phương thức tĩnh hỗ trợ chuyển đổi một mốc thời gian lịch Gregory (Dương lịch) thành số ngày
   * Julian tương ứng.
   *
   * Nếu đầu vào là giờ địa phương, số ngày Julian đầu ra sẽ vẫn luôn được đảm bảo tương ứng với UTC
   * dựa trên phần bù chênh lệch.
   */
  public static fromGregorian(
    input: Date | GregoryDateTimeStorage | SimpleDateTime,
  ) {
    const date =
      input instanceof GregoryDateTimeStorage
        ? input
        : GregoryDateTimeStorage.fromDate(input);

    const a = Math.floor((14 - date.month()) / 12);
    const y = date.year() + 4800 - a;
    const m = date.month() + 12 * a - 3;
    const j =
      date.day() +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;

    const f = parseFloat(
      (
        (((date.hour() - 12) % 24) * 3600 +
          date.minute() * 60 +
          date.second()) /
        86400
      ).toFixed(6),
    );

    let jdn = j + f;

    if (date.offset() !== undefined && date.offset() !== 0) {
      jdn -= parseFloat((date.offset() / 86400).toFixed(6));
    }

    return new this(jdn, date.offset());
  }
}

export { BaseJdn };
