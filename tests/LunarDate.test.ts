import { describe, expect, test } from "@jest/globals";
import { LunarDate } from "../src/LunarDate";
import { GregToJd } from "../src/converters/GregToJd";
import { DateToSimpleDateTime } from "../src/converters/DateToSimpleDateTime";
import { JdToLunar } from "../src/converters/JdToLunar";

describe("Lunar date time test", () => {
  test("Now with instance", () => {
    const date = new Date();
    const lunar = new LunarDate();

    const l2 = new DateToSimpleDateTime(date).forward((out) => {
      return new GregToJd(out, { offset: out.offset }).forward((jd, opt) =>
        new JdToLunar(jd, opt).getOutput(),
      );
    });

    expect(lunar.getDay()).toBe(l2.day);
    expect(lunar.getMonth()).toBe(l2.month);
    expect(lunar.getFullYear()).toBe(l2.year);
    expect(lunar.getJdn()).toBe(l2.jd);
    expect(lunar.getHours()).toBe(date.getHours());
    expect(lunar.getMinutes()).toBe(date.getMinutes());
    expect(lunar.getSeconds()).toBe(date.getSeconds());
    expect(lunar.getTimezoneOffset()).toBe(date.getTimezoneOffset() * -60);
    expect(lunar.getTime() - date.getTime()).toBeLessThan(1000);
  });

  test("Now with static", () => {
    const jd = new DateToSimpleDateTime().forward((gre) =>
      new GregToJd(gre, { offset: gre.offset }).getOutput(),
    );
    const lunar = LunarDate.now();

    expect(lunar.getJdn()).toBe(jd);
  });

  test("Create instance from Jdn", () => {
    const jd = 2460568.570544; // 2024-09-15 01:41:35 +0000
    const lunar = new LunarDate(jd);

    expect(lunar.getJdn()).toBe(jd);
    expect(lunar.getDay()).toBe(13);
    expect(lunar.getMonth()).toBe(8);
    expect(lunar.getFullYear()).toBe(2024);
    expect(lunar.getHours()).toBe(1);
    expect(lunar.getMinutes()).toBe(41);
    expect(lunar.getSeconds()).toBe(35);

    expect(lunar.isLeapYear()).toBe(false);
    expect(lunar.isLeapMonth()).toBe(false);
    expect(lunar.getLeapMonth()).toBe(0);
  });

  test("Create instance form Lunar", () => {
    const jd = 2460568.570544; // 2024-09-15 01:41:35 +0000

    const lunar = new LunarDate({
      day: 13,
      month: 8,
      year: 2024,
      hour: 1,
      minute: 41,
      second: 35,
    });

    expect(lunar.getJdn()).toBe(jd);
  });

  test("From Simple date time", () => {
    const lunar = LunarDate.fromDate(
      {
        day: 1,
        month: 1,
        year: 1970,
      },
      { offset: 25200 },
    );

    expect(lunar.getDay()).toBe(24);
    expect(lunar.getMonth()).toBe(11);
    expect(lunar.getFullYear()).toBe(1969);
    expect(lunar.getHours()).toBe(0);
  });

  test("String format", () => {
    const lunar = new LunarDate({
      day: 20,
      month: 10,
      year: 2022,
    });

    expect(lunar.toDateString()).toBe("2022-10-20");
    expect(lunar.toTimeString()).toBe("00:00:00 GMT+0000");
    expect(lunar.toString()).toBe("2022-10-20 00:00:00 GMT+0000");
  });

  test("To Js Date object", () => {
    const lunar = new LunarDate();
    const date = lunar.toDate();
    const date2 = new Date();

    // Differential within 1000 milliseconds
    expect(Math.abs(date2.getTime() - date.getTime())).toBeLessThan(1000);
  });
});
