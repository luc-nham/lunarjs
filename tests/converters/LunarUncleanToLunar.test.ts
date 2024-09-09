import { describe, expect, test } from "@jest/globals";
import { LunarUnsafeToLunar } from "../../src/converters/LunarUnsafeToLunar";

describe("Lunar unclean input to corrected Lunar date time", () => {
  const opt = {
    fixed: 6,
    offset: 25200,
  };

  test("Lunar 1970-01-01 + 0700", () => {
    const input = {
      day: 1,
      month: 1,
      year: 1970,
      leapMonth: true, // Incorrect
    };

    new LunarUnsafeToLunar(input, opt).forward((lunar) => {
      expect(lunar).toMatchObject({
        day: 1,
        month: 1,
        year: 1970,
        leap: {
          month: 0,
          current: false,
        },
      });
    });
  });

  test("Lunar 2025-06-15 (leap)", () => {
    // Corrected input
    const input = {
      day: 15,
      month: 6,
      year: 2025,
      leapMonth: true,
    };

    new LunarUnsafeToLunar(input, opt).forward((lunar) => {
      expect(lunar).toMatchObject({
        day: 15,
        month: 6,
        year: 2025,
        leap: {
          month: 6,
          current: true,
        },
      });
    });
  });

  test("Incorrect lunar 1970-01-35 + 0700 to correct 1970-02-05 +0700", () => {
    const input = {
      day: 35, // Incorrect day number
      month: 1,
      year: 1970,
    };

    new LunarUnsafeToLunar(input, opt).forward((lunar) => {
      expect(lunar).toMatchObject({
        day: 5,
        month: 2,
        year: 1970,
      });
    });
  });

  test("Incorrect lunar 2024-13-01 + 0700 to correct 2025-01-01 +0700", () => {
    const input = {
      day: 1,
      month: 13, // Incorrect month number
      year: 2024,
    };

    new LunarUnsafeToLunar(input, opt).forward((lunar) => {
      expect(lunar).toMatchObject({
        day: 1,
        month: 1,
        year: 2025,
      });
    });
  });
});
