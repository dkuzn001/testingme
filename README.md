# PolyWrite Chrome Extension

PolyWrite helps compose well‑formed text in different languages by checking grammar and style.

![screenshot](docs/screenshot.png)

## Build & Install
1. `npm install`
2. `npm test`
3. `npm run build` to package `polywrite.zip`
4. Open `chrome://extensions` and enable Developer Mode
5. Choose **Load unpacked** and select this folder

The extension will appear with a feather icon. Click it to open the popup and choose your language.

## Privacy Policy
All text is sent to LanguageTool Public API only while typing. No data is stored except settings (language, custom API URL) via `chrome.storage.sync`.
