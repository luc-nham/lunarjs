import { describe, test, expect } from "@jest/globals";
import { GregToJd } from "../../src/converters/GregToJd";
import { JdToNm } from "../../src/converters/JdToNm";
import { NewMoonNavigator } from "../../src/converters/NewMoonNavigator";

describe("Navigate next and previous New moon", () => {
  const nm = new GregToJd({
    day: 1,
    month: 1,
    year: 1900,
  })
    .forward((jd) => new JdToNm(jd))
    .getOutput();

  test("Next 1 new moon (default)", () => {
    new NewMoonNavigator(nm).forward((nm) => {
      expect(nm).toStrictEqual({
        jd: 2415050.556749,
        total: 1,
      });
    });
  });

  test("Next 10 new moon phases", () => {
    new NewMoonNavigator(nm, { quantity: 10 }).forward((nm) => {
      expect(nm).toStrictEqual({
        jd: 2415316.060147,
        total: 10,
      });
    });
  });

  test("Previous 1 new moon phase", () => {
    new NewMoonNavigator(nm, { navigation: "previous" }).forward((nm) => {
      expect(nm).toStrictEqual({
        jd: 2414991.531987,
        total: -1,
      });
    });
  });

  test("Previous 10 new moon phases", () => {
    new NewMoonNavigator()
      .setInput(nm)
      .setOption({ navigation: "previous", quantity: 10 })
      .forward((nm) => {
        expect(nm).toStrictEqual({
          jd: 2414725.328934,
          total: -10,
        });
      });
  });
});
