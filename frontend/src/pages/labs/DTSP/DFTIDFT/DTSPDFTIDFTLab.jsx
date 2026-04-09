import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DTSPDFTIDFTOverview from "./DTSPDFTIDFTOverview.jsx";
import DTSPDFTIDFTSimulation from "./DTSPDFTIDFTSimulation.jsx";
import DTSPDFTIDFTGraphs from "./DTSPDFTIDFTGraphs.jsx";
import DTSPDFTIDFTQuiz from "./DTSPDFTIDFTQuiz.jsx";
import DTSPDFTIDFTCoding from "./DTSPDFTIDFTCoding.jsx";

import {
  computeDFT,
  computeIDFT,
  getMagnitude,
  getPhase
} from "../../../../utils/dtsp/fourier.js";

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

const quizQuestions = [
  {
    question: "What does DFT convert a signal into?",
    options: ["Only time domain", "Frequency domain", "Binary form", "Analog form"],
    correct: 1
  },
  {
    question: "How many DFT coefficients are obtained for a sequence of length N?",
    options: ["N/2", "N", "2N", "1"],
    correct: 1
  },
  {
    question: "What is represented by |X[k]| ?",
    options: ["Phase spectrum", "Sampling interval", "Magnitude spectrum", "Time shift"],
    correct: 2
  },
  {
    question: "What does IDFT do?",
    options: [
      "Deletes frequency components",
      "Converts time domain to z-domain",
      "Reconstructs time-domain sequence from DFT coefficients",
      "Computes only phase"
    ],
    correct: 2
  },
  {
    question: "DFT coefficients are generally:",
    options: ["Always integers", "Always real numbers", "Complex numbers", "Always zero"],
    correct: 2
  }
];

const problemBank = [
  {
    id: 1,
    title: "Compute 4-point DFT",
    description: "Write a function dft4(arr) that computes the DFT of a 4-point real sequence."
  },
  {
    id: 2,
    title: "Compute Magnitude Spectrum",
    description: "Write a function magnitudeSpectrum(X) that returns the magnitude of each DFT coefficient."
  },
  {
    id: 3,
    title: "Reconstruct using IDFT",
    description: "Write a function simpleIDFT(X) that reconstructs a real-valued sequence from frequency-domain coefficients."
  }
];

function buildDFTSteps(sequence, k) {
  const N = sequence.length;
  const steps = [];
  let sumRe = 0;
  let sumIm = 0;

  for (let n = 0; n < N; n++) {
    const angle = (-2 * Math.PI * k * n) / N;
    const cosTerm = Math.cos(angle);
    const sinTerm = Math.sin(angle);

    const reContribution = sequence[n] * cosTerm;
    const imContribution = sequence[n] * sinTerm;

    sumRe += reContribution;
    sumIm += imContribution;

    steps.push({
      n,
      x: sequence[n],
      angle,
      cosTerm,
      sinTerm,
      reContribution,
      imContribution,
      partialRe: sumRe,
      partialIm: sumIm
    });
  }

  return steps;
}

export default function DTSPDFTIDFTLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [inputText, setInputText] = useState("1, 2, 3, 4");
  const [sequence, setSequence] = useState([]);
  const [dftResult, setDftResult] = useState([]);
  const [reconstructed, setReconstructed] = useState([]);
  const [error, setError] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const [selectedK, setSelectedK] = useState(0);

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const parseSequence = () => {
    const parts = inputText
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const nums = parts.map(Number);

    if (nums.some((n) => Number.isNaN(n))) {
      setError("Please enter a valid numeric sequence (comma-separated).");
      setSequence([]);
      setDftResult([]);
      setReconstructed([]);
      return null;
    }

    return nums;
  };

  const handleComputeDFT = () => {
    setError("");
    setReconstructed([]);

    const nums = parseSequence();
    if (!nums) return;

    const X = computeDFT(nums);
    setSequence(nums);
    setDftResult(X);
    setSelectedK(0);
    setExperimentRun(true);
  };

  const handleComputeIDFT = () => {
    if (!dftResult.length) return;

    const xRec = computeIDFT(dftResult);
    setReconstructed(xRec);
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
      [problemId]: "Code execution for DTSP will be connected next. Structure is ready."
    }));
  };

  const selectedBinSteps = useMemo(() => {
    if (!sequence.length) return [];
    return buildDFTSteps(sequence, selectedK);
  }, [sequence, selectedK]);

  const selectedBinResult = dftResult[selectedK] || null;

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – DFT and IDFT</h1>

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
          {activeSection === "overview" && <DTSPDFTIDFTOverview />}

          {activeSection === "simulation" && (
            <DTSPDFTIDFTSimulation
              inputText={inputText}
              setInputText={setInputText}
              sequence={sequence}
              dftResult={dftResult}
              reconstructed={reconstructed}
              error={error}
              selectedK={selectedK}
              setSelectedK={setSelectedK}
              selectedBinSteps={selectedBinSteps}
              selectedBinResult={selectedBinResult}
              handleComputeDFT={handleComputeDFT}
              handleComputeIDFT={handleComputeIDFT}
              formatNumber={formatNumber}
              getMagnitude={getMagnitude}
              getPhase={getPhase}
            />
          )}

          {activeSection === "graphs" && (
            <DTSPDFTIDFTGraphs
              sequence={sequence}
              dftResult={dftResult}
              reconstructed={reconstructed}
              formatNumber={formatNumber}
              getMagnitude={getMagnitude}
              getPhase={getPhase}
            />
          )}

          {activeSection === "quiz" && (
            <DTSPDFTIDFTQuiz
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
            <DTSPDFTIDFTCoding
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