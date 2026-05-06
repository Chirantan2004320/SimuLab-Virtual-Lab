// DBMSQueryOptimizationCoding.jsx

import React from "react";
import {
  Code2,
  Play,
  Database,
  GitMerge,
  Filter,
  Sparkles,
  Wrench
} from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" }
];

export default function DBMSQueryOptimizationCoding({
  codingProblems,
  selectedLanguage,
  setSelectedLanguage,
  codes,
  results,
  handleCodeChange,
  runCode,
  analyzeCode,
  correctCode,
  mode
}) {
  const modeIcon =
    mode === "selection" ? (
      <Filter size={18} />
    ) : mode === "projection" ? (
      <Database size={18} />
    ) : (
      <GitMerge size={18} />
    );

  const modeLabel =
    mode === "selection"
      ? "Selection Pushdown"
      : mode === "projection"
      ? "Projection Pushdown"
      : "Join Order Optimization";

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice {modeLabel} using structured query-plan answers.
          </p>
        </div>
      </div>

      {codingProblems.map((problem, index) => (
        <div key={index} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <div className="modern-coding-tag">
                {modeIcon}
                <span>{modeLabel}</span>
              </div>

              <h3>
                Problem {index + 1}: {problem.title}
              </h3>
              <p>{problem.description}</p>
            </div>

            {index === 0 && (
              <div className="coding-language-wrap">
                <label className="sorting-label">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="sorting-select"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <textarea
            value={codes[index] || ""}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            rows={14}
            className="coding-textarea-upgraded"
            placeholder="Write your optimized query-plan answer here..."
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => runCode(index)}
            >
              <Play size={16} />
              Run Code
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => analyzeCode(index)}
            >
              <Sparkles size={16} />
              Analyze Query
            </button>

            <button
              className="sim-btn sim-btn-danger"
              onClick={() => correctCode(index)}
            >
              <Wrench size={16} />
              Correct Query
            </button>
          </div>

          {selectedLanguage !== "javascript" && index === 0 && (
            <div className="modern-coding-note">
              Execution for {selectedLanguage.toUpperCase()} will be enabled later.
              For now, direct execution works in JavaScript.
            </div>
          )}

          {results[index] && (
            <div className="coding-result-box">
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "inherit"
                }}
              >
                {results[index]}
              </pre>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}