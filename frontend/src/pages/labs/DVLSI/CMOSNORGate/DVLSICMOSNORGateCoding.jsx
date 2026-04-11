import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "NOR Logic Function",
    description:
      "Write a function NOR(A, B) that returns the logical NOR of two binary inputs."
  },
  {
    id: 2,
    title: "Truth Table Generator",
    description:
      "Write a function generateNORTruthTable() that returns all input-output combinations for a 2-input NOR gate."
  },
  {
    id: 3,
    title: "Pull-Down Detection",
    description:
      "Write a function hasPullDownPath(A, B) that returns true if at least one nMOS branch conducts."
  }
];

export default function DVLSICMOSNORCoding() {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const generateProblems = () => {
    setCurrentProblems(problemBank);
    const initialCodes = {};
    problemBank.forEach((p) => {
      initialCodes[p.id] = getStarterCode(p.id);
    });
    setCodes(initialCodes);
    setResults({});
  };

  const getStarterCode = (id) => {
    if (id === 1) {
      return `function NOR(A, B) {
  return !(A || B) ? 1 : 0;
}`;
    }

    if (id === 2) {
      return `function generateNORTruthTable() {
  return [
    { A: 0, B: 0, Y: 1 },
    { A: 0, B: 1, Y: 0 },
    { A: 1, B: 0, Y: 0 },
    { A: 1, B: 1, Y: 0 }
  ];
}`;
    }

    return `function hasPullDownPath(A, B) {
  return A === 1 || B === 1;
}`;
  };

  const handleCodeChange = (problemId, code) => {
    setCodes((prev) => ({ ...prev, [problemId]: code }));
  };

  const runCode = (problemId) => {
    const code = codes[problemId];

    if (!code) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Please enter code first."
      }));
      return;
    }

    try {
      let resultText = "";

      if (problemId === 1) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return NOR;`)();
        const output = fn(1, 0);
        resultText =
          typeof output === "number"
            ? `Function ran successfully. Example NOR(1,0) = ${output}`
            : "Return value should be 0 or 1.";
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return generateNORTruthTable;`)();
        const output = fn();
        resultText = Array.isArray(output)
          ? `Function ran successfully. Truth table rows: ${output.length}`
          : "Return value should be an array.";
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return hasPullDownPath;`)();
        const output = fn(0, 1);
        resultText =
          typeof output === "boolean"
            ? `Function ran successfully. Example hasPullDownPath(0,1) = ${output}`
            : "Return value should be true or false.";
      }

      setResults((prev) => ({
        ...prev,
        [problemId]: resultText
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [problemId]: `Error: ${error.message}`
      }));
    }
  };

  return (
    <section className="card">
      <h2>Coding Practice</h2>
      <p>
        Practice implementing NOR logic and understanding pull-up and pull-down behavior
        in CMOS gate design.
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