import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Delay Check",
    description:
      "Write a function hasOutputChanged(timeNs, delayNs) that returns true if the output should have changed."
  },
  {
    id: 2,
    title: "NOT Gate with Delay",
    description:
      "Write a function delayedNot(input, timeNs, delayNs, oldOutput) that returns oldOutput until delay elapses, then returns inverted input."
  },
  {
    id: 3,
    title: "BUFFER Gate with Delay",
    description:
      "Write a function delayedBuffer(input, timeNs, delayNs, oldOutput) that returns oldOutput until delay elapses, then returns input."
  }
];

export default function DSDPropagationDelayCoding() {
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
      return `function hasOutputChanged(timeNs, delayNs) {
  return timeNs >= delayNs;
}`;
    }

    if (id === 2) {
      return `function delayedNot(input, timeNs, delayNs, oldOutput) {
  if (timeNs < delayNs) return oldOutput;
  return input === 1 ? 0 : 1;
}`;
    }

    return `function delayedBuffer(input, timeNs, delayNs, oldOutput) {
  if (timeNs < delayNs) return oldOutput;
  return input;
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
        const fn = new Function(`${code}; return hasOutputChanged;`)();
        const output = fn(5, 3);
        resultText = `Function ran successfully. Example hasOutputChanged(5,3) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return delayedNot;`)();
        const output = fn(1, 6, 5, 1);
        resultText = `Function ran successfully. Example delayedNot(1,6,5,1) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return delayedBuffer;`)();
        const output = fn(1, 2, 5, 0);
        resultText = `Function ran successfully. Example delayedBuffer(1,2,5,0) = ${output}`;
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
      <p>Practice implementing simple delay-aware digital logic functions.</p>

      <button className="btn primary" onClick={generateProblems}>
        Generate Problems
      </button>

      {currentProblems.map((problem, index) => (
        <div key={problem.id} className="coding-problem">
          <h3>Problem {index + 1}: {problem.title}</h3>
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