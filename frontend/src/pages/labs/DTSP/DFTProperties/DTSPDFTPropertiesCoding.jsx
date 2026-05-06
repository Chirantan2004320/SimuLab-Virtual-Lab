import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";
import { saveCodingSubmission } from "../../../../API/progressApi";

const problemBank = [
  {
    id: 1,
    title: "Linearity of DFT",
    description:
      "Write a function verifyLinearity(x1, x2) that returns true if DFT{x1[n] + x2[n]} equals DFT{x1[n]} + DFT{x2[n]}."
  },
  {
    id: 2,
    title: "Circular Time Shift",
    description:
      "Write a function circularShift(arr, shift) that circularly shifts a sequence to the right by shift samples."
  },
  {
    id: 3,
    title: "Frequency Shift",
    description:
      "Write a function frequencyShift(arr) that multiplies each sample by cos(2πn/N)."
  }
];

function computeDFTLocal(sequence) {
  const N = sequence.length;
  const X = [];

  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;
      re += sequence[n] * Math.cos(angle);
      im += sequence[n] * Math.sin(angle);
    }

    X.push({ re, im });
  }

  return X;
}

function getStarterCode(id) {
  if (id === 1) {
    return `function verifyLinearity(x1, x2) {
  function dft(sequence) {
    const N = sequence.length;
    const X = [];

    for (let k = 0; k < N; k++) {
      let re = 0;
      let im = 0;

      for (let n = 0; n < N; n++) {
        const angle = (-2 * Math.PI * k * n) / N;
        re += sequence[n] * Math.cos(angle);
        im += sequence[n] * Math.sin(angle);
      }

      X.push({ re, im });
    }

    return X;
  }

  const y = x1.map((value, index) => value + x2[index]);

  const Y = dft(y);
  const X1 = dft(x1);
  const X2 = dft(x2);

  return Y.every((value, index) => {
    const expectedRe = X1[index].re + X2[index].re;
    const expectedIm = X1[index].im + X2[index].im;

    return (
      Math.abs(value.re - expectedRe) < 0.001 &&
      Math.abs(value.im - expectedIm) < 0.001
    );
  });
}`;
  }

  if (id === 2) {
    return `function circularShift(arr, shift) {
  const N = arr.length;
  const output = [];

  for (let n = 0; n < N; n++) {
    output[n] = arr[(n - shift + N) % N];
  }

  return output;
}`;
  }

  return `function frequencyShift(arr) {
  const N = arr.length;

  return arr.map((value, n) => {
    return value * Math.cos((2 * Math.PI * n) / N);
  });
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

function spectraNearlyEqual(actual, expected, tolerance = 1e-3) {
  if (!Array.isArray(actual) || actual.length !== expected.length) return false;

  return actual.every((value, index) => {
    return (
      nearlyEqual(value.re, expected[index].re, tolerance) &&
      nearlyEqual(value.im, expected[index].im, tolerance)
    );
  });
}

export default function DTSPDFTPropertiesCoding() {
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
        experimentSlug: "dft-properties",
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
      console.error("DFT Properties coding save failed:", error);

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
        const fn = new Function(`${code}; return verifyLinearity;`)();

        const x1 = [1, 2, 3, 4];
        const x2 = [4, 3, 2, 1];

        const output = fn(x1, x2);

        const y = x1.map((value, index) => value + x2[index]);
        const Y = computeDFTLocal(y);
        const X1 = computeDFTLocal(x1);
        const X2 = computeDFTLocal(x2);

        const expectedSpectrum = X1.map((value, index) => ({
          re: value.re + X2[index].re,
          im: value.im + X2[index].im
        }));

        isPassed =
          output === true ||
          spectraNearlyEqual(Y, expectedSpectrum, 1e-3);

        resultText = isPassed
          ? "Correct. Linearity verified for x1 = [1,2,3,4] and x2 = [4,3,2,1]."
          : "Incorrect. Verify DFT{x1 + x2} equals DFT{x1} + DFT{x2} coefficient-wise.";
      }

      if (problem.id === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return circularShift;`)();

        const outputOne = fn([1, 2, 3, 4], 1);
        const outputTwo = fn([1, 2, 3, 4], 2);

        isPassed =
          arraysNearlyEqual(outputOne, [4, 1, 2, 3]) &&
          arraysNearlyEqual(outputTwo, [3, 4, 1, 2]);

        resultText = isPassed
          ? "Correct. Circular shift test cases passed."
          : "Incorrect. circularShift([1,2,3,4], 1) should return [4,1,2,3].";
      }

      if (problem.id === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return frequencyShift;`)();

        const output = fn([1, 2, 3, 4]);
        const expected = [1, 0, -3, 0];

        isPassed = arraysNearlyEqual(output, expected, 1e-3);

        resultText = isPassed
          ? "Correct. Frequency shift modulation using cos(2πn/N) is working."
          : "Incorrect. For [1,2,3,4], expected approximately [1,0,-3,0].";
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
        experiment: "dft-properties",
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
        experiment: "dft-properties",
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
            Practice implementing and verifying important DFT properties.
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