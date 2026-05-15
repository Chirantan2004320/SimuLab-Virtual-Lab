import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  FileCode2,
  Play,
  Wrench,
  Sparkles,
  CheckCircle2,
  XCircle,
  Cpu,
  Zap,
  Gauge
} from "lucide-react";

import { saveCodingSubmission } from "../../../../API/progressApi";

const LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript"
  },
  {
    value: "python",
    label: "Python"
  },
  {
    value: "cpp",
    label: "C++"
  },
  {
    value: "c",
    label: "C"
  },
  {
    value: "java",
    label: "Java"
  }
];

const problems = [
  {
    id: 1,
    title:
      "Hold State",
    description:
      "Write a function holdState(q) that returns the stored bit without changing it.",
    functionName:
      "holdState",
    tests: [
      {
        input: [1],
        expected: 1
      },
      {
        input: [0],
        expected: 0
      }
    ]
  },

  {
    id: 2,
    title:
      "Write Operation",
    description:
      "Write a function writeSRAM(bitline, wordline, oldQ) that returns the new stored bit only if wordline = 1.",
    functionName:
      "writeSRAM",
    tests: [
      {
        input: [1, 1, 0],
        expected: 1
      },
      {
        input: [0, 0, 1],
        expected: 1
      }
    ]
  },

  {
    id: 3,
    title:
      "Read Operation",
    description:
      "Write a function readSRAM(q, wordline) that returns q when wordline = 1, otherwise returns 'Z'.",
    functionName:
      "readSRAM",
    tests: [
      {
        input: [1, 1],
        expected: 1
      },
      {
        input: [0, 0],
        expected: "Z"
      }
    ]
  }
];

const templates = {
  javascript: [
    `function holdState(q) {
  return q;
}`,

    `function writeSRAM(bitline, wordline, oldQ) {
  return wordline === 1 ? bitline : oldQ;
}`,

    `function readSRAM(q, wordline) {
  return wordline === 1 ? q : "Z";
}`
  ],

  python: [
    `def holdState(q):
    return q`,

    `def writeSRAM(bitline, wordline, oldQ):
    return bitline if wordline == 1 else oldQ`,

    `def readSRAM(q, wordline):
    return q if wordline == 1 else "Z"`
  ],

  cpp: [
    `int holdState(int q) {
  return q;
}`,

    `int writeSRAM(int bitline, int wordline, int oldQ) {
  return wordline == 1 ? bitline : oldQ;
}`,

    `string readSRAM(int q, int wordline) {
  return wordline == 1 ? to_string(q) : "Z";
}`
  ],

  c: [
    `int holdState(int q) {
  return q;
}`,

    `int writeSRAM(int bitline, int wordline, int oldQ) {
  return wordline ? bitline : oldQ;
}`,

    `char* readSRAM(int q, int wordline) {
  return wordline ? "DATA" : "Z";
}`
  ],

  java: [
    `public static int holdState(int q) {
  return q;
}`,

    `public static int writeSRAM(int bitline, int wordline, int oldQ) {
  return wordline == 1 ? bitline : oldQ;
}`,

    `public static String readSRAM(int q, int wordline) {
  return wordline == 1 ? String.valueOf(q) : "Z";
}`
  ]
};

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runJavascript(
  problem,
  code
) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    `${code}; return ${problem.functionName};`
  )();

  const testResults =
    problem.tests.map(
      (test) => {
        const actual =
          fn(...test.input);

        const passed =
          deepEqual(
            actual,
            test.expected
          );

        return {
          input:
            test.input,
          expected:
            test.expected,
          actual,
          passed
        };
      }
    );

  return {
    passed:
      testResults.every(
        (test) =>
          test.passed
      ),
    testResults
  };
}

