import React, { useEffect, useState } from "react";
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
    title: "4-to-1 MUX Output",
    description:
      "Write a function mux4(I0, I1, I2, I3, S1, S0) that returns the selected input.",
    functionName: "mux4",
    tests: [
      { input: [0, 1, 0, 1, 0, 0], expected: 0 },
      { input: [0, 1, 0, 1, 0, 1], expected: 1 },
      { input: [0, 1, 0, 1, 1, 0], expected: 0 },
      { input: [0, 1, 0, 1, 1, 1], expected: 1 }
    ]
  },
  {
    id: 2,
    title: "Selected Input Index",
    description:
      "Write a function selectedInputIndex(S1, S0) that returns 0, 1, 2, or 3 based on select lines.",
    functionName: "selectedInputIndex",
    tests: [
      { input: [0, 0], expected: 0 },
      { input: [0, 1], expected: 1 },
      { input: [1, 0], expected: 2 },
      { input: [1, 1], expected: 3 }
    ]
  },
  {
    id: 3,
    title: "MUX Result Object",
    description:
      "Write a function muxResult(I0, I1, I2, I3, S1, S0) that returns { selected: 'I2', output: 0 }.",
    functionName: "muxResult",
    tests: [
      {
        input: [1, 0, 1, 0, 0, 0],
        expected: { selected: "I0", output: 1 }
      },
      {
        input: [1, 0, 1, 0, 0, 1],
        expected: { selected: "I1", output: 0 }
      },
      {
        input: [1, 0, 1, 0, 1, 0],
        expected: { selected: "I2", output: 1 }
      },
      {
        input: [1, 0, 1, 0, 1, 1],
        expected: { selected: "I3", output: 0 }
      }
    ]
  }
];

const templates = {
  javascript: [
    `function mux4(I0, I1, I2, I3, S1, S0) {
  const inputs = [I0, I1, I2, I3];
  const index = S1 * 2 + S0;

  return inputs[index];
}`,
    `function selectedInputIndex(S1, S0) {
  return S1 * 2 + S0;
}`,
    `function muxResult(I0, I1, I2, I3, S1, S0) {
  const inputs = [I0, I1, I2, I3];
  const index = S1 * 2 + S0;

  return {
    selected: "I" + index,
    output: inputs[index]
  };
}`
  ],
  python: [
    `def mux4(I0, I1, I2, I3, S1, S0):
    inputs = [I0, I1, I2, I3]
    index = S1 * 2 + S0
    return inputs[index]`,
    `def selectedInputIndex(S1, S0):
    return S1 * 2 + S0`,
    `def muxResult(I0, I1, I2, I3, S1, S0):
    inputs = [I0, I1, I2, I3]
    index = S1 * 2 + S0
    return {
        "selected": "I" + str(index),
        "output": inputs[index]
    }`
  ],
  cpp: [
    `int mux4(int I0, int I1, int I2, int I3, int S1, int S0) {
  int inputs[4] = {I0, I1, I2, I3};
  int index = S1 * 2 + S0;

  return inputs[index];
}`,
    `int selectedInputIndex(int S1, int S0) {
  return S1 * 2 + S0;
}`,
    `// Return selected label and output using pair<string, int>
pair<string, int> muxResult(int I0, int I1, int I2, int I3, int S1, int S0) {
  int inputs[4] = {I0, I1, I2, I3};
  int index = S1 * 2 + S0;

  return {"I" + to_string(index), inputs[index]};
}`
  ],
  c: [
    `int mux4(int I0, int I1, int I2, int I3, int S1, int S0) {
  int inputs[4] = {I0, I1, I2, I3};
  int index = S1 * 2 + S0;

  return inputs[index];
}`,
    `int selectedInputIndex(int S1, int S0) {
  return S1 * 2 + S0;
}`,
    `// Use pointers to return selected index and output
void muxResult(int I0, int I1, int I2, int I3, int S1, int S0, int *selected, int *output) {
  int inputs[4] = {I0, I1, I2, I3};
  int index = S1 * 2 + S0;

  *selected = index;
  *output = inputs[index];
}`
  ],
  java: [
    `public static int mux4(int I0, int I1, int I2, int I3, int S1, int S0) {
  int[] inputs = {I0, I1, I2, I3};
  int index = S1 * 2 + S0;

  return inputs[index];
}`,
    `public static int selectedInputIndex(int S1, int S0) {
  return S1 * 2 + S0;
}`,
    `public static Object[] muxResult(int I0, int I1, int I2, int I3, int S1, int S0) {
  int[] inputs = {I0, I1, I2, I3};
  int index = S1 * 2 + S0;

  return new Object[]{"I" + index, inputs[index]};
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
              <td>{test.input.join(", ")}</td>
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

export default function DSDMultiplexerCoding({ analysis }) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codes, setCodes] = useState([]);
  const [results, setResults] = useState([]);
  const [codingSaveStatus, setCodingSaveStatus] = useState([]);

  useEffect(() => {
    setCodes(templates[selectedLanguage]);
    setResults(Array(problems.length).fill(null));
    setCodingSaveStatus(Array(problems.length).fill(""));
  }, [selectedLanguage]);

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
        experimentSlug: "multiplexer",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(index, "Submission saved to dashboard.");
    } catch (error) {
      console.error("Multiplexer coding save failed:", error);
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
        ? ["s1", "s0", "return"]
        : index === 1
        ? ["s1", "s0", "2"]
        : ["selected", "output", "s1", "s0"];

    const score = expected.filter((token) => content.includes(token)).length;

    setResultAt(index, {
      message:
        score >= Math.max(2, expected.length - 1)
          ? "Analysis: Your solution includes the expected multiplexer logic."
          : "Analysis: Your answer is partially correct, but it should include select-line based routing.",
      passed: null,
      testResults: []
    });
  };

  const correctCode = (index) => {
    setCodes((prev) =>
      prev.map((item, i) => (i === index ? templates[selectedLanguage][index] : item))
    );

    setResultAt(index, {
      message: "Model answer loaded for this problem.",
      passed: null,
      testResults: []
    });
  };

  const currentInsight = `Current state: S1S0 = ${analysis.selectCode}, so ${analysis.selectedInputLabel} is selected and Y = ${analysis.output}.`;

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <FileCode2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Design Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice 4-to-1 multiplexer logic with real test cases.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>Multiplexer Test Case Workspace</h3>
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
                <span>4-to-1 MUX Problem</span>
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
              Execution for {selectedLanguage.toUpperCase()} will be enabled later.
              For now, direct execution works in JavaScript.
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