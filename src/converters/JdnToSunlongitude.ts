import { Converter, Jdn } from "../types";

/**
 * Bộ chuyển đổi số ngày Julian thành góc Kinh độ Mặt trời tương ứng
 */
export class JdnToSunlongitude implements Converter<Jdn, number> {
  /**
   * @inheritdoc
   */
  convert(input: Jdn): number {
    const { jdn } = input;

    const T = (jdn - 2451545) / 36525;
    const dr = Math.PI / 180;
    const L = 280.46 + 36000.77 * T;
    const G = 357.528 + 35999.05 * T;
    const ec = 1.915 * Math.sin(dr * G) + 0.02 * Math.sin(dr * 2 * G);
    const lambda = L + ec;
    const sl = lambda - 360 * Math.floor(lambda / 360);

    return parseFloat(sl.toFixed(2));
  }
}
