import React, { useEffect, useMemo, useState } from "react";
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
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" }
];

const problems = [
  {
    id: 1,
    title: "CMOS Inverter Logic",
    description:
      "Write a function inverterOutput(vin, vm, vdd) that returns HIGH if Vin is below VM, otherwise LOW.",
    functionName: "inverterOutput",
    tests: [
      { input: [1, 2.5, 5], expected: "HIGH" },
      { input: [4, 2.5, 5], expected: "LOW" },
      { input: [2, 2.5, 5], expected: "HIGH" }
    ]
  },
  {
    id: 2,
    title: "Noise Margin Estimation",
    description:
      "Write a function noiseMargins(vm, vdd) that returns an object { nml, nmh }.",
    functionName: "noiseMargins",
    tests: [
      {
        input: [2.5, 5],
        expected: { nml: 2.5, nmh: 2.5 }
      },
      {
        input: [1, 5],
        expected: { nml: 1, nmh: 4 }
      }
    ]
  },
  {
    id: 3,
    title: "Dynamic Power Calculation",
    description:
      "Write a function dynamicPower(cap, vdd) using the relation 0.5 × C × VDD².",
    functionName: "dynamicPower",
    tests: [
      { input: [10, 5], expected: 125 },
      { input: [2, 5], expected: 25 },
      { input: [4, 2], expected: 8 }
    ]
  }
];

