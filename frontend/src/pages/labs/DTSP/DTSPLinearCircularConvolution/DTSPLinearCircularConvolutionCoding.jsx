import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const problemBank = [
  {
    id: 1,
    title: "Linear Convolution",
    description:
      "Write a function linearConv(x, h) that returns the linear convolution of two sequences."
  },
  {
    id: 2,
    title: "Circular Convolution",
    description:
      "Write a function circularConv(x, h, L) that computes circular convolution of length L."
  },
  {
    id: 3,
    title: "Zero Padding",
    description:
      "Write a function zeroPad(arr, L) that pads a sequence with zeros up to length L."
  }
];

function getStarterCode(id) {
  if (id === 1) {
    return `function linearConv(x, h) {
  const y = new Array(x.length + h.length - 1).fill(0);

  for (let n = 0; n < y.length; n++) {
    for (let k = 0; k < x.length; k++) {
      const hIndex = n - k;

      if (hIndex >= 0 && hIndex < h.length) {
        y[n] += x[k] * h[hIndex];
      }
    }
  }

  return y;
}`;
  }

  if (id === 2) {
    return `function circularConv(x, h, L) {
  const xa = new Array(L).fill(0);
  const ha = new Array(L).fill(0);

  for (let i = 0; i < L; i++) {
    if (i < x.length) xa[i] = x[i];
    if (i < h.length) ha[i] = h[i];
  }

  const y = new Array(L).fill(0);

  for (let n = 0; n < L; n++) {
    for (let k = 0; k < L; k++) {
      const index = (n - k + L) % L;
      y[n] += xa[k] * ha[index];
    }
  }

  return y;
}`;
  }

  return `function zeroPad(arr, L) {
  const output = [...arr];

  while (output.length < L) {
    output.push(0);
  }

  return output.slice(0, L);
}`;
}

function arraysEqual(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export default function DTSPLinearCircularConvolutionCoding() {
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
        experimentSlug: "linear-circular-convolution",
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
      console.error("Convolution coding save failed:", error);

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
        const fn = new Function(`${code}; return linearConv;`)();

        const outputOne = fn([1, 2, 1], [1, -1, 1]);
        const outputTwo = fn([1, 2], [3, 4]);

        isPassed =
          arraysEqual(outputOne, [1, 1, 0, 1, 1]) &&
          arraysEqual(outputTwo, [3, 10, 8]);

        resultText = isPassed
          ? "Correct. Linear convolution test cases passed."
          : "Incorrect. linearConv([1,2,1], [1,-1,1]) should return [1,1,0,1,1].";
      }

      if (problem.id === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return circularConv;`)();

        const outputOne = fn([1, 2, 1], [1, -1, 1], 3);
        const outputTwo = fn([1, 2], [3, 4], 2);

        isPassed =
          arraysEqual(outputOne, [2, 2, 1]) &&
          arraysEqual(outputTwo, [11, 10]);

        resultText = isPassed
          ? "Correct. Circular convolution test cases passed."
          : "Incorrect. circularConv([1,2,1], [1,-1,1], 3) should return [2,2,1].";
      }

      if (problem.id === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return zeroPad;`)();

        const outputOne = fn([1, 2, 3], 5);
        const outputTwo = fn([1, 2], 4);

        isPassed =
          arraysEqual(outputOne, [1, 2, 3, 0, 0]) &&
          arraysEqual(outputTwo, [1, 2, 0, 0]);

        resultText = isPassed
          ? "Correct. Zero padding test cases passed."
          : "Incorrect. zeroPad([1,2,3], 5) should return [1,2,3,0,0].";
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
        experiment: "linear-circular-convolution",
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
        experiment: "linear-circular-convolution",
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
            Practice implementing linear convolution, circular convolution, and
            zero padding.
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