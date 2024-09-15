import { describe, expect, test } from "@jest/globals";
import { JdToLunar } from "../../src/converters/JdToLunar";

describe("Coverts Julian day number to Lunar date time", () => {
  test("Jdn: 2440587.5 | Lunar: 1969-11-24 00:00 +0000 | (default)", () => {
    new JdToLunar(2440587.5).forward((lunar) => {
      expect(lunar).toMatchObject({
        day: 24,
        month: 11,
        year: 1969,
        hour: 0,
        minute: 0,
        second: 0,
      });
    });
  });

  test("Jdn: 2440587.5 | Lunar: 1969-11-24 07:00 +0700 | (default)", () => {
    new JdToLunar(2440587.5, { offset: 25200 }).forward((lunar) => {
      expect(lunar).toMatchObject({
        day: 24,
        month: 11,
        year: 1969,
        hour: 7,
        minute: 0,
        second: 0,
      });
    });
  });

  test("Current new moon equal Lunar first new moon", () => {
    // Lunar: 01-01-2024 +07:00
    // Gregorian: 10-02-2024 +07:00
    // Jd new moon at midnight: 2460350.2083333 (+0700)
    new JdToLunar(2460350.2083333, { offset: 25200 }).forward((lunar) => {
      expect(lunar).toMatchObject({
        day: 1,
        month: 1,
        year: 2024,
        hour: 0,
        minute: 0,
        second: 0,
      });
    });
  });
});
