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

    title: "PWM Brightness Value",

    description:
      "Write a function pwmValue(dutyCycle) that converts duty cycle percentage into Arduino PWM value (0–255).",

    functionName: "pwmValue",

    tests: [
      {
        input: [0],
        expected: 0
      },

      {
        input: [50],
        expected: 128
      },

      {
        input: [100],
        expected: 255
      }
    ]
  },

  {
    id: 2,

    title: "LED Brightness Label",

    description:
      "Write a function brightnessLabel(dutyCycle) that returns DIM, MEDIUM, BRIGHT, or FULL BRIGHTNESS.",

    functionName: "brightnessLabel",

    tests: [
      {
        input: [10],
        expected: "DIM"
      },

      {
        input: [50],
        expected: "MEDIUM"
      },

      {
        input: [80],
        expected:
          "FULL BRIGHTNESS"
      }
    ]
  },

  {
    id: 3,

    title: "Average PWM Voltage",

    description:
      "Write a function averageVoltage(dutyCycle) that returns the average voltage assuming 5V source.",

    functionName: "averageVoltage",

    tests: [
      {
        input: [0],
        expected: 0
      },

      {
        input: [50],
        expected: 2.5
      },

      {
        input: [100],
        expected: 5
      }
    ]
  }
];

const templates = {
  javascript: [
    `function pwmValue(dutyCycle) {
  return Math.round(
    (dutyCycle / 100) * 255
  );
}`,

    `function brightnessLabel(dutyCycle) {
  if (dutyCycle <= 25) {
    return "DIM";
  }

  if (dutyCycle <= 50) {
    return "MEDIUM";
  }

  if (dutyCycle <= 75) {
    return "BRIGHT";
  }

  return "FULL BRIGHTNESS";
}`,

    `function averageVoltage(dutyCycle) {
  return Number(
    (
      (dutyCycle / 100) *
      5
    ).toFixed(1)
  );
}`
  ],

  python: [
    `def pwmValue(dutyCycle):
    return round(
        (dutyCycle / 100) * 255
    )`,

    `def brightnessLabel(dutyCycle):
    if dutyCycle <= 25:
        return "DIM"

    if dutyCycle <= 50:
        return "MEDIUM"

    if dutyCycle <= 75:
        return "BRIGHT"

    return "FULL BRIGHTNESS"`,

    `def averageVoltage(dutyCycle):
    return round(
        (dutyCycle / 100) * 5,
        1
    )`
  ],

  cpp: [
    `int pwmValue(int dutyCycle) {
  return round(
    (dutyCycle / 100.0) * 255
  );
}`,

    `string brightnessLabel(int dutyCycle) {
  if (dutyCycle <= 25) {
    return "DIM";
  }

  if (dutyCycle <= 50) {
    return "MEDIUM";
  }

  if (dutyCycle <= 75) {
    return "BRIGHT";
  }

  return "FULL BRIGHTNESS";
}`,

    `float averageVoltage(int dutyCycle) {
  return (dutyCycle / 100.0) * 5;
}`
  ],

  c: [
    `int pwmValue(int dutyCycle) {
  return (dutyCycle * 255) / 100;
}`,

    `char* brightnessLabel(int dutyCycle) {
  if (dutyCycle <= 25) {
    return "DIM";
  }

  if (dutyCycle <= 50) {
    return "MEDIUM";
  }

  if (dutyCycle <= 75) {
    return "BRIGHT";
  }

  return "FULL BRIGHTNESS";
}`,

    `float averageVoltage(int dutyCycle) {
  return (dutyCycle / 100.0) * 5;
}`
  ],

  java: [
    `public static int pwmValue(int dutyCycle) {
  return Math.round(
    (dutyCycle / 100f) * 255
  );
}`,

    `public static String brightnessLabel(int dutyCycle) {
  if (dutyCycle <= 25) {
    return "DIM";
  }

  if (dutyCycle <= 50) {
    return "MEDIUM";
  }

  if (dutyCycle <= 75) {
    return "BRIGHT";
  }

  return "FULL BRIGHTNESS";
}`,

    `public static double averageVoltage(int dutyCycle) {
  return Math.round(
    ((dutyCycle / 100.0) * 5) * 10
  ) / 10.0;
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

export default function PWMLedDesignPractice({
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
      return `Current Duty Cycle = ${analysis.dutyCycle}%, PWM Value = ${analysis.pwmValue}, Brightness = ${analysis.brightnessLabel}, Average Voltage = ${analysis.voltageText}.`;
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
              "pwm-led",

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
          "PWM LED coding save failed:",
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
            "255",
            "100",
            "duty"
          ]
        : index === 1
        ? [
            "bright",
            "medium",
            "dim"
          ]
        : [
            "5",
            "voltage",
            "duty"
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
          ? "Analysis: Your solution contains the expected PWM brightness logic."
          : "Analysis: Your answer is partially correct. Include proper PWM calculations and brightness control logic.",

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
            Practice PWM LED
            brightness logic and
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
            PWM signal generation
            and LED brightness
            control.
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
            Duty cycle,
            analogWrite,
            brightness scaling,
            voltage averaging.
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
            Easy to medium PWM
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
              PWM LED Coding
              Workspace
            </h3>

            <p>
              Run JavaScript
              solutions against
              live PWM test cases.
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
                    PWM Problem
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