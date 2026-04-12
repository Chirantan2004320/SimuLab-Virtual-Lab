import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Greater Check",
    description:
      "Write a function isGreater(a, b) that returns 1 if a > b, otherwise 0."
  },
  {
    id: 2,
    title: "Equality Check",
    description:
      "Write a function isEqual(a, b) that returns 1 if a === b, otherwise 0."
  },
  {
    id: 3,
    title: "1-bit Comparator",
    description:
      "Write a function comparator(a, b) that returns an object with greater, equal, and less outputs."
  }
];

export default function DSDComparatorCoding() {
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
      return `function isGreater(a, b) {
  return a > b ? 1 : 0;
}`;
    }

    if (id === 2) {
      return `function isEqual(a, b) {
  return a === b ? 1 : 0;
}`;
    }

    return `function comparator(a, b) {
  return {
    greater: a > b ? 1 : 0,
    equal: a === b ? 1 : 0,
    less: a < b ? 1 : 0
  };
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
        const fn = new Function(`${code}; return isGreater;`)();
        const output = fn(1, 0);
        resultText = `Function ran successfully. Example isGreater(1,0) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return isEqual;`)();
        const output = fn(1, 1);
        resultText = `Function ran successfully. Example isEqual(1,1) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return comparator;`)();
        const output = fn(0, 1);
        resultText = `Function ran successfully. Example comparator(0,1) = ${JSON.stringify(output)}`;
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
        Practice implementing comparison logic using JavaScript functions.
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
            rows={12}
            placeholder="Write your code here..."
            style={{
              width: "100%",
              fontFamily: "monospace",
              color: "#000",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "10px"
            }}
          />

          <button className="btn secondary" onClick={() => runCode(problem.id)}>
            Run Code
          </button>

          {results[problem.id] && (
            <p className="result" style={{ marginTop: "10px" }}>
              {results[problem.id]}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}