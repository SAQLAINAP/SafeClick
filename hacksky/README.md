# SafeClick (AI Content & Fact Checker)

A modern browser extension to analyze web pages for AI-generated content and fact-checked claims. Features a crisp, modern UI with dark mode support.

## Features
- Detects AI-generated text and images
- Fact-checks claims on the page
- Modern, responsive popup UI
- Dark mode toggle

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Install dependencies
```bash
npm install
```

### Development build (with watch)
```bash
npm run dev
```

### Production build
```bash
npm run build
```

### Load the extension in Chrome
1. Build the project (`npm run build`).
2. Go to `chrome://extensions` in your browser.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the `public` directory.

## Project Structure
- `src/` - TypeScript/React source code
  - `background/` - Background scripts for the extension
  - `content/` - Content scripts injected into web pages
  - `popup/` - React components and entry point for the popup UI
    - `App.tsx` - Main popup UI component (modern, dark mode ready)
    - `index.tsx` - Popup React entry point
- `public/` - Static files and extension manifest
  - `background/` - Compiled background script
  - `content/` - Compiled content script
  - `popup/` - Compiled popup assets (HTML, JS, CSS)
    - `index.html` - Popup HTML
    - `popup.css` - Modern and dark mode styles
  - `manifest.json` - Chrome extension manifest
- `webpack.config.js` - Webpack configuration for bundling
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore rules
- `package.json` / `package-lock.json` - NPM dependencies

## How to Proceed

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Develop**
   - Edit files in `src/` for TypeScript/React code.
   - Use `npm run dev` for live development (auto-rebuilds on changes).
   - UI changes go in `src/popup/App.tsx` and `popup.css`.
3. **Build for production**
   ```bash
   npm run build
   ```
   - Output will be in the `public/` directory, ready for Chrome extension loading.
4. **Test**
   - Load the extension in Chrome via `chrome://extensions` > "Load unpacked" > select `public/`.
   - Test popup, background, and content scripts.
5. **Contribute**
   - Create new branches for features/bugfixes.
   - Open pull requests for review.
6. **Deploy**
   - After testing, zip the `public/` directory for Chrome Web Store submission.

---

For any questions or contributions, open an issue or pull request on the repository.

## License
MIT 