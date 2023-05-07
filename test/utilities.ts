import { Suite } from 'sarg';
import { arrayStartsWith } from '../src/utilities';
import { expect } from 'chai';

const suite = new Suite();

suite.test(
  'arrayStartsWith: it should check if start of the left array, matches the whole right array',
  () => {
    expect(arrayStartsWith(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.ok;
    expect(arrayStartsWith(['a', 'b', 'c'], ['a', 'b', '1'])).to.not.be.ok;
    expect(arrayStartsWith(['a', 'b', 'c', 'd'], ['a', 'b', 'c'])).to.be.ok;
    expect(arrayStartsWith(['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'c'])).to.be
      .ok;
  }
);

export default suite;
