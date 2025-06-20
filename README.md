# PolyWrite Chrome Extension

PolyWrite helps compose well‑formed text in different languages by checking grammar and style.

![screenshot](docs/screenshot.png)

## Build & Install
1. `npm install`
2. `npm test`
3. `npm run build` to package `polywrite.zip` (works on Windows/macOS/Linux without additional tools)
4. Open `chrome://extensions` and enable Developer Mode
5. Choose **Load unpacked** and select this folder

To enable AI rewriting, set your OpenAI API key in the extension options.

The extension will appear with a feather icon. Click it to open the popup and choose your language.

## Privacy Policy
Text is sent to the LanguageTool Public API while typing and to OpenAI only when the rewrite feature is used. No data is stored except settings (language, custom API URL, OpenAI key) via `chrome.storage.sync`.
