import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Transmission Gate Output",
    description:
      "Write a function transmissionGate(input, control) that returns input when control = 1, otherwise returns 'Z'."
  },
  {
    id: 2,
    title: "Complementary Control",
    description:
      "Write a function controlBar(control) that returns the complement of the control signal."
  },
  {
    id: 3,
    title: "Pass nMOS Output",
    description:
      "Write a function passNMOS(input, control) that returns input when control = 1, otherwise returns 'Z'."
  }
];

export default function DVLSITransmissionGateCoding() {
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
      return `function transmissionGate(input, control) {
  return control === 1 ? input : "Z";
}`;
    }

    if (id === 2) {
      return `function controlBar(control) {
  return control === 1 ? 0 : 1;
}`;
    }

    return `function passNMOS(input, control) {
  return control === 1 ? input : "Z";
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
        const fn = new Function(`${code}; return transmissionGate;`)();
        const output = fn(1, 1);
        resultText = `Function ran successfully. Example transmissionGate(1,1) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return controlBar;`)();
        const output = fn(1);
        resultText = `Function ran successfully. Example controlBar(1) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return passNMOS;`)();
        const output = fn(0, 1);
        resultText = `Function ran successfully. Example passNMOS(0,1) = ${output}`;
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
        Practice implementing transmission gate control logic and basic pass transistor behavior.
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