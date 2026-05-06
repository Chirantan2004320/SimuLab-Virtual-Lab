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
    title: "Delayed Gate Output",
    description:
      "Write a function delayedOutput(gate, previousInput, currentInput, delayNs, timeNs) that returns the observed output. If timeNs is less than delayNs, return the output for previousInput. Otherwise return the output for currentInput. gate can be 'NOT' or 'BUFFER'.",
    functionName: "delayedOutput",
    tests: [
      { input: ["NOT", 0, 1, 5, 0], expected: 1 },
      { input: ["NOT", 0, 1, 5, 3], expected: 1 },
      { input: ["NOT", 0, 1, 5, 5], expected: 0 },
      { input: ["BUFFER", 1, 0, 4, 2], expected: 1 },
      { input: ["BUFFER", 1, 0, 4, 4], expected: 0 }
    ]
  },
  {
    id: 2,
    title: "Timing State Detector",
    description:
      "Write a function timingState(delayNs, timeNs) that returns 'Waiting' if timeNs is less than delayNs, otherwise returns 'Output Updated'.",
    functionName: "timingState",
    tests: [
      { input: [5, 0], expected: "Waiting" },
      { input: [5, 4], expected: "Waiting" },
      { input: [5, 5], expected: "Output Updated" },
      { input: [8, 10], expected: "Output Updated" }
    ]
  },
  {
    id: 3,
    title: "Propagation Delay Result Object",
    description:
      "Write a function delayResult(gate, previousInput, currentInput, delayNs, timeNs) that returns an object like { state: 'Waiting', observedOutput: 1, finalOutput: 0 }.",
    functionName: "delayResult",
    tests: [
      {
        input: ["NOT", 0, 1, 5, 3],
        expected: { state: "Waiting", observedOutput: 1, finalOutput: 0 }
      },
      {
        input: ["NOT", 0, 1, 5, 5],
        expected: { state: "Output Updated", observedOutput: 0, finalOutput: 0 }
      },
      {
        input: ["BUFFER", 1, 0, 4, 2],
        expected: { state: "Waiting", observedOutput: 1, finalOutput: 0 }
      },
      {
        input: ["BUFFER", 1, 0, 4, 6],
        expected: { state: "Output Updated", observedOutput: 0, finalOutput: 0 }
      }
    ]
  }
];

