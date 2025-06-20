const apiInput = document.getElementById('api');
const openAiInput = document.getElementById('openai');

chrome.storage.sync.get('settings', (res) => {
  const settings = res.settings || {};
  apiInput.value = settings.apiUrl || 'https://api.languagetool.org/v2/check';
  openAiInput.value = settings.openAiKey || '';
});

apiInput.addEventListener('change', () => {
  chrome.storage.sync.get('settings', (res) => {
    const s = Object.assign({}, res.settings, { apiUrl: apiInput.value });
    chrome.storage.sync.set({ settings: s });
  });
});

openAiInput.addEventListener('change', () => {
  chrome.storage.sync.get('settings', (res) => {
    const s = Object.assign({}, res.settings, { openAiKey: openAiInput.value });
    chrome.storage.sync.set({ settings: s });
  });
});
