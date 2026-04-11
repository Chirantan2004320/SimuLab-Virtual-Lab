import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "CMOS Inverter Logic",
    description:
      "Write a function inverterOutput(vin, vm, vdd) that returns HIGH or LOW depending on Vin and switching point VM."
  },
  {
    id: 2,
    title: "Noise Margin Estimation",
    description:
      "Write a function noiseMargins(vm, vdd) that returns approximate NML and NMH."
  },
  {
    id: 3,
    title: "Dynamic Power Trend",
    description:
      "Write a function dynamicPower(cap, vdd) using the simplified relation 0.5 × C × VDD²."
  }
];

export default function DVLSICMOSInverterSimulationCoding() {
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
      return `function inverterOutput(vin, vm, vdd) {
  if (vin < vm) return "HIGH";
  return "LOW";
}`;
    }

    if (id === 2) {
      return `function noiseMargins(vm, vdd) {
  return {
    nml: vm,
    nmh: vdd - vm
  };
}`;
    }

    return `function dynamicPower(cap, vdd) {
  return 0.5 * cap * vdd * vdd;
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
        const fn = new Function(`${code}; return inverterOutput;`)();
        const output = fn(1, 2.5, 5);
        resultText =
          typeof output === "string"
            ? `Function ran successfully. Example output for Vin=1, VM=2.5, VDD=5: ${output}`
            : "Return value should be HIGH or LOW.";
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return noiseMargins;`)();
        const output = fn(2.5, 5);
        resultText =
          typeof output === "object" && output !== null
            ? `Function ran successfully. Example result: NML=${output.nml}, NMH=${output.nmh}`
            : "Return value should be an object like { nml, nmh }.";
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return dynamicPower;`)();
        const output = fn(10, 5);
        resultText =
          typeof output === "number"
            ? `Function ran successfully. Example dynamic power for C=10 and VDD=5: ${output}`
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
        Practice basic logic, noise margin estimation, and simplified power calculations
        related to CMOS inverter behavior.
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