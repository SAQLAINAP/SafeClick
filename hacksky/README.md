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
- `public/` - Static files and extension manifest
- `webpack.config.js` - Webpack configuration
- `tsconfig.json` - TypeScript configuration

## License
MIT 