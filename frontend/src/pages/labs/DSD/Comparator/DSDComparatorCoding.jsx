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
    title: "1-bit Comparator Outputs",
    description:
      "Write a function comparator1Bit(A, B) that returns { greater, equal, less } for a 1-bit comparator.",
    functionName: "comparator1Bit",
    tests: [
      { input: [0, 0], expected: { greater: 0, equal: 1, less: 0 } },
      { input: [0, 1], expected: { greater: 0, equal: 0, less: 1 } },
      { input: [1, 0], expected: { greater: 1, equal: 0, less: 0 } },
      { input: [1, 1], expected: { greater: 0, equal: 1, less: 0 } }
    ]
  },
  {
    id: 2,
    title: "Comparator Relation",
    description:
      "Write a function comparatorRelation(A, B) that returns 'A > B', 'A = B', or 'A < B'.",
    functionName: "comparatorRelation",
    tests: [
      { input: [0, 0], expected: "A = B" },
      { input: [0, 1], expected: "A < B" },
      { input: [1, 0], expected: "A > B" },
      { input: [1, 1], expected: "A = B" }
    ]
  },
  {
    id: 3,
    title: "Greater, Equal, Less Array",
    description:
      "Write a function comparatorArray(A, B) that returns [A>B, A=B, A<B].",
    functionName: "comparatorArray",
    tests: [
      { input: [0, 0], expected: [0, 1, 0] },
      { input: [0, 1], expected: [0, 0, 1] },
      { input: [1, 0], expected: [1, 0, 0] },
      { input: [1, 1], expected: [0, 1, 0] }
    ]
  }
];

const templates = {
  javascript: [
    `function comparator1Bit(A, B) {
  return {
    greater: A > B ? 1 : 0,
    equal: A === B ? 1 : 0,
    less: A < B ? 1 : 0
  };
}`,
    `function comparatorRelation(A, B) {
  if (A > B) {
    return "A > B";
  }

  if (A < B) {
    return "A < B";
  }

  return "A = B";
}`,
    `function comparatorArray(A, B) {
  return [
    A > B ? 1 : 0,
    A === B ? 1 : 0,
    A < B ? 1 : 0
  ];
}`
  ],
  python: [
    `def comparator1Bit(A, B):
    return {
        "greater": 1 if A > B else 0,
        "equal": 1 if A == B else 0,
        "less": 1 if A < B else 0
    }`,
    `def comparatorRelation(A, B):
    if A > B:
        return "A > B"

    if A < B:
        return "A < B"

    return "A = B"`,
    `def comparatorArray(A, B):
    return [
        1 if A > B else 0,
        1 if A == B else 0,
        1 if A < B else 0
    ]`
  ],
  cpp: [
    `map<string, int> comparator1Bit(int A, int B) {
  return {
    {"greater", A > B ? 1 : 0},
    {"equal", A == B ? 1 : 0},
    {"less", A < B ? 1 : 0}
  };
}`,
    `string comparatorRelation(int A, int B) {
  if (A > B) {
    return "A > B";
  }

  if (A < B) {
    return "A < B";
  }

  return "A = B";
}`,
    `vector<int> comparatorArray(int A, int B) {
  return {
    A > B ? 1 : 0,
    A == B ? 1 : 0,
    A < B ? 1 : 0
  };
}`
  ],
  c: [
    `// Use pointers to return greater, equal, and less
void comparator1Bit(int A, int B, int *greater, int *equal, int *less) {
  *greater = A > B ? 1 : 0;
  *equal = A == B ? 1 : 0;
  *less = A < B ? 1 : 0;
}`,
    `// Return 1 for A>B, 0 for A=B, -1 for A<B
int comparatorRelation(int A, int B) {
  if (A > B) {
    return 1;
  }

  if (A < B) {
    return -1;
  }

  return 0;
}`,
    `// Store [A>B, A=B, A<B] in output array
void comparatorArray(int A, int B, int output[3]) {
  output[0] = A > B ? 1 : 0;
  output[1] = A == B ? 1 : 0;
  output[2] = A < B ? 1 : 0;
}`
  ],
  java: [
    `public static Map<String, Integer> comparator1Bit(int A, int B) {
  Map<String, Integer> result = new HashMap<>();

  result.put("greater", A > B ? 1 : 0);
  result.put("equal", A == B ? 1 : 0);
  result.put("less", A < B ? 1 : 0);

  return result;
}`,
    `public static String comparatorRelation(int A, int B) {
  if (A > B) {
    return "A > B";
  }

  if (A < B) {
    return "A < B";
  }

  return "A = B";
}`,
    `public static int[] comparatorArray(int A, int B) {
  return new int[]{
    A > B ? 1 : 0,
    A == B ? 1 : 0,
    A < B ? 1 : 0
  };
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

export default function DSDComparatorCoding({ a, b, analysis }) {
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
    return `Current state: A = ${a}, B = ${b}, active relation = ${analysis.relation}, active output = ${analysis.activeOutput}.`;
  }, [a, b, analysis]);

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
        experimentSlug: "comparator",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setSaveStatusAt(index, "Submission saved to dashboard.");
    } catch (error) {
      console.error("Comparator coding save failed:", error);
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
        ? ["greater", "equal", "less", "return"]
        : index === 1
        ? ["a > b", "a < b", "return"]
        : ["return", "a > b", "a === b", "a < b"];

    const score = expected.filter((token) => content.includes(token)).length;

    setResultAt(index, {
      message:
        score >= Math.max(2, expected.length - 1)
          ? "Analysis: Your solution includes the expected comparator relation logic."
          : "Analysis: Your answer is partially correct, but it should compare A and B and return greater/equal/less outputs.",
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
            Practice comparator output logic with real test cases.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>Comparator Test Case Workspace</h3>
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
                <span>Comparator Logic Problem</span>
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