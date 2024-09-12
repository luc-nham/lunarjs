import { describe, expect, test } from "@jest/globals";
import { BasedOnOffset, ToFixedOuput } from "../../src/types";
import { LunarToJd } from "../../src/converters/LunarToJd";

describe("Lunar to Julian day number", () => {
  const opts: ToFixedOuput & BasedOnOffset = {
    fixed: 6,
    offset: 25200,
  };

  test("1970-01-01 00:00 +0000 (default)", () => {
    new LunarToJd().forward((jd) => expect(jd).toBe(2440623.5));
  });

  test("1970-01-01 00:00 +0700 (default)", () => {
    new LunarToJd({}, opts).forward((jd) => expect(jd).toBe(2440623.208333));
  });

  test("2033-11-20 10:30 +0700 (leap month)", () => {
    new LunarToJd(
      {
        day: 20,
        month: 11,
        year: 2033,
        hour: 10,
        minute: 30,
        leapMonth: true,
      },
      opts,
    ).forward((jd) => expect(jd).toBe(2463972.645833));
  });

  test("2033-09-30 10:30 +0700 (incorrect leap month)", () => {
    new LunarToJd(
      {
        day: 30,
        month: 9,
        year: 2033,
        leapMonth: true, // Incorrect
      },
      opts,
    ).forward((jd) => expect(jd).toBe(2463892.208333));
  });

  test("2033-11-20 23:59:59 +0700 (unleap month)", () => {
    new LunarToJd(
      {
        day: 20,
        month: 11,
        year: 2033,
        hour: 23,
        minute: 59,
        second: 59,
        leapMonth: false,
      },
      opts,
    ).forward((jd) => expect(jd).toBe(2463943.208321));
  });

  test("2024-10-08 00:00 +0700", () => {
    new LunarToJd(
      {
        day: 40, // Incorrect
        month: 7,
        year: 2024,
        leapMonth: true, // Incorrect
      },
      opts,
    ).forward((jd) => expect(jd).toBe(2460565.208333));
  });
});
