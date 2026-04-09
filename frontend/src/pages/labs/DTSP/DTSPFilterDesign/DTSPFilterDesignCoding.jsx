import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Generate Ideal Low-Pass Filter",
    description:
      "Write a function idealLowPass(cutoff, length) that generates ideal FIR low-pass coefficients."
  },
  {
    id: 2,
    title: "Apply Hamming Window",
    description:
      "Write a function applyHammingWindow(h) that multiplies FIR coefficients by a Hamming window."
  },
  {
    id: 3,
    title: "Check Odd Filter Length",
    description:
      "Write a function isOddLength(N) that returns true if the FIR filter length is odd."
  }
];

export default function DTSPFilterDesignCoding() {
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
      return `function idealLowPass(cutoff, length) {
  const h = [];
  const M = (length - 1) / 2;

  for (let n = 0; n < length; n++) {
    const k = n - M;
    if (k === 0) {
      h.push(2 * cutoff);
    } else {
      h.push(Math.sin(2 * Math.PI * cutoff * k) / (Math.PI * k));
    }
  }

  return h;
}`;
    }

    if (id === 2) {
      return `function applyHammingWindow(h) {
  const N = h.length;
  return h.map((value, n) => {
    const w = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
    return value * w;
  });
}`;
    }

    return `function isOddLength(N) {
  return N % 2 === 1;
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
        const fn = new Function(`${code}; return idealLowPass;`)();
        const output = fn(0.3, 11);
        resultText = Array.isArray(output)
          ? `Function ran successfully. Generated ${output.length} coefficients.`
          : "Return value should be an array.";
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return applyHammingWindow;`)();
        const output = fn([0.2, 0.3, 0.5, 0.3, 0.2]);
        resultText = Array.isArray(output)
          ? `Window applied successfully. Output length: ${output.length}`
          : "Return value should be an array.";
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return isOddLength;`)();
        const output = fn(11);
        resultText =
          typeof output === "boolean"
            ? `Function ran successfully. Example result for N=11: ${output}`
            : "Return value should be true or false.";
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
        Practice generating FIR coefficients and applying window methods.
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