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
    title: "CMOS NAND Logic",
    description:
      "Write a function NAND(A, B) that returns 0 only when both inputs are 1.",
    functionName: "NAND",
    tests: [
      {
        input: [0, 0],
        expected: 1
      },
      {
        input: [0, 1],
        expected: 1
      },
      {
        input: [1, 0],
        expected: 1
      },
      {
        input: [1, 1],
        expected: 0
      }
    ]
  },
  {
    id: 2,
    title: "Truth Table Generator",
    description:
      "Write a function generateNANDTruthTable() that returns the complete NAND truth table.",
    functionName:
      "generateNANDTruthTable",
    tests: [
      {
        input: [],
        expected: [
          {
            A: 0,
            B: 0,
            Y: 1
          },
          {
            A: 0,
            B: 1,
            Y: 1
          },
          {
            A: 1,
            B: 0,
            Y: 1
          },
          {
            A: 1,
            B: 1,
            Y: 0
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title:
      "Pull-Down Network Detection",
    description:
      "Write a function hasPullDownPath(A, B) that returns true only when both nMOS transistors conduct.",
    functionName:
      "hasPullDownPath",
    tests: [
      {
        input: [0, 0],
        expected: false
      },
      {
        input: [0, 1],
        expected: false
      },
      {
        input: [1, 0],
        expected: false
      },
      {
        input: [1, 1],
        expected: true
      }
    ]
  }
];

const templates = {
  javascript: [
    `function NAND(A, B) {
  return !(A && B) ? 1 : 0;
}`,

    `function generateNANDTruthTable() {
  return [
    { A: 0, B: 0, Y: 1 },
    { A: 0, B: 1, Y: 1 },
    { A: 1, B: 0, Y: 1 },
    { A: 1, B: 1, Y: 0 }
  ];
}`,

    `function hasPullDownPath(A, B) {
  return A === 1 && B === 1;
}`
  ],

  python: [
    `def NAND(A, B):
    return 1 if not (A and B) else 0`,

    `def generateNANDTruthTable():
    return [
        {"A": 0, "B": 0, "Y": 1},
        {"A": 0, "B": 1, "Y": 1},
        {"A": 1, "B": 0, "Y": 1},
        {"A": 1, "B": 1, "Y": 0}
    ]`,

    `def hasPullDownPath(A, B):
    return A == 1 and B == 1`
  ],

  cpp: [
    `int NAND(int A, int B) {
  return !(A && B);
}`,

    `vector<vector<int>> generateNANDTruthTable() {
  return {
    {0,0,1},
    {0,1,1},
    {1,0,1},
    {1,1,0}
  };
}`,

    `bool hasPullDownPath(int A, int B) {
  return A == 1 && B == 1;
}`
  ],

  c: [
    `int NAND(int A, int B) {
  return !(A && B);
}`,

    `void generateNANDTruthTable() {
  // Truth table logic
}`,

    `int hasPullDownPath(int A, int B) {
  return A && B;
}`
  ],

  java: [
    `public static int NAND(int A, int B) {
  return (A == 1 && B == 1) ? 0 : 1;
}`,

    `public static int[][] generateNANDTruthTable() {
  return new int[][] {
    {0,0,1},
    {0,1,1},
    {1,0,1},
    {1,1,0}
  };
}`,

    `public static boolean hasPullDownPath(int A, int B) {
  return A == 1 && B == 1;
}`
  ]
};

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runJavascript(problem, code) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    `${code}; return ${problem.functionName};`
  )();

  const testResults = problem.tests.map(
    (test) => {
      const actual = fn(...test.input);

      const passed = deepEqual(
        actual,
        test.expected
      );

      return {
        input: test.input,
        expected: test.expected,
        actual,
        passed
      };
    }
  );

  return {
    passed: testResults.every(
      (test) => test.passed
    ),
    testResults
  };
}

function TestCaseTable({
  testResults
}) {
  if (!testResults?.length) return null;

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
            (test, index) => (
              <tr key={index}>
                <td>
                  <span
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: 6,
                      color: test.passed
                        ? "#22c55e"
                        : "#ef4444",
                      fontWeight: 800
                    }}
                  >
                    {test.passed ? (
                      <CheckCircle2
                        size={15}
                      />
                    ) : (
                      <XCircle
                        size={15}
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

export default function DVLSICMOSNANDGateCoding({
  analysis,
  A,
  B,
  vdd,
  tpd
}) {
  const [
    selectedLanguage,
    setSelectedLanguage
  ] = useState("javascript");

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
      templates[selectedLanguage]
    );

    setResults(
      Array(problems.length).fill(
        null
      )
    );

    setCodingSaveStatus(
      Array(problems.length).fill("")
    );
  }, [selectedLanguage]);

  const currentInsight =
    useMemo(() => {
      return `Current simulation: A=${A}, B=${B}, VDD=${vdd}V, Delay=${tpd}ns, Output=${analysis.logicRegion}.`;
    }, [
      analysis,
      A,
      B,
      vdd,
      tpd
    ]);

  const handleCodeChange = (
    index,
    value
  ) => {
    setCodes((prev) =>
      prev.map((item, i) =>
        i === index ? value : item
      )
    );
  };

  const setResultAt = (
    index,
    value
  ) => {
    setResults((prev) =>
      prev.map((item, i) =>
        i === index ? value : item
      )
    );
  };

  const setSaveStatusAt = (
    index,
    value
  ) => {
    setCodingSaveStatus((prev) =>
      prev.map((item, i) =>
        i === index ? value : item
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
        await saveCodingSubmission({
          labSlug: "dvlsi",
          experimentSlug:
            "cmos-nand-gate",
          problemTitle:
            problem.title,
          language:
            selectedLanguage,
          code,
          result
        });

        setSaveStatusAt(
          index,
          "Submission saved to dashboard."
        );
      } catch (error) {
        console.error(
          "CMOS NAND coding save failed:",
          error
        );

        setSaveStatusAt(
          index,
          "Code checked, but backend save failed."
        );
      }
    };

  const runCode = async (
    index
  ) => {
    const problem =
      problems[index];

    const code = codes[index];

    if (!code?.trim()) {
      setResultAt(index, {
        message:
          "Please enter code first.",
        passed: false,
        testResults: []
      });

      return;
    }

    if (
      selectedLanguage !==
      "javascript"
    ) {
      setResultAt(index, {
        message: `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Saved as attempted submission.`,
        passed: null,
        testResults: []
      });

      await saveSubmission({
        index,
        problem,
        code,
        result: "attempted"
      });

      return;
    }

    try {
      const output =
        runJavascript(
          problem,
          code
        );

      setResultAt(index, {
        message: output.passed
          ? "All test cases passed."
          : "Some test cases failed. Check the table below.",
        passed: output.passed,
        testResults:
          output.testResults
      });

      await saveSubmission({
        index,
        problem,
        code,
        result: output.passed
          ? "passed"
          : "failed"
      });
    } catch (error) {
      setResultAt(index, {
        message: `Error: ${error.message}`,
        passed: false,
        testResults: []
      });

      await saveSubmission({
        index,
        problem,
        code,
        result: "failed"
      });
    }
  };

  const analyzeCode = (
    index
  ) => {
    const content = (
      codes[index] || ""
    ).toLowerCase();

    const expected =
      index === 0
        ? [
            "nand",
            "a",
            "b"
          ]
        : index === 1
        ? [
            "truth",
            "table",
            "return"
          ]
        : [
            "pull",
            "path",
            "&&"
          ];

    const score =
      expected.filter((token) =>
        content.includes(token)
      ).length;

    setResultAt(index, {
      message:
        score >=
        Math.max(
          2,
          expected.length - 1
        )
          ? "Analysis: Your solution contains the expected CMOS NAND logic."
          : "Analysis: Your answer is partially correct. Include the required NAND logic and return values.",
      passed: null,
      testResults: []
    });
  };

  const correctCode = (
    index
  ) => {
    setCodes((prev) =>
      prev.map((item, i) =>
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
        style={{ marginBottom: 18 }}
      >
        <div className="sorting-sim-icon">
          <FileCode2 size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Coding Practice
          </h2>

          <p className="sorting-sim-subtitle">
            Practice CMOS NAND logic
            and run real test-case
            validations.
          </p>
        </div>
      </div>

      <div
        className="overview-grid"
        style={{ marginBottom: 18 }}
      >
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Focus Area</h4>
          </div>

          <p>
            CMOS NAND logic and
            switching behavior.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Topics Covered</h4>
          </div>

          <p>
            NAND logic, pull-down
            path, truth tables.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Difficulty</h4>
          </div>

          <p>
            Easy to medium CMOS NAND
            coding problems.
          </p>
        </div>
      </div>

      <div
        className="coding-empty-state"
        style={{ marginBottom: 18 }}
      >
        <strong>Live Hint:</strong>{" "}
        {currentInsight}
      </div>

      <div
        className="coding-card-upgraded"
        style={{ marginBottom: 18 }}
      >
        <div className="coding-card-header">
          <div>
            <h3>
              CMOS NAND Coding
              Workspace
            </h3>

            <p>
              Run JavaScript
              solutions against live
              test cases. Other
              languages are currently
              stored as attempted
              submissions.
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
                  e.target.value
                )
              }
              className="sorting-select"
            >
              {LANGUAGES.map(
                (lang) => (
                  <option
                    key={lang.value}
                    value={
                      lang.value
                    }
                  >
                    {lang.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {problems.map(
        (problem, index) => (
          <div
            key={problem.id}
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
                    CMOS Problem
                  </span>
                </div>

                <h3>
                  {problem.title}
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
                codes[index] || ""
              }
              onChange={(e) =>
                handleCodeChange(
                  index,
                  e.target.value
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
                  runCode(index)
                }
              >
                <Play size={16} />
                Run Tests
              </button>

              <button
                className="sim-btn sim-btn-muted"
                onClick={() =>
                  analyzeCode(index)
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
                  correctCode(index)
                }
              >
                Load Correct
              </button>
            </div>

            {selectedLanguage !==
              "javascript" && (
              <div
                className="coding-result-box"
                style={{
                  marginTop: 14
                }}
              >
                Execution for{" "}
                {selectedLanguage.toUpperCase()}{" "}
                will be enabled later.
                For now, direct
                execution works in
                JavaScript.
              </div>
            )}

            {results[index] && (
              <div className="coding-result-box">
                <strong
                  style={{
                    color:
                      results[index]
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
                    results[index]
                      .message
                  }
                </strong>

                <TestCaseTable
                  testResults={
                    results[index]
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