import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DTSPLinearCircularConvolutionOverview from "./DTSPLinearCircularConvolutionOverview";
import DTSPLinearCircularConvolutionSimulation from "./DTSPLinearCircularConvolutionSimulation";
import DTSPLinearCircularConvolutionGraphs from "./DTSPLinearCircularConvolutionGraphs";
import DTSPLinearCircularConvolutionQuiz from "./DTSPLinearCircularConvolutionQuiz";
import DTSPLinearCircularConvolutionCoding from "./DTSPLinearCircularConvolutionCoding";

function parseSequence(text) {
  const parts = text
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  const nums = parts.map(Number);

  if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) {
    return null;
  }

  return nums;
}

function linearConvolution(x, h) {
  const N = x.length;
  const M = h.length;
  const yLength = N + M - 1;
  const y = new Array(yLength).fill(0);

  for (let n = 0; n < yLength; n++) {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      const hIndex = n - k;
      if (hIndex >= 0 && hIndex < M) {
        sum += x[k] * h[hIndex];
      }
    }
    y[n] = sum;
  }

  return y;
}

function circularConvolution(x, h, L) {
  const N = x.length;
  const M = h.length;
  const len = L || Math.max(N, M);

  const xa = new Array(len).fill(0);
  const ha = new Array(len).fill(0);

  for (let n = 0; n < len; n++) {
    if (n < N) xa[n] = x[n];
    if (n < M) ha[n] = h[n];
  }

  const y = new Array(len).fill(0);

  for (let n = 0; n < len; n++) {
    let sum = 0;
    for (let k = 0; k < len; k++) {
      const index = (n - k + len) % len;
      sum += xa[k] * ha[index];
    }
    y[n] = sum;
  }

  return y;
}

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

function buildLinearSteps(x, h, n) {
  const steps = [];
  let runningSum = 0;

  for (let k = 0; k < x.length; k++) {
    const hIndex = n - k;
    const valid = hIndex >= 0 && hIndex < h.length;
    const xValue = x[k];
    const hValue = valid ? h[hIndex] : 0;
    const product = valid ? xValue * hValue : 0;

    runningSum += product;

    steps.push({
      k,
      xIndex: k,
      hIndex,
      xValue,
      hValue,
      product,
      valid,
      wrapped: false,
      runningSum,
      note: valid
        ? `Valid term: x[${k}] × h[${hIndex}] contributes to y[${n}]`
        : `Ignored: h[${hIndex}] is outside valid range`
    });
  }

  return steps;
}

function buildCircularSteps(x, h, n, L, padded = false) {
  const xa = new Array(L).fill(0);
  const ha = new Array(L).fill(0);

  for (let i = 0; i < L; i++) {
    if (i < x.length) xa[i] = x[i];
    if (i < h.length) ha[i] = h[i];
  }

  const steps = [];
  let runningSum = 0;

  for (let k = 0; k < L; k++) {
    const rawIndex = n - k;
    const wrappedIndex = (rawIndex + L) % L;
    const wrapped = rawIndex < 0 || rawIndex >= L;

    const xValue = xa[k];
    const hValue = ha[wrappedIndex];
    const product = xValue * hValue;

    runningSum += product;

    steps.push({
      k,
      xIndex: k,
      rawIndex,
      hIndex: wrappedIndex,
      xValue,
      hValue,
      product,
      valid: true,
      wrapped,
      runningSum,
      note: wrapped
        ? `Wrap-around: h[${rawIndex}] mapped to h[${wrappedIndex}] using modulo ${L}`
        : `Direct circular term: x[${k}] × h[${wrappedIndex}]`
    });
  }

  const explanation = padded
    ? `Because zero padding is used with L = ${L}, wrap-around does not corrupt the useful output.`
    : `Because L = ${L} is too short, wrap-around changes the result compared to linear convolution.`;

  return { steps, explanation };
}

const quizQuestions = [
  {
    question: "What is the length of linear convolution of sequences of lengths N and M?",
    options: ["N + M", "N + M - 1", "max(N, M)", "N × M"],
    correct: 1
  },
  {
    question: "Circular convolution without zero padding differs from linear convolution because of:",
    options: ["Noise", "Wrap-around effect", "Sampling error", "Only phase shift"],
    correct: 1
  },
  {
    question: "To make circular convolution equal linear convolution, the circular length should be:",
    options: ["max(N, M)", "N", "M", "N + M - 1"],
    correct: 3
  },
  {
    question: "Zero padding helps by:",
    options: [
      "Reducing amplitude",
      "Avoiding overlap due to wrap-around",
      "Removing negative values",
      "Making signals periodic"
    ],
    correct: 1
  },
  {
    question: "Linear convolution is commonly used to find the output of:",
    options: [
      "A linear time-invariant system",
      "A random system",
      "Only periodic systems",
      "Only analog systems"
    ],
    correct: 0
  }
];

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

export default function DTSPLinearCircularConvolutionLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [xText, setXText] = useState("1, 2, 1");
  const [hText, setHText] = useState("1, -1, 1");

  const [x, setX] = useState([]);
  const [h, setH] = useState([]);
  const [yLinear, setYLinear] = useState([]);
  const [yCircularNoPad, setYCircularNoPad] = useState([]);
  const [yCircularPadded, setYCircularPadded] = useState([]);
  const [error, setError] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const [selectedLinearIndex, setSelectedLinearIndex] = useState(0);
  const [selectedCircularIndex, setSelectedCircularIndex] = useState(0);
  const [selectedPaddedIndex, setSelectedPaddedIndex] = useState(0);

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const handleCompute = () => {
    setError("");

    const xSeq = parseSequence(xText);
    const hSeq = parseSequence(hText);

    if (!xSeq || !hSeq) {
      setError("Please enter valid numeric sequences for x[n] and h[n].");
      setX([]);
      setH([]);
      setYLinear([]);
      setYCircularNoPad([]);
      setYCircularPadded([]);
      return;
    }

    const yLin = linearConvolution(xSeq, hSeq);
    const L = Math.max(xSeq.length, hSeq.length);
    const Lfull = xSeq.length + hSeq.length - 1;
    const yCircNoPad = circularConvolution(xSeq, hSeq, L);
    const yCircPad = circularConvolution(xSeq, hSeq, Lfull);

    setX(xSeq);
    setH(hSeq);
    setYLinear(yLin);
    setYCircularNoPad(yCircNoPad);
    setYCircularPadded(yCircPad);

    setSelectedLinearIndex(0);
    setSelectedCircularIndex(0);
    setSelectedPaddedIndex(0);

    setExperimentRun(true);
  };

  const linearSteps = useMemo(() => {
    if (!x.length || !h.length || !yLinear.length) return [];
    return buildLinearSteps(x, h, selectedLinearIndex);
  }, [x, h, yLinear, selectedLinearIndex]);

  const circularNoPadAnalysis = useMemo(() => {
    if (!x.length || !h.length || !yCircularNoPad.length) return { steps: [], explanation: "" };
    return buildCircularSteps(x, h, selectedCircularIndex, Math.max(x.length, h.length), false);
  }, [x, h, yCircularNoPad, selectedCircularIndex]);

  const circularPaddedAnalysis = useMemo(() => {
    if (!x.length || !h.length || !yCircularPadded.length) return { steps: [], explanation: "" };
    return buildCircularSteps(x, h, selectedPaddedIndex, x.length + h.length - 1, true);
  }, [x, h, yCircularPadded, selectedPaddedIndex]);

  const handleQuizAnswer = (index, answer) => {
    const updated = [...quizAnswers];
    updated[index] = answer;
    setQuizAnswers(updated);
  };

  const submitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const generateProblems = () => {
    setCurrentProblems(problemBank);
    const initialCodes = {};
    problemBank.forEach((p) => {
      initialCodes[p.id] = "// Write your code here";
    });
    setCodes(initialCodes);
    setResults({});
  };

  const handleCodeChange = (problemId, code) => {
    setCodes((prev) => ({ ...prev, [problemId]: code }));
  };

  const runCode = (problemId) => {
    setResults((prev) => ({
      ...prev,
      [problemId]:
        "Code execution for this DTSP experiment will be connected next. Structure is ready."
    }));
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Linear Convolution via Circular Convolution</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          <button
            className={`sorting-sidebar-item ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>

          <button
            className={`sorting-sidebar-item ${activeSection === "simulation" ? "active" : ""}`}
            onClick={() => setActiveSection("simulation")}
          >
            Simulation
          </button>

          <button
            className={`sorting-sidebar-item ${activeSection === "graphs" ? "active" : ""}`}
            onClick={() => setActiveSection("graphs")}
          >
            Graphs
          </button>

          <button
            className={`sorting-sidebar-item ${activeSection === "quiz" ? "active" : ""}`}
            onClick={() => setActiveSection("quiz")}
          >
            Quiz
          </button>

          <button
            className={`sorting-sidebar-item ${activeSection === "coding" ? "active" : ""}`}
            onClick={() => setActiveSection("coding")}
          >
            Coding
          </button>
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && (
            <DTSPLinearCircularConvolutionOverview />
          )}

          {activeSection === "simulation" && (
            <DTSPLinearCircularConvolutionSimulation
              xText={xText}
              setXText={setXText}
              hText={hText}
              setHText={setHText}
              x={x}
              h={h}
              yLinear={yLinear}
              yCircularNoPad={yCircularNoPad}
              yCircularPadded={yCircularPadded}
              error={error}
              handleCompute={handleCompute}
              formatNumber={formatNumber}
              selectedLinearIndex={selectedLinearIndex}
              setSelectedLinearIndex={setSelectedLinearIndex}
              selectedCircularIndex={selectedCircularIndex}
              setSelectedCircularIndex={setSelectedCircularIndex}
              selectedPaddedIndex={selectedPaddedIndex}
              setSelectedPaddedIndex={setSelectedPaddedIndex}
              linearSteps={linearSteps}
              circularNoPadAnalysis={circularNoPadAnalysis}
              circularPaddedAnalysis={circularPaddedAnalysis}
            />
          )}

          {activeSection === "graphs" && (
            <DTSPLinearCircularConvolutionGraphs
              x={x}
              h={h}
              yLinear={yLinear}
              yCircularNoPad={yCircularNoPad}
              yCircularPadded={yCircularPadded}
            />
          )}

          {activeSection === "quiz" && (
            <DTSPLinearCircularConvolutionQuiz
              experimentRun={experimentRun}
              quizQuestions={quizQuestions}
              quizAnswers={quizAnswers}
              quizSubmitted={quizSubmitted}
              quizScore={quizScore}
              handleQuizAnswer={handleQuizAnswer}
              submitQuiz={submitQuiz}
              redoQuiz={redoQuiz}
            />
          )}

          {activeSection === "coding" && (
            <DTSPLinearCircularConvolutionCoding
              currentProblems={currentProblems}
              codes={codes}
              results={results}
              generateProblems={generateProblems}
              handleCodeChange={handleCodeChange}
              runCode={runCode}
            />
          )}
        </main>
      </div>
    </div>
  );
}