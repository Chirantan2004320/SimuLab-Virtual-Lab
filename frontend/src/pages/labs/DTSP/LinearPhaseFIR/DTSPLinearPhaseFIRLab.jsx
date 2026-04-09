import React, { useState } from "react";
import "../../../Lab.css";

import DTSPLinearPhaseFIROverview from "./DTSPLinearPhaseFIROverview";
import DTSPLinearPhaseFIRSimulation from "./DTSPLinearPhaseFIRSimulation";
import DTSPLinearPhaseFIRGraphs from "./DTSPLinearPhaseFIRGraphs";
import DTSPLinearPhaseFIRQuiz from "./DTSPLinearPhaseFIRQuiz";
import DTSPLinearPhaseFIRCoding from "./DTSPLinearPhaseFIRCoding";

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

function formatNumber(value, digits = 4) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

function detectSymmetryType(h) {
  const N = h.length;
  let symmetric = true;
  let antisymmetric = true;

  for (let n = 0; n < N; n++) {
    const mirror = N - 1 - n;
    if (Math.abs(h[n] - h[mirror]) > 1e-9) symmetric = false;
    if (Math.abs(h[n] + h[mirror]) > 1e-9) antisymmetric = false;
  }

  if (symmetric && N % 2 === 1) return "Type I (symmetric, odd length)";
  if (symmetric && N % 2 === 0) return "Type II (symmetric, even length)";
  if (antisymmetric && N % 2 === 1) return "Type III (antisymmetric, odd length)";
  if (antisymmetric && N % 2 === 0) return "Type IV (antisymmetric, even length)";
  return "Not Linear Phase";
}

function computeFrequencyResponse(h, samples = 128) {
  const magnitude = [];
  const phase = [];

  for (let i = 0; i < samples; i++) {
    const w = (Math.PI * i) / (samples - 1);
    let re = 0;
    let im = 0;

    for (let n = 0; n < h.length; n++) {
      re += h[n] * Math.cos(w * n);
      im -= h[n] * Math.sin(w * n);
    }

    const mag = Math.sqrt(re * re + im * im);
    const ph = Math.atan2(im, re);

    magnitude.push({ index: i, omega: w, value: mag });
    phase.push({ index: i, omega: w, value: ph });
  }

  return { magnitude, phase };
}

const quizQuestions = [
  {
    question: "A linear phase FIR filter requires the impulse response to be:",
    options: ["Random", "Symmetric or antisymmetric", "All positive", "Periodic"],
    correct: 1
  },
  {
    question: "For a symmetric FIR filter with odd length, the type is:",
    options: ["Type I", "Type II", "Type III", "Type IV"],
    correct: 0
  },
  {
    question: "Linear phase means the phase response is approximately:",
    options: ["Constant zero", "Linear with frequency", "Exponential", "Always positive"],
    correct: 1
  },
  {
    question: "An FIR filter is guaranteed stable because:",
    options: [
      "Its poles are random",
      "It has finite impulse response",
      "Its phase is zero",
      "Its gain is less than 1"
    ],
    correct: 1
  },
  {
    question: "A symmetric impulse response mainly helps achieve:",
    options: ["Instability", "Linear phase", "Infinite response", "Oscillation"],
    correct: 1
  }
];

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
      "Write code to compute the magnitude response of an FIR filter at sampled frequencies."
  }
];

export default function DTSPLinearPhaseFIRLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [impulseText, setImpulseText] = useState("0.2, 0.3, 0.5, 0.3, 0.2");
  const [impulseResponse, setImpulseResponse] = useState([]);
  const [symmetryType, setSymmetryType] = useState("");
  const [frequencyData, setFrequencyData] = useState({ magnitude: [], phase: [] });
  const [error, setError] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const handleAnalyze = () => {
    setError("");

    const h = parseSequence(impulseText);
    if (!h) {
      setError("Please enter a valid impulse response.");
      setImpulseResponse([]);
      setSymmetryType("");
      setFrequencyData({ magnitude: [], phase: [] });
      return;
    }

    const type = detectSymmetryType(h);
    const response = computeFrequencyResponse(h);

    setImpulseResponse(h);
    setSymmetryType(type);
    setFrequencyData(response);
    setExperimentRun(true);
  };

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
        "Code execution for this Linear Phase FIR experiment will be connected next. Structure is ready."
    }));
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Linear Phase FIR Analysis</h1>

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
            <DTSPLinearPhaseFIROverview />
          )}

          {activeSection === "simulation" && (
            <DTSPLinearPhaseFIRSimulation
              impulseText={impulseText}
              setImpulseText={setImpulseText}
              impulseResponse={impulseResponse}
              symmetryType={symmetryType}
              frequencyData={frequencyData}
              error={error}
              handleAnalyze={handleAnalyze}
              formatNumber={formatNumber}
            />
          )}

          {activeSection === "graphs" && (
            <DTSPLinearPhaseFIRGraphs
              impulseResponse={impulseResponse}
              frequencyData={frequencyData}
              symmetryType={symmetryType}
              formatNumber={formatNumber}
            />
          )}

          {activeSection === "quiz" && (
            <DTSPLinearPhaseFIRQuiz
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
            <DTSPLinearPhaseFIRCoding
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