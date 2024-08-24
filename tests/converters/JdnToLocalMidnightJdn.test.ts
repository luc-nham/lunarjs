import { describe, expect, test } from "@jest/globals";
import { JdnToLocalMidnightJdn } from "../../src/converters/JdnToLocalMidnightJdn";
import { SimpleDateTime } from "../../src/types";
import { GregorianToJdn } from "../../src/converters/GregorianToJdn";

describe("Kiểm tra chuyển đổi mốc ngày Julian thành mốc Julian nửa đêm giờ địa phương", () => {
  const gre: Required<SimpleDateTime> = {
    day: 1,
    month: 1,
    year: 1970,
    hour: 23,
    minute: 59,
    second: 59,
    offset: 0,
  };

  const input = new GregorianToJdn().convert(gre);
  const c = new JdnToLocalMidnightJdn();

  test("1970-01-01 23:59:59 +0000 | Midnight JDN = 2440587.5", () => {
    const ouput = c.convert(input);

    expect(ouput.jdn).toBe(2440587.5);
    expect(ouput.offset).toBe(0);
  });

  test("1970-01-01 23:59:59 +0700 | Midnight JDN = 2440587.208333", () => {
    input.offset = 25200;

    const ouput = c.convert(input);

    expect(ouput.jdn).toBe(2440587.208333);
    expect(ouput.offset).toBe(25200);
  });

  test("1970-01-01 11:59:59 +0700 | Midnight JDN = 2440587.208333", () => {
    gre.hour = 11;
    gre.offset = 25200;

    const ouput = c.convert(new GregorianToJdn().convert(gre));

    expect(ouput.jdn).toBe(2440587.208333);
    expect(ouput.offset).toBe(25200);
  });
});
