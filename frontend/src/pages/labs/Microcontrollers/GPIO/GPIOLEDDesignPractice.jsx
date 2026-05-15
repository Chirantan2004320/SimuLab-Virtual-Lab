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
  XCircle
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

    title: "Configure GPIO Pin",

    description:
      "Write a function configurePin() that returns the Arduino statement required to configure GPIO pin 13 as OUTPUT.",

    functionName: "configurePin",

    tests: [
      {
        input: [],
        expected: "pinMode(13, OUTPUT);"
      }
    ]
  },

  {
    id: 2,

    title: "Turn LED ON",

    description:
      "Write a function ledOn() that returns the Arduino statement required to turn ON the LED connected to GPIO pin 13.",

    functionName: "ledOn",

    tests: [
      {
        input: [],
        expected: "digitalWrite(13, HIGH);"
      }
    ]
  },

  {
    id: 3,

    title: "Turn LED OFF",

    description:
      "Write a function ledOff() that returns the Arduino statement required to turn OFF the LED connected to GPIO pin 13.",

    functionName: "ledOff",

    tests: [
      {
        input: [],
        expected: "digitalWrite(13, LOW);"
      }
    ]
  },

  {
    id: 4,

    title: "GPIO LED Logic",

    description:
      "Write a function ledState(pinState) that returns 'ON' when the GPIO state is HIGH and 'OFF' when the GPIO state is LOW.",

    functionName: "ledState",

    tests: [
      {
        input: ["HIGH"],
        expected: "ON"
      },

      {
        input: ["LOW"],
        expected: "OFF"
      }
    ]
  }
];

const templates = {
  javascript: [
    `function configurePin() {
  return "pinMode(13, OUTPUT);";
}`,

    `function ledOn() {
  return "digitalWrite(13, HIGH);";
}`,

    `function ledOff() {
  return "digitalWrite(13, LOW);";
}`,

    `function ledState(pinState) {
  return pinState === "HIGH"
    ? "ON"
    : "OFF";
}`
  ],

  python: [
    `def configurePin():
    return "pinMode(13, OUTPUT);"`,

    `def ledOn():
    return "digitalWrite(13, HIGH);"`,

    `def ledOff():
    return "digitalWrite(13, LOW);"`,

    `def ledState(pinState):
    return "ON" if pinState == "HIGH" else "OFF"`
  ],

  cpp: [
    `string configurePin() {
  return "pinMode(13, OUTPUT);";
}`,

    `string ledOn() {
  return "digitalWrite(13, HIGH);";
}`,

    `string ledOff() {
  return "digitalWrite(13, LOW);";
}`,

    `string ledState(string pinState) {
  return pinState == "HIGH"
    ? "ON"
    : "OFF";
}`
  ],

  c: [
    `char* configurePin() {
  return "pinMode(13, OUTPUT);";
}`,

    `char* ledOn() {
  return "digitalWrite(13, HIGH);";
}`,

    `char* ledOff() {
  return "digitalWrite(13, LOW);";
}`,

    `char* ledState(char* pinState) {
  return strcmp(pinState, "HIGH") == 0
    ? "ON"
    : "OFF";
}`
  ],

  java: [
    `public static String configurePin() {
  return "pinMode(13, OUTPUT);";
}`,

    `public static String ledOn() {
  return "digitalWrite(13, HIGH);";
}`,

    `public static String ledOff() {
  return "digitalWrite(13, LOW);";
}`,

    `public static String ledState(String pinState) {
  return pinState.equals("HIGH")
    ? "ON"
    : "OFF";
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

  const testResults = problem.tests.map((test) => {
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
  });

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
  if (!testResults?.length) {
    return null;
  }

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

export default function GPIOLEDDesignPractice({
  analysis = {}
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
      return `Current GPIO State → Pin Mode = ${analysis.pinMode}, GPIO = ${
        analysis.pinState
          ? "HIGH"
          : "LOW"
      }, Voltage = ${
        analysis.voltage
      }, LED = ${
        analysis.led
          ? "ON"
          : "OFF"
      }.`;
    }, [analysis]);

  const handleCodeChange = (
    index,
    value
  ) => {
    setCodes((prev) =>
      prev.map((item, i) =>
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
      prev.map((item, i) =>
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
    setCodingSaveStatus((prev) =>
      prev.map((item, i) =>
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
        await saveCodingSubmission({
          labSlug:
            "microcontroller",

          experimentSlug:
            "gpio-led",

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
          "GPIO LED coding save failed:",
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
        message:
          output.passed
            ? "All test cases passed."
            : "Some test cases failed. Check the table below.",

        passed:
          output.passed,

        testResults:
          output.testResults
      });

      await saveSubmission({
        index,
        problem,
        code,

        result:
          output.passed
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
            "pinmode",
            "output"
          ]
        : index === 1
        ? [
            "digitalwrite",
            "high"
          ]
        : index === 2
        ? [
            "digitalwrite",
            "low"
          ]
        : [
            "high",
            "on",
            "off"
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
          ? "Analysis: Your solution includes the expected GPIO LED logic."
          : "Analysis: Your solution is partially correct. Review the GPIO LED logic and try again.",

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
        style={{
          marginBottom: 18
        }}
      >
        <div className="sorting-sim-icon">
          <FileCode2 size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Coding Practice
          </h2>

          <p className="sorting-sim-subtitle">
            Practice GPIO LED
            programming concepts
            using live coding test
            cases.
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
              GPIO LED Coding
              Workspace
            </h3>

            <p>
              Run JavaScript
              solutions against
              GPIO LED test cases.
              Other languages are
              currently saved as
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
                    GPIO LED
                    Problem
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
                <Wrench size={16} />
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
                will be enabled
                later. For now,
                direct execution
                works only in
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
                      ].passed ===
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