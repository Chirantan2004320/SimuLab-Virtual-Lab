import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "NOT Gate Function",
    description:
      "Write a function NOT(A) that returns the output of a NOT gate."
  },
  {
    id: 2,
    title: "AND Gate Function",
    description:
      "Write a function AND(A, B) that returns the output of an AND gate."
  },
  {
    id: 3,
    title: "XOR Gate Function",
    description:
      "Write a function XOR(A, B) that returns the output of an XOR gate."
  }
];

export default function DSDLogicGatesCoding() {
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
      return `function NOT(A) {
  return A === 1 ? 0 : 1;
}`;
    }

    if (id === 2) {
      return `function AND(A, B) {
  return A && B ? 1 : 0;
}`;
    }

    return `function XOR(A, B) {
  return A !== B ? 1 : 0;
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
        const fn = new Function(`${code}; return NOT;`)();
        const output = fn(1);
        resultText = `Function ran successfully. Example NOT(1) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return AND;`)();
        const output = fn(1, 1);
        resultText = `Function ran successfully. Example AND(1,1) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return XOR;`)();
        const output = fn(1, 0);
        resultText = `Function ran successfully. Example XOR(1,0) = ${output}`;
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
        Practice implementing Boolean logic using simple gate functions.
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