import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Hold State",
    description:
      "Write a function holdState(q) that returns the stored bit without changing it."
  },
  {
    id: 2,
    title: "Write Operation",
    description:
      "Write a function writeSRAM(bitline, wordline, oldQ) that returns the new stored bit only if wordline = 1."
  },
  {
    id: 3,
    title: "Read Operation",
    description:
      "Write a function readSRAM(q, wordline) that returns q when wordline = 1, otherwise returns 'Z'."
  }
];

export default function DVLSISRAMCellCoding() {
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
      return `function holdState(q) {
  return q;
}`;
    }

    if (id === 2) {
      return `function writeSRAM(bitline, wordline, oldQ) {
  return wordline === 1 ? bitline : oldQ;
}`;
    }

    return `function readSRAM(q, wordline) {
  return wordline === 1 ? q : "Z";
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
        const fn = new Function(`${code}; return holdState;`)();
        const output = fn(1);
        resultText = `Function ran successfully. Example holdState(1) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return writeSRAM;`)();
        const output = fn(0, 1, 1);
        resultText = `Function ran successfully. Example writeSRAM(0,1,1) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return readSRAM;`)();
        const output = fn(1, 1);
        resultText = `Function ran successfully. Example readSRAM(1,1) = ${output}`;
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
        Practice implementing basic SRAM hold, read, and write behavior.
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