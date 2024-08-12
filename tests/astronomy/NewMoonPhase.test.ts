import { describe, expect, test } from "@jest/globals";
import { NewMoonPhase } from "../../src/astronomy/NewMoonPhase";

describe("Kiểm tra tính toán vị trí pha Trăng mới - điểm Sóc", () => {
  test("Tính toán từ lịch Gregory", () => {
    //1900-01-01 | Jdn new moon = 2415021.076721
    const nmp = NewMoonPhase.fromGregorian({
      day: 1,
      month: 1,
      year: 1900,
    });

    expect(nmp.getJdn()).toBe(2415021.076721);
  });
});
