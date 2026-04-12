import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Next Counter State",
    description:
      "Write a function nextCounterState(count) that returns the next state of a 2-bit counter."
  },
  {
    id: 2,
    title: "Binary Bits",
    description:
      "Write a function getBits(count) that returns q1 and q0 for a 2-bit counter state."
  },
  {
    id: 3,
    title: "Counter Reset",
    description:
      "Write a function resetCounter() that returns the reset state of the counter."
  }
];

export default function DSDCounterCoding() {
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
      return `function nextCounterState(count) {
  return (count + 1) % 4;
}`;
    }

    if (id === 2) {
      return `function getBits(count) {
  return {
    q1: Math.floor(count / 2),
    q0: count % 2
  };
}`;
    }

    return `function resetCounter() {
  return 0;
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
        const fn = new Function(`${code}; return nextCounterState;`)();
        const output = fn(2);
        resultText = `Function ran successfully. Example nextCounterState(2) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return getBits;`)();
        const output = fn(3);
        resultText = `Function ran successfully. Example getBits(3) = ${JSON.stringify(output)}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return resetCounter;`)();
        const output = fn();
        resultText = `Function ran successfully. Example resetCounter() = ${output}`;
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
        Practice implementing basic counter logic using JavaScript functions.
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