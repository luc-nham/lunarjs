import { describe, expect, test } from "@jest/globals";
import { GregorianToJdn } from "../../src/converters/GregorianToJdn";
import { JdnToNewMoonPhase } from "../../src/converters/JdnToNewMoonPhase";
import { NmpToLunarFirstNmp } from "../../src/converters/NmpToLunarFirstNmp";
import { SimpleDateTime } from "./export type";

describe("Kiểm tra chuyển đổi pha Trăng mới thành pha Trăng mới đầu tiên của năm Âm lịch", () => {
  const gretojd = new GregorianToJdn();
  const jdtonmp = new JdnToNewMoonPhase();
  const lunarfirstnmp = new NmpToLunarFirstNmp();

  const gre: SimpleDateTime = {
    day: 6,
    month: 2,
    year: 1970,
    offset: 25200,
  };

  /**
   * Đầu vào chính là điểm Sóc tháng 01 Âm lịch:
   * - Dương lịch: 1970-02-06
   * - Âm lịch: 1970-01-01
   * - JDN điểm Sóc: 2440623.801500
   * - Tổng chu kỳ Trăng: 867
   * - Hành vi mong đợi: trả về điểm Sóc của 1970-01-01 Âm lịch
   */
  test("Date: 1970-02-06 | Lunar: 1970-01-01", () => {
    const output = lunarfirstnmp.convert(jdtonmp.convert(gretojd.convert(gre)));

    expect(output.jdn).toBe(2440623.8015);
    expect(output.total).toBe(867);
  });

  /**
   * Đầu vào là tháng lớn hơn tháng 01 Âm lịch:
   * - Dương lịch: 1970-03-09
   * - Âm lịch: 1970-02-02
   * - JDN điểm Sóc: 2440623.8015
   * - Tổng chu kỳ Trăng: 867
   * - Hành vi mong đợi: trả về điểm Sóc của 1970-01-01 Âm lịch
   */
  test("Date: 1970-03-09 | Lunar: 1970-02-02", () => {
    const output = lunarfirstnmp.convert(
      jdtonmp.convert(
        gretojd.convert({ day: 9, month: 3, year: 1970, offset: 25200 }),
      ),
    );

    expect(output.jdn).toBe(2440623.8015);
    expect(output.total).toBe(867);
  });

  /**
   * Đầu vào Dương lịch đã qua năm mới, nhưng Âm lịch đang ở năm cũ:
   * - Dương lịch: 1970-01-08
   * - Âm lịch: 1969-12-01
   * - JDN điểm Sóc: 2440269.18583
   * - Tổng chu kỳ Trăng: 855
   * - Hành vi mong đợi: trả về điểm Sóc của 1969-01-01 Âm lịch
   */
  test("Date: 1970-01-08 | Lunar: 1969-12-01", () => {
    const output = lunarfirstnmp.convert(
      jdtonmp.convert(
        gretojd.convert({ day: 8, month: 1, year: 1970, offset: 25200 }),
      ),
    );

    expect(output.total).toBe(855);
  });

  /**
   * Đầu vào Dương lịch đã qua năm mới, nhưng Âm lịch đang ở năm cũ NHUẬN:
   * - Dương lịch: 2024-02-08
   * - Âm lịch: 2023-12-09
   * - JDN điểm Sóc: 2459966.371877
   * - Tổng chu kỳ Trăng: 1522
   * - Hành vi mong đợi: trả về điểm Sóc của 2023-01-01 Âm lịch (nhuận)
   */
  test("Date: 2024-01-10 | Lunar: 2023-11-29", () => {
    const output = lunarfirstnmp.convert(
      jdtonmp.convert(gretojd.convert({ day: 8, month: 2, year: 2024 })),
    );

    expect(output.year).toBe(2023);
    expect(output.leap).toBe(true);
    expect(output.total).toBe(1522);
  });

  /**
   * Đầu vào Dương lịch trước năm 1900:
   * - Dương lịch: 1800-12-06
   * - Âm lịch: 1800-10-20
   * - JDN điểm Sóc: 2378520.640596
   * - Tổng chu kỳ Trăng: -1236
   * - Hành vi mong đợi: trả về điểm Sóc của 1800-01-01 Âm lịch
   */
  test("Date: 1800-12-06 | Lunar: 1800-10-20", () => {
    const output = lunarfirstnmp.convert(
      jdtonmp.convert(gretojd.convert({ day: 6, month: 12, year: 1800 })),
    );

    expect(output.year).toBe(1800);
    expect(output.jdn).toBe(2378520.640596);
    expect(output.total).toBe(-1236);
  });
});
