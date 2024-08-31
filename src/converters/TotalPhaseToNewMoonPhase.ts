import { NewMoonPhase } from "../types";
import { BaseNewMoonPhase } from "./BaseNewMoonPhase";

type Input = {
  total: number;
  offset: number;
};

export class TotalPhaseToNewMoonPhase extends BaseNewMoonPhase<
  Input,
  NewMoonPhase
> {
  /**
   * Chuyển đổi một giá trị tổng số pha Trăng mới đã qua kể từ 1900-01-01 00:00 +0000 thành điểm
   * Sóc tương ứng.
   *
   * Bộ chuyển đổi này hữu ích khi muốn chuyển tiếp một điểm Sóc đã biết thành điểm Sóc mới dễ
   * dàng và nhanh chóng.
   */
  convert(input: Input): NewMoonPhase {
    const { offset, total } = input;

    return {
      jdn: this._truephase(total),
      total,
      offset,
    };
  }
}
