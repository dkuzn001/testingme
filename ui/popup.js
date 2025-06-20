const langSelect = document.getElementById('lang');
const stats = document.getElementById('stats');

const LANGS = [
  { code: 'auto', label: 'Auto' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
  { code: 'pl', label: 'Polski' },
];

LANGS.forEach(l => {
  const opt = document.createElement('option');
  opt.value = l.code;
  opt.textContent = l.label;
  langSelect.appendChild(opt);
});

chrome.storage.sync.get('settings', (res) => {
  const language = res.settings?.language || 'auto';
  langSelect.value = language;
});

langSelect.addEventListener('change', () => {
  chrome.storage.sync.get('settings', (res) => {
    const s = Object.assign({}, res.settings, { language: langSelect.value });
    chrome.storage.sync.set({ settings: s });
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { type: 'popup-stats' }, (res) => {
    if (res) stats.textContent = `${res.chars} chars, ${res.errors} errors`;
  });
});
