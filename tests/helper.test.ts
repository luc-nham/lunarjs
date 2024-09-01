import { describe, expect, test } from "@jest/globals";
import {
  gregorianToJd,
  jdToGregorian,
  jdToLocalMidnightJd,
} from "../src/helper";
import { SimpleDateTime } from "../src/types";

const EPOCH_JDN = 2440587.5;

/**
 * Gregorian to Julian day number
 */
describe("Gregorian to Jdn", () => {
  test("Default without input", () => {
    expect(gregorianToJd()).toBe(EPOCH_JDN);
  });

  test("With UTC offset", () => {
    expect(gregorianToJd({ offset: 25200 })).toBe(2440587.208333);
  });
});

/**
 * Julian day number to Local midnight Julian day number
 */
describe("Jdn to local midnight Jdn", () => {
  test("1970-01-01 23:59:59 +0000", () => {
    const ouput = jdToLocalMidnightJd(
      gregorianToJd({
        hour: 23,
        minute: 59,
        second: 59,
      }),
    );

    expect(ouput).toBe(EPOCH_JDN);
  });

  test("1970-01-01 23:59:59 +0700", () => {
    const ouput = jdToLocalMidnightJd(
      gregorianToJd({ offset: 25200, hour: 23, minute: 59, second: 59 }),
      25200,
    );
    expect(ouput).toBe(2440587.208333);
  });

  test("1970-01-01 00:00 +0700", () => {
    const input = gregorianToJd({ offset: 25200 });
    const ouput = jdToLocalMidnightJd(input, 25200);

    expect(ouput).toBe(input);
  });

  test("1970-01-01 00:59 +0700", () => {
    const input = gregorianToJd({ offset: 25200, minute: 59 });
    const ouput = jdToLocalMidnightJd(input, 25200);

    expect(ouput).toBe(2440587.208333);
  });

  test("1970-01-01 07:00 +0700", () => {
    const input = gregorianToJd({ offset: 25200, hour: 7 });
    const ouput = jdToLocalMidnightJd(input, 25200);

    expect(ouput).toBe(2440587.208333);
  });
});

/**
 * Julian to Gregorian
 */
describe("Julian day number to Gregorian", () => {
  test("1970-01-01 00:00 +0000", () => {
    const input: SimpleDateTime = {
      day: 1,
      month: 1,
      year: 1970,
      hour: 0,
      minute: 0,
      second: 0,
      offset: 0,
    };

    const jd = gregorianToJd(input);
    const gre = jdToGregorian(jd);

    expect(gre).toStrictEqual(input);
  });

  test("1970-01-01 23:59:59 +0700", () => {
    const input: SimpleDateTime = {
      day: 1,
      month: 1,
      year: 1970,
      hour: 23,
      minute: 59,
      second: 58,
      offset: 25200,
    };

    const jd = gregorianToJd(input);
    const gre = jdToGregorian(jd, input.offset);

    expect(gre).toStrictEqual(input);
  });

  test("2024-10-10 23:59:59 +0700", () => {
    const input: SimpleDateTime = {
      day: 10,
      month: 10,
      year: 2024,
      hour: 23,
      minute: 59,
      second: 58,
      offset: 25200,
    };

    const jd = gregorianToJd(input);
    const gre = jdToGregorian(jd, input.offset);

    expect(gre).toStrictEqual(input);
  });
});
