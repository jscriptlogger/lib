import Logger, { ILoggerOptions } from '../src';

export default class LoggerBrowser extends Logger {
  public constructor(
    name: string | string[],
    options: Partial<ILoggerOptions> = {}
  ) {
    super(name, {
      root: null,
      callbacks: null,
      ...options,
      console: window.console,
    });
  }
}
