import React from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

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
  
  
  React.useEffect(() => {
  if (currentProblems.length === 0) {
    generateProblems();
  }
}, [currentProblems.length, generateProblems]);


  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Solve linked list problems and test your logic across languages.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Practice Mode:</strong> Complete all problems below. JavaScript runs directly.
      </div>

      {currentProblems.map((problem, index) => {
        const selectedLanguage = selectedLanguages[problem.id] || "javascript";
        const codeKey = `${problem.id}_${selectedLanguage}`;

        return (
          <div key={problem.id} className="coding-card-upgraded">
            {/* HEADER */}
            <div className="coding-card-header">
              <div>
                <h3>Problem {index + 1} • {problem.type}</h3>
                <p>{problem.description}</p>
              </div>

              <div className="coding-language-wrap">
                <label className="sorting-label">Language</label>
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

            {/* CODE EDITOR */}
            <textarea
              value={codes[codeKey] || ""}
              onChange={(e) =>
                handleCodeChange(problem.id, selectedLanguage, e.target.value)
              }
              rows={14}
              className="coding-textarea-upgraded"
              placeholder="Write your solution here..."
            />

            {/* ACTIONS */}
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

            {/* NOTE */}
            {selectedLanguage !== "javascript" && (
              <div className="modern-coding-note">
                Execution for {selectedLanguage.toUpperCase()} will be enabled later.
              </div>
            )}

            {/* RESULT */}
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

export default LinkedListCoding;