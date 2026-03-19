import React from "react";

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
    <section className="card">
      <h2>Coding Practice</h2>
      <p>
        Test your understanding by implementing sorting algorithms. Choose a language,
        write your solution, and run it.
      </p>

      <button className="btn primary" onClick={generateProblems}>
        Generate Problems
      </button>

      {currentProblems.map((problem, index) => {
        const selectedLanguage = selectedLanguages[problem.id] || "javascript";
        const codeKey = `${problem.id}_${selectedLanguage}`;

        return (
          <div key={problem.id} className="coding-problem">
            <h3>Problem {index + 1}</h3>
            <p>{problem.description}</p>

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#ffffff"
                }}
              >
                Select Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(problem.id, e.target.value, problem)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  minWidth: "180px",
                  fontSize: "14px",
                  color: "#000000"
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={codes[codeKey] || ""}
              onChange={(e) =>
                handleCodeChange(problem.id, selectedLanguage, e.target.value)
              }
              placeholder="Write your code here..."
              rows={12}
              style={{
                width: "100%",
                fontFamily: "monospace",
                color: "#000000",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px"
              }}
            />

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                className="btn secondary"
                onClick={() => runCode(problem.id, selectedLanguage)}
              >
                Run Code
              </button>

              <button
                className="btn info"
                onClick={() => analyzeCode(problem.id, selectedLanguage)}
              >
                Analyze Code
              </button>

              <button
                className="btn success"
                onClick={() => correctCode(problem.id, selectedLanguage)}
              >
                Correct Code
              </button>
            </div>

            {results[problem.id] && <p className="result">{results[problem.id]}</p>}
          </div>
        );
      })}
    </section>
  );
};

export default SortingCoding;