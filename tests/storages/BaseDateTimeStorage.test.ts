import { describe, expect, test } from "@jest/globals";
import { BaseDateTimeStorage } from "../../src/storages/BaseDateTimeStorage";
import { DateTimeKeyProp } from "../../src/types";

describe("Kiểm tra kho lưu trữ thời gian không xác định", () => {
  const storage = new BaseDateTimeStorage();

  test("Kiểm tra đọc - ghi giá trị thời gian", () => {
    expect(storage.day()).toBe(1); // Mặc định
    storage.day(100);
    expect(storage.day()).toBe(100);

    expect(storage.month()).toBe(1); // Mặc định
    storage.month(6);
    expect(storage.month()).toBe(6);

    expect(storage.year()).toBe(1970); // Mặc định
    storage.year(2024);
    expect(storage.year()).toBe(2024);

    expect(storage.hour()).toBe(0); // Mặc định
    storage.hour(100);
    expect(storage.hour()).toBe(100);

    expect(storage.minute()).toBe(0); // Mặc định
    storage.minute(23);
    expect(storage.minute()).toBe(23);

    expect(storage.second()).toBe(0); // Mặc định
    storage.second(5432.5);
    expect(storage.second()).toBe(5432.5);

    expect(storage.offset()).toBe(0); // Mặc định
    storage.offset(25200);
    expect(storage.offset()).toBe(25200);
  });

  test("Xuất ra lỗi đặt giá trị không hợp lệ", () => {
    expect(() => {
      const s = new (class extends BaseDateTimeStorage {
        protected validateBeforeSetValue(
          p: DateTimeKeyProp,
          v: number,
        ): string | boolean {
          if (p === "_d" && v > 31) {
            return false;
          }

          return true;
        }
      })();
      s.day(32);
    }).toThrow();

    expect(() => {
      const s = new (class extends BaseDateTimeStorage {
        protected validateBeforeSetValue(
          p: DateTimeKeyProp,
          v: number,
        ): string | boolean {
          return p === "_h" && v < 0
            ? "Error. The hour value must be greter than 0."
            : true;
        }
      })();

      s.hour(-100);
    }).toThrow();

    expect(() => {
      const s = new (class extends BaseDateTimeStorage {
        protected validateBeforeSetValue(
          p: DateTimeKeyProp,
          v: number,
        ): string | boolean {
          if (v === 1) {
            return false;
          }
          return true;
        }
      })();

      s.day(1);
    }).toThrow();
  });

  test("Khởi tạo đối tượng với các mốc thời gian đầu vào", () => {
    expect(new BaseDateTimeStorage({ day: 10 }).day()).toBe(10);
    expect(new BaseDateTimeStorage({ month: 10 }).month()).toBe(10);
    expect(new BaseDateTimeStorage({ year: 1990 }).year()).toBe(1990);
    expect(new BaseDateTimeStorage({ hour: 10 }).hour()).toBe(10);
    expect(new BaseDateTimeStorage({ minute: 10 }).minute()).toBe(10);
    expect(new BaseDateTimeStorage({ second: 10 }).second()).toBe(10);
    expect(new BaseDateTimeStorage({ offset: 3600 }).offset()).toBe(3600);
  });
});
