import { RequiredSimpleDateTime, SimpleDateTime } from "./types";

/**
 * Cố định phần thập phân của một số dấu động.
 *
 * @param num   Số mục tiêu
 * @param quan  Số lượng phần thập phân, mặc định 6
 */
export function toFloat(num: number, quan: number = 6) {
  return parseFloat(num.toFixed(quan));
}

/**
 * Chuyển đổi một mốc thời gian Dương lịch - Gregorian sang số ngày Julian tương ứng.
 *
 * @param input Đối tượng lưu trữ các mốc thời gian lịch Gregorian. Bất kỳ dữ kiện thời gian nào bị
 * thiếu sẽ được thay thế bổ sung bằng mốc thời gian 1970-01-01 00:00:00 +0000
 * @returns Số ngày Julian đầu ra tuân thủ quy ước ngày mới bắt đầu vào lúc 12 giờ trưa GMT+0.
 */
export function gregorianToJd(input: SimpleDateTime = {}) {
  const {
    day,
    hour,
    minute,
    month,
    offset,
    second,
    year,
  }: RequiredSimpleDateTime = {
    ...{
      day: 1,
      month: 1,
      year: 1970,
      hour: 0,
      minute: 0,
      second: 0,
      offset: 0,
    },
    ...input,
  };

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const j =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const f = toFloat((((hour - 12) % 24) * 3600 + minute * 60 + second) / 86400);

  let jdn = j + f;

  if (offset !== 0) {
    jdn -= toFloat(offset / 86400);
  }

  return jdn;
}
