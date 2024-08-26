import { describe, expect, test } from "@jest/globals";
import { GregorianToJdn } from "../../src/converters/GregorianToJdn";
import { SimpleDateTime } from "../../src/types";

describe("Kiểm tra chuyển đổi một mốc lịch Gregory sang số ngày Julian", () => {
  const c = new GregorianToJdn();
  const input: SimpleDateTime = {};

  test("1970-01-01 00:00 +0000 | JDN = 2440587.5", () => {
    const ouput = c.convert(input);

    expect(ouput.jdn).toBe(2440587.5);
    expect(ouput.offset).toBe(0);
  });

  test("2024-01-01 00:00 +0700 | JDN = 2460310.208333", () => {
    input.year = 2024;
    input.offset = 25200;

    const ouput = c.convert(input);

    expect(ouput.jdn).toBe(2460310.208333);
    expect(ouput.offset).toBe(25200);
  });
});
