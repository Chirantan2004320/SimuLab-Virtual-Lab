import React, { useEffect, useMemo, useState } from "react";
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
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" }
];

const problems = [
  {
    id: 1,
    title: "Minimum Spacing Check",
    description:
      "Write a function checkSpacing(actual, required) that returns true if the chosen spacing satisfies the minimum layout rule.",
    functionName: "checkSpacing",
    tests: [
      { input: [3, 2], expected: true },
      { input: [2, 2], expected: true },
      { input: [1, 2], expected: false }
    ]
  },
  {
    id: 2,
    title: "Contact Validation",
    description:
      "Write a function validContactSize(actual, required) that returns PASS if the contact size is valid, otherwise FAIL.",
    functionName: "validContactSize",
    tests: [
      { input: [3, 2], expected: "PASS" },
      { input: [2, 2], expected: "PASS" },
      { input: [1, 2], expected: "FAIL" }
    ]
  },
  {
    id: 3,
    title: "Lambda Dimension Calculator",
    description:
      "Write a function dimensionInLambda(lambdaValue, multiplier) that returns the final layout dimension.",
    functionName: "dimensionInLambda",
    tests: [
      { input: [2, 4], expected: 8 },
      { input: [1.5, 2], expected: 3 },
      { input: [0.5, 6], expected: 3 }
    ]
  }
];

const templates = {
  javascript: [
    `function checkSpacing(actual, required) {
  return actual >= required;
}`,

    `function validContactSize(actual, required) {
  return actual >= required ? "PASS" : "FAIL";
}`,

    `function dimensionInLambda(lambdaValue, multiplier) {
  return lambdaValue * multiplier;
}`
  ],

  python: [
    `def checkSpacing(actual, required):
    return actual >= required`,

    `def validContactSize(actual, required):
    return "PASS" if actual >= required else "FAIL"`,

    `def dimensionInLambda(lambdaValue, multiplier):
    return lambdaValue * multiplier`
  ],

  cpp: [
    `bool checkSpacing(double actual, double required) {
  return actual >= required;
}`,

    `string validContactSize(double actual, double required) {
  return actual >= required ? "PASS" : "FAIL";
}`,

    `double dimensionInLambda(double lambdaValue, double multiplier) {
  return lambdaValue * multiplier;
}`
  ],

  c: [
    `int checkSpacing(double actual, double required) {
  return actual >= required;
}`,

    `// Return 1 for PASS and 0 for FAIL
int validContactSize(double actual, double required) {
  return actual >= required ? 1 : 0;
}`,

    `double dimensionInLambda(double lambdaValue, double multiplier) {
  return lambdaValue * multiplier;
}`
  ],

  java: [
    `public static boolean checkSpacing(double actual, double required) {
  return actual >= required;
}`,

    `public static String validContactSize(double actual, double required) {
  return actual >= required ? "PASS" : "FAIL";
}`,

    `public static double dimensionInLambda(double lambdaValue, double multiplier) {
  return lambdaValue * multiplier;
}`
  ]
};

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runJavascript(problem, code) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(`${code}; return ${problem.functionName};`)();

  const testResults = problem.tests.map((test) => {
    const actual = fn(...test.input);
    const passed = deepEqual(actual, test.expected);

    return {
      input: test.input,
      expected: test.expected,
      actual,
      passed
    };
  });

  return {
    passed: testResults.every((test) => test.passed),
    testResults
  };
}

