import { detectLanguage } from '../utils/detectLanguage.js';

test('detects Russian', () => {
  expect(detectLanguage('привет')).toBe('ru');
});

test('detects Polish', () => {
  expect(detectLanguage('zażółć')).toBe('pl');
});

test('defaults to English', () => {
  expect(detectLanguage('hello')).toBe('en');
});
