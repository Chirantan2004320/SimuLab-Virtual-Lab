import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "D Flip-Flop Output",
    description:
      "Write a function dFlipFlop(D, CLK, prevQ) that returns the next state of Q."
  },
  {
    id: 2,
    title: "JK Flip-Flop Toggle Logic",
    description:
      "Write a function jkNextState(J, K, CLK, prevQ) that returns the next Q."
  },
  {
    id: 3,
    title: "T Flip-Flop Logic",
    description:
      "Write a function tFlipFlop(T, CLK, prevQ) that returns the next state."
  }
];

export default function DSDFlipFlopsCoding() {
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
      return `function dFlipFlop(D, CLK, prevQ) {
  return CLK === 1 ? D : prevQ;
}`;
    }

    if (id === 2) {
      return `function jkNextState(J, K, CLK, prevQ) {
  if (CLK !== 1) return prevQ;
  if (J === 0 && K === 0) return prevQ;
  if (J === 1 && K === 0) return 1;
  if (J === 0 && K === 1) return 0;
  return prevQ === 1 ? 0 : 1;
}`;
    }

    return `function tFlipFlop(T, CLK, prevQ) {
  if (CLK !== 1) return prevQ;
  return T === 1 ? (prevQ === 1 ? 0 : 1) : prevQ;
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
        const fn = new Function(`${code}; return dFlipFlop;`)();
        const output = fn(1, 1, 0);
        resultText = `Function ran successfully. Example dFlipFlop(1,1,0) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return jkNextState;`)();
        const output = fn(1, 1, 1, 0);
        resultText = `Function ran successfully. Example jkNextState(1,1,1,0) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return tFlipFlop;`)();
        const output = fn(1, 1, 1);
        resultText = `Function ran successfully. Example tFlipFlop(1,1,1) = ${output}`;
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
      <p>Practice implementing sequential logic using simple functions.</p>

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