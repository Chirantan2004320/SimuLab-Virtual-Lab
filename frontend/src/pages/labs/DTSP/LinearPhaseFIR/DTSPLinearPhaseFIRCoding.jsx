import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const problemBank = [
  {
    id: 1,
    title: "Check Symmetry",
    description:
      "Write a function isSymmetric(h) that returns true if an impulse response is symmetric."
  },
  {
    id: 2,
    title: "Classify FIR Type",
    description:
      "Write a function classifyFIR(h) to identify whether the FIR filter is Type I, II, III, IV, or not linear phase."
  },
  {
    id: 3,
    title: "Frequency Response Magnitude",
    description:
      "Write a function magnitudeResponse(h, samples) that returns sampled magnitude response values."
  }
];

function getStarterCode(id) {
  if (id === 1) {
    return `function isSymmetric(h) {
  const N = h.length;

  for (let n = 0; n < N; n++) {
    const mirror = N - 1 - n;

    if (Math.abs(h[n] - h[mirror]) > 0.001) {
      return false;
    }
  }

  return true;
}`;
  }

  if (id === 2) {
    return `function classifyFIR(h) {
  const N = h.length;
  let symmetric = true;
  let antisymmetric = true;

  for (let n = 0; n < N; n++) {
    const mirror = N - 1 - n;

    if (Math.abs(h[n] - h[mirror]) > 0.001) {
      symmetric = false;
    }

    if (Math.abs(h[n] + h[mirror]) > 0.001) {
      antisymmetric = false;
    }
  }

  if (symmetric && N % 2 === 1) return "Type I";
  if (symmetric && N % 2 === 0) return "Type II";
  if (antisymmetric && N % 2 === 1) return "Type III";
  if (antisymmetric && N % 2 === 0) return "Type IV";

  return "Not Linear Phase";
}`;
  }

  return `function magnitudeResponse(h, samples) {
  const output = [];

  for (let i = 0; i < samples; i++) {
    const w = (Math.PI * i) / (samples - 1);
    let re = 0;
    let im = 0;

    for (let n = 0; n < h.length; n++) {
      re += h[n] * Math.cos(w * n);
      im -= h[n] * Math.sin(w * n);
    }

    output.push(Math.sqrt(re * re + im * im));
  }

  return output;
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

export default function DTSPLinearPhaseFIRCoding() {
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
        experimentSlug: "linear-phase-fir",
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
      console.error("Linear Phase FIR coding save failed:", error);

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
        const fn = new Function(`${code}; return isSymmetric;`)();

        isPassed =
          fn([0.2, 0.3, 0.5, 0.3, 0.2]) === true &&
          fn([1, 2, 3, 4]) === false;

        resultText = isPassed
          ? "Correct. Symmetry checks passed."
          : "Incorrect. Symmetric impulse response should match h[n] = h[N - 1 - n].";
      }

      if (problem.id === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return classifyFIR;`)();

        isPassed =
          fn([1, 2, 3, 2, 1]) === "Type I" &&
          fn([1, 2, 2, 1]) === "Type II" &&
          fn([1, 2, 0, -2, -1]) === "Type III" &&
          fn([1, 2, -2, -1]) === "Type IV" &&
          fn([1, 2, 3, 4]) === "Not Linear Phase";

        resultText = isPassed
          ? "Correct. FIR type classification test cases passed."
          : "Incorrect. Check symmetry, antisymmetry, and even/odd filter length.";
      }

      if (problem.id === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return magnitudeResponse;`)();

        const output = fn([1, 1], 3);
        const expected = [2, Math.sqrt(2), 0];

        isPassed = arraysNearlyEqual(output, expected, 1e-3);

        resultText = isPassed
          ? "Correct. Magnitude response test case passed."
          : "Incorrect. For h = [1,1] and 3 samples, expected approximately [2, 1.414, 0].";
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
        experiment: "linear-phase-fir",
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
        experiment: "linear-phase-fir",
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
            Practice identifying symmetry and analyzing FIR frequency response.
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