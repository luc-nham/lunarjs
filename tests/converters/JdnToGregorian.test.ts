import { describe, expect, test } from "@jest/globals";
import { Jdn } from "./export type";
import { JdnToGregorian } from "../../src/converters/JdnToGregorian";

describe("Kiểm tra chuyển đổi JDN thành ngày tháng lịch Gregory tương ứng", () => {
  const input: Jdn = {
    jdn: 2440587.5,
    offset: 0,
  };

  const jc = new JdnToGregorian();

  test("1970-01-01 +0000 | Jdn = 2440587.5", () => {
    const output = jc.convert(input);

    expect(output).toStrictEqual({
      day: 1,
      month: 1,
      year: 1970,
      hour: 0,
      minute: 0,
      second: 0,
      offset: 0,
    });
  });

  test("1970-01-01 07:59:59 +0700 | JDN = 2440587.541655", () => {
    const output = jc.convert({ jdn: 2440587.541655, offset: 25200 });

    expect(output).toStrictEqual({
      day: 1,
      month: 1,
      year: 1970,
      hour: 7,
      minute: 59,
      second: 59,
      offset: 25200,
    });
  });

  test("1970-01-01 23:59:58 +0700 | JDN = 2440588.208310", () => {
    const output = jc.convert({ jdn: 2440588.20831, offset: 25200 });

    expect(output).toStrictEqual({
      day: 1,
      month: 1,
      year: 1970,
      hour: 23,
      minute: 59,
      second: 58,
      offset: 25200,
    });
  });
});
