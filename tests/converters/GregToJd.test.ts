import { describe, expect, test } from "@jest/globals";
import { GregToJd } from "../../src/converters/GregToJd";

describe("Convert Gregorian to JDN", () => {
  const EPOCH = 2440587.5;

  test("1970-01-01 00:00 +0000 - midnight - (default)", () => {
    expect(new GregToJd().getOutput()).toBe(EPOCH);
  });

  test("1970-01-01 12:00 + 0000 - new day at noon", () => {
    expect(new GregToJd({ hour: 12 }).getOutput()).toBe(EPOCH + 0.5);
    expect(new GregToJd().setInput({ hour: 12 }).getOutput()).toBe(EPOCH + 0.5);
  });

  test("1970-01-01 23:00 +0000 with fixed ouput option", () => {
    expect(new GregToJd({ hour: 23 }, { fixed: 2 }).getOutput()).toBe(
      2440588.46,
    );
  });

  test("1970-01-01 00:00 +0700", () => {
    expect(new GregToJd({}, { offset: 25200 }).getOutput()).toBe(
      2440587.208333,
    );
  });
});
