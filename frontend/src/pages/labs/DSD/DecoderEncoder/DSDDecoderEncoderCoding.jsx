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
    title: "2-to-4 Decoder Output",
    description:
      "Write a function decoder2to4(A, B) that returns an array of four outputs. Only one output should be 1.",
    functionName: "decoder2to4",
    tests: [
      { input: [0, 0], expected: [1, 0, 0, 0] },
      { input: [0, 1], expected: [0, 1, 0, 0] },
      { input: [1, 0], expected: [0, 0, 1, 0] },
      { input: [1, 1], expected: [0, 0, 0, 1] }
    ]
  },
  {
    id: 2,
    title: "4-to-2 Encoder Output",
    description:
      "Write a function encoder4to2(I0, I1, I2, I3) that returns the binary output string. Exactly one input should be active.",
    functionName: "encoder4to2",
    tests: [
      { input: [1, 0, 0, 0], expected: "00" },
      { input: [0, 1, 0, 0], expected: "01" },
      { input: [0, 0, 1, 0], expected: "10" },
      { input: [0, 0, 0, 1], expected: "11" }
    ]
  },
  {
    id: 3,
    title: "Decoder Encoder Result Object",
    description:
      "Write a function logicConverter(mode, values) that returns decoder or encoder result. For decoder values = [A, B], return { activeOutput: 'Y2', outputs: [0,0,1,0] }. For encoder values = [I0,I1,I2,I3], return { activeInput: 'I2', binary: '10' }.",
    functionName: "logicConverter",
    tests: [
      {
        input: ["decoder", [1, 0]],
        expected: { activeOutput: "Y2", outputs: [0, 0, 1, 0] }
      },
      {
        input: ["decoder", [1, 1]],
        expected: { activeOutput: "Y3", outputs: [0, 0, 0, 1] }
      },
      {
        input: ["encoder", [0, 0, 1, 0]],
        expected: { activeInput: "I2", binary: "10" }
      },
      {
        input: ["encoder", [0, 0, 0, 1]],
        expected: { activeInput: "I3", binary: "11" }
      }
    ]
  }
];

