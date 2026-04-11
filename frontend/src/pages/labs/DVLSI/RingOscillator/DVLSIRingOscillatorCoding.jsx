import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Oscillation Condition",
    description:
      "Write a function canOscillate(stages, enabled) that returns true only when the oscillator is enabled and the number of stages is odd."
  },
  {
    id: 2,
    title: "Period Calculator",
    description:
      "Write a function ringPeriod(stages, tpd) that returns the approximate period using T = 2 × stages × tpd."
  },
  {
    id: 3,
    title: "Frequency Calculator",
    description:
      "Write a function ringFrequency(period) that returns 1 / period."
  }
];

export default function DVLSIRingOscillatorCoding() {
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
      return `function canOscillate(stages, enabled) {
  return enabled && stages % 2 === 1;
}`;
    }

    if (id === 2) {
      return `function ringPeriod(stages, tpd) {
  return 2 * stages * tpd;
}`;
    }

    return `function ringFrequency(period) {
  return 1 / period;
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
        const fn = new Function(`${code}; return canOscillate;`)();
        const output = fn(5, true);
        resultText = `Function ran successfully. Example canOscillate(5,true) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return ringPeriod;`)();
        const output = fn(3, 1);
        resultText = `Function ran successfully. Example ringPeriod(3,1) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return ringFrequency;`)();
        const output = fn(6);
        resultText = `Function ran successfully. Example ringFrequency(6) = ${output}`;
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
        Practice implementing ring oscillator conditions and simple timing equations.
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