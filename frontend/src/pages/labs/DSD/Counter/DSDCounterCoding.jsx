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
    title: "2-bit Counter Next State",
    description:
      "Write a function nextCounterState(count) that returns the next count value for a 2-bit up counter.",
    functionName: "nextCounterState",
    tests: [
      { input: [0], expected: 1 },
      { input: [1], expected: 2 },
      { input: [2], expected: 3 },
      { input: [3], expected: 0 }
    ]
  },
  {
    id: 2,
    title: "Counter Binary Output",
    description:
      "Write a function counterBinary(count) that returns the 2-bit binary output string Q1Q0.",
    functionName: "counterBinary",
    tests: [
      { input: [0], expected: "00" },
      { input: [1], expected: "01" },
      { input: [2], expected: "10" },
      { input: [3], expected: "11" }
    ]
  },
  {
    id: 3,
    title: "Counter Result Object",
    description:
      "Write a function counterResult(count) that returns { q1, q0, binary, nextBinary }.",
    functionName: "counterResult",
    tests: [
      {
        input: [0],
        expected: { q1: 0, q0: 0, binary: "00", nextBinary: "01" }
      },
      {
        input: [1],
        expected: { q1: 0, q0: 1, binary: "01", nextBinary: "10" }
      },
      {
        input: [2],
        expected: { q1: 1, q0: 0, binary: "10", nextBinary: "11" }
      },
      {
        input: [3],
        expected: { q1: 1, q0: 1, binary: "11", nextBinary: "00" }
      }
    ]
  }
];

const templates = {
  javascript: [
    `function nextCounterState(count) {
  return (count + 1) % 4;
}`,
    `function counterBinary(count) {
  return count.toString(2).padStart(2, "0");
}`,
    `function counterResult(count) {
  const q1 = Math.floor(count / 2);
  const q0 = count % 2;
  const binary = count.toString(2).padStart(2, "0");

  const nextCount = (count + 1) % 4;
  const nextBinary = nextCount.toString(2).padStart(2, "0");

  return {
    q1,
    q0,
    binary,
    nextBinary
  };
}`
  ],
  python: [
    `def nextCounterState(count):
    return (count + 1) % 4`,
    `def counterBinary(count):
    return format(count, "02b")`,
    `def counterResult(count):
    q1 = count // 2
    q0 = count % 2
    binary = format(count, "02b")

    next_count = (count + 1) % 4
    next_binary = format(next_count, "02b")

    return {
        "q1": q1,
        "q0": q0,
        "binary": binary,
        "nextBinary": next_binary
    }`
  ],
  cpp: [
    `int nextCounterState(int count) {
  return (count + 1) % 4;
}`,
    `string counterBinary(int count) {
  return bitset<2>(count).to_string();
}`,
    `// Return q1, q0, binary, and nextBinary using a struct in your compiler setup.
string counterResult(int count) {
  int q1 = count / 2;
  int q0 = count % 2;
  int nextCount = (count + 1) % 4;

  return bitset<2>(count).to_string() + " -> " + bitset<2>(nextCount).to_string();
}`
  ],
  c: [
    `int nextCounterState(int count) {
  return (count + 1) % 4;
}`,
    `// Store binary output in q1 and q0 pointers
void counterBinary(int count, int *q1, int *q0) {
  *q1 = count / 2;
  *q0 = count % 2;
}`,
    `// Store q1, q0, nextQ1, and nextQ0 using pointers
void counterResult(int count, int *q1, int *q0, int *nextQ1, int *nextQ0) {
  int nextCount = (count + 1) % 4;

  *q1 = count / 2;
  *q0 = count % 2;
  *nextQ1 = nextCount / 2;
  *nextQ0 = nextCount % 2;
}`
  ],
  java: [
    `public static int nextCounterState(int count) {
  return (count + 1) % 4;
}`,
    `public static String counterBinary(int count) {
  return String.format("%2s", Integer.toBinaryString(count)).replace(' ', '0');
}`,
    `public static Map<String, Object> counterResult(int count) {
  Map<String, Object> result = new HashMap<>();

  int q1 = count / 2;
  int q0 = count % 2;
  String binary = String.format("%2s", Integer.toBinaryString(count)).replace(' ', '0');

  int nextCount = (count + 1) % 4;
  String nextBinary = String.format("%2s", Integer.toBinaryString(nextCount)).replace(' ', '0');

  result.put("q1", q1);
  result.put("q0", q0);
  result.put("binary", binary);
  result.put("nextBinary", nextBinary);

  return result;
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

export default function DSDCounterCoding({ count, clockPulses, analysis }) {
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
    return `Current state: Count = ${count}, Q1Q0 = ${analysis.binary}, next state = ${analysis.nextBinary}, clock pulses = ${clockPulses}.`;
  }, [count, clockPulses, analysis]);

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
        labSlug: "dsd",
        experimentSlug: "counter",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(index, "Submission saved to dashboard.");
    } catch (error) {
      console.error("Counter coding save failed:", error);
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
        ? ["return", "%", "4"]
        : index === 1
        ? ["return", "tostring", "padstart"]
        : ["q1", "q0", "binary", "nextbinary"];

    const score = expected.filter((token) => content.includes(token)).length;

    setResultAt(index, {
      message:
        score >= Math.max(2, expected.length - 1)
          ? "Analysis: Your solution includes the expected counter state logic."
          : "Analysis: Your answer is partially correct, but it should include modulo-4 counting and binary state conversion.",
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
          <h2 className="sorting-sim-title">Design Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice counter state logic with real test cases.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>Counter Test Case Workspace</h3>
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
                <span>Sequential Logic Problem</span>
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