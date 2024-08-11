import { describe, expect, test } from "@jest/globals";
import { Sunlongitude } from "../../src/astronomy/Sunlongitude";

describe("Tính toán Kinh độ Mặt trời", () => {
  test("Epoch 1970-01-01T00:00 UTC", () => {
    const sl = new Sunlongitude();
    const diff = Math.abs(sl.getDegrees() - 280.159893394254);

    expect(diff).toBeLessThan(0.01);
  });

  test("Tham số chiều dài phần thập phân không hợp lệ", () => {
    const sl = new Sunlongitude();

    expect(() => sl.getDegrees(-1)).toThrow();
    expect(() => sl.getLocalMidnightDegrees(7)).toThrow();
  });

  test("Nửa đêm UTC", () => {
    // 1970-01-01T00:00 UTC
    const sl = new Sunlongitude();
    expect(sl.getDegrees()).toBe(sl.getLocalMidnightDegrees()); // UTC

    // 1970-01-01T12:00 UTC
    sl.setJdn(sl.getJdn() + 0.5);
    expect(sl.getDegrees()).toBeGreaterThan(sl.getLocalMidnightDegrees());

    // 1969-12-31T12:00 UTC
    sl.setJdn(sl.getJdn() - 1);
    expect(sl.getDegrees()).toBeGreaterThan(sl.getLocalMidnightDegrees());
  });
});
