import { DateTimeKeyProp, SimpleDateTime } from "../types";
import { BaseDateTimeStorage } from "./BaseDateTimeStorage";

/**
 * Lớp lưu trữ các giá trị thời gian lịch Gregory. Mục đích lớp này được sử dụng trong gói bao gồm:
 * - Cung cấp đầu vào cho các bộ chuyển đổi từ dương lịch sang các giá trị thiên văn như tính toán
 * Kinh độ Mặt trời, xác định điểm Sóc (Trăng mới...), hoặc chuyển đổi sang Âm lịch...
 * - Tạo kết quả đầu ra từ các bộ chuyển đổi. Ví dụ, chuyển đổi ngược số ngày Julian thành các mốc
 * thời gian Gregory, hoặc chuyển đổi một mốc Âm lịch sang Dương lịch...
 *
 * Lớp này tuân thủ những nguyên tắc xác thực chung của lịch Gregory:
 * - Ngày trong tháng chấp nhận từ 1 - 31
 * - Số tháng chấp nhận từ 1 - 12
 * - Năm chấp nhận từ 1 - 9999
 * - Giờ chấp nhận định dạng 24h, từ 0 - 23
 * - Phút và giây chấp nhận từ 0 đến 59
 * - Bù chênh lệch UTC chấp nhận -43200 (GMT-12) cho đến 50400 (GMT+14)
 */
class GregoryDateTimeStorage extends BaseDateTimeStorage {
  /**
   * @inheritdoc
   */
  protected validateBeforeSetValue(
    p: DateTimeKeyProp,
    v: number,
  ): string | boolean {
    switch (p) {
      case "_d":
        return v >= 1 && v <= 31 && Number.isInteger(v)
          ? true
          : "Error. The day must be between 1 and 31.";
      case "_m":
        return v >= 1 && v <= 12 && Number.isInteger(v)
          ? true
          : "Error. The month must be between 1 and 12.";
      case "_y":
        return v >= 1 && v <= 9999 && Number.isInteger(v)
          ? true
          : "Error. The year must be between 1 and 9999.";
      case "_h":
        return v >= 0 && v <= 23 && Number.isInteger(v)
          ? true
          : "Error. The hour must be between 0 and 23.";
      case "_i":
      case "_s":
        return v >= 0 && v <= 59 && Number.isInteger(v)
          ? true
          : `Error. The ${p === "_i" ? "minute" : "second"} must be between 0 and 59.`;
      case "_o":
        return v >= -43200 && v <= 50400
          ? true
          : "Error. The offset must be between -43200 and 50400.";
    }
  }

  /**
   * Tạo một kho lưu trữ Dương lịch - Gregory từ một đối tượng Date. Nếu tham số không được cung
   * cấp, mặc định sẽ sử dụng thời gian hiện tại của hệ thống. Các giá trị trả về được tính theo
   * giờ địa phương.
   *
   * @param date Date | undefined
   * @returns
   */
  public static fromDate(date?: Date | SimpleDateTime) {
    if (date === undefined) {
      date = new Date();
    }

    const storage = new this();

    if (date instanceof Date) {
      storage
        .day(date.getDate())
        .month(date.getMonth() + 1)
        .year(date.getFullYear())
        .hour(date.getHours())
        .minute(date.getMinutes())
        .second(date.getSeconds())
        .offset(date.getTimezoneOffset() * -60);
    } else {
      if (date.day) storage.day(date.day);
      if (date.month) storage.month(date.month);
      if (date.year) storage.year(date.year);
      if (date.hour) storage.hour(date.hour);
      if (date.minute) storage.minute(date.minute);
      if (date.second) storage.second(date.second);
      if (date.offset) storage.offset(date.offset);
    }

    return storage;
  }
}

export { GregoryDateTimeStorage };
