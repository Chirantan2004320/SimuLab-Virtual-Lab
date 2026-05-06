import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const problemBank = [
  {
    id: 1,
    title: "Compute Magnitude of a Complex Number",
    description:
      "Write a function magnitude(z) that returns the magnitude of a complex number represented as { re, im }."
  },
  {
    id: 2,
    title: "Check Stability from Pole Magnitudes",
    description:
      "Write a function isStable(poles) that returns true if all poles lie inside the unit circle."
  },
  {
    id: 3,
    title: "Format Complex Number",
    description:
      "Write a function formatComplex(z) that returns a string form like a + jb."
  }
];

function getStarterCode(id) {
  if (id === 1) {
    return `function magnitude(z) {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}`;
  }

  if (id === 2) {
    return `function isStable(poles) {
  return poles.every((pole) => {
    const mag = Math.sqrt(pole.re * pole.re + pole.im * pole.im);
    return mag < 1;
  });
}`;
  }

  return `function formatComplex(z) {
  const sign = z.im >= 0 ? "+" : "-";
  return \`\${z.re} \${sign} j\${Math.abs(z.im)}\`;
}`;
}

function nearlyEqual(a, b, tolerance = 1e-3) {
  return Math.abs(Number(a) - Number(b)) <= tolerance;
}

export default function DTSPPoleZeroAnalysisCoding() {
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
        experimentSlug: "pole-zero-analysis",
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
      console.error("Pole-Zero coding save failed:", error);

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
        const fn = new Function(`${code}; return magnitude;`)();

        const outputOne = fn({ re: 3, im: 4 });
        const outputTwo = fn({ re: 0.6, im: 0.8 });

        isPassed = nearlyEqual(outputOne, 5) && nearlyEqual(outputTwo, 1);

        resultText = isPassed
          ? "Correct. Complex magnitude test cases passed."
          : "Incorrect. magnitude({re:3, im:4}) should return 5.";
      }

      if (problem.id === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return isStable;`)();

        const stablePoles = [
          { re: 0.5, im: 0 },
          { re: 0.3, im: 0.4 }
        ];

        const unstablePoles = [
          { re: 1.2, im: 0 },
          { re: 0.3, im: 0.4 }
        ];

        isPassed = fn(stablePoles) === true && fn(unstablePoles) === false;

        resultText = isPassed
          ? "Correct. Stability check passed for stable and unstable pole sets."
          : "Incorrect. All pole magnitudes must be strictly less than 1 for stability.";
      }

      if (problem.id === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return formatComplex;`)();

        const outputOne = fn({ re: 2, im: 3 });
        const outputTwo = fn({ re: -1, im: -4 });

        isPassed =
          outputOne === "2 + j3" &&
          outputTwo === "-1 - j4";

        resultText = isPassed
          ? "Correct. Complex number formatting test cases passed."
          : 'Incorrect. Expected "2 + j3" and "-1 - j4".';
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
        experiment: "pole-zero-analysis",
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
        experiment: "pole-zero-analysis",
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
            Practice basic utility functions used in pole-zero analysis.
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