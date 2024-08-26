import { describe, expect, test } from "@jest/globals";
import { RequiredSimpleDateTime } from "../../src/types";
import { GregorianToJdn } from "../../src/converters/GregorianToJdn";
import { JdnToNewMoonPhase } from "../../src/converters/JdnToNewMoonPhase";

describe("Kiểm tra chuyển đổi JDN thành pha Trăng mới", () => {
  const gre: RequiredSimpleDateTime = {
    day: 1,
    month: 1,
    year: 1900,
    hour: 0,
    minute: 0,
    second: 0,
    offset: 0,
  };

  const jc = new GregorianToJdn();
  const nc = new JdnToNewMoonPhase();

  test("Input Date :1900-01-01 +0000 | New Moon Phase Jdn: 2415021.076721 | Date: 1900-01-01 13:50:28 +0000 ", () => {
    const output = nc.convert(jc.convert(gre));

    expect(output.total).toBe(0);
    expect(output.offset).toBe(0);
    expect(output.jdn).toBe(2415021.076721);
  });

  test("Input Date :1900-02-10 +0000 | New Moon Phase Jdn: 2415050.556749 | Date: 1900-01-31 01:21:43 +0000", () => {
    gre.day = 10;
    gre.month = 2;

    const output = nc.convert(jc.convert(gre));

    expect(output.total).toBe(1);
    expect(output.jdn).toBe(2415050.556749);
  });
});
