import React, { useState } from "react";
import "../../../Lab.css";

import DTSPFFTvsDFTOverview from "./DTSPFFTvsDFTOverview";
import DTSPFFTvsDFTSimulation from "./DTSPFFTvsDFTSimulation";
import DTSPFFTvsDFTGraphs from "./DTSPFFTvsDFTGraphs";
import DTSPFFTvsDFTQuiz from "./DTSPFFTvsDFTQuiz";
import DTSPFFTvsDFTCoding from "./DTSPFFTvsDFTCoding";

import {
  padToPowerOfTwo,
  computeDFTWithCount,
  fftRecursive,
  getMagnitude
} from "../../../../utils/dtsp/fft";

function parseSequence(text) {
  const parts = text
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  const nums = parts.map(Number);
  if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) return null;
  return nums;
}

function formatNumber(value, digits = 4) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

const quizQuestions = [
  {
    question: "What is the main advantage of FFT over DFT?",
    options: [
      "It changes the signal",
      "It uses fewer computations",
      "It removes noise",
      "It avoids complex numbers"
    ],
    correct: 1
  },
  {
    question: "The time complexity of direct DFT is:",
    options: ["O(N)", "O(log N)", "O(N²)", "O(N log N²)"],
    correct: 2
  },
  {
    question: "The time complexity of FFT is approximately:",
    options: ["O(N²)", "O(N log N)", "O(log N)", "O(1)"],
    correct: 1
  },
  {
    question: "FFT is especially efficient when sequence length is:",
    options: ["Prime", "Odd only", "Power of 2", "Always 3"],
    correct: 2
  },
  {
    question: "FFT computes:",
    options: [
      "A different spectrum than DFT",
      "The same spectrum as DFT, more efficiently",
      "Only magnitude",
      "Only phase"
    ],
    correct: 1
  }
];

const problemBank = [
  {
    id: 1,
    title: "Count DFT Operations",
    description:
      "Write a function to estimate the number of multiply-add operations in direct DFT for size N."
  },
  {
    id: 2,
    title: "Check Power of Two",
    description:
      "Write a function isPowerOfTwo(n) that returns true if n is a power of two."
  },
  {
    id: 3,
    title: "Pad Sequence for FFT",
    description:
      "Write a function padToPowerOfTwo(arr) that extends a sequence using zeros to the next power of two."
  }
];

export default function DTSPFFTvsDFTLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [inputText, setInputText] = useState("1, 2, 3, 4");
  const [originalSequence, setOriginalSequence] = useState([]);
  const [paddedSequence, setPaddedSequence] = useState([]);
  const [dftResult, setDftResult] = useState([]);
  const [fftResult, setFftResult] = useState([]);
  const [dftOps, setDftOps] = useState(0);
  const [fftOps, setFftOps] = useState(0);
  const [fftStages, setFftStages] = useState([]);
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

    const parsed = parseSequence(inputText);
    if (!parsed) {
      setError("Please enter a valid numeric sequence.");
      setOriginalSequence([]);
      setPaddedSequence([]);
      setDftResult([]);
      setFftResult([]);
      setFftStages([]);
      return;
    }

    const padded = padToPowerOfTwo(parsed);

    const dft = computeDFTWithCount(padded);
    const fft = fftRecursive(padded);

    setOriginalSequence(parsed);
    setPaddedSequence(padded);
    setDftResult(dft.result);
    setFftResult(fft.result);
    setDftOps(dft.operations);
    setFftOps(fft.operations);
    setFftStages(fft.stages);
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
      [problemId]: "Code execution for FFT vs DFT will be connected next. Structure is ready."
    }));
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – FFT vs DFT</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "graphs", "quiz", "coding"].map((sec) => (
            <button
              key={sec}
              className={`sorting-sidebar-item ${activeSection === sec ? "active" : ""}`}
              onClick={() => setActiveSection(sec)}
            >
              {sec.charAt(0).toUpperCase() + sec.slice(1)}
            </button>
          ))}
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && <DTSPFFTvsDFTOverview />}

          {activeSection === "simulation" && (
            <DTSPFFTvsDFTSimulation
              inputText={inputText}
              setInputText={setInputText}
              originalSequence={originalSequence}
              paddedSequence={paddedSequence}
              dftResult={dftResult}
              fftResult={fftResult}
              dftOps={dftOps}
              fftOps={fftOps}
              fftStages={fftStages}
              error={error}
              handleAnalyze={handleAnalyze}
              formatNumber={formatNumber}
              getMagnitude={getMagnitude}
            />
          )}

          {activeSection === "graphs" && (
            <DTSPFFTvsDFTGraphs
              paddedSequence={paddedSequence}
              dftResult={dftResult}
              fftResult={fftResult}
              dftOps={dftOps}
              fftOps={fftOps}
              formatNumber={formatNumber}
              getMagnitude={getMagnitude}
            />
          )}

          {activeSection === "quiz" && (
            <DTSPFFTvsDFTQuiz
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
            <DTSPFFTvsDFTCoding
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