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

export { Jdn };
