import React from "react";

export default function DBMSQueryOptimizationCoding({
  codingProblem,
  selectedLanguage,
  setSelectedLanguage,
  code,
  setCode,
  codeResult,
  runCode,
  mode
}) {
  return (
    <section className="card">
      <h2>Coding Practice</h2>
      <p>
        Practice {mode.toUpperCase()} query optimization concepts in your preferred language.
        JavaScript execution works now. Other languages can be enabled later with Judge0.
      </p>

      <div className="coding-problem">
        <h3>{codingProblem.title}</h3>
        <p>{codingProblem.description}</p>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              color: "#e5e7eb",
              fontWeight: 600
            }}
          >
            Select Language
          </label>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="lab-select"
            style={{ minWidth: "220px" }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={14}
          style={{
            width: "100%",
            fontFamily: "monospace",
            color: "#000000"
          }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn secondary" onClick={runCode}>
            Run Code
          </button>
        </div>

        {selectedLanguage !== "javascript" && (
          <p style={{ marginTop: 12, color: "#fbbf24", fontWeight: 600 }}>
            Execution for {selectedLanguage.toUpperCase()} will be enabled later with Judge0.
          </p>
        )}

        {codeResult && (
          <p className="result" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
            {codeResult}
          </p>
        )}
      </div>
    </section>
  );
}