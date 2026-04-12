import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "2-to-1 Multiplexer",
    description:
      "Write a function mux2to1(i0, i1, s) that returns i0 when s = 0 and i1 when s = 1."
  },
  {
    id: 2,
    title: "4-to-1 Multiplexer Output",
    description:
      "Write a function mux4to1(i0, i1, i2, i3, s1, s0) that returns the selected input."
  },
  {
    id: 3,
    title: "Selected Index",
    description:
      "Write a function selectedIndex(s1, s0) that returns the decimal index chosen by the select lines."
  }
];

export default function DSDMultiplexerCoding() {
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
      return `function mux2to1(i0, i1, s) {
  return s === 0 ? i0 : i1;
}`;
    }

    if (id === 2) {
      return `function mux4to1(i0, i1, i2, i3, s1, s0) {
  const index = s1 * 2 + s0;
  const inputs = [i0, i1, i2, i3];
  return inputs[index];
}`;
    }

    return `function selectedIndex(s1, s0) {
  return s1 * 2 + s0;
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
        const fn = new Function(`${code}; return mux2to1;`)();
        const output = fn(0, 1, 1);
        resultText = `Function ran successfully. Example mux2to1(0,1,1) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return mux4to1;`)();
        const output = fn(0, 1, 0, 1, 1, 0);
        resultText = `Function ran successfully. Example mux4to1(0,1,0,1,1,0) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return selectedIndex;`)();
        const output = fn(1, 1);
        resultText = `Function ran successfully. Example selectedIndex(1,1) = ${output}`;
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
        Practice implementing multiplexer selection logic using JavaScript functions.
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