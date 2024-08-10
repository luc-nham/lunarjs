import { SimpleDateTime, DateTimeKeyProp, DateTimeStorage } from "../types";

/**
 * Lớp lưu trữ các giá trị thời gian cơ bản. Các giá trị có thể được lưu trữ linh động mà không bị
 * ràng buộc vào một hoặc nhiều giới hạn. Bạn có thể sử dụng để lưu trữ chỉ chấp nhận quy ước số
 * ngày từ 1 đến 31 theo lịch Gregory, hoặc cũng có thể lưu trữ giá trị một tổng số ngày của 5 tháng
 * gỡ lỗi chương trình là 150 ngày...
 *
 * Nói chung, nó được thiết kế như là một lớp cơ sở, mà các lớp mở rộng có thể chỉ định mức độ ràng
 * buộc trong khi đọc - ghi dữ liệu.
 */
class BaseDateTimeStorage implements DateTimeStorage {
  private _d = 1;
  private _m = 1;
  private _y = 1970;
  private _h = 0;
  private _i = 0;
  private _s = 0;
  private _o = 0;

  constructor(datetime?: SimpleDateTime) {
    if (datetime) {
      if (datetime.day !== undefined) this.day(datetime.day);
      if (datetime.month !== undefined) this.month(datetime.month);
      if (datetime.year !== undefined) this.year(datetime.year);
      if (datetime.hour !== undefined) this.hour(datetime.hour);
      if (datetime.minute !== undefined) this.minute(datetime.minute);
      if (datetime.second !== undefined) this.second(datetime.second);
      if (datetime.offset !== undefined) this.offset(datetime.offset);
    }
  }

  /**
   * Xác thực tham số trước khi thay đổi các thuộc tính thời gian. Hàm này sẽ được gọi mỗi khi có
   * yêu cầu thay đổi dữ liệu. Ví dụ, bạn có thể muốn kiểm tra chỉ cho phép thay đổi số ngày trong
   * phạm vi từ 1 đến 31. Để sử dụng trong các lớp con, hãy ghi đè với các lưu ý sau:
   * - Trả về true khi giá trị đầu vào là hợp lệ và tiến hành thay đổi giá trị cũ bằng giá trị mới
   * - Trả về false để xác định giá trị không hợp lệ, một ngoại lệ sẽ được xuất ra với thông điệp
   * mặc định "Error. The input value invalid.".
   * - Trả về chuỗi thông báo để xác định giá trị không hợp lệ, một Error sẽ được xuất ra với thông
   * điệp là chuỗi được trả về.
   *
   * @param p
   * @param v
   */
  protected validateBeforeSetValue(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    p: DateTimeKeyProp,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    v: number,
  ): string | boolean {
    return true;
  }

  /**
   * Xử lý việc đọc và ghi dữ liệu
   */
  protected handle(p: DateTimeKeyProp, v?: number): this | number {
    if (v === undefined) {
      return this[p];
    }

    const validated = this.validateBeforeSetValue(p, v);

    if (validated !== true) {
      throw new Error(
        validated === false ? "Error. The input value invalid." : validated,
      );
    }

    this[p] = v;
    return this;
  }

  /**
   * @inheritdoc
   */
  day(): number;
  day(d: number): this;
  day(d?: number): number | this {
    return this.handle("_d", d);
  }

  /**
   * @inheritdoc
   */
  month(): number;
  month(m: number): this;
  month(m?: number): number | this {
    return this.handle("_m", m);
  }

  /**
   * @inheritdoc
   */
  year(): number;
  year(y: number): this;
  year(y?: number): number | this {
    return this.handle("_y", y);
  }

  /**
   * @inheritdoc
   */
  hour(): number;
  hour(h: number): this;
  hour(h?: number): number | this {
    return this.handle("_h", h);
  }

  /**
   * @inheritdoc
   */
  minute(): number;
  minute(i: number): this;
  minute(i?: number): number | this {
    return this.handle("_i", i);
  }

  /**
   * @inheritdoc
   */
  second(): number;
  second(s: number): this;
  second(s?: number): number | this {
    return this.handle("_s", s);
  }

  /**
   * @inheritdoc
   */
  offset(): number;
  offset(o: number): this;
  offset(o?: number): number | this {
    return this.handle("_o", o);
  }
}

export { BaseDateTimeStorage };
