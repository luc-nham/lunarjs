import { describe, expect, test } from "@jest/globals";
import { JdToGreg } from "../../src/converters/JdToGreg";

describe("Convert Jdn to Gregorian", () => {
  test("1970-01-01 00:00 +0000", () => {
    new JdToGreg().forward((o) => {
      expect(o).toStrictEqual({
        day: 1,
        month: 1,
        year: 1970,
        hour: 0,
        minute: 0,
        second: 0,
      });
    });
  });

  test("1970-01-01 23:59:59 +0000", () => {
    new JdToGreg(2440588.499988).forward((o) => {
      expect(o).toStrictEqual({
        day: 1,
        month: 1,
        year: 1970,
        hour: 23,
        minute: 59,
        second: 59,
      });
    });
  });

  test("1970-01-01 07:00 +0700", () => {
    new JdToGreg(2440587.5, { offset: 25200 }).forward((o) => {
      expect(o).toStrictEqual({
        day: 1,
        month: 1,
        year: 1970,
        hour: 7,
        minute: 0,
        second: 0,
      });
    });
  });

  test("1970-01-01 00:00 +0700", () => {
    new JdToGreg(2440587.208333, { offset: 25200 }).forward((o) => {
      expect(o).toStrictEqual({
        day: 1,
        month: 1,
        year: 1970,
        hour: 0,
        minute: 0,
        second: 0,
      });
    });
  });

  test("2024-10-10 23:59:58 +0000", () => {
    new JdToGreg(2460594.499977).forward((o) => {
      expect(o).toStrictEqual({
        day: 10,
        month: 10,
        year: 2024,
        hour: 23,
        minute: 59,
        second: 58,
      });
    });
  });
});
