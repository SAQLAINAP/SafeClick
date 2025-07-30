import React, { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, Info, Moon, Sun, Settings, Zap, Eye, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScanResult {
  id: string
  type: 'ai-generated' | 'fake-news' | 'suspicious' | 'safe'
  confidence: number
  description: string
  timestamp: Date
}

interface PageAnalysis {
  url: string
  title: string
  aiScore: number
  fakeNewsScore: number
  overallRisk: 'low' | 'medium' | 'high'
  results: ScanResult[]
}

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false)
  const [currentTab, setCurrentTab] = useState<'overview' | 'analysis' | 'settings'>('overview')
  const [isScanning, setIsScanning] = useState(false)
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null)

  useEffect(() => {
    // Load theme preference from storage
    chrome.storage.local.get(['theme'], (result) => {
      setIsDark(result.theme === 'dark')
    })

    // Apply theme to document
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    chrome.storage.local.set({ theme: newTheme ? 'dark' : 'light' })
  }

  const scanCurrentPage = async () => {
    setIsScanning(true)
    
    // Simulate scanning process
    setTimeout(() => {
      const mockAnalysis: PageAnalysis = {
        url: 'https://example.com',
        title: 'Example News Article',
        aiScore: 75,
        fakeNewsScore: 60,
        overallRisk: 'medium',
        results: [
          {
            id: '1',
            type: 'ai-generated',
            confidence: 85,
            description: 'Text patterns suggest AI-generated content',
            timestamp: new Date()
          },
          {
            id: '2',
            type: 'fake-news',
            confidence: 70,
            description: 'Claims lack credible sources',
            timestamp: new Date()
          }
        ]
      }
      setAnalysis(mockAnalysis)
      setIsScanning(false)
    }, 2000)
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
        {currentTab === 'overview' && (
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Current Page</h2>
                <button
                  onClick={scanCurrentPage}
                  disabled={isScanning}
                  className="btn-primary flex items-center space-x-2"
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
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">{analysis.aiScore}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">AI Generated</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-warning-600">{analysis.fakeNewsScore}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Fake News</div>
                    </div>
                  </div>
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
                  <div className="text-2xl font-bold text-success-600">24</div>
                  <div className="text-gray-600 dark:text-gray-400">Pages Scanned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-danger-600">3</div>
                  <div className="text-gray-600 dark:text-gray-400">Threats Detected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'analysis' && analysis && (
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
              <div className="space-y-3">
                {analysis.results.map((result) => (
                  <div key={result.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{result.type.replace('-', ' ')}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {result.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="space-y-4">
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
                Stay safe online with our advanced detection algorithms.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App 