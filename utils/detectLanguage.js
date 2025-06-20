/**
 * Very naive language detection based on characters.
 * @param {string} text
 * @returns {string} ISO 639-1 code
 */
export function detectLanguage(text) {
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  if (/[\u0105\u017c\u015b]/i.test(text)) return 'pl';
  return 'en';
}