function TestCaseTable({
  testResults
}) {
  if (
    !testResults?.length
  )
    return null;

  return (
    <div
      style={{
        marginTop: 14,
        overflowX: "auto"
      }}
    >
      <table className="dbms-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Input</th>
            <th>Expected</th>
            <th>Actual</th>
          </tr>
        </thead>

        <tbody>
          {testResults.map(
            (
              test,
              index
            ) => (
              <tr key={index}>
                <td>
                  <span
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: 6,
                      color:
                        test.passed
                          ? "#22c55e"
                          : "#ef4444",
                      fontWeight: 800
                    }}
                  >
                    {test.passed ? (
                      <CheckCircle2
                        size={
                          15
                        }
                      />
                    ) : (
                      <XCircle
                        size={
                          15
                        }
                      />
                    )}

                    {test.passed
                      ? "Passed"
                      : "Failed"}
                  </span>
                </td>

                <td>
                  {JSON.stringify(
                    test.input
                  )}
                </td>

                <td>
                  <code>
                    {JSON.stringify(
                      test.expected
                    )}
                  </code>
                </td>

                <td>
                  <code>
                    {JSON.stringify(
                      test.actual
                    )}
                  </code>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function DVLSISRAMCellCoding({
  operation,
  wordline,
  analysis
}) {
  const [
    selectedLanguage,
    setSelectedLanguage
  ] = useState(
    "javascript"
  );

  const [codes, setCodes] =
    useState([]);

  const [results, setResults] =
    useState([]);

  const [
    codingSaveStatus,
    setCodingSaveStatus
  ] = useState([]);

  useEffect(() => {
    setCodes(
      templates[
        selectedLanguage
      ]
    );

    setResults(
      Array(
        problems.length
      ).fill(null)
    );

    setCodingSaveStatus(
      Array(
        problems.length
      ).fill("")
    );
  }, [selectedLanguage]);

  const currentInsight =
    useMemo(() => {
      return `Operation=${operation}, Wordline=${wordline}, Q=${analysis.q}, Q̅=${analysis.qBar}.`;
    }, [
      operation,
      wordline,
      analysis
    ]);

  const handleCodeChange = (
    index,
    value
  ) => {
    setCodes((prev) =>
      prev.map(
        (item, i) =>
          i === index
            ? value
            : item
      )
    );
  };

  const setResultAt = (
    index,
    value
  ) => {
    setResults((prev) =>
      prev.map(
        (item, i) =>
          i === index
            ? value
            : item
      )
    );
  };

  const setSaveStatusAt =
    (index, value) => {
      setCodingSaveStatus(
        (prev) =>
          prev.map(
            (
              item,
              i
            ) =>
              i === index
                ? value
                : item
          )
      );
    };

  const saveSubmission =
    async ({
      index,
      problem,
      code,
      result
    }) => {
      setSaveStatusAt(
        index,
        "Saving submission..."
      );

      try {
        await saveCodingSubmission(
          {
            labSlug:
              "dvlsi",
            experimentSlug:
              "sram-cell-basics",
            problemTitle:
              problem.title,
            language:
              selectedLanguage,
            code,
            result
          }
        );

        setSaveStatusAt(
          index,
          "Submission saved to dashboard."
        );
      } catch (error) {
        console.error(
          "SRAM coding save failed:",
          error
        );

        setSaveStatusAt(
          index,
          "Code checked, but backend save failed."
        );
      }
    };

  const runCode =
    async (index) => {
      const problem =
        problems[index];

      const code =
        codes[index];

      if (
        !code?.trim()
      ) {
        setResultAt(
          index,
          {
            message:
              "Please enter code first.",
            passed: false,
            testResults:
              []
          }
        );

        return;
      }

      if (
        selectedLanguage !==
        "javascript"
      ) {
        setResultAt(
          index,
          {
            message: `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Saved as attempted submission.`,
            passed: null,
            testResults:
              []
          }
        );

        await saveSubmission(
          {
            index,
            problem,
            code,
            result:
              "attempted"
          }
        );

        return;
      }

      try {
        const output =
          runJavascript(
            problem,
            code
          );

        setResultAt(
          index,
          {
            message:
              output.passed
                ? "All test cases passed."
                : "Some test cases failed. Check the table below.",
            passed:
              output.passed,
            testResults:
              output.testResults
          }
        );

        await saveSubmission(
          {
            index,
            problem,
            code,
            result:
              output.passed
                ? "passed"
                : "failed"
          }
        );
      } catch (error) {
        setResultAt(
          index,
          {
            message: `Error: ${error.message}`,
            passed: false,
            testResults:
              []
          }
        );

        await saveSubmission(
          {
            index,
            problem,
            code,
            result:
              "failed"
          }
        );
      }
    };

  const analyzeCode = (
    index
  ) => {
    const content = (
      codes[index] ||
      ""
    ).toLowerCase();

    const expected =
      index === 0
        ? ["return", "q"]
        : index === 1
        ? [
            "wordline",
            "bitline"
          ]
        : [
            "wordline",
            "z"
          ];

    const score =
      expected.filter(
        (token) =>
          content.includes(
            token
          )
      ).length;

    setResultAt(index, {
      message:
        score >=
        Math.max(
          2,
          expected.length -
            1
        )
          ? "Analysis: Your solution contains the expected SRAM behavior."
          : "Analysis: Your answer is partially correct. Review SRAM read/write conditions.",
      passed: null,
      testResults: []
    });
  };

  const correctCode = (
    index
  ) => {
    setCodes((prev) =>
      prev.map(
        (item, i) =>
          i === index
            ? templates[
                selectedLanguage
              ][index]
            : item
      )
    );

    setResultAt(index, {
      message:
        "Model answer loaded for this problem.",
      passed: null,
      testResults: []
    });
  };

  return (
    <section className="coding-shell">
      <div
        className="sorting-sim-title-wrap"
        style={{
          marginBottom: 18
        }}
      >
        <div className="sorting-sim-icon">
          <FileCode2
            size={18}
          />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Coding Practice
          </h2>

          <p className="sorting-sim-subtitle">
            Practice SRAM
            storage, read,
            write, and hold
            logic operations.
          </p>
        </div>
      </div>

      <div
        className="overview-grid"
        style={{
          marginBottom: 18
        }}
      >
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>
              Focus Area
            </h4>
          </div>

          <p>
            SRAM read/write
            logic and memory
            cell behavior.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>
              Topics Covered
            </h4>
          </div>

          <p>
            Wordline control,
            storage nodes,
            hold state, and
            bitline logic.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>
              Difficulty
            </h4>
          </div>

          <p>
            Beginner to
            intermediate
            SRAM memory
            problems.
          </p>
        </div>
      </div>

      <div
        className="coding-empty-state"
        style={{
          marginBottom: 18
        }}
      >
        <strong>
          Live Hint:
        </strong>{" "}
        {
          currentInsight
        }
      </div>

      <div
        className="coding-card-upgraded"
        style={{
          marginBottom: 18
        }}
      >
        <div className="coding-card-header">
          <div>
            <h3>
              SRAM Coding
              Workspace
            </h3>

            <p>
              Run JavaScript
              SRAM solutions
              against real
              test cases.
            </p>
          </div>

          <div className="coding-language-wrap">
            <label className="sorting-label">
              Language
            </label>

            <select
              value={
                selectedLanguage
              }
              onChange={(e) =>
                setSelectedLanguage(
                  e.target
                    .value
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
      </div>

      {problems.map(
        (
          problem,
          index
        ) => (
          <div
            key={
              problem.id
            }
            className="coding-card-upgraded"
          >
            <div className="coding-card-header">
              <div>
                <div
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: 8,
                    marginBottom: 10,
                    padding:
                      "6px 12px",
                    borderRadius: 999,
                    background:
                      "rgba(56,189,248,0.10)",
                    border:
                      "1px solid rgba(56,189,248,0.18)",
                    color:
                      "#38bdf8",
                    fontWeight: 700,
                    fontSize:
                      "0.82rem"
                  }}
                >
                  <Sparkles
                    size={14}
                  />

                  <span>
                    SRAM Problem
                  </span>
                </div>

                <h3>
                  {
                    problem.title
                  }
                </h3>

                <p>
                  {
                    problem.description
                  }
                </p>
              </div>
            </div>

            <textarea
              value={
                codes[
                  index
                ] || ""
              }
              onChange={(e) =>
                handleCodeChange(
                  index,
                  e.target
                    .value
                )
              }
              rows={12}
              className="coding-textarea-upgraded"
              placeholder="Write your code here..."
            />

            <div className="coding-actions-upgraded">
              <button
                className="sim-btn sim-btn-primary"
                onClick={() =>
                  runCode(
                    index
                  )
                }
              >
                <Play
                  size={16}
                />
                Run Tests
              </button>

              <button
                className="sim-btn sim-btn-muted"
                onClick={() =>
                  analyzeCode(
                    index
                  )
                }
              >
                <Wrench
                  size={16}
                />
                Analyze
              </button>

              <button
                className="sim-btn sim-btn-success"
                onClick={() =>
                  correctCode(
                    index
                  )
                }
              >
                Load Correct
              </button>
            </div>

            {results[
              index
            ] && (
              <div className="coding-result-box">
                <strong
                  style={{
                    color:
                      results[
                        index
                      ]
                        .passed ===
                      true
                        ? "#22c55e"
                        : results[
                            index
                          ]
                              .passed ===
                            false
                        ? "#ef4444"
                        : "#e2e8f0"
                  }}
                >
                  {
                    results[
                      index
                    ].message
                  }
                </strong>

                <TestCaseTable
                  testResults={
                    results[
                      index
                    ]
                      .testResults
                  }
                />
              </div>
            )}

            {codingSaveStatus[
              index
            ] && (
              <div className="coding-result-box">
                {
                  codingSaveStatus[
                    index
                  ]
                }
              </div>
            )}
          </div>
        )
      )}
    </section>
  );
}