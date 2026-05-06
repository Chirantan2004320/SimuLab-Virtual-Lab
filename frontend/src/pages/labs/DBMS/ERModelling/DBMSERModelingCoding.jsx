import React from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" }
];

export default function DBMSERModelingCoding({
  codingProblems,
  selectedLanguage,
  setSelectedLanguage,
  codes,
  results,
  codingSaveStatus,
  handleCodeChange,
  runCode,
  analyzeCode,
  correctCode,
  mode
}) {
  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice {mode.toUpperCase()} ER modelling through structured schema answers.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Practice Mode:</strong> Write ER design answers, run them, analyze concepts, and load model answers.
      </div>

      {codingProblems.map((problem, index) => (
        <div key={`${mode}-${index}`} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <h3>
                Problem {index + 1}: {problem.title}
              </h3>
              <p>{problem.description}</p>
            </div>

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
          </div>

          <textarea
            value={codes[index] || ""}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            placeholder="Write your ER modelling answer here..."
            rows={14}
            className="coding-textarea-upgraded"
          />

          <div className="coding-actions-upgraded">
            <button className="sim-btn sim-btn-primary" onClick={() => runCode(index)}>
              <Play size={16} />
              Run Code
            </button>

            <button className="sim-btn sim-btn-muted" onClick={() => analyzeCode(index)}>
              <Sparkles size={16} />
              Analyze
            </button>

            <button className="sim-btn sim-btn-danger" onClick={() => correctCode(index)}>
              <Wrench size={16} />
              Correct
            </button>
          </div>

          {selectedLanguage !== "javascript" && (
            <div className="modern-coding-note">
              Execution for {selectedLanguage.toUpperCase()} will be enabled later with Judge0.
            </div>
          )}

          {results[index] && <div className="coding-result-box">{results[index]}</div>}

          {codingSaveStatus?.[index] && (
            <div className="coding-result-box">{codingSaveStatus[index]}</div>
          )}
        </div>
      ))}
    </section>
  );
}