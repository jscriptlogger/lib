import { arrayStartsWith } from './utilities';

export interface ILoggerConsole {
  log(...data: unknown[]): void;
  debug(...data: unknown[]): void;
  error(...data: unknown[]): void;
}

export interface ILogger extends ILoggerConsole {
  at(...name: string[]): ILogger;
}

const separator = '/';

export interface ILoggerOptions {
  root: Logger | null;
  console: ILoggerConsole;
  /**
   * no matter what callbacks
   */
  callbacks: ILoggerConsole | null;
}

function keyToString(key: string[]) {
  return key.join(separator);
}

export function checkPermission(set: Set<string>, name: string[]) {
  for (const d of set) {
    if (arrayStartsWith(name, d.split(separator))) {
      return true;
    }
  }
  return false;
}

export enum LogLevel {
  None = 0,
  Error = 1,
  Log = 2,
  Debug = 3,
}

export default class Logger implements ILogger {
  readonly #children = new Map<string, Logger>();
  readonly #name;
  readonly #options: ILoggerOptions;
  readonly #logLevel;
  readonly #permissions = {
    disabled: new Set<string>(),
    enabled: new Set<string>(),
  };
  public constructor(
    name: string | string[],
    options: ILoggerOptions & {
      logLevel?: LogLevel;
    }
  ) {
    this.#name = Array.isArray(name) ? name : [name];
    this.#logLevel = options.logLevel ?? LogLevel.Error;
    this.#options = {
      callbacks: options.callbacks,
      root: options.root,
      console: options.console,
    };
  }
  public log(...args: unknown[]) {
    this.#maybePrependName(args);
    this.#options.callbacks?.log(...args);
    if (!this.#enabled(LogLevel.Log)) {
      return;
    }
    this.#options.console.log(...args);
  }
  public error(...args: unknown[]) {
    this.#maybePrependName(args);
    this.#options.callbacks?.error(...args);
    if (!this.#enabled(LogLevel.Error)) {
      return;
    }
    this.#options.console.error(...args);
  }
  public debug(...args: unknown[]) {
    this.#maybePrependName(args);
    this.#options.callbacks?.debug(...args);
    if (!this.#enabled(LogLevel.Debug)) {
      return;
    }
    this.#options.console.debug(...args);
  }
  public disable(...name: string[]) {
    this.#permissions.disabled.add(keyToString([...this.#name, ...name]));
  }
  public enable(...name: string[]) {
    this.#permissions.enabled.add(keyToString([...this.#name, ...name]));
  }
  public at(...name: string[]) {
    const key = [...this.#name, ...name];
    const keyAsString = keyToString(key);
    const root = this.#root();
    let logger = root.#children.get(keyAsString);
    if (!logger) {
      logger = new Logger(key, {
        ...this.#options,
        root,
      });
      root.#children.set(keyAsString, logger);
    }
    return logger;
  }
  #root() {
    return this.#options.root ?? this;
  }
  #enabled(logLevel: LogLevel) {
    const root = this.#root();
    let result = logLevel <= this.#root().#logLevel;
    if (checkPermission(root.#permissions.disabled, this.#name)) {
      result = result && checkPermission(root.#permissions.enabled, this.#name);
    }
    return result;
  }
  #maybePrependName(args: unknown[]) {
    const [firstArg] = args;
    if (typeof firstArg === 'string') {
      args[0] = `${keyToString(this.#name)}: ${firstArg}`;
    }
  }
}
