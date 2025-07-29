import React, { useState, useEffect } from "react";

// Helper to call Gemini AI API
async function validateWithGemini(text: string, images: string[]): Promise<any> {
  // Replace with your Gemini API endpoint and key
  const apiKey = "AIzaSyDjD8nmMVP5rLw-20D56v6i0_H9nDVjOtM";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const prompt = `Analyze the following web page content for AI-generated text, images, and fact-check the claims.\n\nContent:\n${text}\n\nImages: ${images.join(", ")}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Gemini API failed");
  return res.json();
}

// Helper to call Claude Sonnet API (Anthropic)
/*
async function validateWithClaude(text: string, images: string[]): Promise<any> {
  // Replace with your Anthropic API key
  const apiKey = "YOUR_ANTHROPIC_API_KEY";
  const url = "https://api.anthropic.com/v1/messages";
  const prompt = `Analyze the following web page content for AI-generated text, images, and fact-check the claims.\n\nContent:\n${text}\n\nImages: ${images.join(", ")}`;
  const body = {
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }]
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Claude API failed");
  return res.json();
}
*/

const App = () => {
  const [state, setState] = useState<"initial" | "loading" | "report">("initial");
  const [darkMode, setDarkMode] = useState(false);
  const [aiContent, setAIContent] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Auto-parse on popup open
  useEffect(() => {
    handleRun();
    // eslint-disable-next-line
  }, []);

  const handleRun = async () => {
    setState("loading");
    setError(null);
    setAIContent([]);
    setClaims([]);
    try {
      // Get page content from content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id!, { type: "extract_page_content" });
      const { textContent, images } = response;
      // Only use Gemini
      let result;
      try {
        result = await validateWithGemini(textContent, images);
      } catch (e) {
        setError("Gemini validation failed.");
        setState("initial");
        return;
      }
      // Log the analysis result to the page console for debugging
      // This will log both aiContent and claims
      console.log("Gemini Analysis Result:", result);
      // Parse result (this will depend on your API response structure)
      // For demo, just show the raw result
      setAIContent(result.aiContent || []);
      setClaims(result.claims || []);
      setState("report");
    } catch (e) {
      setError("Failed to analyze page content.");
      setState("initial");
    }
  };

  const handleRunAgain = () => {
    handleRun();
  };

  return (
    <div>
      <div className="toggle-switch">
        <input
          id="darkmode-toggle"
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode((d) => !d)}
        />
        <label htmlFor="darkmode-toggle">
          {darkMode ? "Dark Mode" : "Light Mode"}
        </label>
      </div>
      {error && <div style={{ color: "#f44336", marginBottom: 10 }}>{error}</div>}
      {state === "loading" && (
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <div className="spinner" />
          <p style={{ color: "var(--color-primary)", fontWeight: 500 }}>Analyzing page...</p>
        </div>
      )}
      {state === "report" && (
        <>
          <h3>Analysis Report</h3>
          <div style={{ marginBottom: 18 }}>
            <h4>AI Content Detected</h4>
            {aiContent.length === 0 ? (
              <div style={{ color: "#888" }}>No AI-generated content found.</div>
            ) : (
              <ul>
                {aiContent.map((item, idx) => (
                  <li key={idx}>
                    {item.type === "text" ? (
                      <span className="badge text">AI Text</span>
                    ) : (
                      <span className="badge image">AI Image</span>
                    )}
                    {item.type === "text" ? (
                      <span>{item.content}</span>
                    ) : (
                      <img src={item.content} alt="AI Detected" />
                    )}
                    <span style={{ marginLeft: 'auto', color: '#888', fontSize: 13 }}>
                      {item.confidence ? `${(item.confidence * 100).toFixed(0)}% AI` : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ marginBottom: 18 }}>
            <h4>Fact-Checked Claims</h4>
            {claims.length === 0 ? (
              <div style={{ color: "#888" }}>No claims found.</div>
            ) : (
              <ul>
                {claims.map((claim, idx) => (
                  <li key={idx}>
                    <span style={{ color: "var(--color-text)", marginRight: 8 }}>{claim.claim}</span>
                    <span className={`status ${claim.status}`}>{claim.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="alt" onClick={handleRunAgain}>
            Run Again
          </button>
        </>
      )}
    </div>
  );
};

export default App; 