import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

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

function getStarterCode(id) {
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
}

function nearlyEqual(a, b, tolerance = 1e-3) {
  return Math.abs(Number(a) - Number(b)) <= tolerance;
}

function arraysNearlyEqual(actual, expected, tolerance = 1e-3) {
  if (!Array.isArray(actual) || actual.length !== expected.length) return false;

  return actual.every((value, index) =>
    nearlyEqual(value, expected[index], tolerance)
  );
}

export default function DTSPFilterDesignCoding() {
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
        experimentSlug: "fir-filter-design",
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
      console.error("FIR Filter Design coding save failed:", error);

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
        const fn = new Function(`${code}; return idealLowPass;`)();

        const output = fn(0.3, 5);
        const expected = [
          Math.sin(2 * Math.PI * 0.3 * -2) / (Math.PI * -2),
          Math.sin(2 * Math.PI * 0.3 * -1) / (Math.PI * -1),
          0.6,
          Math.sin(2 * Math.PI * 0.3 * 1) / (Math.PI * 1),
          Math.sin(2 * Math.PI * 0.3 * 2) / (Math.PI * 2)
        ];

        isPassed = arraysNearlyEqual(output, expected, 1e-3);

        resultText = isPassed
          ? "Correct. Ideal low-pass FIR coefficients were generated properly."
          : "Incorrect. Use sinc formula with center M = (length - 1) / 2 and h[M] = 2 × cutoff.";
      }

      if (problem.id === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return applyHammingWindow;`)();

        const output = fn([1, 1, 1, 1, 1]);
        const expected = [0.08, 0.54, 1, 0.54, 0.08];

        isPassed = arraysNearlyEqual(output, expected, 1e-2);

        resultText = isPassed
          ? "Correct. Hamming window was applied properly."
          : "Incorrect. Use w[n] = 0.54 - 0.46 cos(2πn/(N-1)).";
      }

      if (problem.id === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return isOddLength;`)();

        isPassed =
          fn(11) === true &&
          fn(5) === true &&
          fn(10) === false &&
          fn(0) === false;

        resultText = isPassed
          ? "Correct. Odd length checks passed."
          : "Incorrect. Return true only for positive odd filter lengths.";
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
        experiment: "fir-filter-design",
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
        experiment: "fir-filter-design",
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
            Practice generating FIR coefficients and applying window methods.
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