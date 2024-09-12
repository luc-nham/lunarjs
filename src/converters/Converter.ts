import { Option } from "../types";

/**
 * A root abstract converter
 */
export abstract class Converter<Input, Ouput, O extends Option> {
  /**
   * The input value
   */
  private input: Input;

  /**
   * An object to store options that effects to output value
   */
  private option: O;

  /**
   * Create new converter. The input and options can be specified via the constructor
   *
   * @param inp
   * @param opt
   */
  constructor(inp?: Input, opt?: Partial<O>) {
    this.input = this._defaultInput();
    this.option = this._defaultOptions();

    if (inp) {
      this.input = inp;
    }

    if (opt) {
      this.option = { ...this.option, ...opt };
    }
  }

  /**
   * Create ouput
   *
   * @param input
   */
  protected abstract _makeOuput(input: Input): Ouput;

  /**
   * Define default options for output
   */
  protected abstract _defaultOptions(): O;

  /**
   * Define default input
   */
  protected abstract _defaultInput(): Input;

  /**
   * Set - change input
   *
   * @param input
   */
  setInput(input: Partial<Input>) {
    if (typeof input === "object" && input !== null) {
      this.input = { ...this.input, ...input };
    } else {
      this.input = input;
    }

    return this;
  }

  /**
   * Set - change options to effect on ouput
   *
   * @param opt
   * @returns
   */
  setOption(opt: Partial<O>) {
    if (opt) {
      this.option = { ...this.option, ...opt };
    }

    return this;
  }

  /**
   * Get a list of options or a specific option
   */
  getOption(): O;
  getOption<K extends keyof O>(k: K): O[K];
  getOption<K extends keyof O>(k?: K): O[K] | O {
    if (!k) {
      return this.option;
    }

    return this.option[k];
  }

  isOptionEqual<K extends keyof O, C extends O[K]>(k: K, c: C) {
    return this.getOption(k) === c;
  }

  /**
   * Get input value
   */
  getInput(): Input {
    return this.input;
  }

  /**
   * Get ouput value
   */
  getOutput() {
    return this._makeOuput(this.getInput());
  }

  /**
   * Forward the output value to a callback function, useful when chaining converters is needed.
   */
  forward<F>(cb: (output: Ouput, option: O, input: Input) => F): F {
    return cb(this.getOutput(), this.getOption(), this.getInput());
  }

  /**
   * A brief usage of 'setInput' method
   */
  in(i: Partial<Input>) {
    return this.setInput(i);
  }

  /**
   * A brief usage of 'getOutPut' method
   */
  out() {
    return this.getOutput();
  }

  /**
   * A brief usage of 'forward' method
   */
  fw<F>(cb: (out: Ouput, opt: O, inp: Input) => F) {
    return cb(this.getOutput(), this.getOption(), this.getInput());
  }
}
