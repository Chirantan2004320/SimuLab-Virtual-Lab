import React, { useEffect, useMemo, useState } from "react";
import { Code2, Play, Wrench, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" }
];

const problemSet = {
  half: [
    {
      id: 1,
      title: "Half Adder Sum",
      description: "Write a function halfAdderSum(A, B) that returns the Sum output.",
      functionName: "halfAdderSum",
      tests: [
        { input: [0, 0], expected: 0 },
        { input: [0, 1], expected: 1 },
        { input: [1, 0], expected: 1 },
        { input: [1, 1], expected: 0 }
      ]
    },
    {
      id: 2,
      title: "Half Adder Carry",
      description: "Write a function halfAdderCarry(A, B) that returns the Carry output.",
      functionName: "halfAdderCarry",
      tests: [
        { input: [0, 0], expected: 0 },
        { input: [0, 1], expected: 0 },
        { input: [1, 0], expected: 0 },
        { input: [1, 1], expected: 1 }
      ]
    },
    {
      id: 3,
      title: "Half Adder Result Object",
      description:
        "Write a function halfAdder(A, B) that returns an object like { sum: 1, carry: 0 }.",
      functionName: "halfAdder",
      tests: [
        { input: [0, 0], expected: { sum: 0, carry: 0 } },
        { input: [0, 1], expected: { sum: 1, carry: 0 } },
        { input: [1, 0], expected: { sum: 1, carry: 0 } },
        { input: [1, 1], expected: { sum: 0, carry: 1 } }
      ]
    }
  ],
  full: [
    {
      id: 1,
      title: "Full Adder Sum",
      description: "Write a function fullAdderSum(A, B, Cin) that returns the Sum output.",
      functionName: "fullAdderSum",
      tests: [
        { input: [0, 0, 0], expected: 0 },
        { input: [0, 1, 0], expected: 1 },
        { input: [1, 0, 1], expected: 0 },
        { input: [1, 1, 1], expected: 1 }
      ]
    },
    {
      id: 2,
      title: "Full Adder Carry",
      description: "Write a function fullAdderCarry(A, B, Cin) that returns the Carry output.",
      functionName: "fullAdderCarry",
      tests: [
        { input: [0, 0, 0], expected: 0 },
        { input: [0, 1, 1], expected: 1 },
        { input: [1, 0, 1], expected: 1 },
        { input: [1, 1, 0], expected: 1 }
      ]
    },
    {
      id: 3,
      title: "Full Adder Result Object",
      description:
        "Write a function fullAdder(A, B, Cin) that returns an object like { sum: 0, carry: 1 }.",
      functionName: "fullAdder",
      tests: [
        { input: [0, 0, 0], expected: { sum: 0, carry: 0 } },
        { input: [0, 1, 1], expected: { sum: 0, carry: 1 } },
        { input: [1, 0, 1], expected: { sum: 0, carry: 1 } },
        { input: [1, 1, 1], expected: { sum: 1, carry: 1 } }
      ]
    }
  ]
};

