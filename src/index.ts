import { arrayStartsWith } from './utilities';

export interface ILogger {
  log(...data: unknown[]): void;
  error(...data: unknown[]): void;
}

const separator = '/';

export interface ILoggerOptions {
  root: Logger | null;
  console: ILogger;
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

export default class Logger implements ILogger {
  readonly #children = new Map<string, Logger>();
  readonly #name;
  readonly #options: ILoggerOptions;
  readonly #permissions = {
    disabled: new Set<string>(),
    enabled: new Set<string>(),
  };
  public constructor(name: string | string[], options: ILoggerOptions) {
    this.#name = Array.isArray(name) ? name : [name];
    this.#options = options;
  }
  public log(...args: unknown[]) {
    if (!this.#enabled()) {
      return;
    }
    this.#maybePrependName(args);
    this.#options.console.log(...args);
  }
  public error(...args: unknown[]) {
    if (!this.#enabled()) {
      return;
    }
    this.#maybePrependName(args);
    this.#options.console.error(...args);
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
  #enabled() {
    const root = this.#root();
    if (checkPermission(root.#permissions.disabled, this.#name)) {
      return checkPermission(root.#permissions.enabled, this.#name);
    }
    return true;
  }
  #maybePrependName(args: unknown[]) {
    const [firstArg] = args;
    if (typeof firstArg === 'string') {
      args[0] = `${keyToString(this.#name)}: ${firstArg}`;
    }
  }
}