const templates = {
  javascript: [
    `function decoder2to4(A, B) {
  const index = A * 2 + B;
  const outputs = [0, 0, 0, 0];

  outputs[index] = 1;
  return outputs;
}`,
    `function encoder4to2(I0, I1, I2, I3) {
  const inputs = [I0, I1, I2, I3];
  const index = inputs.findIndex((value) => value === 1);

  return index.toString(2).padStart(2, "0");
}`,
    `function logicConverter(mode, values) {
  if (mode === "decoder") {
    const [A, B] = values;
    const index = A * 2 + B;
    const outputs = [0, 0, 0, 0];

    outputs[index] = 1;

    return {
      activeOutput: "Y" + index,
      outputs
    };
  }

  const index = values.findIndex((value) => value === 1);

  return {
    activeInput: "I" + index,
    binary: index.toString(2).padStart(2, "0")
  };
}`
  ],
  python: [
    `def decoder2to4(A, B):
    index = A * 2 + B
    outputs = [0, 0, 0, 0]

    outputs[index] = 1
    return outputs`,
    `def encoder4to2(I0, I1, I2, I3):
    inputs = [I0, I1, I2, I3]
    index = inputs.index(1)

    return format(index, "02b")`,
    `def logicConverter(mode, values):
    if mode == "decoder":
        A, B = values
        index = A * 2 + B
        outputs = [0, 0, 0, 0]
        outputs[index] = 1

        return {
            "activeOutput": "Y" + str(index),
            "outputs": outputs
        }

    index = values.index(1)

    return {
        "activeInput": "I" + str(index),
        "binary": format(index, "02b")
    }`
  ],
  cpp: [
    `vector<int> decoder2to4(int A, int B) {
  int index = A * 2 + B;
  vector<int> outputs = {0, 0, 0, 0};

  outputs[index] = 1;
  return outputs;
}`,
    `string encoder4to2(int I0, int I1, int I2, int I3) {
  vector<int> inputs = {I0, I1, I2, I3};
  int index = 0;

  for (int i = 0; i < 4; i++) {
    if (inputs[i] == 1) {
      index = i;
      break;
    }
  }

  return bitset<2>(index).to_string();
}`,
    `// For C++, return decoder/encoder result using a custom struct in your compiler setup.
string logicConverter(string mode, vector<int> values) {
  if (mode == "decoder") {
    int index = values[0] * 2 + values[1];
    return "Y" + to_string(index);
  }

  int index = 0;
  for (int i = 0; i < 4; i++) {
    if (values[i] == 1) {
      index = i;
      break;
    }
  }

  return bitset<2>(index).to_string();
}`
  ],
  c: [
    `// Store decoder output in outputs array
void decoder2to4(int A, int B, int outputs[4]) {
  int index = A * 2 + B;

  for (int i = 0; i < 4; i++) {
    outputs[i] = 0;
  }

  outputs[index] = 1;
}`,
    `// Return encoder output as decimal value: 0, 1, 2, or 3
int encoder4to2(int I0, int I1, int I2, int I3) {
  int inputs[4] = {I0, I1, I2, I3};

  for (int i = 0; i < 4; i++) {
    if (inputs[i] == 1) {
      return i;
    }
  }

  return -1;
}`,
    `// mode 0 = decoder, mode 1 = encoder. Store result index in result.
void logicConverter(int mode, int values[], int *result) {
  if (mode == 0) {
    *result = values[0] * 2 + values[1];
    return;
  }

  for (int i = 0; i < 4; i++) {
    if (values[i] == 1) {
      *result = i;
      return;
    }
  }

  *result = -1;
}`
  ],
  java: [
    `public static int[] decoder2to4(int A, int B) {
  int index = A * 2 + B;
  int[] outputs = {0, 0, 0, 0};

  outputs[index] = 1;
  return outputs;
}`,
    `public static String encoder4to2(int I0, int I1, int I2, int I3) {
  int[] inputs = {I0, I1, I2, I3};
  int index = 0;

  for (int i = 0; i < inputs.length; i++) {
    if (inputs[i] == 1) {
      index = i;
      break;
    }
  }

  return String.format("%2s", Integer.toBinaryString(index)).replace(' ', '0');
}`,
    `public static Object[] logicConverter(String mode, int[] values) {
  if (mode.equals("decoder")) {
    int index = values[0] * 2 + values[1];
    int[] outputs = {0, 0, 0, 0};
    outputs[index] = 1;

    return new Object[]{"Y" + index, outputs};
  }

  int index = 0;
  for (int i = 0; i < values.length; i++) {
    if (values[i] == 1) {
      index = i;
      break;
    }
  }

  return new Object[]{"I" + index, String.format("%2s", Integer.toBinaryString(index)).replace(' ', '0')};
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

export default function DSDDecoderEncoderCoding({
  mode,
  a,
  b,
  inputs,
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
    return mode === "decoder"
      ? `Current decoder state: A=${a}, B=${b}, active output = Y${analysis.index}.`
      : analysis.index === -1
      ? "Current encoder state: no valid active input line."
      : `Current encoder state: active input = I${analysis.index}, binary output = ${analysis.binary}.`;
  }, [mode, a, b, analysis]);

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
        experimentSlug: "decoder-encoder",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(index, "Submission saved to dashboard.");
    } catch (error) {
      console.error("Decoder Encoder coding save failed:", error);
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
        ? ["a", "b", "outputs", "return"]
        : index === 1
        ? ["inputs", "index", "return"]
        : ["decoder", "encoder", "return"];

    const score = expected.filter((token) => content.includes(token)).length;

    setResultAt(index, {
      message:
        score >= Math.max(2, expected.length - 1)
          ? "Analysis: Your solution includes the expected decoder/encoder mapping logic."
          : "Analysis: Your answer is partially correct, but it should include binary mapping and active-line selection.",
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
            Practice decoder and encoder logic with real test cases.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>Decoder / Encoder Test Case Workspace</h3>
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
                <span>Combinational Logic Problem</span>
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