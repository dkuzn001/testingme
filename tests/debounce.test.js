import { jest } from '@jest/globals';
import { debounce } from '../utils/debounce.js';

jest.useFakeTimers();

test('debounce delays function', () => {
  const fn = jest.fn();
  const deb = debounce(fn, 100);
  deb();
  expect(fn).not.toBeCalled();
  jest.advanceTimersByTime(100);
  expect(fn).toBeCalledTimes(1);
});