const templates = {
  javascript: [
    `function inverterOutput(vin, vm, vdd) {
  return vin < vm ? "HIGH" : "LOW";
}`,

    `function noiseMargins(vm, vdd) {
  return {
    nml: vm,
    nmh: vdd - vm
  };
}`,

    `function dynamicPower(cap, vdd) {
  return 0.5 * cap * vdd * vdd;
}`
  ],

  python: [
    `def inverterOutput(vin, vm, vdd):
    return "HIGH" if vin < vm else "LOW"`,

    `def noiseMargins(vm, vdd):
    return {
        "nml": vm,
        "nmh": vdd - vm
    }`,

    `def dynamicPower(cap, vdd):
    return 0.5 * cap * vdd * vdd`
  ],

  cpp: [
    `string inverterOutput(double vin, double vm, double vdd) {
  return vin < vm ? "HIGH" : "LOW";
}`,

    `map<string, double> noiseMargins(double vm, double vdd) {
  return {
    {"nml", vm},
    {"nmh", vdd - vm}
  };
}`,

    `double dynamicPower(double cap, double vdd) {
  return 0.5 * cap * vdd * vdd;
}`
  ],

  c: [
    `char* inverterOutput(double vin, double vm, double vdd) {
  return vin < vm ? "HIGH" : "LOW";
}`,

    `// Return values manually in C
void noiseMargins(double vm, double vdd) {
  double nml = vm;
  double nmh = vdd - vm;
}`,

    `double dynamicPower(double cap, double vdd) {
  return 0.5 * cap * vdd * vdd;
}`
  ],

  java: [
    `public static String inverterOutput(double vin, double vm, double vdd) {
  return vin < vm ? "HIGH" : "LOW";
}`,

    `public static Map<String, Double> noiseMargins(double vm, double vdd) {
  Map<String, Double> result = new HashMap<>();
  result.put("nml", vm);
  result.put("nmh", vdd - vm);
  return result;
}`,

    `public static double dynamicPower(double cap, double vdd) {
  return 0.5 * cap * vdd * vdd;
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

export default function DVLSICMOSInverterSimulationCoding({
  analysis,
  vin,
  vdd,
  switchPoint,
  tpd,
  loadCap
}) {
  const [selectedLanguage, setSelectedLanguage] =
    useState("javascript");

  const [codes, setCodes] = useState([]);
  const [results, setResults] = useState([]);
  const [codingSaveStatus, setCodingSaveStatus] = useState([]);

  useEffect(() => {
    setCodes(templates[selectedLanguage]);
    setResults(Array(problems.length).fill(null));
    setCodingSaveStatus(Array(problems.length).fill(""));
  }, [selectedLanguage]);

  const currentInsight = useMemo(() => {
    return `Current simulation: Vin=${vin}V, VDD=${vdd}V, VM=${switchPoint}V, Delay=${tpd}ns, LoadCap=${loadCap}fF, Output=${analysis.logicRegion}.`;
  }, [analysis, vin, vdd, switchPoint, tpd, loadCap]);

  const handleCodeChange = (index, value) => {
    setCodes((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const setResultAt = (index, value) => {
    setResults((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const setSaveStatusAt = (index, value) => {
    setCodingSaveStatus((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const saveSubmission = async ({
    index,
    problem,
    code,
    result
  }) => {
    setSaveStatusAt(index, "Saving submission...");

    try {
      await saveCodingSubmission({
        labSlug: "dvlsi",
        experimentSlug: "cmos-inverter-simulation",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(
        index,
        "Submission saved to dashboard."
      );
    } catch (error) {
      console.error("CMOS coding save failed:", error);

      setSaveStatusAt(
        index,
        "Code checked, but backend save failed."
      );
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
        ? ["vin", "vm", "high", "low"]
        : index === 1
        ? ["nml", "nmh", "return"]
        : ["0.5", "cap", "vdd"];

    const score = expected.filter((token) =>
      content.includes(token)
    ).length;

    setResultAt(index, {
      message:
        score >= Math.max(2, expected.length - 1)
          ? "Analysis: Your solution contains the expected CMOS inverter logic."
          : "Analysis: Your answer is partially correct. Include the required inverter calculations and return values.",
      passed: null,
      testResults: []
    });
  };

  const correctCode = (index) => {
    setCodes((prev) =>
      prev.map((item, i) =>
        i === index
          ? templates[selectedLanguage][index]
          : item
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
          <h2 className="sorting-sim-title">
            Coding Practice
          </h2>

          <p className="sorting-sim-subtitle">
            Practice CMOS inverter logic and run real
            test-case validations.
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

          <p>CMOS logic and switching behavior.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Topics Covered</h4>
          </div>

          <p>Logic inversion, delay, noise margin, power.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Difficulty</h4>
          </div>

          <p>Easy to medium CMOS coding problems.</p>
        </div>
      </div>

      <div
        className="coding-empty-state"
        style={{ marginBottom: 18 }}
      >
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div
        className="coding-card-upgraded"
        style={{ marginBottom: 18 }}
      >
        <div className="coding-card-header">
          <div>
            <h3>CMOS Inverter Coding Workspace</h3>

            <p>
              Run JavaScript solutions against live test
              cases. Other languages are currently stored
              as attempted submissions.
            </p>
          </div>

          <div className="coding-language-wrap">
            <label className="sorting-label">
              Language
            </label>

            <select
              value={selectedLanguage}
              onChange={(e) =>
                setSelectedLanguage(e.target.value)
              }
              className="sorting-select"
            >
              {LANGUAGES.map((lang) => (
                <option
                  key={lang.value}
                  value={lang.value}
                >
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {problems.map((problem, index) => (
        <div
          key={problem.id}
          className="coding-card-upgraded"
        >
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
                  background:
                    "rgba(56,189,248,0.10)",
                  border:
                    "1px solid rgba(56,189,248,0.18)",
                  color: "#38bdf8",
                  fontWeight: 700,
                  fontSize: "0.82rem"
                }}
              >
                <Sparkles size={14} />
                <span>CMOS Problem</span>
              </div>

              <h3>{problem.title}</h3>

              <p>{problem.description}</p>
            </div>
          </div>

          <textarea
            value={codes[index] || ""}
            onChange={(e) =>
              handleCodeChange(index, e.target.value)
            }
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
            <div
              className="coding-result-box"
              style={{ marginTop: 14 }}
            >
              Execution for{" "}
              {selectedLanguage.toUpperCase()} will be
              enabled later. For now, direct execution
              works in JavaScript.
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

              <TestCaseTable
                testResults={results[index].testResults}
              />
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