const templates = {
  javascript: [
    `function delayedOutput(gate, previousInput, currentInput, delayNs, timeNs) {
  function gateOutput(input) {
    if (gate === "NOT") {
      return input === 1 ? 0 : 1;
    }

    return input;
  }

  if (timeNs < delayNs) {
    return gateOutput(previousInput);
  }

  return gateOutput(currentInput);
}`,
    `function timingState(delayNs, timeNs) {
  if (timeNs < delayNs) {
    return "Waiting";
  }

  return "Output Updated";
}`,
    `function delayResult(gate, previousInput, currentInput, delayNs, timeNs) {
  function gateOutput(input) {
    if (gate === "NOT") {
      return input === 1 ? 0 : 1;
    }

    return input;
  }

  const finalOutput = gateOutput(currentInput);
  const observedOutput =
    timeNs < delayNs ? gateOutput(previousInput) : finalOutput;

  return {
    state: timeNs < delayNs ? "Waiting" : "Output Updated",
    observedOutput,
    finalOutput
  };
}`
  ],
  python: [
    `def delayedOutput(gate, previousInput, currentInput, delayNs, timeNs):
    def gateOutput(value):
        if gate == "NOT":
            return 0 if value == 1 else 1
        return value

    if timeNs < delayNs:
        return gateOutput(previousInput)

    return gateOutput(currentInput)`,
    `def timingState(delayNs, timeNs):
    if timeNs < delayNs:
        return "Waiting"

    return "Output Updated"`,
    `def delayResult(gate, previousInput, currentInput, delayNs, timeNs):
    def gateOutput(value):
        if gate == "NOT":
            return 0 if value == 1 else 1
        return value

    finalOutput = gateOutput(currentInput)
    observedOutput = gateOutput(previousInput) if timeNs < delayNs else finalOutput

    return {
        "state": "Waiting" if timeNs < delayNs else "Output Updated",
        "observedOutput": observedOutput,
        "finalOutput": finalOutput
    }`
  ],
  cpp: [
    `int delayedOutput(string gate, int previousInput, int currentInput, int delayNs, int timeNs) {
  auto gateOutput = [&](int value) {
    if (gate == "NOT") {
      return value == 1 ? 0 : 1;
    }

    return value;
  };

  if (timeNs < delayNs) {
    return gateOutput(previousInput);
  }

  return gateOutput(currentInput);
}`,
    `string timingState(int delayNs, int timeNs) {
  if (timeNs < delayNs) {
    return "Waiting";
  }

  return "Output Updated";
}`,
    `// Return state, observedOutput, and finalOutput using tuple<string, int, int>
tuple<string, int, int> delayResult(string gate, int previousInput, int currentInput, int delayNs, int timeNs) {
  auto gateOutput = [&](int value) {
    if (gate == "NOT") {
      return value == 1 ? 0 : 1;
    }

    return value;
  };

  int finalOutput = gateOutput(currentInput);
  int observedOutput = timeNs < delayNs ? gateOutput(previousInput) : finalOutput;
  string state = timeNs < delayNs ? "Waiting" : "Output Updated";

  return {state, observedOutput, finalOutput};
}`
  ],
  c: [
    `int delayedOutput(char gate[], int previousInput, int currentInput, int delayNs, int timeNs) {
  int oldOutput = previousInput;
  int newOutput = currentInput;

  if (gate[0] == 'N') {
    oldOutput = previousInput == 1 ? 0 : 1;
    newOutput = currentInput == 1 ? 0 : 1;
  }

  if (timeNs < delayNs) {
    return oldOutput;
  }

  return newOutput;
}`,
    `// Return 0 for Waiting and 1 for Output Updated
int timingState(int delayNs, int timeNs) {
  if (timeNs < delayNs) {
    return 0;
  }

  return 1;
}`,
    `// Use pointers to return stateCode, observedOutput, and finalOutput
void delayResult(char gate[], int previousInput, int currentInput, int delayNs, int timeNs, int *stateCode, int *observedOutput, int *finalOutput) {
  int oldOutput = previousInput;
  int newOutput = currentInput;

  if (gate[0] == 'N') {
    oldOutput = previousInput == 1 ? 0 : 1;
    newOutput = currentInput == 1 ? 0 : 1;
  }

  *finalOutput = newOutput;
  *observedOutput = timeNs < delayNs ? oldOutput : newOutput;
  *stateCode = timeNs < delayNs ? 0 : 1;
}`
  ],
  java: [
    `public static int delayedOutput(String gate, int previousInput, int currentInput, int delayNs, int timeNs) {
  int oldOutput = gate.equals("NOT") ? (previousInput == 1 ? 0 : 1) : previousInput;
  int newOutput = gate.equals("NOT") ? (currentInput == 1 ? 0 : 1) : currentInput;

  if (timeNs < delayNs) {
    return oldOutput;
  }

  return newOutput;
}`,
    `public static String timingState(int delayNs, int timeNs) {
  if (timeNs < delayNs) {
    return "Waiting";
  }

  return "Output Updated";
}`,
    `public static Object[] delayResult(String gate, int previousInput, int currentInput, int delayNs, int timeNs) {
  int oldOutput = gate.equals("NOT") ? (previousInput == 1 ? 0 : 1) : previousInput;
  int finalOutput = gate.equals("NOT") ? (currentInput == 1 ? 0 : 1) : currentInput;
  int observedOutput = timeNs < delayNs ? oldOutput : finalOutput;
  String state = timeNs < delayNs ? "Waiting" : "Output Updated";

  return new Object[]{state, observedOutput, finalOutput};
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

export default function DSDPropagationDelayCoding({
  selectedGate,
  inputBit,
  delayNs,
  timeNs,
  analysis
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
    return `Current state: gate = ${selectedGate}, input = ${inputBit}, delay = ${delayNs} ns, time = ${timeNs} ns, observed output = ${analysis.observedOutput}.`;
  }, [selectedGate, inputBit, delayNs, timeNs, analysis]);

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
        experimentSlug: "propagation-delay",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(index, "Submission saved to dashboard.");
    } catch (error) {
      console.error("Propagation Delay coding save failed:", error);
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
        ? ["delay", "time", "return"]
        : index === 1
        ? ["waiting", "output updated", "delay"]
        : ["state", "observedoutput", "finaloutput"];

    const score = expected.filter((token) => content.includes(token)).length;

    setResultAt(index, {
      message:
        score >= Math.max(2, expected.length - 1)
          ? "Analysis: Your solution includes the expected propagation delay timing logic."
          : "Analysis: Your answer is partially correct, but it should include delay, time, and output update conditions.",
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
            Practice propagation delay timing logic with real test cases.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>Propagation Delay Test Case Workspace</h3>
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
                <span>Timing Logic Problem</span>
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