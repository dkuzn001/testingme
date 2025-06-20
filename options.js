const apiInput = document.getElementById('api');

chrome.storage.sync.get('settings', (res) => {
  apiInput.value = res.settings?.apiUrl || 'https://api.languagetool.org/v2/check';
});

apiInput.addEventListener('change', () => {
  chrome.storage.sync.get('settings', (res) => {
    const s = Object.assign({}, res.settings, { apiUrl: apiInput.value });
    chrome.storage.sync.set({ settings: s });
  });
});
