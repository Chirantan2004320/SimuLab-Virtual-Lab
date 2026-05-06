import React, { useEffect, useState } from "react";
import { Code2, Play, Sparkles, Wrench, Cpu } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" }
];

const problemBank = [
  {
    id: 1,
    title: "NOT Gate Function",
    description:
      "Write a function NOT(A) that returns the output of a NOT gate.",
    functionName: "NOT",
    tests: [
      { input: [1], expected: 0 },
      { input: [0], expected: 1 }
    ],
    starter: {
      javascript: `function NOT(A) {
  return A === 1 ? 0 : 1;
}`,
      python: `def NOT(A):
    return 0 if A == 1 else 1`,
      cpp: `int NOT(int A) {
    return A == 1 ? 0 : 1;
}`,
      c: `int NOT(int A) {
    return A == 1 ? 0 : 1;
}`,
      java: `public static int NOT(int A) {
    return A == 1 ? 0 : 1;
}`
    }
  },
  {
    id: 2,
    title: "AND Gate Function",
    description:
      "Write a function AND(A, B) that returns the output of an AND gate.",
    functionName: "AND",
    tests: [
      { input: [0, 0], expected: 0 },
      { input: [0, 1], expected: 0 },
      { input: [1, 0], expected: 0 },
      { input: [1, 1], expected: 1 }
    ],
    starter: {
      javascript: `function AND(A, B) {
  return A === 1 && B === 1 ? 1 : 0;
}`,
      python: `def AND(A, B):
    return 1 if A == 1 and B == 1 else 0`,
      cpp: `int AND(int A, int B) {
    return (A == 1 && B == 1) ? 1 : 0;
}`,
      c: `int AND(int A, int B) {
    return (A == 1 && B == 1) ? 1 : 0;
}`,
      java: `public static int AND(int A, int B) {
    return (A == 1 && B == 1) ? 1 : 0;
}`
    }
  },
  {
    id: 3,
    title: "XOR Gate Function",
    description:
      "Write a function XOR(A, B) that returns the output of an XOR gate.",
    functionName: "XOR",
    tests: [
      { input: [0, 0], expected: 0 },
      { input: [0, 1], expected: 1 },
      { input: [1, 0], expected: 1 },
      { input: [1, 1], expected: 0 }
    ],
    starter: {
      javascript: `function XOR(A, B) {
  return A !== B ? 1 : 0;
}`,
      python: `def XOR(A, B):
    return 1 if A != B else 0`,
      cpp: `int XOR(int A, int B) {
    return A != B ? 1 : 0;
}`,
      c: `int XOR(int A, int B) {
    return A != B ? 1 : 0;
}`,
      java: `public static int XOR(int A, int B) {
    return A != B ? 1 : 0;
}`
    }
  }
];

function runJavascript(problem, code) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(`${code}; return ${problem.functionName};`)();

  const outputs = problem.tests.map((test) => {
    const actual = fn(...test.input);

    return {
      input: test.input,
      expected: test.expected,
      actual,
      passed: actual === test.expected
    };
  });

  const allPassed = outputs.every((item) => item.passed);

  return {
    allPassed,
    outputText: outputs
      .map(
        (item) =>
          `${problem.functionName}(${item.input.join(", ")}) = ${item.actual} ${
            item.passed ? "✓" : `✗ expected ${item.expected}`
          }`
      )
      .join("\n")
  };
}

