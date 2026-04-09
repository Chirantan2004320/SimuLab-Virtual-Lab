import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Generate Sampled Sine Wave",
    description:
      "Write a function generateSamples(f, fs, duration) that returns sampled values of sin(2πft)."
  },
  {
    id: 2,
    title: "Check Nyquist Condition",
    description:
      "Write a function checkNyquist(f, fs) that returns true if fs >= 2f, otherwise false."
  },
  {
    id: 3,
    title: "Estimate Alias Frequency",
    description:
      "Write a function aliasFrequency(f, fs) that estimates the aliased frequency when undersampling occurs."
  }
];

export default function DTSPAliasingCoding() {
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
      return `function generateSamples(f, fs, duration) {
  const samples = [];
  const Ts = 1 / fs;

  for (let t = 0; t <= duration; t += Ts) {
    samples.push(Math.sin(2 * Math.PI * f * t));
  }

  return samples;
}`;
    }

    if (id === 2) {
      return `function checkNyquist(f, fs) {
  return fs >= 2 * f;
}`;
    }

    return `function aliasFrequency(f, fs) {
  if (fs >= 2 * f) return f;
  return Math.abs(f - fs);
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
        const fn = new Function(`${code}; return generateSamples;`)();
        const output = fn(2, 10, 1);
        resultText = Array.isArray(output)
          ? `Output generated successfully. Sample count: ${output.length}`
          : "Incorrect output format.";
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return checkNyquist;`)();
        const output = fn(3, 8);
        resultText =
          typeof output === "boolean"
            ? `Function ran successfully. Example result for f=3, fs=8: ${output}`
            : "Return value should be true or false.";
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return aliasFrequency;`)();
        const output = fn(9, 10);
        resultText =
          typeof output === "number"
            ? `Function ran successfully. Example alias frequency for f=9, fs=10: ${output}`
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
        Practice writing simple functions related to sampling, Nyquist condition, and aliasing.
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