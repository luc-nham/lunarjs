import { describe, expect, test } from "@jest/globals";
import { BaseLunarToStringFormater } from "../../src/formaters/BaseLunarToStringFormater";
import { LunarUnsafeToLunar } from "../../src";

describe("Test Lunar to string defautl format", () => {
  test("Date part string format", () => {
    const lunar = new LunarUnsafeToLunar({
      day: 14,
      month: 8,
      year: 2024,
    }).getOutput();

    const formatter = new BaseLunarToStringFormater(lunar);

    expect(formatter.toDateString()).toBe("2024-08-14");
  });

  test("Time part string format", () => {
    new LunarUnsafeToLunar(
      { hour: 10, minute: 8, second: 40 },
      { offset: 0 },
    ).forward((l) => {
      const formatter = new BaseLunarToStringFormater(l);

      expect(formatter.toTimeString()).toBe("10:08:40 GMT+0000");
    });
  });

  test("Full date time string format", () => {
    new LunarUnsafeToLunar(
      { day: 1, month: 12, year: 2024, hour: 6, minute: 30, second: 0 },
      { offset: 25200 },
    ).forward((l) => {
      const formatter = new BaseLunarToStringFormater(l, 25200);

      expect(formatter.toString()).toBe("2024-12-01 06:30:00 GMT+0700");
    });

    new LunarUnsafeToLunar(
      { day: 1, month: 12, year: 2024, hour: 6, minute: 30, second: 0 },
      { offset: -27000 },
    ).forward((l, o) => {
      const formatter = new BaseLunarToStringFormater(l, o.offset);

      expect(formatter.toString()).toBe("2024-12-01 06:30:00 GMT-0730");
    });
  });
});
