import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const problemBank = [
  {
    id: 1,
    title: "Compute 4-point DFT",
    description:
      "Write a function dft4(arr) that computes the DFT of a 4-point real sequence and returns an array of objects like { re, im }."
  },
  {
    id: 2,
    title: "Compute Magnitude Spectrum",
    description:
      "Write a function magnitudeSpectrum(X) that returns the magnitude of each DFT coefficient."
  },
  {
    id: 3,
    title: "Reconstruct using IDFT",
    description:
      "Write a function simpleIDFT(X) that reconstructs a real-valued sequence from frequency-domain coefficients."
  }
];

function getStarterCode(id) {
  if (id === 1) {
    return `function dft4(arr) {
  const N = 4;
  const X = [];

  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;
      re += arr[n] * Math.cos(angle);
      im += arr[n] * Math.sin(angle);
    }

    X.push({ re, im });
  }

  return X;
}`;
  }

  if (id === 2) {
    return `function magnitudeSpectrum(X) {
  return X.map((value) => {
    return Math.sqrt(value.re * value.re + value.im * value.im);
  });
}`;
  }

  return `function simpleIDFT(X) {
  const N = X.length;
  const output = [];

  for (let n = 0; n < N; n++) {
    let re = 0;

    for (let k = 0; k < N; k++) {
      const angle = (2 * Math.PI * k * n) / N;
      re += X[k].re * Math.cos(angle) - X[k].im * Math.sin(angle);
    }

    output.push(re / N);
  }

  return output;
}`;
}

function nearlyEqual(a, b, tolerance = 1e-3) {
  return Math.abs(Number(a) - Number(b)) <= tolerance;
}

function arraysNearlyEqual(actual, expected, tolerance = 1e-3) {
  if (!Array.isArray(actual) || actual.length !== expected.length) return false;

  return actual.every((value, index) => {
    if (typeof expected[index] === "number") {
      return nearlyEqual(value, expected[index], tolerance);
    }

    return (
      nearlyEqual(value.re, expected[index].re, tolerance) &&
      nearlyEqual(value.im, expected[index].im, tolerance)
    );
  });
}

