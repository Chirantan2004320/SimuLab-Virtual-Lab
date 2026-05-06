import React, { useState } from "react";
import {
  Code2,
  Play,
  Wrench,
  Sparkles,
  Cpu,
  Zap,
  Gauge
} from "lucide-react";

const problemBank = [
  {
    id: 1,
    title: "CMOS Inverter Logic",
    difficulty: "Easy",
    description:
      "Write a function inverterOutput(vin, vm, vdd) that returns HIGH if Vin is below VM, otherwise LOW.",
    starter: `function inverterOutput(vin, vm, vdd) {
  // Return "HIGH" or "LOW"
}`
  },
  {
    id: 2,
    title: "Noise Margin Estimation",
    difficulty: "Medium",
    description:
      "Write a function noiseMargins(vm, vdd) that returns an object { nml, nmh }.",
    starter: `function noiseMargins(vm, vdd) {
  // Return { nml: ..., nmh: ... }
}`
  },
  {
    id: 3,
    title: "Dynamic Power Trend",
    difficulty: "Medium",
    description:
      "Write a function dynamicPower(cap, vdd) using the relation 0.5 × C × VDD².",
    starter: `function dynamicPower(cap, vdd) {
  // Return dynamic power
}`
  }
];

export default function DVLSICMOSInverterSimulationCoding() {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const generateProblems = () => {
    const initialCodes = {};

    problemBank.forEach((problem) => {
      initialCodes[problem.id] = problem.starter;
    });

    setCurrentProblems(problemBank);
    setCodes(initialCodes);
    setResults({});
  };

  const handleCodeChange = (problemId, code) => {
    setCodes((prev) => ({
      ...prev,
      [problemId]: code
    }));
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
          output === "HIGH"
            ? `Correct! inverterOutput(1, 2.5, 5) = ${output}`
            : `Incorrect Output. Expected HIGH, got ${output}`;
      }

      if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return noiseMargins;`)();
        const output = fn(2.5, 5);

        resultText =
          output &&
          typeof output === "object" &&
          output.nml === 2.5 &&
          output.nmh === 2.5
            ? `Correct! NML=${output.nml}, NMH=${output.nmh}`
            : "Incorrect Output. Expected { nml: 2.5, nmh: 2.5 }";
      }

      if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return dynamicPower;`)();
        const output = fn(10, 5);

        resultText =
          typeof output === "number" && Math.abs(output - 125) < 1e-9
            ? `Correct! dynamicPower(10, 5) = ${output}`
            : `Incorrect Output. Expected 125, got ${output}`;
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

  const analyzeCode = () => {
    alert("AI code analysis can be connected here later.");
  };

  const correctCode = () => {
    alert("AI code correction can be connected here later.");
  };

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice inverter logic, noise margin estimation, and dynamic power
            calculations.
          </p>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Focus Area</h4>
          </div>
          <p>CMOS logic behavior and switching analysis.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Topics Covered</h4>
          </div>
          <p>Logic inversion, noise margins, dynamic power.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Difficulty</h4>
          </div>
          <p>Easy to medium conceptual coding problems.</p>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginBottom: 18 }}>
        <Sparkles size={16} style={{ marginRight: 8 }} />
        Generate coding problems and test your CMOS understanding with live
        execution.
      </div>

      <div style={{ marginBottom: 22 }}>
        <button className="sim-btn sim-btn-primary" onClick={generateProblems}>
          Generate Problems
        </button>
      </div>

      {currentProblems.length === 0 && (
        <div className="coding-empty-state">
          No problems generated yet. Click <b>Generate Problems</b> to begin.
        </div>
      )}

      {currentProblems.map((problem, index) => (
        <div
          key={problem.id}
          className="coding-card-upgraded"
          style={{ marginBottom: 22 }}
        >
          <div className="coding-card-header">
            <div>
              <h3>
                Problem {index + 1}: {problem.title}
              </h3>
              <p>{problem.description}</p>
            </div>

            <div className="er-chip active">{problem.difficulty}</div>
          </div>

          <textarea
            rows={14}
            value={codes[problem.id] || ""}
            onChange={(e) => handleCodeChange(problem.id, e.target.value)}
            className="coding-textarea-upgraded"
            placeholder="Write your code here..."
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => runCode(problem.id)}
            >
              <Play size={16} />
              Run Code
            </button>

            <button className="sim-btn sim-btn-muted" onClick={analyzeCode}>
              <Sparkles size={16} />
              Analyze Code
            </button>

            <button className="sim-btn sim-btn-danger" onClick={correctCode}>
              <Wrench size={16} />
              Correct Code
            </button>
          </div>

          {results[problem.id] && (
            <div className="coding-result-box">{results[problem.id]}</div>
          )}
        </div>
      ))}
    </section>
  );
}