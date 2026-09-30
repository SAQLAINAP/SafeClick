# HackSky AI Detector

A sophisticated Chrome extension that proactively identifies and disrupts AI-generated fake content and honeytrap operations on the web.

## Features

- 🔍 **AI Content Detection**: Analyzes web pages for AI-generated content patterns
- 🚨 **Fake News Detection**: Identifies potential fake news and misinformation
- 🎨 **Modern UI**: Clean, responsive interface with dark/light theme support
- ⚡ **Real-time Analysis**: Instant scanning and analysis of web content
- 📊 **Detailed Reports**: Comprehensive analysis with confidence scores
- 🔧 **Customizable Settings**: User preferences and scanning options

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Extension**: Chrome Extension Manifest V3

## Project Structure

```
hacksky1/
├── src/
│   ├── popup/           # Extension popup UI (scan, results, settings)
│   ├── components/      # Reusable UI pieces
│   └── lib/             # Gemini client + utilities
├── public/
│   └── manifest.json    # Extension manifest (copied into dist/)
└── dist/                # Build output — load this folder in Chrome
```

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Loading the Extension

1. Build the project: `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder

### Gemini API Key

Scans are powered by Google Gemini (`gemini-2.5-flash`, set in `src/lib/gemini.ts`).
Get a free key at [aistudio.google.com](https://aistudio.google.com/apikey), open the
extension's **Settings** tab, paste it and click **Save Key**. The key is stored only in
your browser (`chrome.storage.local`) — never commit a key to this repo.

## Usage

1. **Install the Extension**: Load the extension in Chrome
2. **Navigate to a Webpage**: Visit any website you want to analyze
3. **Click the Extension Icon**: Open the popup to see the interface
4. **Scan the Page**: Click "Scan Page" to analyze the content
5. **Review Results**: View detailed analysis and risk assessments

## Features in Detail

### AI Content Detection
- Analyzes text patterns and writing styles
- Identifies AI-generated content markers
- Provides confidence scores for detection

### Fake News Detection
- Checks for credible sources and citations
- Analyzes claim consistency
- Identifies sensationalist language patterns

### Risk Assessment
- **Low Risk**: Content appears genuine
- **Medium Risk**: Some suspicious indicators
- **High Risk**: Strong evidence of AI generation or fake news

### Settings
- **Gemini API Key**: Your own key, stored locally
- **Theme Toggle**: Switch between light and dark themes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Integration with external fact-checking APIs
- [ ] Machine learning model for improved detection
- [ ] Browser action badge with real-time alerts
- [ ] Export analysis reports
- [ ] Custom detection rules
- [ ] Multi-language support

## Security

This extension:
- Reads a page only when you click **Scan Page** (via `activeTab` — no content script runs on every site)
- Never modifies the page it scans
- Sends the page's visible text to Google Gemini for analysis, and nothing else
- Does not track your browsing history

## Support

For issues and feature requests, please open an issue on GitHub. 