import React from "react";

import {
  Code2,
  Play,
  Sparkles,
  Wrench,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript",
  },

  {
    value: "python",
    label: "Python",
  },

  {
    value: "cpp",
    label: "C++",
  },

  {
    value: "c",
    label: "C",
  },

  {
    value: "java",
    label: "Java",
  },
];

export default function PagingCoding({
  currentProblems,
  selectedLanguages,
  codes,
  results,
  codingSaveStatus,
  generateProblems,
  handleLanguageChange,
  handleCodeChange,
  runCode,
  analyzeCode,
  correctCode,
}) {

  return (
    <section className="coding-shell">

      <div
        className="sorting-sim-title-wrap"
        style={{
          marginBottom: 18,
        }}
      >

        <div className="sorting-sim-icon">

          <Code2 size={18} />

        </div>

        <div>

          <h2 className="sorting-sim-title">
            Coding Practice
          </h2>

          <p className="sorting-sim-subtitle">
            Solve Paging & Memory
            Management analytical
            problems and validate your
            operating system concepts.
          </p>

        </div>

      </div>

      <div
        style={{
          marginBottom: 20,
        }}
      >

        <button
          className="sim-btn sim-btn-primary"
          onClick={
            generateProblems
          }
        >

          Generate Problems

        </button>

      </div>

      {currentProblems.length ===
        0 && (

        <div className="coding-empty-state">

          No problems generated yet.
          Click <b>Generate Problems</b> to begin.

        </div>
      )}

      {currentProblems.map(
        (
          problem,
          index
        ) => {

          const selectedLanguage =
            selectedLanguages[
              problem.id
            ] || "javascript";

          const codeKey =
            `${problem.id}_${selectedLanguage}`;

          const result =
            results[
              problem.id
            ];

          return (

            <div
              key={problem.id}
              className="coding-card-upgraded"
            >

              <div className="coding-card-header">

                <div>

                  <h3>

                    Problem {index + 1}:{" "}

                    {problem.title}

                  </h3>

                  <p>

                    {
                      problem.problem_statement
                    }

                  </p>

                </div>

                <div className="coding-language-wrap">

                  <label className="sorting-label">
                    Language
                  </label>

                  <select
                    value={selectedLanguage}
                    onChange={(e) =>
                      handleLanguageChange(
                        problem.id,
                        e.target.value,
                        problem
                      )
                    }
                    className="sorting-select"
                  >

                    {LANGUAGES.map(
                      (lang) => (

                        <option
                          key={lang.value}
                          value={lang.value}
                        >

                          {lang.label}

                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              <div className="coding-sample-box">

                <div>

                  <strong>
                    Sample Input:
                  </strong>

                  <pre>
                    {problem.sample_input}
                  </pre>

                </div>

                <div>

                  <strong>
                    Sample Output:
                  </strong>

                  <pre>
                    {problem.sample_output}
                  </pre>

                </div>

              </div>

              <textarea
                value={
                  codes[codeKey] || ""
                }
                onChange={(e) =>
                  handleCodeChange(
                    problem.id,
                    selectedLanguage,
                    e.target.value
                  )
                }
                placeholder="Write your Paging & Memory Management answer here..."
                rows={14}
                className="coding-textarea-upgraded"
              />

              <div className="coding-actions-upgraded">

                <button
                  className="sim-btn sim-btn-primary"
                  onClick={() =>
                    runCode(
                      problem.id,
                      selectedLanguage
                    )
                  }
                >

                  <Play size={16} />

                  Check Answer

                </button>

                <button
                  className="sim-btn sim-btn-muted"
                  onClick={() =>
                    analyzeCode(
                      problem.id,
                      selectedLanguage
                    )
                  }
                >

                  <Sparkles size={16} />

                  Analyze Answer

                </button>

                <button
                  className="sim-btn sim-btn-danger"
                  onClick={() =>
                    correctCode(
                      problem.id,
                      selectedLanguage
                    )
                  }
                >

                  <Wrench size={16} />

                  Show Correct Logic

                </button>

              </div>

              {result && (

                <div className="coding-modern-result">

                  <div className="coding-result-header">

                    {result.verdict ===
                    "passed" ? (

                      <CheckCircle2 className="text-green-400" />

                    ) : (

                      <XCircle className="text-red-400" />

                    )}

                    <h3>
                      Execution Result
                    </h3>

                  </div>

                  <div className="coding-result-content">

                    <p>

                      Verdict:{" "}

                      <b>
                        {result.verdict}
                      </b>

                    </p>

                    <p>

                      Passed Tests:{" "}

                      <b>

                        {
                          result.passedTests
                        }
                        /
                        {
                          result.totalTests
                        }

                      </b>

                    </p>

                    <p>

                      Points:{" "}

                      <b>
                        {result.points}
                      </b>

                    </p>

                  </div>

                </div>
              )}

              {codingSaveStatus?.[
                problem.id
              ] && (

                <div className="coding-result-box">

                  {
                    codingSaveStatus[
                      problem.id
                    ]
                  }

                </div>
              )}

            </div>
          );
        }
      )}

    </section>
  );
}