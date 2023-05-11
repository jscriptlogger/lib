# jscriptlogger/lib

## Description

A beautiful and lightweight wrapper for the old and good `console.log`.

## Usage

```ts
import Logger from '@jscriptlogger/lib';

const logger = new Logger(['A'], {
  root: null,
  logLevel: LogLevel.Log,
  console,
});

logger.at('B').log('this is a log');
// the same as
console.log('A/B: this is a log');
```

## Installation

```
yarn add @jscriptlogger/lib
```