function TestCaseTable({ testResults }) {
  if (!testResults?.length) return null;

  return (
    <div style={{ marginTop: 14, overflowX: "auto" }}>
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
          {testResults.map((test, index) => (
            <tr key={index}>
              <td>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: test.passed ? "#22c55e" : "#ef4444",
                    fontWeight: 800
                  }}
                >
                  {test.passed ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <XCircle size={15} />
                  )}

                  {test.passed ? "Passed" : "Failed"}
                </span>
              </td>

              <td>{JSON.stringify(test.input)}</td>

              <td>
                <code>{JSON.stringify(test.expected)}</code>
              </td>

              <td>
                <code>{JSON.stringify(test.actual)}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DVLSICMOSInverterLayoutCoding({
  analysis = {},
  lambdaValue = 1,
  polyWidth = 2,
  metalWidth = 3,
  contactSize = 2,
  spacing = 2
}) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codes, setCodes] = useState([]);
  const [results, setResults] = useState([]);
  const [codingSaveStatus, setCodingSaveStatus] = useState([]);

  useEffect(() => {
    setCodes(templates[selectedLanguage]);
    setResults(Array(problems.length).fill(null));
    setCodingSaveStatus(Array(problems.length).fill(""));
  }, [selectedLanguage]);

  const currentInsight = useMemo(() => {
    return `Current Layout → λ=${lambdaValue}, Poly=${polyWidth}λ, Metal=${metalWidth}λ, Contact=${contactSize}λ, Spacing=${spacing}λ, DRC=${analysis.allPass ? "PASS" : "FAIL"}.`;
  }, [
    analysis,
    lambdaValue,
    polyWidth,
    metalWidth,
    contactSize,
    spacing
  ]);

  const handleCodeChange = (index, value) => {
    setCodes((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const setResultAt = (index, value) => {
    setResults((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const setSaveStatusAt = (index, value) => {
    setCodingSaveStatus((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const saveSubmission = async ({ index, problem, code, result }) => {
    setSaveStatusAt(index, "Saving submission...");

    try {
      await saveCodingSubmission({
        labSlug: "dvlsi",
        experimentSlug: "cmos-inverter-layout",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(index, "Submission saved to dashboard.");
    } catch (error) {
      console.error("CMOS Inverter Layout coding save failed:", error);

      setSaveStatusAt(index, "Code checked, but backend save failed.");
    }
  };

  const runCode = async (index) => {
    const problem = problems[index];
    const code = codes[index];

    if (!code?.trim()) {
      setResultAt(index, {
        message: "Please enter code first.",
        passed: false,
        testResults: []
      });

      return;
    }

    if (selectedLanguage !== "javascript") {
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
      const output = runJavascript(problem, code);

      setResultAt(index, {
        message: output.passed
          ? "All test cases passed."
          : "Some test cases failed. Check the table below.",

        passed: output.passed,
        testResults: output.testResults
      });

      await saveSubmission({
        index,
        problem,
        code,
        result: output.passed ? "passed" : "failed"
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

  const analyzeCode = (index) => {
    const content = (codes[index] || "").toLowerCase();

    const expected =
      index === 0
        ? ["actual", "required", "return"]
        : index === 1
        ? ["pass", "fail", "required"]
        : ["lambdavalue", "multiplier", "return"];

    const score = expected.filter((token) =>
      content.includes(token)
    ).length;

    setResultAt(index, {
      message:
        score >= Math.max(2, expected.length - 1)
          ? "Analysis: Your solution includes the expected layout validation logic."
          : "Analysis: Your solution is partially correct. Include proper validation and return logic.",

      passed: null,
      testResults: []
    });
  };

  const correctCode = (index) => {
    setCodes((prev) =>
      prev.map((item, i) =>
        i === index ? templates[selectedLanguage][index] : item
      )
    );

    setResultAt(index, {
      message: "Model answer loaded for this problem.",
      passed: null,
      testResults: []
    });
  };

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <FileCode2 size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>

          <p className="sorting-sim-subtitle">
            Practice CMOS inverter layout validation logic using live test cases.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>CMOS Layout Coding Workspace</h3>

            <p>
              Run JavaScript solutions against test cases. Other languages are
              currently saved as attempted submissions.
            </p>
          </div>

          <div className="coding-language-wrap">
            <label className="sorting-label">Language</label>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
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
      </div>

      {problems.map((problem, index) => (
        <div key={problem.id} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(56,189,248,0.10)",
                  border: "1px solid rgba(56,189,248,0.18)",
                  color: "#38bdf8",
                  fontWeight: 700,
                  fontSize: "0.82rem"
                }}
              >
                <Sparkles size={14} />
                <span>CMOS Layout Problem</span>
              </div>

              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
            </div>
          </div>

          <textarea
            value={codes[index] || ""}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            rows={12}
            className="coding-textarea-upgraded"
            placeholder="Write your code here..."
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => runCode(index)}
            >
              <Play size={16} />
              Run Tests
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => analyzeCode(index)}
            >
              <Wrench size={16} />
              Analyze
            </button>

            <button
              className="sim-btn sim-btn-success"
              onClick={() => correctCode(index)}
            >
              Load Correct
            </button>
          </div>

          {selectedLanguage !== "javascript" && (
            <div className="coding-result-box" style={{ marginTop: 14 }}>
              Execution for {selectedLanguage.toUpperCase()} will be enabled
              later. For now, direct execution works only in JavaScript.
            </div>
          )}

          {results[index] && (
            <div className="coding-result-box">
              <strong
                style={{
                  color:
                    results[index].passed === true
                      ? "#22c55e"
                      : results[index].passed === false
                      ? "#ef4444"
                      : "#e2e8f0"
                }}
              >
                {results[index].message}
              </strong>

              <TestCaseTable testResults={results[index].testResults} />
            </div>
          )}

          {codingSaveStatus[index] && (
            <div className="coding-result-box">
              {codingSaveStatus[index]}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}