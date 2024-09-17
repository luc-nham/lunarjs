import { padZeroLeft } from "../helper";
import { LunarToStringFormater, SimpleLunarDateTime } from "../types";

export class BaseLunarToStringFormater implements LunarToStringFormater {
  constructor(
    private lunar: SimpleLunarDateTime,
    private offset = 0,
  ) {}

  protected _offsetToString(o: number) {
    const h = o / 60 / 60;
    const h2 = h < 0 ? Math.round(h) : Math.floor(h);
    const m = Math.abs(h - h2);
    const m2 = m * 60;
    const out = `${padZeroLeft(h2)}${padZeroLeft(m2)}`;

    return h >= 0 ? `+${out}` : out;
  }

  /**
   * @inheritdoc
   */
  toDateString(): string {
    const { day, month, year } = this.lunar;

    return `${padZeroLeft(year, 4)}-${padZeroLeft(month)}-${padZeroLeft(day)}`;
  }

  /**
   * @inheritdoc
   */
  toTimeString(): string {
    const { hour, minute, second } = this.lunar;

    return `${padZeroLeft(hour)}:${padZeroLeft(minute)}:${padZeroLeft(second)} GMT${this._offsetToString(this.offset)}`;
  }

  /**
   * @inheritdoc
   */
  toString(): string {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
}
