/**
 * Service worker handling API requests and settings storage.
 * @file Service Worker for PolyWrite
 */

// Default settings
const DEFAULT_SETTINGS = {
  language: 'auto', // auto detect
  apiUrl: 'https://api.languagetool.org/v2/check',
};

/** Fetch with timeout wrapper */
function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  return Promise.race([
    fetch(resource, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    ),
  ]);
}

// Initialize settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('settings', (res) => {
    if (!res.settings) {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    }
  });
});

/** Handle grammar check request */
async function handleCheck(request, sender) {
  const { text, improve } = request;
  const { settings } = await chrome.storage.sync.get('settings');
  const { language, apiUrl } = Object.assign({}, DEFAULT_SETTINGS, settings);
  const params = new URLSearchParams({
    text,
    language: language === 'auto' ? 'auto' : language,
  });
  try {
    if (!navigator.onLine) throw new Error('offline');
    const res = await fetchWithTimeout(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    if (!res.ok) throw new Error('api-error');
    const data = await res.json();
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'check-text') {
    handleCheck(request).then(sendResponse);
    return true; // indicate async
  }
});
