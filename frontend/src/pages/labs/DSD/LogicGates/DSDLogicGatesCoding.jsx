import React, { useEffect, useState } from "react";
import { Code2, Play, Sparkles, Wrench, Cpu } from "lucide-react";

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

function runJavascript(problemId, code) {
  if (problemId === 1) {
    const fn = new Function(`${code}; return NOT;`)();
    return `NOT(1) = ${fn(1)}, NOT(0) = ${fn(0)}`;
  }

  if (problemId === 2) {
    const fn = new Function(`${code}; return AND;`)();
    return `AND(1,1) = ${fn(1, 1)}, AND(1,0) = ${fn(1, 0)}`;
  }

  if (problemId === 3) {
    const fn = new Function(`${code}; return XOR;`)();
    return `XOR(1,0) = ${fn(1, 0)}, XOR(1,1) = ${fn(1, 1)}`;
  }

  return "No output";
}

export default function DSDLogicGatesCoding({ selectedGate = "AND" }) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});
  const currentProblems = problemBank;

  useEffect(() => {
    const nextCodes = {};
    currentProblems.forEach((problem) => {
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

  const runCode = (problemId) => {
    const code = codes[problemId];

    if (!code?.trim()) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Please enter code first."
      }));
      return;
    }

    if (selectedLanguage !== "javascript") {
      setResults((prev) => ({
        ...prev,
        [problemId]:
          `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Use JavaScript for direct browser execution.`
      }));
      return;
    }

    try {
      const output = runJavascript(problemId, code);
      setResults((prev) => ({
        ...prev,
        [problemId]: `Success\n${output}`
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [problemId]: `Error: ${error.message}`
      }));
    }
  };

  const analyzeCode = (problemId) => {
    const code = codes[problemId] || "";
    let feedback = [];

    if (code.includes("return")) {
      feedback.push("Your function returns a value correctly.");
    } else {
      feedback.push("Your function should return the gate output.");
    }

    if (problemId === 1 && (code.includes("? 0 : 1") || code.includes("!"))) {
      feedback.push("Your logic appears suitable for inversion.");
    }

    if (problemId === 2 && (code.includes("&&") || code.includes("&"))) {
      feedback.push("Your logic appears suitable for AND evaluation.");
    }

    if (problemId === 3 && (code.includes("!==") || code.includes("^") || code.includes("!="))) {
      feedback.push("Your logic appears suitable for XOR behavior.");
    }

    setResults((prev) => ({
      ...prev,
      [problemId]: `Analysis\n- ${feedback.join("\n- ")}`
    }));
  };

  const correctCode = (problemId) => {
    const problem = currentProblems.find((p) => p.id === problemId);
    if (!problem) return;

    setCodes((prev) => ({
      ...prev,
      [problemId]: problem.starter[selectedLanguage]
    }));

    setResults((prev) => ({
      ...prev,
      [problemId]: "Model answer loaded successfully."
    }));
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
        <div key={problem.id} className="coding-card-upgraded" style={{ marginBottom: 18 }}>
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
            <button className="sim-btn sim-btn-primary" onClick={() => runCode(problem.id)}>
              <Play size={16} />
              Run Code
            </button>

            <button className="sim-btn sim-btn-muted" onClick={() => analyzeCode(problem.id)}>
              <Sparkles size={16} />
              Analyze Code
            </button>

            <button className="sim-btn sim-btn-success" onClick={() => correctCode(problem.id)}>
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
            <div className="coding-result-box">{results[problem.id]}</div>
          )}
        </div>
      ))}
    </section>
  );
}