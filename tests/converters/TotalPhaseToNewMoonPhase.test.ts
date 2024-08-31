import { describe, expect, test } from "@jest/globals";
import { JdnToNewMoonPhase } from "../../src/converters/JdnToNewMoonPhase";
import { GregorianToJdn } from "../../src/converters/GregorianToJdn";
import { TotalPhaseToNewMoonPhase } from "../../src/converters/TotalPhaseToNewMoonPhase";

describe("Kiểm tra chuyển đổi tổng pha Trăng mới thành điểm Sóc mới", () => {
  test("1900-01-01", () => {
    const nmp = new JdnToNewMoonPhase().convert(
      new GregorianToJdn().convert({
        day: 1,
        month: 1,
        year: 1900,
      }),
    );

    const nextNmp = new TotalPhaseToNewMoonPhase().convert({
      total: nmp.total + 1,
      offset: nmp.offset,
    });

    expect(nmp.total).toBe(0);
    expect(nextNmp.total).toBe(1);

    expect(Math.floor(nextNmp.jdn - nmp.jdn)).toBe(29);
  });
});
