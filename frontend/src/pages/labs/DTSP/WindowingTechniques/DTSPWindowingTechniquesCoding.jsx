import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const problemBank = [
  {
    id: 1,
    title: "Generate Hamming Window",
    description:
      "Write a function hammingWindow(N) that returns N Hamming window samples."
  },
  {
    id: 2,
    title: "Generate Blackman Window",
    description:
      "Write a function blackmanWindow(N) that returns N Blackman window samples."
  },
  {
    id: 3,
    title: "Compute Window Energy",
    description:
      "Write a function windowEnergy(w) that returns the sum of squares of all window samples."
  }
];

function getStarterCode(id) {
  if (id === 1) {
    return `function hammingWindow(N) {
  const w = [];

  for (let n = 0; n < N; n++) {
    w.push(0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1)));
  }

  return w;
}`;
  }

  if (id === 2) {
    return `function blackmanWindow(N) {
  const w = [];

  for (let n = 0; n < N; n++) {
    w.push(
      0.42 -
      0.5 * Math.cos((2 * Math.PI * n) / (N - 1)) +
      0.08 * Math.cos((4 * Math.PI * n) / (N - 1))
    );
  }

  return w;
}`;
  }

  return `function windowEnergy(w) {
  return w.reduce((sum, value) => sum + value * value, 0);
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

export default function DTSPWindowingTechniquesCoding() {
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
        experimentSlug: "windowing-techniques",
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
      console.error("Windowing coding save failed:", error);

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
        const fn = new Function(`${code}; return hammingWindow;`)();

        const output = fn(5);
        const expected = [0.08, 0.54, 1, 0.54, 0.08];

        isPassed = arraysNearlyEqual(output, expected, 1e-2);

        resultText = isPassed
          ? "Correct. Hamming window samples were generated properly."
          : "Incorrect. For N = 5, expected approximately [0.08, 0.54, 1, 0.54, 0.08].";
      }

      if (problem.id === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return blackmanWindow;`)();

        const output = fn(5);
        const expected = [0, 0.34, 1, 0.34, 0];

        isPassed = arraysNearlyEqual(output, expected, 2e-2);

        resultText = isPassed
          ? "Correct. Blackman window samples were generated properly."
          : "Incorrect. For N = 5, expected approximately [0, 0.34, 1, 0.34, 0].";
      }

      if (problem.id === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return windowEnergy;`)();

        const outputOne = fn([1, 1, 1]);
        const outputTwo = fn([0.5, 0.5, 0.5, 0.5]);

        isPassed =
          nearlyEqual(outputOne, 3, 1e-3) &&
          nearlyEqual(outputTwo, 1, 1e-3);

        resultText = isPassed
          ? "Correct. Window energy test cases passed."
          : "Incorrect. Energy should be the sum of squared sample values.";
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
        experiment: "windowing-techniques",
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
        experiment: "windowing-techniques",
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
            Practice generating window functions and calculating window energy.
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