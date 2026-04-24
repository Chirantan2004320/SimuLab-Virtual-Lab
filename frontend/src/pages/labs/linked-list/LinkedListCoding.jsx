import React from "react";
import { Code2, Play, Wand2, SearchCheck } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" }
];

const LinkedListCoding = ({
  currentProblems,
  codes,
  selectedLanguages,
  results,
  generateProblems,
  handleLanguageChange,
  handleCodeChange,
  runCode,
  analyzeCode,
  correctCode
}) => {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Code2 size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Coding Practice</h2>
            <p className="sorting-sim-subtitle">
              Practice linked list logic with implementation-based coding problems.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginBottom: "18px" }}>
        Generate linked list problems, choose a language, write your solution, and test it.
      </div>

      <div style={{ marginBottom: "18px" }}>
        <button className="sim-btn sim-btn-primary" onClick={generateProblems}>
          Generate Problems
        </button>
      </div>

      {currentProblems.length === 0 ? (
        <div className="sorting-empty-state">
          No problems generated yet. Click <strong>Generate Problems</strong> to begin.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "18px" }}>
          {currentProblems.map((problem, index) => {
            const selectedLanguage = selectedLanguages[problem.id] || "javascript";
            const codeKey = `${problem.id}_${selectedLanguage}`;

            return (
              <div key={problem.id} className="modern-coding-card">
                <div className="modern-coding-top">
                  <div>
                    <div className="modern-coding-badge">
                      Problem {index + 1} • {problem.type}
                    </div>
                    <h3 className="modern-coding-title">{problem.title}</h3>
                    <p className="modern-coding-desc">{problem.description}</p>
                  </div>
                </div>

                <div className="modern-coding-controls">
                  <div className="modern-coding-select-wrap">
                    <label className="sorting-label">Select Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) =>
                        handleLanguageChange(problem.id, e.target.value, problem)
                      }
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
                  value={codes[codeKey] || ""}
                  onChange={(e) =>
                    handleCodeChange(problem.id, selectedLanguage, e.target.value)
                  }
                  placeholder="Write your code here..."
                  className="modern-coding-editor"
                  rows={14}
                />

                <div className="modern-coding-actions">
                  <button
                    className="sim-btn sim-btn-primary"
                    onClick={() => runCode(problem.id, selectedLanguage)}
                  >
                    <Play size={16} />
                    Run Code
                  </button>

                  <button
                    className="sim-btn sim-btn-muted"
                    onClick={() => analyzeCode(problem.id, selectedLanguage)}
                  >
                    <SearchCheck size={16} />
                    Analyze Code
                  </button>

                  <button
                    className="sim-btn sim-btn-success"
                    onClick={() => correctCode(problem.id, selectedLanguage)}
                  >
                    <Wand2 size={16} />
                    Correct Code
                  </button>
                </div>

                {selectedLanguage !== "javascript" && (
                  <div className="modern-coding-note">
                    Execution for {selectedLanguage.toUpperCase()} will be enabled later. For now,
                    direct execution works in JavaScript only.
                  </div>
                )}

                {results[problem.id] && (
                  <div className="modern-coding-result">
                    {results[problem.id]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LinkedListCoding;