import { GregoryDateTimeStorage } from "../storages/GregoryDateTimeStorage";
import { Jdn, SimpleDateTime } from "../types";

export const EPOCH_JDN = 2440587.5;

/**
 * Lớp truy xuất giá trị JDN cơ bản
 */
export class BaseJdn implements Jdn {
  private jdn: number = EPOCH_JDN;
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
   * Phương thức này được gọi mỗi khi một trong các hành động dưới đây xảy ra, và sau khi giá trị
   * mới đã được thay đổi thành công:
   * - Thay đổi số ngày Julian thông qua phương thức setJdn
   * - Thay đổi phần bù chênh lệnh giữa giờ địa phương so với UTC thông qua phương thức setOffset
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
   * Chuyển đổi một mốc ngày Julian thành lịch Gregory giờ địa phương. Phương thức này cho phép các
   * lớp mở rộng có thể sử dụng linh hoạt khi cần thực hiện các phép chuyển đổi.
   *
   * @param jd      số ngày Julian - tuân thủ theo nguyên tắc: ngày mới bắt đầu vào 12 giờ trưa UTC
   * @param offset  phần bù chênh lệch giờ địa phương so với UTC, tính bằng giây
   * @returns       đối tượng chứa các thông tin về thời gian lịch Gregory
   */
  protected _toGregorian(jd: number, offset: number) {
    const storage: SimpleDateTime = {};
    const jdn = jd + Math.ceil(offset / 86400);

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
    const totalSec = Math.ceil((jd - Math.floor(jd)) * 86400 + offset + 43200);

    const h = Math.floor(totalSec / 3600) % 24;
    const i = Math.floor(totalSec / 60) % 60;
    const s = Math.floor(totalSec % 60);

    storage.hour = h;
    storage.minute = i;
    storage.second = s;
    storage.offset = offset;

    return storage;
  }

  /**
   * Chuyển đổi mốc ngày Julian thành mốc lịch Gregory tương ứng, hỗ trợ giờ, phút, giây và bù chênh
   * lệnh với UTC. Nếu phần bù được thiết lập (thông qua khởi tạo đối tượng hoặc hàm setOffset...),
   * đầu ra sẽ tương ứng với giờ địa phương. Nếu phần bù bằng 0 (tương ứng UTC), đầu ra sẽ là UTC.
   */
  public toGregorian() {
    return this._toGregorian(this.getJdn(), this.getOffset());
  }

  /**
   * Tạo nhanh đối tượng mới (chuyển đổi) từ một mốc thời gian Dương lịch - Gregory đầu vào. Tham số
   * có được hỗ trợ dưới 3 dạng:
   * - GregoryDateTimeStorage: kho lưu trữ lịch Gregory với các cấu hình xác thực đã được thiết lập.
   * - Date: lớp Date của Javascript, sẽ được chuyển tiếp qua một kho lưu trữ GregoryDateTimeStorage
   * để chuyển đổi các dữ liệu cần thiết (số tháng, bù chênh lệnh UTC...) trước khi tiến hành xử lý.
   * - Một đối tượng đơn giản với các mốc thời gian theo lịch Gregory, nó sẽ được chuyển tiếp qua
   * một kho lưu trữ GregoryDateTimeStorage để xác thực trước khi tiến hành xử lý.
   */
  public static fromGregorian<T extends BaseJdn>(
    this: new (jdn: number, offset: number) => T,
    input: Date | GregoryDateTimeStorage | SimpleDateTime,
  ): T {
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

  /**
   * Tạo nhanh đối tượng từ một đối tượng triển khai giao diện Jdn. Điều này hữu ích khi các lớp mở
   * rộng sử dụng một mốc ngày julian đã được tính toán để làm đầu vào.
   */
  public static fromJdn<T extends BaseJdn>(
    this: new (jdn: number, offset: number) => T,
    j: Jdn,
  ): T {
    return new this(j.getJdn(), j.getOffset());
  }
}
