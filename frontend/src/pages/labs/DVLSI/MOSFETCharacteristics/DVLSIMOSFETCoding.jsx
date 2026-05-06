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
    title: "Cutoff Detection",
    description:
      "Write a function isCutoff(vgs, vt) that returns true when VGS is below threshold voltage.",
    functionName: "isCutoff",
    tests: [
      { input: [0.8, 1.0], expected: true },
      { input: [1.0, 1.0], expected: false },
      { input: [2.5, 1.0], expected: false }
    ]
  },
  {
    id: 2,
    title: "Triode Current",
    description:
      "Write a function triodeCurrent(vgs, vds, vt, k) using Id = k[(VGS − VT)VDS − VDS²/2].",
    functionName: "triodeCurrent",
    tests: [
      { input: [2.5, 1.0, 1.0, 1.0], expected: 1.0 },
      { input: [3.0, 1.0, 1.0, 2.0], expected: 3.0 },
      { input: [2.0, 0.5, 1.0, 1.0], expected: 0.375 }
    ]
  },
  {
    id: 3,
    title: "Saturation Current",
    description:
      "Write a function saturationCurrent(vgs, vt, k) using Id = 0.5k(VGS − VT)².",
    functionName: "saturationCurrent",
    tests: [
      { input: [2.5, 1.0, 1.0], expected: 1.125 },
      { input: [3.0, 1.0, 2.0], expected: 4.0 },
      { input: [1.5, 1.0, 1.0], expected: 0.125 }
    ]
  }
];

const templates = {
  javascript: [
    `function isCutoff(vgs, vt) {
  return vgs < vt;
}`,
    `function triodeCurrent(vgs, vds, vt, k) {
  return k * ((vgs - vt) * vds - (vds * vds) / 2);
}`,
    `function saturationCurrent(vgs, vt, k) {
  return 0.5 * k * Math.pow(vgs - vt, 2);
}`
  ],
  python: [
    `def isCutoff(vgs, vt):
    return vgs < vt`,
    `def triodeCurrent(vgs, vds, vt, k):
    return k * ((vgs - vt) * vds - (vds * vds) / 2)`,
    `def saturationCurrent(vgs, vt, k):
    return 0.5 * k * (vgs - vt) ** 2`
  ],
  cpp: [
    `bool isCutoff(double vgs, double vt) {
  return vgs < vt;
}`,
    `double triodeCurrent(double vgs, double vds, double vt, double k) {
  return k * ((vgs - vt) * vds - (vds * vds) / 2.0);
}`,
    `double saturationCurrent(double vgs, double vt, double k) {
  return 0.5 * k * pow(vgs - vt, 2);
}`
  ],
  c: [
    `int isCutoff(double vgs, double vt) {
  return vgs < vt;
}`,
    `double triodeCurrent(double vgs, double vds, double vt, double k) {
  return k * ((vgs - vt) * vds - (vds * vds) / 2.0);
}`,
    `double saturationCurrent(double vgs, double vt, double k) {
  return 0.5 * k * (vgs - vt) * (vgs - vt);
}`
  ],
  java: [
    `public static boolean isCutoff(double vgs, double vt) {
  return vgs < vt;
}`,
    `public static double triodeCurrent(double vgs, double vds, double vt, double k) {
  return k * ((vgs - vt) * vds - (vds * vds) / 2.0);
}`,
    `public static double saturationCurrent(double vgs, double vt, double k) {
  return 0.5 * k * Math.pow(vgs - vt, 2);
}`
  ]
};

function normalizeNumber(value) {
  return typeof value === "number" ? Number(value.toFixed(6)) : value;
}

function deepEqual(a, b) {
  return JSON.stringify(normalizeNumber(a)) === JSON.stringify(normalizeNumber(b));
}

function runJavascript(problem, code) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(`${code}; return ${problem.functionName};`)();

  const testResults = problem.tests.map((test) => {
    const actualRaw = fn(...test.input);
    const actual = normalizeNumber(actualRaw);
    const expected = normalizeNumber(test.expected);
    const passed = deepEqual(actual, expected);

    return {
      input: test.input,
      expected,
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

export default function DVLSIMOSFETCoding({
  analysis,
  vgs,
  vds,
  vt,
  k,
  lambda
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
    return `Current MOSFET state: VGS = ${vgs} V, VDS = ${vds} V, VT = ${vt} V, region = ${analysis.region}, ID ≈ ${Number(
      analysis.id || 0
    ).toFixed(4)} A.`;
  }, [analysis, vgs, vds, vt]);

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
        experimentSlug: "mosfet-characteristics",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(index, "Submission saved to dashboard.");
    } catch (error) {
      console.error("MOSFET coding save failed:", error);
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
        ? ["vgs", "vt", "return"]
        : index === 1
        ? ["vgs", "vds", "vt", "k", "return"]
        : ["vgs", "vt", "k", "return"];

    const score = expected.filter((token) => content.includes(token)).length;

    setResultAt(index, {
      message:
        score >= Math.max(2, expected.length - 1)
          ? "Analysis: Your solution includes the expected MOSFET equation logic."
          : "Analysis: Your answer is partially correct, but it should include MOSFET voltage parameters and the correct current equation.",
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
            Practice MOSFET region checks and drain current equations with real
            test cases.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>MOSFET Equation Test Case Workspace</h3>
            <p>
              Run JavaScript solutions against test cases. Other languages are
              saved as attempted submissions for now.
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
                <span>Device Equation Problem</span>
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
              later. For now, direct execution works in JavaScript.
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
            <div className="coding-result-box">{codingSaveStatus[index]}</div>
          )}
        </div>
      ))}
    </section>
  );
}