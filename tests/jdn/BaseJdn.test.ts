import { describe, expect, test } from "@jest/globals";
import { BaseJdn } from "../../src/jdn/BaseJdn";
import { GregoryDateTimeStorage } from "../../src/storages/GregoryDateTimeStorage";

describe("Kiểm tra lớp xử lý JDN cơ sở", () => {
  // Số ngày Julian tại thời điểm 1970-01-01T00:00:00Z0000
  const epochJdn = 2440587.5;

  // Đối tượng mặc định tương ứng với thời điểm 1970-01-01T00:00:00Z0000
  const jdn = new BaseJdn();

  test("Khởi tạo đối tượng gốc: 1970-01-01T00:00:00Z0000", () => {
    expect(jdn.getJdn()).toBe(epochJdn);
    expect(jdn.getLocalMidnightJdn()).toBe(jdn.getJdn());
    expect(jdn.getOffset()).toBe(0);
  });

  test("Thay đổi số ngày Jdn: 1970-01-01T12:00:00Z0000", () => {
    // Thay đổi thời gian thành 12 giờ trưa ngày 01 tháng 01 năm 1970
    jdn.setJdn(epochJdn + 0.5);

    // Mong đợi số ngày Julian tương ứng 2440588
    expect(jdn.getJdn()).toBe(epochJdn + 0.5);

    // Mong đợi số ngày Julian tại thời điểm nửa đêm không thay đổi
    expect(jdn.getLocalMidnightJdn()).toBe(epochJdn);
  });

  test("Thay đổi phần bù chênh lệch UTC", () => {
    jdn.setJdn(epochJdn); // Đặt lại điểm khởi tạo
    jdn.setOffset(3600); // GMT+1

    /**
     * Mong đợi hành vi số ngày Julian không thay đổi. Tương tự như timestamp, số ngày Julian được
     * tính theo UTC, do đó nó cần được cố định để làm căn cứ cho các dữ liệu liên quan.
     */
    expect(jdn.getJdn()).toBe(epochJdn);

    /**
     * Mong đợi hành vi số ngày Julian lúc nửa đêm theo giờ địa phương sẽ giảm. Khi múi giờ là GMT+1
     * tức vào lúc 00:00 của giờ địa phương, thì giờ UTC khi đó là 23:00, nghĩa là chưa đạt được đến
     * nửa ngày, phần thập phân của ngày Julian sẽ nhỏ hơn 0.5.
     *
     * @link https://aa.usno.navy.mil/calculated/juliandate?ID=AA&date=1969-12-31&era=AD&time=23%3A00%3A00.000&submit=Get+Date
     */
    expect(jdn.getLocalMidnightJdn()).toBeLessThan(epochJdn);
    expect(jdn.getLocalMidnightJdn()).toBe(2440587.458333);

    /**
     * Mong đợi hành vi số ngày Julian lúc nửa đêm theo giờ địa phương sẽ tăng. Khi múi giờ là GMT-7
     * tức vào lúc 00:00 của giờ địa phương, thì giờ UTC khi đó là 07:00 sáng, phần thập phân sẽ lớn
     * hơn 0.5.
     *
     * @link https://aa.usno.navy.mil/calculated/juliandate?ID=AA&date=1970-01-01&era=AD&time=07%3A00%3A00.000&submit=Get+Date
     */
    jdn.setOffset(-7 * 60 * 60); // GMT-7
    expect(jdn.getLocalMidnightJdn()).toBeGreaterThan(epochJdn);
    expect(jdn.getLocalMidnightJdn()).toBe(2440587.791667);
  });

  test("Lỗi đặt giá trị (setter)", () => {
    // Lỗi phạm vi số ngày julian không được hỗ trợ
    expect(() => {
      jdn.setJdn(-1);
    }).toThrow();

    expect(() => {
      jdn.setJdn(5373485);
    }).toThrow();
  });

  // Lỗi phạm vi phần bù chênh lệch UTC không được hỗ trợ
  expect(() => {
    jdn.setOffset(-43201);
  }).toThrow();

  expect(() => {
    jdn.setOffset(50401);
  }).toThrow();

  test("Số ngày Julian lúc nửa đêm giờ giờ địa phương múi giờ GMT14 (Christmas Island/Kiribati)", () => {
    /**
     * Múi giờ GMT12 (54200 giây) là mốc bù chênh lệch dương tối đa được hỗ trợ. Tại thời điểm 00:00
     * phút ngày 01 tháng 01 năm 1970 GMT14, mong đợi kết quả số ngày Julian đầu ra sẽ tương ứng
     * với thời điểm 10:00 sáng ngày 31 tháng 12 năm 1969 UTC.
     *
     * @link https://aa.usno.navy.mil/calculated/juliandate?ID=AA&date=1969-12-31&era=AD&time=10%3A00%3A00.000&submit=Get+Date
     */
    jdn.setOffset(50400);
    expect(jdn.getLocalMidnightJdn()).toBe(2440586.916667);
  });

  test("Số ngày Julian lúc nửa đêm giờ giờ địa phương múi giờ GMT-12 (US Minor Outlying Islands)", () => {
    /**
     * Múi giờ GMT-12 (-43200 giây) là mốc bù chênh lệch âm tối đa được hỗ trợ. Tại thời điểm 00:00
     * phút ngày 01 tháng 01 năm 1970 GMT-12, mong đợi kết quả số ngày Julian đầu ra sẽ tương ứng
     * với thời điểm 12:00 trưa ngày 01 tháng 01 năm 1970 UTC.
     *
     * @link https://aa.usno.navy.mil/calculated/juliandate?ID=AA&date=1970-01-01&era=AD&time=12%3A00%3A00.000&submit=Get+Date
     */
    jdn.setOffset(-43200);
    expect(jdn.getLocalMidnightJdn()).toBe(2440588.0);
  });

  /**
   * @link https://aa.usno.navy.mil/calculated/juliandate?ID=AA&date=2020-01-01&era=AD&time=00%3A00%3A00.000&submit=Get+Date
   */
  test("Khởi tạo/chuyển đổi từ lịch Gregory", () => {
    const date = new Date("2020-01-01T00:00:00+00:00");
    const storage = GregoryDateTimeStorage.fromDate(date);

    const jdn1 = BaseJdn.fromGregorian(date);
    const jdn2 = BaseJdn.fromGregorian(storage);

    expect(jdn1.getJdn()).toBe(2458849.5);
    expect(jdn1.getJdn()).toBe(jdn2.getJdn());
    expect(jdn1.getLocalMidnightJdn()).toBe(jdn2.getLocalMidnightJdn());

    // Không có tham số giờ phút giây
    const jdn3 = BaseJdn.fromGregorian(
      new GregoryDateTimeStorage({ day: 1, month: 1, year: 2020 }),
    );

    expect(jdn3.getJdn()).toBe(2458849.5);
  });
});
