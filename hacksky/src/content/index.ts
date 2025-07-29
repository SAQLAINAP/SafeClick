console.log("AI Content & Fact Checker content script loaded.");

// Extract visible text and images from the page
function extractPageContent() {
  // Get all visible text nodes
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.parentElement) return NodeFilter.FILTER_REJECT;
      const style = window.getComputedStyle(node.parentElement);
      if (style && style.visibility !== 'hidden' && style.display !== 'none') {
        const text = node.textContent?.trim();
        if (text && text.length > 20) return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_REJECT;
    }
  });
  let textContent = '';
  let node;
  while ((node = walker.nextNode())) {
    textContent += node.textContent + '\n';
  }

  // Get all images (src)
  const images = Array.from(document.images)
    .filter(img => img.width > 50 && img.height > 50)
    .map(img => img.src);

  return { textContent, images };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'extract_page_content') {
    sendResponse(extractPageContent());
  }
}); 