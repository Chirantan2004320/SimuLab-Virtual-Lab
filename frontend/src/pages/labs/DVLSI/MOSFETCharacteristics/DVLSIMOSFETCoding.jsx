import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Cutoff Detection",
    description:
      "Write a function isCutoff(vgs, vt) that returns true if the MOSFET is in cutoff."
  },
  {
    id: 2,
    title: "Triode Current",
    description:
      "Write a function triodeCurrent(vgs, vds, vt, k) using the equation Id = k[(VGS−VT)VDS − VDS²/2]."
  },
  {
    id: 3,
    title: "Saturation Current",
    description:
      "Write a function saturationCurrent(vgs, vt, k) using the equation Id = 0.5k(VGS−VT)²."
  }
];

export default function DVLSIMOSFETCoding() {
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
      return `function isCutoff(vgs, vt) {
  return vgs < vt;
}`;
    }

    if (id === 2) {
      return `function triodeCurrent(vgs, vds, vt, k) {
  return k * ((vgs - vt) * vds - (vds * vds) / 2);
}`;
    }

    return `function saturationCurrent(vgs, vt, k) {
  return 0.5 * k * (vgs - vt) * (vgs - vt);
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
        const fn = new Function(`${code}; return isCutoff;`)();
        const output = fn(0.8, 1.0);
        resultText =
          typeof output === "boolean"
            ? `Function ran successfully. Example isCutoff(0.8, 1.0) = ${output}`
            : "Return value should be true or false.";
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return triodeCurrent;`)();
        const output = fn(2.5, 1.0, 1.0, 1.0);
        resultText =
          typeof output === "number"
            ? `Function ran successfully. Example triode current = ${output}`
            : "Return value should be a number.";
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return saturationCurrent;`)();
        const output = fn(2.5, 1.0, 1.0);
        resultText =
          typeof output === "number"
            ? `Function ran successfully. Example saturation current = ${output}`
            : "Return value should be a number.";
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
        Practice implementing MOSFET region checks and drain current equations.
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