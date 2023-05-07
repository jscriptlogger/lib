import { Suite } from 'sarg';
import LoggerNode, { checkPermission } from '../src';
import { spy } from 'sinon';
import { expect } from 'chai';

const suite = new Suite();

function createSpiedConsole() {
  return {
    error: spy((..._: unknown[]) => {}),
    log: spy((..._: unknown[]) => {}),
  };
}

suite.test('it should append name if first argument is a string', () => {
  const customConsole = createSpiedConsole();
  const logger = new LoggerNode(['a'], {
    root: null,
    console: customConsole,
  });
  logger.log('A');
  expect(customConsole.log.calledWithExactly('a: A')).to.be.ok;
});

suite.test('it should deal with deep loggers', () => {
  const customConsole = createSpiedConsole();
  const logger = new LoggerNode(['A'], {
    root: null,

    console: customConsole,
  });
  logger.at('1', '2', '3').at('4', '5', '6').log('A');
  expect(customConsole.log.calledWithExactly('A/1/2/3/4/5/6: A')).to.be.ok;
});

suite.test(
  'it should return the same logger in case is called with the same arguments twice',
  () => {
    const customConsole = createSpiedConsole();
    const logger = new LoggerNode(['A'], {
      root: null,
      console: customConsole,
    });
    expect(logger.at('1', '2', '3')).to.be.equal(logger.at('1', '2', '3'));
    expect(logger.at('1', '2', '3').at('4', '5', '6')).to.be.equal(
      logger.at('1', '2', '3', '4', '5', '6')
    );
  }
);

suite.test('it should disable specific long path', () => {
  const customConsole = createSpiedConsole();
  const logger = new LoggerNode(['A1'], {
    root: null,
    console: customConsole,
  });
  logger.disable('B1', 'C1', 'D1');
  logger.at('B1', 'C1', 'D1').log('X');
  expect(customConsole.log.notCalled);
});

suite.test(
  'checkPermission: it should disable a whole path, but enable a specific one inside of that one',
  () => {
    expect(
      checkPermission(new Set(['A1/B1/C1/D1']), ['A1', 'B1', 'C1', 'D1', 'E1'])
    ).to.be.ok;
    expect(checkPermission(new Set(['A1/B1/C1/D1']), ['A1', 'B1', 'C1', 'D1']))
      .to.be.ok;
  }
);

suite.test(
  'Logger#log: it should disable a whole path, but enable a specific one inside of that one',
  () => {
    const customConsole = createSpiedConsole();
    const logger = new LoggerNode(['A1'], {
      root: null,
      console: customConsole,
    });
    logger.disable('B1', 'C1', 'D1');
    logger.enable('B1', 'C1', 'D1', 'E1');
    logger.at('B1', 'C1', 'D1').log('X');
    expect(customConsole.log.notCalled).to.be.ok;
    logger.at('B1', 'C1', 'D1', 'E1').log('Y');
    expect(customConsole.log.calledOnce).to.be.ok;
    expect(customConsole.log.calledWithExactly('A1/B1/C1/D1/E1: Y')).to.be.ok;
  }
);

suite.test(
  'Logger#log: it should not append logger name if first argument is a string',
  () => {
    const customConsole = createSpiedConsole();
    const logger = new LoggerNode(['A0'], {
      root: null,
      console: customConsole,
    });
    logger.log(1);
    logger.log(2);
    logger.log(3);
    expect(customConsole.log.calledWithExactly(1)).to.be.ok;
    expect(customConsole.log.calledWithExactly(2)).to.be.ok;
    expect(customConsole.log.calledWithExactly(3)).to.be.ok;
  }
);
suite.test('Logger#error: it should handle disabled calls', () => {
  const customConsole = createSpiedConsole();
  const logger = new LoggerNode(['A0'], {
    root: null,
    console: customConsole,
  });
  logger.disable();
  logger.error(3);
  expect(customConsole.error.notCalled).to.be.ok;
  expect(customConsole.log.notCalled).to.be.ok;
});

suite.test('Logger#error: it should prepend logger name', () => {
  const customConsole = createSpiedConsole();
  const logger = new LoggerNode(['A0'], {
    root: null,
    console: customConsole,
  });
  logger.at('B0', 'C0', 'D0', 'E0').error('XXXXX');
  expect(customConsole.error.calledOnceWithExactly('A0/B0/C0/D0/E0: XXXXX'));
});

suite.test(
  'Logger#constructor: it should construct Logger class by passing a string to the first argument',
  () => {
    new LoggerNode('A0', {
      root: null,
      console: createSpiedConsole(),
    });
  }
);

export default suite;
