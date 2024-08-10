interface Jdn {
  /**
   * Trả về số ngày Julian tuân thủ theo 2 nguyên tắc:
   * - Tương ứng với giờ UTC (GMT + 0)
   * - Ngày Julian mới bắt đầu vào lúc 12:00 trưa UTC. Ví dụ, tại thời điểm ngày 01 tháng 01 năm
   * 1970 lúc 00:00 (bắt đầu một ngày mới theo lịch Gregory) số ngày Julian tương ứng 2440587.5,
   * tức thuộc về ngày Julian hôm trước. Cùng ngày 01 tháng 01 năm 1970 nhưng vào lúc 12:00 (giữa
   * trưa ngày Gregory), số ngày Julian sẽ là 2440588 (ngày mới).
   *
   * Việc áp đặt các quy tắc trên mặc dù sẽ làm việc tính toán lịch phức tạp hơn một chút, nhưng
   * nó giúp giá trị Julian đầu ra tuân thủ theo các tiêu chuẩn chung của Quốc tế, do đó nó có thể
   * được sử dụng cho nhiều mục đích rộng rãi hơn.
   */
  getJdn(): number;

  /**
   * Trả về phần bù chênh lệch giữa giờ địa phương so với giờ UTC, được tính bằng giây. Ví dụ,
   * Việt Nam nằm ở múi giờ GMT+7 (tức chênh lệnh 7 giờ so với UTC), khi quy đổi ra số giây sẽ
   * tương ứng 7 x 60 x 60 = 25200 giây.
   *
   * Phần chênh lệch này được sử dụng để tính toán ra số ngày Julian tương ứng với UTC khi đầu vào
   * là giờ địa phương.
   */
  getOffset(): number;

  /**
   * Trả về số ngày Julian tương ứng với thời điểm 00:00 (nửa đêm theo lịch Gregory), có tính đến
   * phần bù chênh lệch so với UTC:
   * - Đối với giờ UTC, giá trị này luôn có phần thập phân là 0.5 (2440587.5, 2440666.5,...)
   * - Đối với giờ địa phương, giá trị này thay đổi tùy theo phần bù chênh lệnh so với giờ UTC. ví
   * dụ, vào lúc 00:00 giờ ngày 01 tháng 01 năm 1970 theo giờ UTC, giá trị này là 2440587.5. Tuy
   * nhiên, cùng thời gian trên nhưng tại Việt Nam, số ngày Julian sẽ là 2440587.791667. Điều này
   * dễ hiểu vì khi đó giờ UTC đã là 07:00 sáng ngày 01 tháng 01 năm 1970, do Việt Nam nằm ở múi
   * giờ GMT+7.
   *
   * Thời điểm 00:00 được xác định là điểm bắt đầu một ngày mới theo lịch Gregory, nó cũng được sử
   * dụng cho các bước tính toán Âm lịch Việt Nam, do vậy mốc ngày Julian tại thời điểm nửa đêm là
   * một tham số quan trọng cho việc tính toán.
   */
  getLocalMidnightJdn(): number;
}

/**
 * Xác định đối tượng lưu trữ thời gian cơ bản, được sử dụng để tạo đầu vào nhanh chóng hoặc đầu ra
 * đơn giản mà không cần các bước khởi tạo phức tạp hay các phương thức không cần thiết. Ví dụ, một
 * bộ chuyển đổi hoặc kho lưu trữ có thể yêu cầu nhiều giá trị thời gian cho quá trình khởi tạo, khi
 * đó, truyền một đối tượng đơn giản này vào constructor sẽ thuận tiện hơn việc gọi nhiều setter.
 *
 * Mặc định, loại đối tượng này hỗ trợ các dạng giá trị thời gian theo lịch Gregory.
 */
type SimpleDateTime = {
  /**
   * Ngày
   */
  day?: number;

  /**
   * Tháng
   */
  month?: number;

  /**
   * Năm
   */
  year?: number;

  /**
   * Giờ
   */
  hour?: number;

  /**
   * Phút
   */
  minute?: number;

  /**
   * Giây
   */
  second?: number;

  /**
   * Số giây bù chênh lệch giữa giờ địa phương so với UTC
   */
  offset?: number;
};

/**
 * Kho lưu trữ các giá trị thời gian cơ bản
 */
interface DateTimeStorage {
  /**
   * Đọc hoặc ghi giá trị ngày:
   * - Khi không có tham số, trả về ngày ở định dạng số.
   * - Khi có tham số, ngày sẽ được thay thế bằng giá trị của tham số, trả về đối tượng gốc.
   *
   * @param d number Đặt giá trị mới của ngày
   */
  day(): number;
  day(d: number): this;

  /**
   * Đọc hoặc ghi giá trị tháng:
   * - Khi không có tham số, trả về tháng ở định dạng số.
   * - Khi có tham số, tháng sẽ được thay thế bằng giá trị của tham số, trả về đối tượng gốc.
   *
   * @param m number Đặt giá trị mới của tháng
   */
  month(): number;
  month(m: number): this;

  /**
   * Đọc hoặc ghi giá trị năm:
   * - Khi không có tham số, trả về năm ở định dạng số.
   * - Khi có tham số, năm sẽ được thay thế bằng giá trị của tham số, trả về đối tượng gốc.
   *
   * @param y number Đặt giá trị mới của năm
   */
  year(): number;
  year(y: number): this;

  /**
   * Đọc hoặc ghi giá trị giờ:
   * - Khi không có tham số, trả về giờ ở định dạng số.
   * - Khi có tham số, giờ sẽ được thay thế bằng giá trị của tham số, trả về đối tượng gốc.
   *
   * @param h number Đặt giá trị mới của giờ
   */
  hour(): number;
  hour(h: number): this;

  /**
   * Đọc hoặc ghi giá trị phút:
   * - Khi không có tham số, trả về phút ở định dạng số.
   * - Khi có tham số, phút sẽ được thay thế bằng giá trị của tham số, trả về đối tượng gốc.
   *
   * @param i number Đặt giá trị mới của phút
   */
  minute(): number;
  minute(i: number): this;

  /**
   * Đọc hoặc ghi giá trị giây:
   * - Khi không có tham số, trả về giây ở định dạng số.
   * - Khi có tham số, giây sẽ được thay thế bằng giá trị của tham số, trả về đối tượng gốc.
   *
   * @param s number Đặt giá trị mới của giây
   */
  second(): number;
  second(s: number): this;

  /**
   * Đọc hoặc ghi giá trị bù chênh lệch giữa giờ địa phương và UTC:
   * - Khi không có tham số, trả về phần bù ở định dạng số.
   * - Khi có tham số, phần bù sẽ được thay thế bằng giá trị của tham số, trả về đối tượng gốc.
   *
   * @param o number Đặt giá trị mới của phần bù chênh lệch
   */
  offset(): number;
  offset(o: number): this;
}

type DateTimeKeyProp = "_d" | "_m" | "_y" | "_h" | "_i" | "_s" | "_o";

export { Jdn, SimpleDateTime, DateTimeStorage, DateTimeKeyProp };
