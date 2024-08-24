import { describe, expect, test } from "@jest/globals";
import { Jdn } from "../../src/types";
import { JdnToSunlongitude } from "../../src/converters/JdnToSunlongitude";

describe("Kiểm tra chuyển đổi mốc ngày Julian thành góc Kinh độ Mặt trời", () => {
  const j: Jdn = {
    jdn: 2440587.5,
    offset: 0,
  };

  const c = new JdnToSunlongitude();

  test("1970-01-01 00:00 +0000 | SL = 280.15", () => {
    expect(c.convert(j)).toBe(280.15);
  });

  test("1970-01-01 00:00 +07:00 | SL = 279.86", () => {
    j.offset = 25200;
    j.jdn = j.jdn - j.offset / 86400;

    expect(c.convert(j)).toBe(279.86);
  });
});
