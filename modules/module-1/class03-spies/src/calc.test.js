import Calc from './calc';
import sinon from 'sinon';
import { deepStrictEqual } from 'assert';

(async () => {
  const calc = new Calc();
  const spy = sinon.spy(calc, calc.pow.name);
  const result = calc.pow(4, 4);
  const expectCallCount = 4;
  deepStrictEqual(spy.callCount, expectCallCount);
  deepStrictEqual(result, 256);
})();
