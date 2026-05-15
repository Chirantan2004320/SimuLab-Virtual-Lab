import React from "react";

import Editor from "@monaco-editor/react";

import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  Wrench,
  Terminal,
  Cpu,
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

export default function TreeCoding({
  treeMode,
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

  const treeNames = {
    binary: "Binary Tree",
    bst: "Binary Search Tree",
  };

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
            Solve{" "}
            {
              treeNames[
                treeMode
              ]
            }{" "}
            coding challenges and
            execute code against
            backend test cases.
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
      0 ? (

        <div className="coding-empty-state">

          No problems generated
          yet. Click{" "}
          <b>
            Generate Problems
          </b>{" "}
          to begin.

        </div>

      ) : null}

      {currentProblems.map(
        (problem, index) => {

          const selectedLanguage =
            selectedLanguages[
              problem.id
            ] ||
            "javascript";

          const codeKey = `${problem.id}_${selectedLanguage}`;

          const result =
            results[
              problem.id
            ];

          return (
            <div
              key={
                problem.id
              }
              className="coding-card-upgraded"
            >

              <div className="coding-card-header">

                <div>

                  <div className="flex items-center gap-3 mb-2">

                    <Cpu className="w-5 h-5 text-primary" />

                    <h3>
                      Problem{" "}
                      {index + 1}
                      :{" "}
                      {
                        problem.title
                      }
                    </h3>

                  </div>

                  <p>
                    {
                      problem.problem_statement
                    }
                  </p>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="rounded-xl bg-secondary/20 p-4 border border-border/30">

                      <h4 className="font-semibold mb-2">
                        Sample Input
                      </h4>

                      <pre className="text-sm whitespace-pre-wrap">
                        {
                          problem.sample_input
                        }
                      </pre>

                    </div>

                    <div className="rounded-xl bg-secondary/20 p-4 border border-border/30">

                      <h4 className="font-semibold mb-2">
                        Sample Output
                      </h4>

                      <pre className="text-sm whitespace-pre-wrap">
                        {
                          problem.sample_output
                        }
                      </pre>

                    </div>

                  </div>
                </div>

                <div className="coding-language-wrap">

                  <label className="sorting-label">
                    Language
                  </label>

                  <select
                    value={
                      selectedLanguage
                    }
                    onChange={(
                      e
                    ) =>
                      handleLanguageChange(
                        problem.id,
                        e.target.value,
                        problem
                      )
                    }
                    className="sorting-select"
                  >

                    {LANGUAGES.map(
                      (
                        lang
                      ) => (
                        <option
                          key={
                            lang.value
                          }
                          value={
                            lang.value
                          }
                        >
                          {
                            lang.label
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>
              </div>

              <div className="coding-editor-shell">

                <div className="coding-editor-topbar">

                  <div className="flex items-center gap-2">

                    <Terminal
                      size={
                        16
                      }
                    />

                    <span>
                      Monaco Editor
                    </span>

                  </div>
                </div>

                <Editor
                  height="500px"
                  language={
                    selectedLanguage
                  }
                  theme="vs-dark"
                  value={
                    codes[
                      codeKey
                    ] ||
                    "// Write your tree solution here"
                  }
                  onChange={(
                    value
                  ) =>
                    handleCodeChange(
                      problem.id,
                      selectedLanguage,
                      value || ""
                    )
                  }
                />

              </div>

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

                  <Play
                    size={
                      16
                    }
                  />

                  Run Code

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

                  <Sparkles
                    size={
                      16
                    }
                  />

                  Analyze Code

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

                  <Wrench
                    size={
                      16
                    }
                  />

                  Correct Code

                </button>

              </div>

              {result && (

                <div className="coding-modern-result">

                  <div className="coding-result-header">

                    {result?.verdict ===
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
                        {
                          result.verdict
                        }
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
                        {
                          result.points
                        }
                      </b>
                    </p>

                    {result.results
                      ?.length >
                      0 && (

                      <div className="mt-5 space-y-4">

                        {result.results.map(
                          (
                            test,
                            idx
                          ) => (

                            <div
                              key={
                                idx
                              }
                              className="rounded-xl border border-border/30 p-4"
                            >

                              <div className="flex items-center justify-between mb-3">

                                <h4 className="font-semibold">
                                  Test Case #
                                  {idx + 1}
                                </h4>

                                <span
                                  className={`text-sm font-semibold ${
                                    test.passed
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {test.passed
                                    ? "PASSED"
                                    : "FAILED"}
                                </span>

                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div>

                                  <p className="text-sm text-muted-foreground mb-2">
                                    Input
                                  </p>

                                  <pre className="rounded-lg bg-secondary/20 p-3 text-sm whitespace-pre-wrap">
                                    {
                                      test.input
                                    }
                                  </pre>

                                </div>

                                <div>

                                  <p className="text-sm text-muted-foreground mb-2">
                                    Expected
                                  </p>

                                  <pre className="rounded-lg bg-secondary/20 p-3 text-sm whitespace-pre-wrap">
                                    {
                                      test.expected
                                    }
                                  </pre>

                                </div>

                                <div>

                                  <p className="text-sm text-muted-foreground mb-2">
                                    Output
                                  </p>

                                  <pre className="rounded-lg bg-secondary/20 p-3 text-sm whitespace-pre-wrap">
                                    {
                                      test.output
                                    }
                                  </pre>

                                </div>

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}

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