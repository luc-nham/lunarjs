import { describe, expect, test } from "@jest/globals";
import { DateToRequiredSimpleGregorian } from "../../src/converters/DateToRequiredSimpleGregorian";

describe("Kiểm tra chuyển đổi Js Date sang đối tượng lưu trữ thời gian cơ bản", () => {
  const cvt = new DateToRequiredSimpleGregorian();

  test("1970-01-01 00:00", () => {
    const date = new Date("1970-01-01");
    const output = cvt.convert(date);

    expect(output.day).toBe(date.getDate());
    expect(output.month).toBe(date.getMonth() + 1);
    expect(output.year).toBe(date.getFullYear());
    expect(output.hour).toBe(date.getHours());
    expect(output.minute).toBe(date.getMinutes());
    expect(output.second).toBe(date.getSeconds());
    expect(output.offset).toBe(date.getTimezoneOffset() * -60);
  });
});
