import { describe, expect, test } from "@jest/globals";
import { GregToJd } from "../../src/converters/GregToJd";
import { JdToMidnightJd } from "../../src/converters/JdToMidnightJd";

describe("Convert a Jdn of any time of day to Jdn of midnight (00:00) local time", () => {
  test("1970-01-01 23:59:59 +0000 | Midnight JDN = 2440587.5", () => {
    new GregToJd({ hour: 23, minute: 59, second: 59 }).forward((out, opt) => {
      new JdToMidnightJd(out, opt).forward((o) => {
        expect(o).toBe(2440587.5);
      });
    });
  });

  test("1970-01-01 23:59:59 +0700 | Midnight JDN = 2440587.208333", () => {
    new GregToJd(
      { hour: 23, minute: 59, second: 59 },
      { offset: 25200 },
    ).forward((out, opt) => {
      new JdToMidnightJd(out, opt).forward((o) => {
        expect(o).toBe(2440587.208333);
      });
    });
  });

  test("1970-01-01 11:59:59 +0700 | Midnight JDN = 2440587.208333", () => {
    new GregToJd(
      { hour: 11, minute: 59, second: 59 },
      { offset: 25200 },
    ).forward((out, opt) => {
      new JdToMidnightJd(out, opt).forward((o) => {
        expect(o).toBe(2440587.208333);
      });
    });
  });

  test("1970-01-01 00:00 +0700 | Midnight JDN = 2440587.208333", () => {
    new GregToJd({}, { offset: 25200 }).forward((out, opt) => {
      new JdToMidnightJd(out, opt).forward((o) => {
        expect(o).toBe(2440587.208333);
      });
    });
  });
});
