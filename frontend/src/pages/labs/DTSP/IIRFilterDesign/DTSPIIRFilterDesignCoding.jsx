import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const problemBank = [
  {
    id: 1,
    title: "Butterworth Low-Pass Magnitude",
    description:
      "Write a function butterworthLowPass(f, fc, order) that returns the Butterworth low-pass magnitude."
  },
  {
    id: 2,
    title: "Butterworth High-Pass Magnitude",
    description:
      "Write a function butterworthHighPass(f, fc, order) that returns the Butterworth high-pass magnitude."
  },
  {
    id: 3,
    title: "Check IIR Stability",
    description:
      "Write a function isStable(poles) that returns true if all pole magnitudes are less than 1."
  }
];

function getStarterCode(id) {
  if (id === 1) {
    return `function butterworthLowPass(f, fc, order) {
  return 1 / Math.sqrt(1 + Math.pow(f / fc, 2 * order));
}`;
  }

  if (id === 2) {
    return `function butterworthHighPass(f, fc, order) {
  return 1 / Math.sqrt(1 + Math.pow(fc / f, 2 * order));
}`;
  }

  return `function isStable(poles) {
  return poles.every((pole) => {
    const mag = Math.sqrt(pole.re * pole.re + pole.im * pole.im);
    return mag < 1;
  });
}`;
}

function nearlyEqual(a, b, tolerance = 1e-3) {
  return Math.abs(Number(a) - Number(b)) <= tolerance;
}

export default function DTSPIIRFilterDesignCoding() {
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
        experimentSlug: "iir-filter-design",
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
      console.error("IIR Filter Design coding save failed:", error);

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
        const fn = new Function(`${code}; return butterworthLowPass;`)();

        const outputOne = fn(0.3, 0.3, 2);
        const outputTwo = fn(0.6, 0.3, 2);

        isPassed =
          nearlyEqual(outputOne, 1 / Math.sqrt(2), 1e-3) &&
          outputTwo < outputOne;

        resultText = isPassed
          ? "Correct. Low-pass Butterworth magnitude behaves as expected."
          : "Incorrect. At f = fc, magnitude should be approximately 0.707, and magnitude should decrease above cutoff.";
      }

      if (problem.id === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return butterworthHighPass;`)();

        const outputOne = fn(0.3, 0.3, 2);
        const outputTwo = fn(0.1, 0.3, 2);
        const outputThree = fn(0.8, 0.3, 2);

        isPassed =
          nearlyEqual(outputOne, 1 / Math.sqrt(2), 1e-3) &&
          outputTwo < outputOne &&
          outputThree > outputOne;

        resultText = isPassed
          ? "Correct. High-pass Butterworth magnitude behaves as expected."
          : "Incorrect. At f = fc, magnitude should be approximately 0.707, lower frequencies should be attenuated, and higher frequencies should pass.";
      }

      if (problem.id === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return isStable;`)();

        const stablePoles = [
          { re: 0.3, im: 0.2 },
          { re: -0.4, im: 0.5 }
        ];

        const unstablePoles = [
          { re: 1.1, im: 0 },
          { re: 0.2, im: 0.3 }
        ];

        isPassed = fn(stablePoles) === true && fn(unstablePoles) === false;

        resultText = isPassed
          ? "Correct. Stability check passed for stable and unstable pole sets."
          : "Incorrect. A digital IIR filter is stable only when every pole magnitude is less than 1.";
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
        experiment: "iir-filter-design",
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
        experiment: "iir-filter-design",
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
            Practice Butterworth magnitude formulas and IIR stability checks.
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