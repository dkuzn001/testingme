// PolyWrite content script
import { debounce } from './utils/debounce.js';
import { detectLanguage } from './utils/detectLanguage.js';

let overlay;
let activeElement;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.id = 'polywrite-overlay';
  overlay.className = 'shadow-lg rounded-lg p-2 bg-white max-w-xs text-gray-900';
  overlay.style.position = 'absolute';
  overlay.style.zIndex = 10000;
  overlay.innerHTML = '<div id="pw-errors" class="text-sm"></div>' +
    '<button id="pw-improve" class="mt-2 text-blue-600 underline">'+
    chrome.i18n.getMessage('improve')+'</button>' +
    '<button id="pw-rewrite" class="mt-2 ml-2 text-blue-600 underline">'+
    chrome.i18n.getMessage('rewrite')+'</button>';
  document.body.appendChild(overlay);
  overlay.style.display = 'none';
  document.getElementById('pw-improve').addEventListener('click', improveText);
  document.getElementById('pw-rewrite').addEventListener('click', rewriteText);
}

function positionOverlay() {
  if (!activeElement) return;
  const rect = activeElement.getBoundingClientRect();
  overlay.style.top = `${rect.bottom + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.display = 'block';
}

async function checkText() {
  const text = activeElement.value;
  const language = detectLanguage(text);
  const response = await chrome.runtime.sendMessage({
    type: 'check-text',
    text,
    language,
  });
  if (!response.ok) return;
  const errors = response.data.matches || [];
  const container = document.getElementById('pw-errors');
  container.innerHTML = '';
  errors.forEach(m => {
    const item = document.createElement('div');
    item.className = 'cursor-pointer hover:bg-gray-100 rounded px-1';
    item.textContent = m.message + ' → ' + (m.replacements[0]?.value || '');
    item.addEventListener('click', () => applySuggestion(m));
    container.appendChild(item);
  });
  positionOverlay();
}

function applySuggestion(match) {
  if (!match.replacements.length) return;
  const start = match.offset;
  const end = match.offset + match.length;
  activeElement.value =
    activeElement.value.slice(0, start) +
    match.replacements[0].value +
    activeElement.value.slice(end);
}

async function improveText() {
  const text = activeElement.value;
  const response = await chrome.runtime.sendMessage({ type: 'check-text', text });
  if (!response.ok) return;
  const matches = response.data.matches || [];
  let improved = text;
  matches.reverse().forEach(m => {
    if (m.replacements[0]) {
      improved = improved.slice(0, m.offset) + m.replacements[0].value + improved.slice(m.offset + m.length);
    }
  });
  activeElement.value = improved;
  overlay.style.display = 'none';
}

async function rewriteText() {
  const text = activeElement.value;
  const response = await chrome.runtime.sendMessage({ type: 'rewrite-text', text });
  if (!response.ok) return;
  activeElement.value = response.text;
  overlay.style.display = 'none';
}

const handleKeyup = debounce(() => {
  if (!activeElement) return;
  checkText();
}, 500);

function attachListeners(el) {
  el.addEventListener('keyup', handleKeyup);
  el.addEventListener('focus', () => {
    activeElement = el;
    if (!overlay) createOverlay();
  });
  el.addEventListener('blur', () => {
    overlay && (overlay.style.display = 'none');
  });
}

document.querySelectorAll('input[type="text"], textarea').forEach(attachListeners);
const observer = new MutationObserver(() => {
  document.querySelectorAll('input[type="text"], textarea').forEach(el => {
    if (!el.dataset.polywriteAttached) {
      el.dataset.polywriteAttached = '1';
      attachListeners(el);
    }
  });
});
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'popup-stats') {
    sendResponse({
      chars: activeElement ? activeElement.value.length : 0,
      errors: document.getElementById('pw-errors')?.childElementCount || 0,
    });
  }
});
