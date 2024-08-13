import { describe, expect, test } from "@jest/globals";
import { NewMoonPhase } from "../../src/astronomy/NewMoonPhase";

describe("Kiểm tra tính toán vị trí pha Trăng mới - điểm Sóc", () => {
  test("Tính toán từ lịch Gregory", () => {
    //1900-01-01 13:50:28 +00:00 | Jdn new moon = 2415021.076721
    const nmp = NewMoonPhase.fromGregorian({
      day: 1,
      month: 1,
      year: 1900,
    });

    expect(nmp.getJdn()).toBe(2415021.076721);
    expect(nmp.getTotalPhases()).toBe(0);

    // Thêm một chu kỳ trăng mới dựa trên số ngày Julian
    // 1900-01-31 01:21:44 +00:00 | Jdn new moon = 2415050.556749
    nmp.setJdn(nmp.getJdn() + 30);
    expect(nmp.getJdn()).toBe(2415050.556749);
    expect(nmp.getTotalPhases()).toBe(1);

    const gre = nmp.toGregorian();
    expect(gre.day).toBe(31);
    expect(gre.month).toBe(1);
    expect(gre.year).toBe(1900);
    expect(gre.hour).toBe(1);
    expect(gre.minute).toBe(21);
    expect(gre.second).toBe(44);
    expect(gre.offset).toBe(0);
  });
});
