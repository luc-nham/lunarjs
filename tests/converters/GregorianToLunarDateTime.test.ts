import { describe, expect, test } from "@jest/globals";
import { GregorianToLunarDateTime } from "../../src/converters/GregorianToLunarDateTime";

describe("Kiểm tra chuyển đổi Dương lịch sang Âm lịch", () => {
  const g2l = new GregorianToLunarDateTime();

  test("Gre: 1970-06-02 10:30 +0700 | Lunar: 1970-01-01 10:30 +0700", () => {
    const lunar = g2l.convert({
      day: 6,
      month: 2,
      year: 1970,
      hour: 10,
      minute: 30,
      offset: 25200,
    });

    expect(lunar.day).toBe(1);
    expect(lunar.month).toBe(1);
    expect(lunar.year).toBe(1970);
    expect(lunar.hour).toBe(10);
    expect(lunar.minute).toBe(30);
    expect(lunar.isLeapYear).toBe(false);
    expect(lunar.isLeapMonth).toBe(false);
    expect(lunar.leapMonth).toBe(0);
  });

  test("Gre: 2023-05-18 00:00 +0700 | Lunar: 2023-03-29 00:00 +0700", () => {
    const lunar = g2l.convert({
      day: 18,
      month: 5,
      year: 2023,
      offset: 25200,
    });

    expect(lunar.day).toBe(29);
    expect(lunar.month).toBe(3);
    expect(lunar.year).toBe(2023);
    expect(lunar.hour).toBe(0);
    expect(lunar.minute).toBe(0);
    expect(lunar.isLeapYear).toBe(true);
    expect(lunar.isLeapMonth).toBe(false);
    expect(lunar.leapMonth).toBe(2);
  });

  test("Gre: 2025-08-13 00:00:59 +0700 | Lunar: 2025-06-20 00:00:59 +0700 (nhuận)", () => {
    const lunar = g2l.convert({
      day: 13,
      month: 8,
      year: 2025,
      second: 59,
      offset: 25200,
    });

    expect(lunar.day).toBe(20);
    expect(lunar.month).toBe(6);
    expect(lunar.year).toBe(2025);
    expect(lunar.second).toBe(59);
    expect(lunar.isLeapYear).toBe(true);
    expect(lunar.isLeapMonth).toBe(true);
    expect(lunar.leapMonth).toBe(6);
  });

  test("Gre: 2033-11-22 23:59:59 +0700 | Lunar: 2033-01-11 23:59:59 +0700", () => {
    const lunar = g2l.convert({
      day: 22,
      month: 11,
      year: 2033,
      hour: 23,
      minute: 59,
      second: 59,
      offset: 25200,
    });

    expect(lunar.day).toBe(1);
    expect(lunar.month).toBe(11);
    expect(lunar.year).toBe(2033);
    expect(lunar.hour).toBe(23);
    expect(lunar.minute).toBe(59);
    expect(lunar.second).toBe(59);
    expect(lunar.isLeapYear).toBe(true);
    expect(lunar.isLeapMonth).toBe(false);
    expect(lunar.leapMonth).toBe(11);
    expect(lunar.dayOfMonth).toBe(30);
  });
});
