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
});
