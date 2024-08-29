import { describe, expect, test } from "@jest/globals";
import { LunarFirstNmpToLeapMonthNmp } from "../../src/converters/LunarFirstNmpToLeapMonthNmp";
import { NmpToLunarFirstNmp } from "../../src/converters/NmpToLunarFirstNmp";
import { JdnToNewMoonPhase } from "../../src/converters/JdnToNewMoonPhase";
import { GregorianToJdn } from "../../src/converters/GregorianToJdn";
import { JdnToLocalMidnightJdn } from "../../src/converters/JdnToLocalMidnightJdn";

describe("Kiểm tra danh sách năm nhuận Âm lịch", () => {
  const gre2jd = new GregorianToJdn();
  const jd2nmp = new JdnToNewMoonPhase();
  const nmp2firstnmp = new NmpToLunarFirstNmp();
  const fnmp2leapnmp = new LunarFirstNmpToLeapMonthNmp();
  const jd2mljd = new JdnToLocalMidnightJdn();

  test("1900 - 2100 Âm lịch Việt Nam", () => {
    const offset = 25200;

    _1900_2100_25200.every((v) => {
      const leap = fnmp2leapnmp.convert(
        nmp2firstnmp.convert(
          jd2nmp.convert(
            gre2jd.convert({
              day: 31,
              month: 12,
              year: v.year,
              offset,
            }),
          ),
        ),
      );

      expect(leap).toBeDefined();

      expect(leap?.month).toBe(v.month);

      if (leap !== undefined) {
        expect(jd2mljd.convert(leap).jdn).toBe(parseFloat(v.jd.toFixed(6)));
      }
    });
  });

  test("Năm không nhuận", () => {
    const unleap = fnmp2leapnmp.convert(
      nmp2firstnmp.convert(
        jd2nmp.convert(
          gre2jd.convert({
            day: 31,
            month: 12,
            year: 1901,
            offset: 25200,
          }),
        ),
      ),
    );

    expect(unleap).toBe(undefined);
  });

  /**
   * @link https://github.com/luc-nham/lunarjs/issues/10
   */
  test("Input: 2033-11-22 23:59:59 +0700", () => {
    const leap = fnmp2leapnmp.convert(
      nmp2firstnmp.convert(
        jd2nmp.convert(
          gre2jd.convert({
            day: 22,
            month: 11,
            year: 2033,
            hour: 23,
            minute: 59,
            second: 59,
            offset: 25200,
          }),
        ),
      ),
    );

    expect(leap?.month).toBe(11);
  });
});

/**
 * Danh sách các năm và tháng nhuận Âm lịch Việt Nam trong khoảng thời gian từ 1900 đến 2100
 */
