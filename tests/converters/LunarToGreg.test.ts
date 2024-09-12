import { describe, expect, test } from "@jest/globals";
import { LunarToGreg } from "../../src/converters/LunarToGreg";

describe("Lunar date time to Gregorian", () => {
  test("Lunar 1970-01-01 to 1970-02-06 Gregorian (default)", () => {
    new LunarToGreg().forward((gre) => {
      expect(gre).toMatchObject({
        day: 6,
        month: 2,
        year: 1970,
        hour: 0,
        minute: 0,
        second: 0,
      });
    });
  });
});