const templates = {
  half: {
    javascript: [
      `function halfAdderSum(A, B) {
  return A ^ B;
}`,
      `function halfAdderCarry(A, B) {
  return A & B;
}`,
      `function halfAdder(A, B) {
  return {
    sum: A ^ B,
    carry: A & B
  };
}`
    ],
    python: [
      `def halfAdderSum(A, B):
    return A ^ B`,
      `def halfAdderCarry(A, B):
    return A & B`,
      `def halfAdder(A, B):
    return {
        "sum": A ^ B,
        "carry": A & B
    }`
    ],
    cpp: [
      `int halfAdderSum(int A, int B) {
  return A ^ B;
}`,
      `int halfAdderCarry(int A, int B) {
  return A & B;
}`,
      `// Return sum and carry using pair<int,int>
pair<int,int> halfAdder(int A, int B) {
  return {A ^ B, A & B};
}`
    ],
    c: [
      `int halfAdderSum(int A, int B) {
  return A ^ B;
}`,
      `int halfAdderCarry(int A, int B) {
  return A & B;
}`,
      `// Use pointers to return both outputs
void halfAdder(int A, int B, int *sum, int *carry) {
  *sum = A ^ B;
  *carry = A & B;
}`
    ],
    java: [
      `public static int halfAdderSum(int A, int B) {
  return A ^ B;
}`,
      `public static int halfAdderCarry(int A, int B) {
  return A & B;
}`,
      `public static int[] halfAdder(int A, int B) {
  return new int[]{A ^ B, A & B};
}`
    ]
  },
  full: {
    javascript: [
      `function fullAdderSum(A, B, Cin) {
  return A ^ B ^ Cin;
}`,
      `function fullAdderCarry(A, B, Cin) {
  return (A & B) | (B & Cin) | (A & Cin);
}`,
      `function fullAdder(A, B, Cin) {
  return {
    sum: A ^ B ^ Cin,
    carry: (A & B) | (B & Cin) | (A & Cin)
  };
}`
    ],
    python: [
      `def fullAdderSum(A, B, Cin):
    return A ^ B ^ Cin`,
      `def fullAdderCarry(A, B, Cin):
    return (A & B) | (B & Cin) | (A & Cin)`,
      `def fullAdder(A, B, Cin):
    return {
        "sum": A ^ B ^ Cin,
        "carry": (A & B) | (B & Cin) | (A & Cin)
    }`
    ],
    cpp: [
      `int fullAdderSum(int A, int B, int Cin) {
  return A ^ B ^ Cin;
}`,
      `int fullAdderCarry(int A, int B, int Cin) {
  return (A & B) | (B & Cin) | (A & Cin);
}`,
      `// Return sum and carry using pair<int,int>
pair<int,int> fullAdder(int A, int B, int Cin) {
  return {A ^ B ^ Cin, (A & B) | (B & Cin) | (A & Cin)};
}`
    ],
    c: [
      `int fullAdderSum(int A, int B, int Cin) {
  return A ^ B ^ Cin;
}`,
      `int fullAdderCarry(int A, int B, int Cin) {
  return (A & B) | (B & Cin) | (A & Cin);
}`,
      `// Use pointers to return both outputs
void fullAdder(int A, int B, int Cin, int *sum, int *carry) {
  *sum = A ^ B ^ Cin;
  *carry = (A & B) | (B & Cin) | (A & Cin);
}`
    ],
    java: [
      `public static int fullAdderSum(int A, int B, int Cin) {
  return A ^ B ^ Cin;
}`,
      `public static int fullAdderCarry(int A, int B, int Cin) {
  return (A & B) | (B & Cin) | (A & Cin);
}`,
      `public static int[] fullAdder(int A, int B, int Cin) {
  return new int[]{A ^ B ^ Cin, (A & B) | (B & Cin) | (A & Cin)};
}`
    ]
  }
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
                  {test.passed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
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

export default function DSDAddersCoding({ selectedAdder }) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const problems = useMemo(() => problemSet[selectedAdder], [selectedAdder]);

  const [codes, setCodes] = useState([]);
  const [results, setResults] = useState([]);
  const [codingSaveStatus, setCodingSaveStatus] = useState([]);

  useEffect(() => {
    setCodes(templates[selectedAdder][selectedLanguage]);
    setResults(Array(3).fill(null));
    setCodingSaveStatus(Array(3).fill(""));
  }, [selectedAdder, selectedLanguage]);

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
        experimentSlug: "half-full-adder",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(index, "Submission saved to dashboard.");
    } catch (error) {
      console.error("Adder coding save failed:", error);
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
      selectedAdder === "half"
        ? index === 0
          ? ["^"]
          : index === 1
          ? ["&"]
          : ["sum", "carry"]
        : index === 0
        ? ["^", "cin"]
        : index === 1
        ? ["&", "|", "cin"]
        : ["sum", "carry", "cin"];

    const score = expected.filter((token) => content.includes(token)).length;

    setResultAt(index, {
      message:
        score >= Math.max(1, expected.length - 1)
          ? "Analysis: Your answer includes the expected adder logic."
          : "Analysis: Your answer is partially correct, but it should include more of the required adder logic.",
      passed: null,
      testResults: []
    });
  };

  const correctCode = (index) => {
    setCodes((prev) =>
      prev.map((item, i) =>
        i === index ? templates[selectedAdder][selectedLanguage][index] : item
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
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice implementing{" "}
            {selectedAdder === "half" ? "Half Adder" : "Full Adder"} logic with
            real test cases.
          </p>
        </div>
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>Adder Test Case Workspace</h3>
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
                <span>
                  {selectedAdder === "half" ? "Half Adder" : "Full Adder"} Problem
                </span>
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
            <div className="coding-result-box">{codingSaveStatus[index]}</div>
          )}
        </div>
      ))}
    </section>
  );
}