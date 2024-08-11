import { BaseJdn } from "./BaseJdn";

/**
 * Lớp tính toán giá trị góc Kinh độ Mặt trời.
 *
 * Hiện nay có một số phương pháp tính toán, và kết quả đầu ra có thể có sự khác biệt nhỏ về phần
 * thập phân. Đầu ra của lớp này được so sánh tương ứng các mốc thời gian tại trang web
 * clearskytonight.com, với sự khác biệt nhỏ hơn 0.01 (khoảng dưới 15 phút). Sự khác biệt này là
 * không quan trọng trong việc lập lịch bởi phần thập phân là không cần thiết trong quá trình xây
 * dựng lịch. Ngoài ra, do quỹ đạo của Trái đất quanh Mặt trời không phải là một vòng hoàn hảo, do
 * đó sai số có thể biến động tùy thuộc vào các thời điểm trong năm.
 *
 * @link https://clearskytonight.com/projects/astronomycalculator/sun/sunlongitude.html
 */
export class Sunlongitude extends BaseJdn {
  private degrees?: number;
  private localMidnightDegrees?: number;

  /**
   * Trả về số đo độ thể hiện góc Kinh độ mặt trời trong khoảng từ 0.xxx - 359.xxx dựa trên mốc
   * ngày Julian đầu vào. Lưu ý, mốc ngày Julian phải tuân thủ quy ước ngày mới bắt đầu vào 12 giờ
   * trưa GTM+0.
   */
  protected getDegreesFromJdn(jdn: number) {
    const T = (jdn - 2451545) / 36525;
    const dr = Math.PI / 180;
    const L = 280.46 + 36000.77 * T;
    const G = 357.528 + 35999.05 * T;
    const ec = 1.915 * Math.sin(dr * G) + 0.02 * Math.sin(dr * 2 * G);
    const lambda = L + ec;

    return lambda - 360 * Math.floor(lambda / 360);
  }

  /**
   * Trả về góc kinh số đo góc kinh độ mặt trời tương ứng với thời gian đầu vào
   *
   * @param decimal
   * @returns
   */
  getDegrees(decimal: number = 6) {
    if (decimal < 0 || decimal > 6) {
      throw new Error("Error. The decimal part is supported between 0 and 6");
    }

    if (this.degrees === undefined) {
      this.degrees = this.getDegreesFromJdn(this.getJdn());
    }

    return parseFloat(this.degrees.toFixed(decimal));
  }

  /**
   * Trả về số đo góc Kinh độ Mặt trời lúc nửa đêm 00:00 của giờ địa phương tương ứng với thời gian
   * đầu vào. Có 2 trường hợp như sau:
   * - Khi thời gian đầu vào là giờ UTC (GMT+0), chằng hạn ngày 01 tháng 01 năm 1970, và ở bất kể
   * giờ nào trong ngày, hành vi xử lý của hàm này sẽ luôn trả về giá trị tương ứng với thời điểm
   * 00:00 ngày 01 tháng 01 năm 1970.
   * - Trường hợp đầu vào là giờ địa phương, chẳng hạn ngày 01 tháng 01 năm 1970 GMT+7 (tại Việt
   * Nam), và bất kể giờ nào trong ngày, đầu ra sẽ là giá trị tương ứng của thời điểm 17:00 ngày
   * 31 tháng 12 năm 1969 - bởi vì nửa đêm tại Việt Nam tương ứng với 05 giờ chiều của ngày hôm
   * trước theo múi giờ UTC.
   *
   * Trong Âm lịch, phương thức này là quan trọng để xác định mốc Đông Chí của tháng 11 Âm lịch, từ
   * đó mới có thể xác định ngày tháng năm.
   *
   * @param decimal
   * @returns
   */
  getLocalMidnightDegrees(decimal: number = 6) {
    if (decimal < 0 || decimal > 6) {
      throw new Error("Error. The decimal part is supported between 0 and 6");
    }

    if (this.localMidnightDegrees === undefined) {
      this.localMidnightDegrees = this.getDegreesFromJdn(
        this.getLocalMidnightJdn(),
      );
    }

    return parseFloat(this.localMidnightDegrees.toFixed(decimal));
  }

  /**
   * @inheritdoc
   */
  setJdn(jdn: number): this {
    this.degrees = undefined;
    this.localMidnightDegrees = undefined;

    return super.setJdn(jdn);
  }

  /**
   * @inheritdoc
   */
  setOffset(offset: number): this {
    this.localMidnightDegrees = undefined;
    return super.setOffset(offset);
  }
}
