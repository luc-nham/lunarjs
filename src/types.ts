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
 * An object can be uses to make a unsafe, unknow Lunar date time to be input
 */
export type LunarUnsafeInput = SimpleDateTime & {
  /**
   * Whether input month is leap
   */
  leapMonth?: boolean;
};

/**
 * 
The formatter converts Lunar date time into commonly used time strings
 */
export interface LunarToStringFormater {
  /**
   * Returns a string representing the date portion of this date interpreted in the local timezone.
   */
  toDateString(): string;

  /**
   * Returns a string representing the time portion of this date interpreted in the local timezone.
   */
  toTimeString(): string;

  /**
   * Returns a string representing this date interpreted in the local timezone.
   */
  toString(): string;
}

/**
 * Main Lunar date time properties
 */
export interface LunarDate extends LunarToStringFormater {
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
   * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC
   */
  getTime(): number;

  /**
   * Return Julian day number
   */
  getJdn(): number;

  /**
   * Check if current year is a leap year
   */
  isLeapYear(): boolean;

  /**
   * Check if current month is a leap month
   */
  isLeapMonth(): boolean;

  /**
   * Get leap month number, returns 0 if there is no leap month
   */
  getLeapMonth(): number;

  /**
   * Create a Javascript Date object instance corresponding to the Lunar Calendar
   */
  toDate(): Date;
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
