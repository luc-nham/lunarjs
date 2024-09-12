import { describe, expect, test } from "@jest/globals";
import { GregToLunar } from "../../src/converters/GregToLunar";
import { SimpleDateTime, SimpleLunarDateTime } from "../../src/types";
import { GregToJd } from "../../src/converters/GregToJd";

describe("Convert Gregorian to Lunar", () => {
  const opt = {
    fixed: 6,
    offset: 25200,
  };
  test("Gre: 1970-06-02 10:30 +0700 | Lunar: 1970-01-01 10:30 +0700", () => {
    const inp = {
      day: 6,
      month: 2,
      year: 1970,
      hour: 10,
      minute: 30,
    };
    const out: Required<SimpleLunarDateTime> = {
      day: 1,
      month: 1,
      year: 1970,
      hour: 10,
      minute: 30,
      second: 0,
      days: 30,
      jd: new GregToJd(inp, opt).getOutput(),
      leap: {
        current: false,
        month: 0,
      },
    };

    new GregToLunar(inp, opt).forward((lunar) => {
      expect(lunar).toStrictEqual(out);
    });
  });

  test("Gre: 2023-05-18 00:00 +0700 | Lunar: 2023-03-29 00:00 +0700", () => {
    const inp = {
      day: 18,
      month: 5,
      year: 2023,
    };

    const out: Required<SimpleLunarDateTime> = {
      day: 29,
      month: 3,
      year: 2023,
      hour: 0,
      minute: 0,
      second: 0,
      days: 29,
      jd: new GregToJd(inp, opt).getOutput(),
      leap: {
        current: false,
        month: 2,
      },
    };

    new GregToLunar(inp, opt).forward((lunar) => {
      expect(lunar).toStrictEqual(out);
    });
  });

  test("Gre: 2025-08-13 00:00:59 +0700 | Lunar: 2025-06-20 00:00:59 +0700 (leap)", () => {
    const inp = {
      day: 13,
      month: 8,
      year: 2025,
      second: 59,
    };

    const out: Required<SimpleLunarDateTime> = {
      day: 20,
      month: 6,
      year: 2025,
      hour: 0,
      minute: 0,
      second: 59,
      days: 29,
      jd: new GregToJd(inp, opt).getOutput(),
      leap: {
        current: true,
        month: 6,
      },
    };

    new GregToLunar(inp, opt).forward((lunar) => {
      expect(lunar).toStrictEqual(out);
    });
  });

  test("Gre: 2033-11-22 23:59:59 +0700 | Lunar: 2033-11-01 23:59:59 +0700", () => {
    const inp: SimpleDateTime = {
      day: 22,
      month: 11,
      year: 2033,
      hour: 23,
      minute: 59,
      second: 59,
    };

    const out: Required<SimpleLunarDateTime> = {
      day: 1,
      month: 11,
      year: 2033,
      hour: 23,
      minute: 59,
      second: 59,
      days: 30,
      jd: new GregToJd(inp, opt).getOutput(),
      leap: {
        current: false,
        month: 11,
      },
    };

    new GregToLunar(inp, opt).forward((lunar) => {
      expect(lunar).toStrictEqual(out);
    });
  });

  test("Gre: 2033-11-21 +0700 | Lunar: 2033-10-30 +0700", () => {
    const inp = {
      day: 21,
      month: 11,
      year: 2033,
    };

    const out: Required<SimpleLunarDateTime> = {
      day: 30,
      month: 10,
      year: 2033,
      hour: 0,
      minute: 0,
      second: 0,
      days: 30,
      jd: new GregToJd(inp, opt).getOutput(),
      leap: {
        current: false,
        month: 11,
      },
    };

    new GregToLunar(inp, opt).forward((lunar) => {
      expect(lunar).toStrictEqual(out);
    });
  });
});
