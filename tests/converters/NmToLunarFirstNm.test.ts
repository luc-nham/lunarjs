import { describe, expect, test } from "@jest/globals";
import { GregToJd } from "../../src/converters/GregToJd";
import { JdToNm } from "../../src/converters/JdToNm";
import { NmToLunarFirstNm } from "../../src/converters/NmToLunarFirstNm";
import { _1900_2100 } from "../data/lunar-fisrt-new-moon";

const leap = (y: number) => [0, 3, 6, 9, 11, 14, 17].includes(y % 19);

describe("Kiểm tra chuyển đổi pha Trăng mới thành pha Trăng mới đầu tiên của năm Âm lịch", () => {
  /**
   * The input is the new moon phase corresponding to the first month of the lunar calendar:
   *
   * - Gregorian: 1970-02-06
   * - Lunarian: 1970-01-01
   * - New moon Jdn: 2440623.801500 (1970-01-01 of Lunar)
   * - New moon total phases: 867
   */
  test("Date: 1970-02-06 | Lunar: 1970-01-01", () => {
    new GregToJd({ day: 6, month: 2, year: 1970 }).forward((jd, opt) => {
      new JdToNm(jd).forward((nm) => {
        new NmToLunarFirstNm(nm, opt).forward((fnm) => {
          expect(fnm.jd).toBe(2440623.8015);
          expect(fnm.total).toBe(867);
          expect(fnm.year).toBe(1970);
          expect(fnm.leap).toBe(false);
        });
      });
    });
  });

  /**
   * The input is the new moon phase larger than to the first month of the Lunar calendar:
   * - Gregorian: 1970-03-09
   * - Lunar: 1970-02-02
   * - New moon phase Jdn: 2440623.8015 (1970-02-01 of Lunar)
   * - New moon phase total: 867
   */
  test("Date: 1970-03-09 | Lunar: 1970-02-02", () => {
    new GregToJd({ day: 9, month: 3, year: 1970 }, { offset: 25200 }).forward(
      (jd, opt) => {
        new JdToNm(jd).forward((nm) => {
          new NmToLunarFirstNm(nm, opt).forward((fnm) => {
            expect(fnm.jd).toBe(2440623.8015);
            expect(fnm.total).toBe(867);
            expect(fnm.year).toBe(1970);
            expect(fnm.leap).toBe(leap(fnm.year));
          });
        });
      },
    );
  });

  /**
   * The Gregorian has passed the new year, while the Lunar is still in the old year (no leap):
   * - Gre: 1970-01-08
   * - Lunar: 1969-12-01
   * - Nm Jdn: 2440269.18583 (1969-01-01 of Lunar)
   * - Nm total: 855
   */
  test("Date: 1970-01-08 | Lunar: 1969-12-01", () => {
    new GregToJd({ day: 8, month: 1, year: 1970 }, { offset: 25200 }).forward(
      (jd, opt) => {
        new JdToNm(jd).forward((nm) => {
          new NmToLunarFirstNm(nm, opt).forward((fnm) => {
            expect(fnm.jd).toBe(2440269.18583);
            expect(fnm.total).toBe(855);
            expect(fnm.year).toBe(1969);
            expect(fnm.leap).toBe(false);
          });
        });
      },
    );
  });

  /**
   * The Gregorian has passed the new year, while the Lunar is still in the old LEAP year:
   * - Gre: 2024-02-08
   * - Lunar: 2023-12-09
   * - Nm Jdn: 2459966.371877 (2023-01-01 of Lunar)
   * - Nm total: 1522
   */
  test("Date: 2024-01-10 | Lunar: 2023-11-29", () => {
    new GregToJd({ day: 8, month: 2, year: 2024 }, { offset: 25200 }).forward(
      (jd, opt) => {
        new JdToNm(jd).forward((nm) => {
          new NmToLunarFirstNm(nm, opt).forward((fnm) => {
            expect(fnm.jd).toBe(2459966.371877);
            expect(fnm.total).toBe(1522);
            expect(fnm.year).toBe(2023);
            expect(fnm.leap).toBe(true);
          });
        });
      },
    );
  });

  /**
   * Extra, an iput before 1900:
   * - Gre: 1800-12-06
   * - Lunar: 1800-10-20
   * - Nm Jdn: 2378520.640596 (1800-01-01 of Lunar)
   * - Nm total: -1236
   */
  test("Date: 1800-12-06 | Lunar: 1800-10-20", () => {
    new GregToJd({ day: 6, month: 12, year: 1800 }, { offset: 25200 }).forward(
      (jd, opt) => {
        new JdToNm(jd).forward((nm) => {
          new NmToLunarFirstNm(nm, opt).forward((fnm) => {
            expect(fnm.jd).toBe(2378520.640596);
            expect(fnm.total).toBe(-1236);
            expect(fnm.year).toBe(1800);
            expect(fnm.leap).toBe(leap(fnm.year));
          });
        });
      },
    );
  });

  /**
   * Issue #13
   *
   * @link https://github.com/luc-nham/lunarjs/issues/13
   */
  test("Date: 1970-01-01 | Lunar: 1969-11-24", () => {
    new GregToJd({ day: 1, month: 1, year: 1970 }, { offset: 25200 }).forward(
      (jd, opt) => {
        new JdToNm(jd, opt).forward((nm) => {
          new NmToLunarFirstNm(nm, opt).forward((fnm) => {
            expect(fnm.jd).toBe(2440269.18583);
            expect(fnm.total).toBe(855);
            expect(fnm.year).toBe(1969);
            expect(fnm.leap).toBe(false);
          });
        });
      },
    );
  });

  /**
   * Issue #13
   *
   * @link https://github.com/luc-nham/lunarjs/issues/13
   */
  test("List from 1900-2100 Viet Nam Lunar Caleandar", () => {
    const opt = {
      fixed: 4,
      offset: 25200,
    };
    const toFloat = (number: string) =>
      parseFloat(Number(number).toFixed(opt.fixed));

    _1900_2100.forEach((data) => {
      const gre = data.gregorian.split("-");
      const [day, month] = gre;
      const [year] = gre[2].split(" ");
      const [cjd] = data.jd.split(" | ");

      new GregToJd(
        { day: Number(day), month: Number(month), year: Number(year) },
        opt,
      ).forward((jd) => {
        new JdToNm(jd, opt).forward((nm) => {
          new NmToLunarFirstNm(nm, opt).forward((fnm) => {
            expect(fnm.jd).toBe(toFloat(cjd));
            expect(fnm.total).toBe(data.total);
            expect(fnm.year).toBe(Number(year));
          });
        });
      });
    });
  });
});
