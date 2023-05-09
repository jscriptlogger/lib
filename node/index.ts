import Logger, { ILoggerOptions, LogLevel } from '../src';
import console from 'console';

export default class LoggerNode extends Logger {
  public constructor(
    name: string | string[],
    options: Partial<ILoggerOptions> & {
      logLevel?: LogLevel;
    } = {}
  ) {
    super(name, {
      root: null,
      console,
      ...options,
    });
  }
}
