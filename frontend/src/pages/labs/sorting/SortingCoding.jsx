import React from "react";
import { Code2, Play, Wrench, Sparkles } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" }
];

const SortingCoding = ({
  currentProblems,
  codes,
  selectedLanguages,
  results,
  handleLanguageChange,
  handleCodeChange,
  runCode,
  analyzeCode,
  correctCode,
  generateProblems
}) => {
  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Solve randomly generated problems and test your understanding in code.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button className="sim-btn sim-btn-primary" onClick={generateProblems}>
          Generate Problems
        </button>
      </div>

      {currentProblems.length === 0 ? (
        <div className="coding-empty-state">
          No problems generated yet. Click <b>Generate Problems</b> to begin.
        </div>
      ) : null}

      {currentProblems.map((problem, index) => {
        const selectedLanguage = selectedLanguages[problem.id] || "javascript";
        const codeKey = `${problem.id}_${selectedLanguage}`;

        return (
          <div key={problem.id} className="coding-card-upgraded">
            <div className="coding-card-header">
              <div>
                <h3>Problem {index + 1}</h3>
                <p>{problem.description}</p>
              </div>

              <div className="coding-language-wrap">
                <label className="sorting-label">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(problem.id, e.target.value, problem)}
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
              rows={14}
              className="coding-textarea-upgraded"
            />

            <div className="coding-actions-upgraded">
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
                <Sparkles size={16} />
                Analyze Code
              </button>

              <button
                className="sim-btn sim-btn-danger"
                onClick={() => correctCode(problem.id, selectedLanguage)}
              >
                <Wrench size={16} />
                Correct Code
              </button>
            </div>

            {results[problem.id] && (
              <div className="coding-result-box">
                {results[problem.id]}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default SortingCoding;