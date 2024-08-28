export type Jdn = {
  /**
   * Số ngày Julian tuân thủ theo 2 nguyên tắc:
   * - Tương ứng với giờ UTC (GMT+0)
   * - Ngày Julian mới bắt đầu vào lúc 12:00 trưa UTC. Ví dụ, tại thời điểm ngày 01 tháng 01 năm
   * 1970 lúc 00:00 (bắt đầu một ngày mới theo lịch Gregory) số ngày Julian tương ứng 2440587.5,
   * tức thuộc về ngày Julian hôm trước. Cùng ngày 01 tháng 01 năm 1970 nhưng vào lúc 12:00 (giữa
   * trưa ngày Gregory), số ngày Julian sẽ là 2440588 (ngày mới).
   *
   * Việc áp đặt các quy tắc trên mặc dù sẽ làm việc tính toán lịch phức tạp hơn một chút, nhưng
   * nó giúp giá trị Julian đầu ra tuân thủ theo các tiêu chuẩn chung của Quốc tế, do đó nó có thể
   * được sử dụng cho nhiều mục đích rộng rãi hơn.
   */
  jdn: number;

  /**
   * Trả về phần bù chênh lệch giữa giờ địa phương so với giờ UTC, được tính bằng giây. Ví dụ,
   * Việt Nam nằm ở múi giờ GMT+7 (tức chênh lệnh 7 giờ so với UTC), khi quy đổi ra số giây sẽ
   * tương ứng 7 x 60 x 60 = 25200 giây.
   *
   * Phần chênh lệch này được sử dụng để tính toán ra số ngày Julian tương ứng với UTC khi đầu vào
   * là giờ địa phương.
   */
  offset: number;
};

/**
 * Xác định đối tượng lưu trữ thời gian cơ bản, được sử dụng để tạo đầu vào nhanh chóng hoặc đầu ra
 * đơn giản mà không cần các bước khởi tạo phức tạp hay các phương thức không cần thiết. Ví dụ, một
 * bộ chuyển đổi hoặc kho lưu trữ có thể yêu cầu nhiều giá trị thời gian cho quá trình khởi tạo, khi
 * đó, truyền một đối tượng đơn giản này vào constructor sẽ thuận tiện hơn việc gọi nhiều setter.
 *
 * Mặc định, loại đối tượng này hỗ trợ các dạng giá trị thời gian theo lịch Gregory.
 */
export type SimpleDateTime = {
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
 * Đối tượng lưu trữ các mốc thời gian cơ bản với các giá trị đầy đủ, thường được sử dụng để tạo đầu
 * ra từ các bộ chuyển đổi
 */
export type RequiredSimpleDateTime = Required<SimpleDateTime>;

/**
 * Bộ chuyển đổi dữ liệu đầu vào - đầu ra
 */
export interface Converter<I, O> {
  /**
   * Chuyển đổi một loại dữ liệu đầu vào thành loại dữ liệu đầu ra tương ứng
   */
  convert(input: I): O;
}

/**
 * Pha Trăng mới - điểm Sóc
 */
export type NewMoonPhase = Jdn & {
  /**
   * Tổng số chu kỳ trăng đã qua kể từ 1900-01-01T00:00+0000 cho đến thời điểm đầu vào
   */
  total: number;
};

/**
 * Pha trăng mới của tháng đầu tiên của năm Âm lịch
 */
export type LunarFirstNewMoonPhase = NewMoonPhase & {
  /**
   * Năm Âm lịch
   */
  year: number;

  /**
   * Xác định năm âm lịch nhuận
   */
  leap: boolean;
};

/**
 * Pha trăng mới của tháng nhuận Âm lịch
 */
export type LunarLeapMonth = NewMoonPhase & {
  /**
   * Số tháng nhuận Âm lịch. Không giống như Dương lịch, trong năm nhuận Âm lịch tháng nhuận có thể
   * bất kỳ trong khoảng 2 đến 11. Đôi khi, múi giờ khác nhau sẽ dẫn đến ngày tháng nhuận khác nhau
   * ở mỗi địa phương. Điều này là do tháng nhuận Âm lịch sử dụng cả Kinh độ Mặt trời kết hợp với
   * điểm Sóc của tháng để tính toán
   */
  month: number;
};
