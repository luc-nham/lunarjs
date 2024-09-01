import { describe, expect, test } from "@jest/globals";
import { gregorianToJd } from "../src/helper";

describe("Gregorian to Jdn", () => {
  const EPOCH_JDN = 2440587.5;

  test("Default without input", () => {
    expect(gregorianToJd()).toBe(EPOCH_JDN);
  });

  test("With UTC offset", () => {
    expect(gregorianToJd({ offset: 25200 })).toBe(2440587.208333);
  });
});