export default function DSDLogicGatesCoding({ selectedGate = "AND" }) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});
  const [codingSaveStatus, setCodingSaveStatus] = useState({});

  const currentProblems = problemBank;

  useEffect(() => {
  const nextCodes = {};

  problemBank.forEach((problem) => {
    nextCodes[problem.id] = problem.starter[selectedLanguage];
  });

  setCodes(nextCodes);
  setResults({});
}, [selectedLanguage]);


  const handleCodeChange = (problemId, value) => {
    setCodes((prev) => ({
      ...prev,
      [problemId]: value
    }));
  };

  const saveSubmission = async ({ problem, code, result }) => {
    setCodingSaveStatus((prev) => ({
      ...prev,
      [problem.id]: "Saving submission..."
    }));

    try {
      await saveCodingSubmission({
        labSlug: "dsd",
        experimentSlug: "logic-gates",
        problemTitle: problem.title,
        language: selectedLanguage,
        code,
        result
      });

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problem.id]: "Submission saved to dashboard."
      }));
    } catch (error) {
      console.error("Logic Gates coding save failed:", error);

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problem.id]: "Code checked, but backend save failed."
      }));
    }
  };

  const runCode = async (problem) => {
    const code = codes[problem.id];

    if (!code?.trim()) {
      setResults((prev) => ({
        ...prev,
        [problem.id]: "Please enter code first."
      }));
      return;
    }

    if (selectedLanguage !== "javascript") {
      setResults((prev) => ({
        ...prev,
        [problem.id]:
          `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Saved as attempted submission.`
      }));

      await saveSubmission({
        problem,
        code,
        result: "attempted"
      });

      return;
    }

    try {
      const output = runJavascript(problem, code);

      setResults((prev) => ({
        ...prev,
        [problem.id]: `${output.allPassed ? "Correct" : "Incorrect"}\n${output.outputText}`
      }));

      await saveSubmission({
        problem,
        code,
        result: output.allPassed ? "passed" : "failed"
      });
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [problem.id]: `Error: ${error.message}`
      }));

      await saveSubmission({
        problem,
        code,
        result: "failed"
      });
    }
  };

  const analyzeCode = (problem) => {
    const code = codes[problem.id] || "";
    const feedback = [];

    if (code.includes("return")) {
      feedback.push("Your function returns a value correctly.");
    } else {
      feedback.push("Your function should return the gate output.");
    }

    if (problem.id === 1 && (code.includes("? 0 : 1") || code.includes("!"))) {
      feedback.push("Your logic appears suitable for NOT gate inversion.");
    }

    if (problem.id === 2 && (code.includes("&&") || code.includes("&"))) {
      feedback.push("Your logic appears suitable for AND gate evaluation.");
    }

    if (
      problem.id === 3 &&
      (code.includes("!==") || code.includes("^") || code.includes("!="))
    ) {
      feedback.push("Your logic appears suitable for XOR gate behavior.");
    }

    setResults((prev) => ({
      ...prev,
      [problem.id]: `Analysis\n- ${feedback.join("\n- ")}`
    }));
  };

  const correctCode = (problem) => {
    setCodes((prev) => ({
      ...prev,
      [problem.id]: problem.starter[selectedLanguage]
    }));

    setResults((prev) => ({
      ...prev,
      [problem.id]: "Model answer loaded successfully."
    }));

    localStorage.setItem(
      "vlab_code_correction",
      JSON.stringify({
        type: "code_correction",
        lab: "dsd",
        experiment: "logic-gates",
        problemId: problem.id,
        title: problem.title,
        language: selectedLanguage,
        expectedStarterCode: problem.starter[selectedLanguage]
      })
    );
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
            Practice Boolean logic implementation for {selectedGate} and related gates.
          </p>
        </div>
      </div>

      <div className="coding-card-upgraded" style={{ marginBottom: 18 }}>
        <div className="coding-card-header">
          <div>
            <h3>Logic Gate Coding Workspace</h3>
            <p>
              Solve the given gate problems, run JavaScript directly, and use
              analyze/correct tools for quick guidance.
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

      {currentProblems.map((problem, index) => (
        <div
          key={problem.id}
          className="coding-card-upgraded"
          style={{ marginBottom: 18 }}
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
                  background: "rgba(56,189,248,0.10)",
                  border: "1px solid rgba(56,189,248,0.18)",
                  color: "#38bdf8",
                  fontWeight: 700,
                  fontSize: "0.82rem"
                }}
              >
                <Cpu size={16} />
                <span>Problem {index + 1}</span>
              </div>

              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
            </div>
          </div>

          <textarea
            value={codes[problem.id] || ""}
            onChange={(e) => handleCodeChange(problem.id, e.target.value)}
            rows={12}
            className="coding-textarea-upgraded"
            placeholder="Write your code here..."
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => runCode(problem)}
            >
              <Play size={16} />
              Run Code
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => analyzeCode(problem)}
            >
              <Sparkles size={16} />
              Analyze Code
            </button>

            <button
              className="sim-btn sim-btn-success"
              onClick={() => correctCode(problem)}
            >
              <Wrench size={16} />
              Correct Code
            </button>
          </div>

          {selectedLanguage !== "javascript" && (
            <div className="coding-result-box" style={{ marginTop: 14 }}>
              Execution for {selectedLanguage.toUpperCase()} is not enabled yet.
              For now, direct execution works in JavaScript.
            </div>
          )}

          {results[problem.id] && (
            <div className="coding-result-box">
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "inherit"
                }}
              >
                {results[problem.id]}
              </pre>
            </div>
          )}

          {codingSaveStatus[problem.id] && (
            <div className="coding-result-box">
              {codingSaveStatus[problem.id]}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}