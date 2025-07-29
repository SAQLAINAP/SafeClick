import React, { useState, useEffect } from "react";

const mockAIContent = [
  {
    type: "text",
    content: "This is a sample paragraph that may be AI-generated.",
    confidence: 0.92,
  },
  {
    type: "image",
    content: "https://via.placeholder.com/150",
    confidence: 0.85,
  },
];

const mockClaims = [
  {
    claim: "The Eiffel Tower is in Berlin.",
    status: "False",
  },
  {
    claim: "Water boils at 100°C.",
    status: "True",
  },
  {
    claim: "The moon is made of cheese.",
    status: "Unverified",
  },
];

const statusColors: Record<string, string> = {
  True: "#4caf50",
  False: "#f44336",
  Unverified: "#ff9800",
};

const App = () => {
  const [state, setState] = useState<"initial" | "loading" | "report">("initial");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleRun = () => {
    setState("loading");
    setTimeout(() => {
      setState("report");
    }, 1500); // Simulate analysis delay
  };

  const handleRunAgain = () => {
    setState("initial");
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
      {state === "initial" && (
        <>
          <h2>AI Content & Fact Checker</h2>
          <p>
            Analyze this page for AI-generated content and fact-checked claims.
          </p>
          <button onClick={handleRun}>Run</button>
        </>
      )}
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
            {mockAIContent.length === 0 ? (
              <div style={{ color: "#888" }}>No AI-generated content found.</div>
            ) : (
              <ul>
                {mockAIContent.map((item, idx) => (
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
                      {(item.confidence * 100).toFixed(0)}% AI
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ marginBottom: 18 }}>
            <h4>Fact-Checked Claims</h4>
            {mockClaims.length === 0 ? (
              <div style={{ color: "#888" }}>No claims found.</div>
            ) : (
              <ul>
                {mockClaims.map((claim, idx) => (
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