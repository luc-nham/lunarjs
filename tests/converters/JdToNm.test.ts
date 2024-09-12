import { describe, expect, test } from "@jest/globals";
import { JdToNm } from "../../src/converters/JdToNm";
import { GregToJd } from "../../src/converters/GregToJd";

describe("Convert Jdn to New moon", () => {
  test("1900-01-01 (defaut)", () => {
    new JdToNm().forward((output) => {
      expect(output).toStrictEqual({
        total: 0,
        jd: 2415021.076721,
      });
    });

    new GregToJd({ day: 29, month: 1, year: 1900 }).forward((o) => {
      new JdToNm(o).forward((o) => {
        expect(o).toStrictEqual({
          total: 0,
          jd: 2415021.076721,
        });
      });
    });
  });

  test("1900-02-10 +0000", () => {
    new GregToJd({ day: 10, month: 2, year: 1900 }).forward((out) => {
      new JdToNm(out, { fixed: 2 }).forward((out) => {
        expect(out).toStrictEqual({
          jd: 2415050.56,
          total: 1,
        });
      });
    });
  });
});
