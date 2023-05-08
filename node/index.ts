import Logger, { ILoggerOptions } from '../src';
import console from 'console';

export default class LoggerNode extends Logger {
  public constructor(
    name: string | string[],
    options: Partial<ILoggerOptions> = {}
  ) {
    super(name, {
      root: null,
      ...options,
      console,
    });
  }
}