const _1900_2100_25200 = [
  { year: 1900, month: 8, jd: 2415286.2083333 },
  {
    year: 1903,
    month: 5,
    jd: 2416290.2083333,
  },
  {
    year: 1906,
    month: 4,
    jd: 2417353.2083333,
  },
  {
    year: 1909,
    month: 2,
    jd: 2418387.2083333,
  },
  {
    year: 1911,
    month: 6,
    jd: 2419243.2083333,
  },
  {
    year: 1914,
    month: 5,
    jd: 2420306.2083333,
  },
  {
    year: 1917,
    month: 3,
    jd: 2421339.2083333,
  },
  {
    year: 1919,
    month: 7,
    jd: 2422195.2083333,
  },
  {
    year: 1922,
    month: 6,
    jd: 2423259.2083333,
  },
  {
    year: 1925,
    month: 4,
    jd: 2424292.2083333,
  },
  {
    year: 1928,
    month: 2,
    jd: 2425327.2083333,
  },
  {
    year: 1930,
    month: 6,
    jd: 2426183.2083333,
  },
  {
    year: 1933,
    month: 5,
    jd: 2427246.2083333,
  },
  {
    year: 1936,
    month: 3,
    jd: 2428279.2083333,
  },
  {
    year: 1938,
    month: 7,
    jd: 2429135.2083333,
  },
  {
    year: 1941,
    month: 6,
    jd: 2430199.2083333,
  },
  {
    year: 1944,
    month: 4,
    jd: 2431232.2083333,
  },
  {
    year: 1947,
    month: 2,
    jd: 2432266.2083333,
  },
  {
    year: 1949,
    month: 7,
    jd: 2433152.2083333,
  },
  {
    year: 1952,
    month: 5,
    jd: 2434185.2083333,
  },
  {
    year: 1955,
    month: 3,
    jd: 2435219.2083333,
  },
  {
    year: 1957,
    month: 8,
    jd: 2436105.2083333,
  },
  {
    year: 1960,
    month: 6,
    jd: 2437139.2083333,
  },
  {
    year: 1963,
    month: 4,
    jd: 2438172.2083333,
  },
  {
    year: 1966,
    month: 3,
    jd: 2439236.2083333,
  },
  {
    year: 1968,
    month: 7,
    jd: 2440092.2083333,
  },
  {
    year: 1971,
    month: 5,
    jd: 2441125.2083333,
  },
  {
    year: 1974,
    month: 4,
    jd: 2442189.2083333,
  },
  {
    year: 1976,
    month: 8,
    jd: 2443045.2083333,
  },
  {
    year: 1979,
    month: 6,
    jd: 2444078.2083333,
  },
  {
    year: 1982,
    month: 4,
    jd: 2445112.2083333,
  },
  {
    year: 1985,
    month: 2,
    jd: 2446145.2083333,
  },
  {
    year: 1987,
    month: 7,
    jd: 2447031.2083333,
  },
  {
    year: 1990,
    month: 5,
    jd: 2448065.2083333,
  },
  {
    year: 1993,
    month: 3,
    jd: 2449099.2083333,
  },
  {
    year: 1995,
    month: 8,
    jd: 2449984.2083333,
  },
  {
    year: 1998,
    month: 5,
    jd: 2450988.2083333,
  },
  {
    year: 2001,
    month: 4,
    jd: 2452052.2083333,
  },
  {
    year: 2004,
    month: 2,
    jd: 2453085.2083333,
  },
  {
    year: 2006,
    month: 7,
    jd: 2453971.2083333,
  },
  {
    year: 2009,
    month: 5,
    jd: 2455005.2083333,
  },
  {
    year: 2012,
    month: 4,
    jd: 2456068.2083333,
  },
  {
    year: 2014,
    month: 9,
    jd: 2456954.2083333,
  },
  {
    year: 2017,
    month: 6,
    jd: 2457957.2083333,
  },
  {
    year: 2020,
    month: 4,
    jd: 2458992.2083333,
  },
  {
    year: 2023,
    month: 2,
    jd: 2460025.2083333,
  },
  {
    year: 2025,
    month: 6,
    jd: 2460881.2083333,
  },
  {
    year: 2028,
    month: 5,
    jd: 2461945.2083333,
  },
  {
    year: 2031,
    month: 3,
    jd: 2462977.2083333,
  },
  {
    year: 2033,
    month: 11,
    jd: 2463953.2083333,
  },
  {
    year: 2036,
    month: 6,
    jd: 2464897.2083333,
  },
  {
    year: 2039,
    month: 5,
    jd: 2465961.2083333,
  },
  {
    year: 2042,
    month: 2,
    jd: 2466965.2083333,
  },
  {
    year: 2044,
    month: 7,
    jd: 2467850.2083333,
  },
  {
    year: 2047,
    month: 5,
    jd: 2468884.2083333,
  },
  {
    year: 2050,
    month: 3,
    jd: 2469917.2083333,
  },
  {
    year: 2052,
    month: 8,
    jd: 2470803.2083333,
  },
  {
    year: 2055,
    month: 6,
    jd: 2471837.2083333,
  },
  {
    year: 2058,
    month: 4,
    jd: 2472870.2083333,
  },
  {
    year: 2061,
    month: 3,
    jd: 2473934.2083333,
  },
  {
    year: 2063,
    month: 7,
    jd: 2474790.2083333,
  },
  {
    year: 2066,
    month: 5,
    jd: 2475824.2083333,
  },
  {
    year: 2069,
    month: 4,
    jd: 2476887.2083333,
  },
  {
    year: 2071,
    month: 8,
    jd: 2477743.2083333,
  },
  {
    year: 2074,
    month: 6,
    jd: 2478777.2083333,
  },
  {
    year: 2077,
    month: 4,
    jd: 2479810.2083333,
  },
  {
    year: 2080,
    month: 3,
    jd: 2480874.2083333,
  },
  {
    year: 2082,
    month: 7,
    jd: 2481730.2083333,
  },
  {
    year: 2085,
    month: 5,
    jd: 2482763.2083333,
  },
  {
    year: 2088,
    month: 4,
    jd: 2483827.2083333,
  },
  {
    year: 2090,
    month: 8,
    jd: 2484683.2083333,
  },
  {
    year: 2093,
    month: 6,
    jd: 2485716.2083333,
  },
  {
    year: 2096,
    month: 4,
    jd: 2486750.2083333,
  },
  {
    year: 2099,
    month: 2,
    jd: 2487784.2083333,
  },
];
