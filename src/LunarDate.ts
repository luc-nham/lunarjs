import { DateToSimpleDateTime } from "./converters/DateToSimpleDateTime";
import { GregToJd } from "./converters/GregToJd";
import { JdToLunar } from "./converters/JdToLunar";
import { LunarToJd } from "./converters/LunarToJd";
import {
  BasedOnOffset,
  LunarDate as LunarDateInterface,
  LunarUnsafeInput,
  SimpleDateTime,
  SimpleLunarDateTime,
  ToFixedOuput,
} from "./types";

/**
 * A Lunar date time class
 */
export class LunarDate implements LunarDateInterface {
  private jd: number = 0;
  private lunar?: SimpleLunarDateTime;
  private options: ToFixedOuput & BasedOnOffset = {
    fixed: 6,
    offset: 0,
  };

  constructor(
    date?: Partial<LunarUnsafeInput> | number,
    opts: Partial<ToFixedOuput & BasedOnOffset> = {},
  ) {
    this.options = { ...this.options, ...opts };

    if (date) {
      this.jd =
        typeof date !== "number"
          ? new LunarToJd(date, this.options).getOutput()
          : date;
    } else {
      new DateToSimpleDateTime().forward((o) => {
        this.options = { ...this.options, ...{ offset: o.offset } };
        this.jd = new GregToJd(o, { offset: o.offset }).getOutput();
      });
    }
  }

  protected get<K extends keyof SimpleLunarDateTime>(
    k: K,
  ): SimpleLunarDateTime[K] {
    if (!this.lunar) {
      this.lunar = new JdToLunar(this.jd, this.options).getOutput();
    }

    return this.lunar[k];
  }

  /**
   * @inheritdoc
   */
  getDay(): number {
    return this.get("day");
  }

  /**
   * @inheritdoc
   */
  getMonth(): number {
    return this.get("month");
  }

  /**
   * @inheritdoc
   */
  getFullYear(): number {
    return this.get("year");
  }

  /**
   * @inheritdoc
   */
  getHours(): number {
    return this.get("hour");
  }

  /**
   * @inheritdoc
   */
  getMinutes(): number {
    return this.get("minute");
  }

  /**
   * @inheritdoc
   */
  getSeconds(): number {
    return this.get("second");
  }

  /**
   * @inheritdoc
   */
  getTimezoneOffset(): number {
    return this.options.offset;
  }

  /**
   * @inheritdoc
   */
  getTime(): number {
    return Math.floor((this.get("jd") - 2440587.5) * 86400 * 1000);
  }

  /**
   * @inheritdoc
   */
  getJdn(): number {
    return this.get("jd");
  }

  /**
   * @inheritdoc
   */
  isLeapYear(): boolean {
    return this.get("leap").month !== 0;
  }

  /**
   * @inheritdoc
   */
  isLeapMonth(): boolean {
    return this.get("leap").current;
  }

  /**
   * @inheritdoc
   */
  getLeapMonth(): number {
    return this.get("leap").month;
  }

  /**
   * Quick create current Lunar date time
   */
  public static now() {
    return LunarDate.fromDate(new Date());
  }

  /**
   * Create Lunar date time form Javascript Date or Simple Date Time interfaces
   */
  public static fromDate(
    date: Date | Partial<SimpleDateTime>,
    options: Partial<ToFixedOuput & BasedOnOffset> = {},
  ) {
    const opts = options;
    const i =
      date instanceof Date
        ? new DateToSimpleDateTime(date).forward((out) => {
            opts.offset = out.offset;
            return out;
          })
        : date;

    return new GregToJd(i, opts).forward((jd) => new this(jd, opts));
  }
}
