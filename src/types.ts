/**
 * An object that stores basic time, used as input and output for converters.
 */
export interface SimpleDateTime {
  /**
   * Number of day
   */
  day: number;

  /**
   * Number of month
   */
  month: number;

  /**
   * Number of year
   */
  year: number;

  /**
   * Number of hour
   */
  hour: number;

  /**
   * Number of minute
   */
  minute: number;

  /**
   * Number of second
   */
  second: number;
}

/**
 * New moon phase
 */
export type NewMoonPhase = {
  /**
   * Julian day number corresponds to new moon begin point
   */
  jd: number;

  /**
   * Total number of new moon phases passed since 1900-01-01
   */
  total: number;
};

/**
 * The new moon phase of Lunar first month (01), likes January of Gregorian calendar
 */
export type LunarFirstNewMoonPhase = NewMoonPhase & {
  /**
   * Number of Lunar year
   */
  year: number;

  /**
   * Whether Lunar year is leap year
   */
  leap: boolean;
};

/**
 * The new moon phase of Lunar leap month if a year be leap.
 */
export type LunarLeapMonth = NewMoonPhase & {
  /**
   * Number of leap month. A lunar leap month can be located in many number, from 2 to 11, and is
   * different in each locality (related to time zone).
   */
  month: number;
};

/**
 * An object that stores basic Lunar date time, used as input and output for converters.
 */
export interface SimpleLunarDateTime extends SimpleDateTime {
  /**
   * Julian days correspond to lunar date time.
   */
  jd: number;

  /**
   * Leap month property
   */
  leap: {
    /**
     * Month number to be leap, if 0, mean is not leap
     */
    month: number;

    /**
     * Check if current month is leap
     */
    current: boolean;
  };

  /**
   * The total days of Lunar month
   */
  days: number;
}

/**
 * Lưu trữ các giá trị cần thiết của một mốc thời gian Âm lịch, thường dùng làm đầu ra from các bộ
 * chuyển đổi
 */
export interface LunarDateTime extends SimpleLunarDateTime {
  /**
   * Xác định năm Âm lịch có nhuận hay không
   */
  isLeapYear: boolean;

  /**
   * Xác định tháng hiện tại có phải tháng nhuận không
   */
  isLeapMonth: boolean;

  /**
   * Xác định vị trí tháng nhuận. Nếu 0 tức năm đó không có tháng nhuận
   */
  leapMonth: number;

  /**
   * Xác định tổng số ngày của tháng Âm lịch hiện tại: 29 tương ứng tháng thiếu, 30 là tháng đủ
   */
  dayOfMonth: number;
}

/**
 * An object can be uses to make a unsafe, unknow Lunar date time to be input
 */
export type LunarUnsafeInput = SimpleDateTime & {
  /**
   * Whether input month is leap
   */
  leapMonth?: boolean;
};

/**
 * Main Lunar date time properties
 */
export interface LunarDate {
  /**
   * Return days of month, form 1 to 30
   */
  getDay(): number;

  /**
   * Return month, form 1 to 12
   */
  getMonth(): number;

  /**
   * Return year, from 1800 - 9999
   */
  getFullYear(): number;

  /**
   * Return hours, from 0 - 23
   */
  getHours(): number;

  /**
   * Return minutes, from 0 - 59
   */
  getMinutes(): number;

  /**
   * Return seconds, from 0 - 59
   */
  getSeconds(): number;

  /**
   * Return UTC offset
   */
  getTimezoneOffset(): number;

  /**
   * Return UNIX timestamp
   */
  getTimestamps(): number;

  /**
   * Return Julian day number
   */
  getJdn(): number;
}

export type Option = object;

export type ToFixedOuput = Option & {
  fixed: number;
};

export type BasedOnOffset = Option & {
  offset: number;
};

export type ToFloorOuput = {
  floor: boolean;
};

export type NewMoonNavigationOuputOption = ToFixedOuput & {
  /**
   * The number of new moon points to navigate next or previous
   */
  quantity: number;

  /**
   * Navigation types, next or previous
   */
  navigation: "next" | "previous";
};
