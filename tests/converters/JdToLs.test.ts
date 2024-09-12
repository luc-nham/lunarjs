import { describe, expect, test } from "@jest/globals";
import { JdToLs } from "../../src/converters/JdToLs";
import { GregToJd } from "../../src/converters/GregToJd";

describe("Convert a Julian day number to Solor longitude (Ls)", () => {
  test("1970-01-01 00:00 +0000 | SL = 280.15", () => {
    expect(new JdToLs(undefined, { fixed: 2, floor: false }).getOutput()).toBe(
      280.15,
    );
  });

  test("1970-01-01 00:00 +07:00 | SL = 279.86", () => {
    new GregToJd({ year: 1970, day: 1, month: 1 }, { offset: 25200 }).forward(
      (o) => {
        expect(new JdToLs(o).getOutput()).toBe(279);
      },
    );
  });
});
