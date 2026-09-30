import React, { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, Info, Moon, Sun, Settings, Zap, Eye, BarChart3, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { analyzeWithGemini, type PageAnalysis, type PageContent } from '@/lib/gemini'

const FINDING_LABELS: Record<string, string> = {
  'ai-generated': 'AI Generated',
  'fake-news': 'Fake News',
  suspicious: 'Suspicious',
  safe: 'Looks Genuine',
}

interface Stats {
  pagesScanned: number
  threatsDetected: number
}

// Runs inside the target page via chrome.scripting, so it must be self-contained.
// Reads innerText (already excludes scripts, styles and hidden elements) and never mutates the page.
function extractPageContent(): PageContent {
  const selectors = ['article', 'main', '[role="main"]', '.post-content', '.entry-content', '.content']
  const root =
    selectors
      .map((s) => document.querySelector<HTMLElement>(s))
      .find((el) => el && el.innerText.trim().length > 200) || document.body
  return {
    title: document.title || '',
    url: location.href,
    text: root.innerText.replace(/\s+/g, ' ').trim().slice(0, 15000),
  }
}

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false)
  const [currentTab, setCurrentTab] = useState<'overview' | 'analysis' | 'settings'>('overview')
  const [isScanning, setIsScanning] = useState(false)
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const [stats, setStats] = useState<Stats>({ pagesScanned: 0, threatsDetected: 0 })

  useEffect(() => {
    chrome.storage.local.get(['theme', 'apiKey', 'pagesScanned', 'threatsDetected'], (result) => {
      setIsDark(result.theme === 'dark')
      setApiKey(result.apiKey || '')
      setStats({ pagesScanned: result.pagesScanned || 0, threatsDetected: result.threatsDetected || 0 })
    })
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    chrome.storage.local.set({ theme: newTheme ? 'dark' : 'light' })
  }

  const saveApiKey = () => {
    chrome.storage.local.set({ apiKey: apiKey.trim() }, () => {
      setKeySaved(true)
      setTimeout(() => setKeySaved(false), 2000)
    })
  }

  const scanCurrentPage = async () => {
    setError(null)
    if (!apiKey.trim()) {
      setError('Add your Gemini API key in Settings first.')
      setCurrentTab('settings')
      return
    }

    setIsScanning(true)
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.id) throw new Error('No active tab found.')

      let content: PageContent | undefined
      try {
        const [injection] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractPageContent })
        content = injection?.result as PageContent | undefined
      } catch {
        throw new Error("This page can't be scanned (browser pages and the Chrome Web Store are blocked).")
      }
      if (!content || content.text.length < 50) throw new Error('Not enough text on this page to analyze.')

      const result = await analyzeWithGemini(content, apiKey.trim())
      setAnalysis(result)

      const next: Stats = {
        pagesScanned: stats.pagesScanned + 1,
        threatsDetected: stats.threatsDetected + (result.overallRisk === 'low' ? 0 : 1),
      }
      setStats(next)
      chrome.storage.local.set(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed.')
    } finally {
      setIsScanning(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success-600 dark:text-success-400'
      case 'medium': return 'text-warning-600 dark:text-warning-400'
      case 'high': return 'text-danger-600 dark:text-danger-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'medium': return <AlertTriangle className="w-5 h-5 text-warning-600" />
      case 'high': return <AlertTriangle className="w-5 h-5 text-danger-600" />
      default: return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="w-96 h-[600px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-primary-600" />
          <h1 className="text-lg font-bold">HackSky AI Detector</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCurrentTab('overview')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors",
            currentTab === 'overview'
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setCurrentTab('analysis')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors",
            currentTab === 'analysis'
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Analysis
        </button>
        <button
          onClick={() => setCurrentTab('settings')}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors",
            currentTab === 'settings'
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto h-[480px]">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger-50 dark:bg-danger-900/20 text-sm text-danger-700 dark:text-danger-400">
            {error}
          </div>
        )}

        {currentTab === 'overview' && (
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Current Page</h2>
                <button
                  onClick={scanCurrentPage}
                  disabled={isScanning}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4" />
                  {isScanning ? 'Scanning...' : 'Scan Page'}
                </button>
              </div>

              {analysis ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level:</span>
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(analysis.overallRisk)}
                      <span className={cn("font-medium", getRiskColor(analysis.overallRisk))}>
                        {analysis.overallRisk.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/60 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">{analysis.aiScore}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">AI Generated</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/60 rounded-lg">
                      <div className="text-2xl font-bold text-warning-600">{analysis.fakeNewsScore}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Fake News</div>
                    </div>
                  </div>

                  {analysis.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.summary}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Click "Scan Page" to analyze the current webpage</p>
                </div>
              )}
            </div>

            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{stats.pagesScanned}</div>
                  <div className="text-gray-600 dark:text-gray-400">Pages Scanned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-danger-600">{stats.threatsDetected}</div>
                  <div className="text-gray-600 dark:text-gray-400">Threats Detected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'analysis' && (
          <div className="space-y-4">
            {analysis ? (
              <div className="card p-4">
                <h3 className="text-lg font-semibold mb-1">Detailed Analysis</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{analysis.title || analysis.url}</p>
                <div className="space-y-3">
                  {analysis.results.map((result, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{FINDING_LABELS[result.type] ?? result.type}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {result.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{result.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Scan a page to see the detailed findings here</p>
              </div>
            )}
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <KeyRound className="w-4 h-4 mr-2" />
                Gemini API Key
              </h3>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your key from aistudio.google.com"
                className="input mb-3"
              />
              <button onClick={saveApiKey} className="btn-primary w-full">
                {keySaved ? 'Saved' : 'Save Key'}
              </button>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Stored only in this browser. Page text is sent to Google Gemini only when you click Scan.
              </p>
            </div>

            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3">Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Dark Theme</span>
                  <button
                    onClick={toggleTheme}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      isDark ? "bg-primary-600" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        isDark ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                HackSky AI Detector helps you identify AI-generated content and potential fake news threats.
                Results come from an AI model and can be wrong, so treat them as a signal, not a verdict.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
