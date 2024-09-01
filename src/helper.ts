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

/**
 * Converts a Julian day number to a Julian day number at midnight local time.
 *
 * @param jdn       Julian day number correspond to any time of day.
 * @param offset    Difference between local time and UTC, in seconds, default 0 mean UTC.
 */
export function jdToLocalMidnightJd(jdn: number, offset: number = 0) {
  const diff = toFloat(jdn - Math.floor(jdn));
  const utcMidnight =
    diff >= 0.5 ? Math.floor(jdn) + 0.5 : Math.floor(jdn) - 0.5;

  if (offset === 0) {
    return utcMidnight;
  }

  const diff2 = toFloat(offset / 86400);

  if (diff === 0.5 - diff2) {
    return jdn;
  }

  const decimal = 1 - diff2;

  const midnight =
    jdn >= utcMidnight + decimal
      ? utcMidnight + decimal
      : utcMidnight + decimal - 1;

  return midnight;
}

/**
 * Converts a Julian day number to the corresponding Gregorian calendar.
 *
 * @param jdn       Julian day number
 * @param offset    Difference between local time and UTC, in seconds. Default 0 mean UTC,
 *                  otherwise, returns local time
 */
export function jdToGregorian(
  jdn: number,
  offset: number = 0,
): RequiredSimpleDateTime {
  const storage: RequiredSimpleDateTime = {
    day: 1,
    month: 1,
    year: 1970,
    hour: 0,
    minute: 0,
    second: 0,
    offset: offset,
  };

  const jd = jdn + toFloat(offset / 86400);

  // Ngày tháng năm
  let j = Math.floor(jd);

  if (jd - j >= 0.5) {
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
  const totalSec = Math.ceil((jdn - Math.floor(jdn)) * 86400 + offset + 43200);

  const h = Math.floor(totalSec / 3600) % 24;
  const i = Math.floor(totalSec / 60) % 60;
  const s = Math.floor(totalSec % 60);

  storage.hour = h;
  storage.minute = i;
  storage.second = s;
  storage.offset = offset;

  return storage;
}
