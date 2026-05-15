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

    title: "Traffic Light State Transition",

    description:
      "Write a function nextState(current) that returns the next traffic light state in the sequence RED → GREEN → YELLOW → RED.",

    functionName: "nextState",

    tests: [
      {
        input: ["RED"],
        expected: "GREEN"
      },

      {
        input: ["GREEN"],
        expected: "YELLOW"
      },

      {
        input: ["YELLOW"],
        expected: "RED"
      }
    ]
  },

  {
    id: 2,

    title: "Traffic Delay Timing",

    description:
      "Write a function trafficDelay(state) that returns timing delay in milliseconds for RED, GREEN, and YELLOW states.",

    functionName: "trafficDelay",

    tests: [
      {
        input: ["RED"],
        expected: 5000
      },

      {
        input: ["GREEN"],
        expected: 5000
      },

      {
        input: ["YELLOW"],
        expected: 2000
      }
    ]
  },

  {
    id: 3,

    title: "GPIO Signal Logic",

    description:
      "Write a function activeSignal(state) that returns HIGH for the active traffic light and LOW for inactive outputs.",

    functionName: "activeSignal",

    tests: [
      {
        input: ["RED"],
        expected: {
          red: "HIGH",
          yellow: "LOW",
          green: "LOW"
        }
      },

      {
        input: ["GREEN"],
        expected: {
          red: "LOW",
          yellow: "LOW",
          green: "HIGH"
        }
      },

      {
        input: ["YELLOW"],
        expected: {
          red: "LOW",
          yellow: "HIGH",
          green: "LOW"
        }
      }
    ]
  }
];

const templates = {
  javascript: [
    `function nextState(current) {
  if (current === "RED") {
    return "GREEN";
  }

  if (current === "GREEN") {
    return "YELLOW";
  }

  return "RED";
}`,

    `function trafficDelay(state) {
  if (state === "RED") {
    return 5000;
  }

  if (state === "GREEN") {
    return 5000;
  }

  return 2000;
}`,

    `function activeSignal(state) {
  return {
    red: state === "RED" ? "HIGH" : "LOW",
    yellow: state === "YELLOW" ? "HIGH" : "LOW",
    green: state === "GREEN" ? "HIGH" : "LOW"
  };
}`
  ],

  python: [
    `def nextState(current):
    if current == "RED":
        return "GREEN"

    if current == "GREEN":
        return "YELLOW"

    return "RED"`,

    `def trafficDelay(state):
    if state == "RED":
        return 5000

    if state == "GREEN":
        return 5000

    return 2000`,

    `def activeSignal(state):
    return {
        "red": "HIGH" if state == "RED" else "LOW",
        "yellow": "HIGH" if state == "YELLOW" else "LOW",
        "green": "HIGH" if state == "GREEN" else "LOW"
    }`
  ],

  cpp: [
    `string nextState(string current) {
  if (current == "RED") {
    return "GREEN";
  }

  if (current == "GREEN") {
    return "YELLOW";
  }

  return "RED";
}`,

    `int trafficDelay(string state) {
  if (state == "RED") {
    return 5000;
  }

  if (state == "GREEN") {
    return 5000;
  }

  return 2000;
}`,

    `map<string, string> activeSignal(string state) {
  return {
    {"red", state == "RED" ? "HIGH" : "LOW"},
    {"yellow", state == "YELLOW" ? "HIGH" : "LOW"},
    {"green", state == "GREEN" ? "HIGH" : "LOW"}
  };
}`
  ],

  c: [
    `char* nextState(char current[]) {
  if (strcmp(current, "RED") == 0) {
    return "GREEN";
  }

  if (strcmp(current, "GREEN") == 0) {
    return "YELLOW";
  }

  return "RED";
}`,

    `int trafficDelay(char state[]) {
  if (strcmp(state, "RED") == 0) {
    return 5000;
  }

  if (strcmp(state, "GREEN") == 0) {
    return 5000;
  }

  return 2000;
}`,

    `void activeSignal(char state[]) {
  // Handle GPIO output logic manually in C
}`
  ],

  java: [
    `public static String nextState(String current) {
  if (current.equals("RED")) {
    return "GREEN";
  }

  if (current.equals("GREEN")) {
    return "YELLOW";
  }

  return "RED";
}`,

    `public static int trafficDelay(String state) {
  if (state.equals("RED")) {
    return 5000;
  }

  if (state.equals("GREEN")) {
    return 5000;
  }

  return 2000;
}`,

    `public static Map<String, String> activeSignal(String state) {
  Map<String, String> signal = new HashMap<>();

  signal.put(
    "red",
    state.equals("RED") ? "HIGH" : "LOW"
  );

  signal.put(
    "yellow",
    state.equals("YELLOW") ? "HIGH" : "LOW"
  );

  signal.put(
    "green",
    state.equals("GREEN") ? "HIGH" : "LOW"
  );

  return signal;
}`
  ]
};

function deepEqual(a, b) {
  return (
    JSON.stringify(a) ===
    JSON.stringify(b)
  );
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
  if (!testResults?.length)
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

export default function TrafficLightDesignPractice({
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

  const [
    results,
    setResults
  ] = useState([]);

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
      return `Current State = ${analysis.state}, Delay = ${analysis.delay} ms, Cycle Count = ${analysis.cycle}, Running = ${analysis.isRunning ? "YES" : "NO"}.`;
    }, [analysis]);

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

  const setSaveStatusAt = (
    index,
    value
  ) => {
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
              "microcontroller",

            experimentSlug:
              "traffic-light-controller",

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
          "Traffic Light coding save failed:",
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

      if (!code?.trim()) {
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
      codes[index] || ""
    ).toLowerCase();

    const expected =
      index === 0
        ? [
            "red",
            "green",
            "yellow"
          ]
        : index === 1
        ? [
            "5000",
            "2000",
            "return"
          ]
        : [
            "high",
            "low",
            "green"
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
          ? "Analysis: Your solution contains the expected traffic light FSM logic."
          : "Analysis: Your answer is partially correct. Include proper GPIO sequencing and timing logic.",

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
            Design Practice
          </h2>

          <p className="sorting-sim-subtitle">
            Practice traffic light
            controller logic and
            run real test-case
            validations.
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
            Finite state machine
            and GPIO sequencing.
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
            State transitions,
            delay timing, GPIO
            logic, FSM control.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge
              size={18}
            />
            <h4>
              Difficulty
            </h4>
          </div>

          <p>
            Medium FSM and GPIO
            coding problems.
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
        {currentInsight}
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
              Traffic Light Coding
              Workspace
            </h3>

            <p>
              Run JavaScript
              solutions against
              live test cases.
              Other languages are
              currently stored as
              attempted
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
                    FSM Problem
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
                codes[index] ||
                ""
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
                will be enabled
                later. For now,
                direct execution
                works in
                JavaScript.
              </div>
            )}

            {results[index] && (
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