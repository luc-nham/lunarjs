import { describe, expect, test } from "@jest/globals";
import { JdnToLocalMidnightJdn } from "../../src/converters/JdnToLocalMidnightJdn";
import { GregorianToJdn } from "../../src/converters/GregorianToJdn";

describe("Kiểm tra chuyển đổi mốc ngày Julian thành mốc Julian nửa đêm giờ địa phương", () => {
  const gtj = new GregorianToJdn();
  const jtm = new JdnToLocalMidnightJdn();

  test("1970-01-01 23:59:59 +0000 | Midnight JDN = 2440587.5", () => {
    const input = gtj.convert({
      day: 1,
      month: 1,
      year: 1970,
      hour: 23,
      minute: 59,
      second: 59,
      offset: 0,
    });
    const ouput = jtm.convert(input);

    expect(ouput.jdn).toBe(2440587.5);
    expect(ouput.offset).toBe(0);
  });

  test("1970-01-01 23:59:59 +0700 | Midnight JDN = 2440587.208333", () => {
    const input = gtj.convert({
      offset: 25200,
      hour: 23,
      minute: 59,
      second: 59,
      year: 1970,
      day: 1,
      month: 1,
    });

    const ouput = jtm.convert(input);

    expect(ouput.jdn).toBe(2440587.208333);
    expect(ouput.offset).toBe(25200);
  });

  test("1970-01-01 11:59:59 +0700 | Midnight JDN = 2440587.208333", () => {
    const input = gtj.convert({
      offset: 25200,
      hour: 11,
      minute: 59,
      second: 59,
      year: 1970,
      day: 1,
      month: 1,
    });
    const ouput = jtm.convert(input);

    expect(ouput.jdn).toBe(2440587.208333);
    expect(ouput.offset).toBe(25200);
  });
});
