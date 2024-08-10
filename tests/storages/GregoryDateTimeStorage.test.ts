import { describe, expect, test } from "@jest/globals";
import { GregoryDateTimeStorage } from "../../src/storages/GregoryDateTimeStorage";

describe("Kiểm tra kho lưu trữ Dương lịch - Grefory", () => {
  test("Xác thực đầu vào trước khi đặt giá trị", () => {
    const storage = new GregoryDateTimeStorage();

    expect(storage.day(10).day()).toBe(10);
    expect(() => storage.day(0)).toThrow();
    expect(() => storage.day(32)).toThrow();
    expect(() => storage.day(5.5)).toThrow();

    expect(storage.month(5).month()).toBe(5);
    expect(() => storage.month(0)).toThrow();
    expect(() => storage.month(13)).toThrow();
    expect(() => storage.month(1.6)).toThrow();

    expect(storage.year(2024).year()).toBe(2024);
    expect(() => storage.year(-1)).toThrow();
    expect(() => storage.year(10000)).toThrow();
    expect(() => storage.year(10.34213423)).toThrow();

    expect(storage.hour(12).hour()).toBe(12);
    expect(() => storage.hour(-1)).toThrow();
    expect(() => storage.hour(24)).toThrow();
    expect(() => storage.hour(15.23423)).toThrow();

    expect(storage.minute(40).minute()).toBe(40);
    expect(() => storage.minute(-1)).toThrow();
    expect(() => storage.minute(60)).toThrow();
    expect(() => storage.minute(15.1)).toThrow();

    expect(storage.second(30).second()).toBe(30);
    expect(() => storage.second(-1)).toThrow();
    expect(() => storage.second(60)).toThrow();
    expect(() => storage.second(59.9)).toThrow();

    expect(storage.offset(25200).offset()).toBe(25200);
    expect(() => storage.offset(-43201)).toThrow();
    expect(() => storage.offset(50401)).toThrow();
  });

  test("Chuyển đổi từ một đối tượng Date gốc của Javascript", () => {
    // Khi có tham số đầu vào
    const date = new Date("2022-02-27T10:30:20");
    const s = GregoryDateTimeStorage.fromDate(date);

    expect(s.day()).toBe(27);
    expect(s.month()).toBe(2);
    expect(s.year()).toBe(2022);
    expect(s.hour()).toBe(10);
    expect(s.minute()).toBe(30);
    expect(s.second()).toBe(20);
    expect(s.offset()).toBe(date.getTimezoneOffset() * -60);

    // Khi không có tham số đầu vào
    const d2 = new Date();
    const s2 = GregoryDateTimeStorage.fromDate();

    expect(s2.day()).toBe(d2.getDate());
    expect(s2.month()).toBe(d2.getMonth() + 1);
    expect(s2.year()).toBe(d2.getFullYear());
    expect(s2.hour()).toBe(d2.getHours());
    expect(s2.minute()).toBe(d2.getMinutes());
    expect(s2.second()).toBe(d2.getSeconds());
    expect(s2.offset()).toBe(d2.getTimezoneOffset() * -60);
  });
});
