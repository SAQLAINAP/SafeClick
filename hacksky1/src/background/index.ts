// Background service worker for HackSky AI Detector

chrome.runtime.onInstalled.addListener(() => {
  console.log('HackSky AI Detector installed')
  
  // Set default settings
  chrome.storage.local.set({
    theme: 'light',
    autoScan: false,
    notifications: true
  })
})

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SCAN_PAGE') {
    // Handle page scanning request
    console.log('Scanning page:', sender.tab?.url)
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysis = {
        url: sender.tab?.url,
        aiScore: Math.floor(Math.random() * 100),
        fakeNewsScore: Math.floor(Math.random() * 100),
        risk: Math.random() > 0.5 ? 'high' : 'low'
      }
      
      sendResponse({ success: true, analysis })
    }, 1000)
    
    return true // Keep message channel open for async response
  }
  
  if (request.type === 'GET_SETTINGS') {
    chrome.storage.local.get(['theme', 'autoScan', 'notifications'], (result) => {
      sendResponse(result)
    })
    return true
  }
  
  if (request.type === 'UPDATE_SETTINGS') {
    chrome.storage.local.set(request.settings, () => {
      sendResponse({ success: true })
    })
    return true
  }
})

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_POPUP' })
  }
}) 