export default function DTSPDFTIDFTCoding() {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});
  const [codingSaveStatus, setCodingSaveStatus] = useState({});

  const generateProblems = () => {
    const initialCodes = {};
    const initialResults = {};
    const initialSaveStatus = {};

    problemBank.forEach((problem) => {
      initialCodes[problem.id] = getStarterCode(problem.id);
      initialResults[problem.id] = "";
      initialSaveStatus[problem.id] = "";
    });

    setCurrentProblems(problemBank);
    setCodes(initialCodes);
    setResults(initialResults);
    setCodingSaveStatus(initialSaveStatus);
  };

  const handleCodeChange = (problemId, code) => {
    setCodes((prev) => ({
      ...prev,
      [problemId]: code
    }));
  };

  const saveSubmission = async ({ problem, code, isPassed }) => {
    setCodingSaveStatus((prev) => ({
      ...prev,
      [problem.id]: "Saving submission..."
    }));

    try {
      await saveCodingSubmission({
        labSlug: "dtsp",
        experimentSlug: "dft-idft",
        problemTitle: problem.title,
        language: "javascript",
        code,
        result: isPassed ? "passed" : "failed"
      });

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problem.id]: "Submission saved to dashboard."
      }));
    } catch (error) {
      console.error("DFT IDFT coding save failed:", error);

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problem.id]: "Code checked, but backend save failed."
      }));
    }
  };

  const runCode = async (problem) => {
    const code = codes[problem.id] || "";

    if (!code.trim()) {
      setResults((prev) => ({
        ...prev,
        [problem.id]: "Please enter code first."
      }));
      return;
    }

    try {
      let resultText = "";
      let isPassed = false;

      if (problem.id === 1) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return dft4;`)();

        const output = fn([1, 2, 3, 4]);

        const expected = [
          { re: 10, im: 0 },
          { re: -2, im: 2 },
          { re: -2, im: 0 },
          { re: -2, im: -2 }
        ];

        isPassed = arraysNearlyEqual(output, expected);

        resultText = isPassed
          ? "Correct. dft4([1, 2, 3, 4]) produced the expected 4 DFT coefficients."
          : "Incorrect output. Expected approximately [{re:10, im:0}, {re:-2, im:2}, {re:-2, im:0}, {re:-2, im:-2}].";
      }

      if (problem.id === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return magnitudeSpectrum;`)();

        const input = [
          { re: 10, im: 0 },
          { re: -2, im: 2 },
          { re: -2, im: 0 },
          { re: -2, im: -2 }
        ];

        const output = fn(input);
        const expected = [10, Math.sqrt(8), 2, Math.sqrt(8)];

        isPassed = arraysNearlyEqual(output, expected);

        resultText = isPassed
          ? "Correct. Magnitude spectrum was computed properly."
          : "Incorrect output. Use sqrt(re² + im²) for each coefficient.";
      }

      if (problem.id === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return simpleIDFT;`)();

        const input = [
          { re: 10, im: 0 },
          { re: -2, im: 2 },
          { re: -2, im: 0 },
          { re: -2, im: -2 }
        ];

        const output = fn(input);
        const expected = [1, 2, 3, 4];

        isPassed = arraysNearlyEqual(output, expected);

        resultText = isPassed
          ? "Correct. IDFT reconstructed the original sequence [1, 2, 3, 4]."
          : "Incorrect output. IDFT should divide the final sum by N and reconstruct [1, 2, 3, 4].";
      }

      setResults((prev) => ({
        ...prev,
        [problem.id]: resultText
      }));

      await saveSubmission({ problem, code, isPassed });
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [problem.id]: `Error: ${error.message}`
      }));

      await saveSubmission({ problem, code, isPassed: false });
    }
  };

  const analyzeCode = (problem) => {
    const code = codes[problem.id] || "";

    if (!code.trim()) {
      alert("Please enter code to analyze.");
      return;
    }

    localStorage.setItem(
      "vlab_code_analysis",
      JSON.stringify({
        type: "code_analysis",
        lab: "dtsp",
        experiment: "dft-idft",
        problemId: problem.id,
        title: problem.title,
        description: problem.description,
        code
      })
    );

    alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctCode = (problem) => {
    const code = codes[problem.id] || "";

    if (!code.trim()) {
      alert("Please enter code to correct.");
      return;
    }

    localStorage.setItem(
      "vlab_code_correction",
      JSON.stringify({
        type: "code_correction",
        lab: "dtsp",
        experiment: "dft-idft",
        problemId: problem.id,
        title: problem.title,
        description: problem.description,
        code,
        expectedStarterCode: getStarterCode(problem.id)
      })
    );

    alert("Code correction request sent to AI Assistant. Check the AI chat for corrected logic!");
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
            Practice DFT and IDFT logic through small implementation-based
            problems.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
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
        <div key={problem.id} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <h3>
                Problem {index + 1}: {problem.title}
              </h3>
              <p>{problem.description}</p>
            </div>

            <div className="coding-language-wrap">
              <label className="sorting-label">Language</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                JavaScript
              </div>
            </div>
          </div>

          <textarea
            value={codes[problem.id] || ""}
            onChange={(e) => handleCodeChange(problem.id, e.target.value)}
            placeholder="Write your code here..."
            rows={14}
            className="coding-textarea-upgraded"
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => runCode(problem)}
            >
              <Play size={16} />
              Run Code
            </button>

            <button
              className="sim-btn sim-btn-muted"
              type="button"
              onClick={() => analyzeCode(problem)}
            >
              <Sparkles size={16} />
              Analyze Code
            </button>

            <button
              className="sim-btn sim-btn-danger"
              type="button"
              onClick={() => correctCode(problem)}
            >
              <Wrench size={16} />
              Correct Code
            </button>
          </div>

          {results[problem.id] && (
            <div className="coding-result-box">{results[problem.id]}</div>
          )}

          {codingSaveStatus[problem.id] && (
            <div className="coding-result-box">
              {codingSaveStatus[problem.id]}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}