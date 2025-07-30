// Content script for HackSky AI Detector

interface PageContent {
  title: string
  text: string
  url: string
  timestamp: Date
}

class ContentAnalyzer {
  private isAnalyzing = false

  constructor() {
    this.init()
  }

  private init() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.type === 'ANALYZE_PAGE') {
        this.analyzeCurrentPage().then(sendResponse)
        return true
      }
    })

    // Auto-scan if enabled
    this.checkAutoScan()
  }

  private async checkAutoScan() {
    chrome.storage.local.get(['autoScan'], (result) => {
      if (result.autoScan) {
        setTimeout(() => {
          this.analyzeCurrentPage()
        }, 2000) // Wait for page to load
      }
    })
  }

  private async analyzeCurrentPage(): Promise<any> {
    if (this.isAnalyzing) {
      return { error: 'Analysis already in progress' }
    }

    this.isAnalyzing = true

    try {
      const content = this.extractPageContent()
      const analysis = await this.performAnalysis(content)
      
      this.isAnalyzing = false
      return { success: true, analysis }
    } catch (error) {
      this.isAnalyzing = false
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  private extractPageContent(): PageContent {
    const title = document.title || ''
    const text = this.extractTextContent()
    const url = window.location.href

    return {
      title,
      text,
      url,
      timestamp: new Date()
    }
  }

  private extractTextContent(): string {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style')
    scripts.forEach(script => script.remove())

    // Get main content areas
    const contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content'
    ]

    let content = ''
    
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector)
      if (element) {
        content += element.textContent || ''
        break
      }
    }

    // Fallback to body content
    if (!content) {
      content = document.body.textContent || ''
    }

    // Clean up the text
    return content
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000) // Limit content length
  }

  private async performAnalysis(content: PageContent): Promise<any> {
    // Send to background script for analysis
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: 'SCAN_PAGE',
        content
      }, (response) => {
        resolve(response)
      })
    })
  }

  // Public method to trigger analysis from popup
  public async scanPage() {
    return this.analyzeCurrentPage()
  }
}

// Initialize the analyzer
const analyzer = new ContentAnalyzer()

// Expose to window for debugging
window.hackskyAnalyzer = analyzer 