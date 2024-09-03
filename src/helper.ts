import { RequiredSimpleDateTime, SimpleDateTime } from "./types";

/**
 * Fix the decimal part of a floating number.
 *
 * @param num   Target number
 * @param quan  Output decimal amount, default 6
 */
export function toFloat(num: number, quan: number = 6) {
  return parseFloat(num.toFixed(quan));
}

/**
 * Converts a Gregorian date to the corresponding of Julian day number (JDN).
 *
 * @param input Object that stores Gregorian calendar dates. Any missing data will be replaced with
 *              1970-01-01 00:00:00 +0000
 * @returns     The output JDN comply with the new date convention starting at 12 noon GMT+0.
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

  // Day - Month - Year
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

  // Hours- Seconds - Minutes
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

/**
 * Average number of days the Moon completes one revolution around the Earth (1 cycle)
 */
const SYN_MOON = 29.53058868;

/**
 * Converts a known total number of new moon phases since 1900-01-01 to the corresponding JDN.
 * Normally, when used to calculate the Lunar Calendar, simply use the local midnight time of the
 * day that begins a new moon phase, and this is the default behavior of the output. However, you
 * can adjust the `midnight` parameter to get the exact JDN of the start of the new moon phase.
 *
 * @param k         Start with 0 at 1900-01-01 UTC
 * @param offset    Used to get Jdn output at midnight local time, default 0 mean UTC
 * @param midnight  If true (default), the output is JDN of midnight local time (00:00), conversely,
 *                  the output is the exact JDN of the start of the new moon phase.
 */
export function totalPhaseToNewMoonJd(
  k: number,
  offset: number = 0,
  midnight: boolean = true,
) {
  const rad = (deg: number) => (deg * Math.PI) / 180;

  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;

  let pt =
    2415020.75933 +
    SYN_MOON * k +
    0.0001178 * t2 -
    0.000000155 * t3 +
    0.00033 * Math.sin(rad(166.56 + 132.87 * t - 0.009173 * t2));

  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
  const mprime = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;

  pt +=
    (0.1734 - 0.000393 * t) * Math.sin(rad(m)) +
    0.0021 * Math.sin(rad(2 * m)) -
    0.4068 * Math.sin(rad(mprime)) +
    0.0161 * Math.sin(rad(2 * mprime)) -
    0.0004 * Math.sin(rad(3 * mprime)) +
    0.0104 * Math.sin(rad(2 * f)) -
    0.0051 * Math.sin(rad(m + mprime)) -
    0.0074 * Math.sin(rad(m - mprime)) +
    0.0004 * Math.sin(rad(2 * f + m)) -
    0.0004 * Math.sin(rad(2 * f - m)) -
    0.0006 * Math.sin(rad(2 * f + mprime)) +
    0.001 * Math.sin(rad(2 * f - mprime)) +
    0.0005 * Math.sin(rad(m + 2 * mprime));

  return midnight ? jdToLocalMidnightJd(pt, offset) : pt;
}

/**
 * Converts a number of Julian days to the corresponding total number of new moon phases, with 0
 * starting at time 1900-01-01 UTC
 *
 * @param jdn The Julian day number
 */
export function jdToTotalPhase(jdn: number) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const meanphase = (jdn: number, k: number) => {
    const jt = (jdn - 2415020.0) / 36525;
    const t2 = jt * jt;
    const t3 = t2 * jt;

    return (
      2415020.75933 +
      SYN_MOON * k +
      0.0001178 * t2 -
      0.000000155 * t3 +
      0.00033 * Math.sin(rad(166.56 + 132.87 * jt - 0.009173 * t2))
    );
  };

  const sdate = jdn + 1;
  const { year, month } = jdToGregorian(sdate - 45);

  let k1 = Math.floor((year + (month - 1) * (1 / 12) - 1900) * 12.3685);
  let nt1 = meanphase(Math.floor(sdate - 45), k1);
  let adate = nt1;

  while (true) {
    const k2 = k1 + 1;
    adate += SYN_MOON;

    let nt2 = meanphase(Math.floor(adate), k2);

    if (Math.abs(nt2 - sdate) < 0.75) {
      nt2 = totalPhaseToNewMoonJd(k2);
    }

    if (nt1 <= sdate && nt2 > sdate) {
      break;
    }

    nt1 = nt2;
    k1 = k2;
  }

  return k1;
}

/**
 * Converts a JDN to a new moon phase JDN, i.e. the input JDN and output JDN of the new moon phase
 * are within one lunar cycle.
 *
 * @param jd        JDN input
 * @param offset    Used to get Jdn output at midnight local time, default 0 mean UTC
 * @param midnight  If true (default), the output is JDN of midnight local time (00:00), conversely,
 *                  the output is the exact JDN of the start of the new moon phase.
 * @returns         JDN of new moon phase
 */
export function jdToNewMoonJd(
  jd: number,
  offset: number = 0,
  midnight: boolean = true,
) {
  return totalPhaseToNewMoonJd(jdToTotalPhase(jd), offset, midnight);
}
