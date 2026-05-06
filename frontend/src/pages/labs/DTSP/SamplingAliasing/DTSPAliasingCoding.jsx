import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

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
  const [codingSaveStatus, setCodingSaveStatus] = useState({});

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
  if (fs <= 0) return f;

  let alias = f % fs;

  if (alias > fs / 2) {
    alias = fs - alias;
  }

  return Math.abs(alias);
}`;
  };

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
    setCodes((prev) => ({ ...prev, [problemId]: code }));
  };

  const saveSubmission = async ({ problem, code, isPassed }) => {
    setCodingSaveStatus((prev) => ({
      ...prev,
      [problem.id]: "Saving submission..."
    }));

    try {
      await saveCodingSubmission({
        labSlug: "dtsp",
        experimentSlug: "sampling-aliasing",
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
      console.error("DTSP coding save failed:", error);

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problem.id]: "Code checked, but backend save failed."
      }));
    }
  };

  const runCode = async (problem) => {
    const problemId = problem.id;
    const code = codes[problemId];

    if (!code || !code.trim()) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Please enter code first."
      }));
      return;
    }

    try {
      let resultText = "";
      let isPassed = false;

      if (problemId === 1) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return generateSamples;`)();
        const output = fn(2, 10, 1);

        isPassed =
          Array.isArray(output) &&
          output.length >= 10 &&
          output.every((value) => typeof value === "number");

        resultText = isPassed
          ? `Correct format. Sample count generated: ${output.length}`
          : "Incorrect output format. Expected an array of numeric samples.";
      }

      if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return checkNyquist;`)();

        const caseOne = fn(3, 8);
        const caseTwo = fn(9, 10);

        isPassed = caseOne === true && caseTwo === false;

        resultText = isPassed
          ? "Function passed test cases. Example: checkNyquist(3, 8) = true and checkNyquist(9, 10) = false."
          : "Incorrect logic. For f = 3, fs = 8 it should return true. For f = 9, fs = 10 it should return false.";
      }

      if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return aliasFrequency;`)();

        const outputOne = fn(9, 10);
        const outputTwo = fn(7, 10);

        isPassed =
          typeof outputOne === "number" &&
          typeof outputTwo === "number" &&
          outputOne === 1 &&
          outputTwo === 3;

        resultText = isPassed
          ? "Function passed test cases. aliasFrequency(9, 10) = 1 Hz and aliasFrequency(7, 10) = 3 Hz."
          : "Incorrect logic. Try using f % fs, then fold frequencies above fs / 2 using fs - alias.";
      }

      setResults((prev) => ({
        ...prev,
        [problemId]: resultText
      }));

      await saveSubmission({ problem, code, isPassed });
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [problemId]: `Error: ${error.message}`
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
        experiment: "sampling-aliasing",
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
        experiment: "sampling-aliasing",
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
            Practice JavaScript functions for sampling, Nyquist condition, and aliasing.
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