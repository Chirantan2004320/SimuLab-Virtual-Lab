import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Compute Magnitude of a Complex Number",
    description:
      "Write a function magnitude(z) that returns the magnitude of a complex number represented as { re, im }."
  },
  {
    id: 2,
    title: "Check Stability from Pole Magnitudes",
    description:
      "Write a function isStable(poles) that returns true if all poles lie inside the unit circle."
  },
  {
    id: 3,
    title: "Format Complex Number",
    description:
      "Write a function formatComplex(z) that returns a string form like a + jb."
  }
];

export default function DTSPPoleZeroAnalysisCoding() {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const generateProblems = () => {
    setCurrentProblems(problemBank);
    const initialCodes = {};
    problemBank.forEach((p) => {
      initialCodes[p.id] = "// Write your code here";
    });
    setCodes(initialCodes);
    setResults({});
  };

  const handleCodeChange = (problemId, code) => {
    setCodes((prev) => ({ ...prev, [problemId]: code }));
  };

  const runCode = (problemId) => {
    setResults((prev) => ({
      ...prev,
      [problemId]:
        "Code execution for this DTSP experiment will be connected next. Structure is ready."
    }));
  };

  return (
    <section className="card">
      <h2>Coding Practice</h2>
      <p>
        Practice implementing basic utilities used in pole-zero analysis.
      </p>

      <button className="btn primary" onClick={generateProblems}>
        Generate Problems
      </button>

      {currentProblems.map((problem, index) => (
        <div key={problem.id} className="coding-problem">
          <h3>
            Problem {index + 1}: {problem.title}
          </h3>
          <p>{problem.description}</p>

          <textarea
            value={codes[problem.id] || ""}
            onChange={(e) => handleCodeChange(problem.id, e.target.value)}
            placeholder="Write your code here..."
            rows={12}
            style={{
              width: "100%",
              fontFamily: "monospace",
              color: "#000000",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "10px"
            }}
          />

          <button className="btn secondary" onClick={() => runCode(problem.id)}>
            Run Code
          </button>

          {results[problem.id] && <p className="result">{results[problem.id]}</p>}
        </div>
      ))}
    </section>
  );
}