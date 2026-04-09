import React, { useState } from "react";
import "../../../Lab.css";

import DTSPDFTPropertiesOverview from "./DTSPDFTPropertiesOverview";
import DTSPDFTPropertiesSimulation from "./DTSPDFTPropertiesSimulation";
import DTSPDFTPropertiesGraphs from "./DTSPDFTPropertiesGraphs";
import DTSPDFTPropertiesQuiz from "./DTSPDFTPropertiesQuiz";
import DTSPDFTPropertiesCoding from "./DTSPDFTPropertiesCoding";

import {
  computeDFT,
  getMagnitude,
  getPhase
} from "../../../../utils/dtsp/fourier";

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

const PROPERTY_OPTIONS = [
  { value: "linearity", label: "Linearity" },
  { value: "timeShift", label: "Time Shift" },
  { value: "frequencyShift", label: "Frequency Shift" }
];

const quizQuestions = [
  {
    question: "Which DFT property states that the DFT of a sum equals the sum of the DFTs?",
    options: ["Periodicity", "Linearity", "Conjugate symmetry", "Duality"],
    correct: 1
  },
  {
    question: "A time shift in the sequence mainly affects:",
    options: ["Magnitude only", "Phase only", "Sequence length", "Sampling frequency"],
    correct: 1
  },
  {
    question: "Multiplying a sequence by a cosine in time domain causes:",
    options: ["Time expansion", "Frequency shift", "Magnitude removal", "Zero padding"],
    correct: 1
  },
  {
    question: "For a circular time shift, the DFT magnitude usually:",
    options: ["Becomes zero", "Stays unchanged", "Always doubles", "Becomes random"],
    correct: 1
  },
  {
    question: "The DFT property used in modulation and communication systems is:",
    options: ["Frequency shift", "Linearity only", "Parseval only", "Periodicity only"],
    correct: 0
  }
];

const problemBank = [
  {
    id: 1,
    title: "Linearity of DFT",
    description:
      "Write code to verify that DFT{x1[n] + x2[n]} = DFT{x1[n]} + DFT{x2[n]}."
  },
  {
    id: 2,
    title: "Circular Time Shift",
    description:
      "Write code to circularly shift a sequence by n0 samples and compare its DFT with the original."
  },
  {
    id: 3,
    title: "Frequency Shift",
    description:
      "Write code to multiply a sequence by cos(2πn/N) and observe how its spectrum changes."
  }
];

export default function DTSPDFTPropertiesLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [inputText, setInputText] = useState("1, 2, 3, 4");
  const [property, setProperty] = useState("linearity");
  const [sequence, setSequence] = useState([]);
  const [originalDFT, setOriginalDFT] = useState([]);
  const [transformedSequence, setTransformedSequence] = useState([]);
  const [transformedDFT, setTransformedDFT] = useState([]);
  const [error, setError] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const handleRunDemo = () => {
    setError("");

    const parts = inputText
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const nums = parts.map(Number);

    if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) {
      setError("Please enter a valid numeric sequence (comma-separated).");
      setSequence([]);
      setOriginalDFT([]);
      setTransformedSequence([]);
      setTransformedDFT([]);
      return;
    }

    const x1 = nums;
    const X1 = computeDFT(x1);

    let y = [];
    let X = X1;

    if (property === "linearity") {
      const N = x1.length;
      const x2 = x1.map((_, n) => x1[(n - 1 + N) % N]);
      y = x1.map((_, n) => x1[n] + x2[n]);
      const X2 = computeDFT(x2);
      const Y = computeDFT(y);

      const Xsum = X1.map((Xk, k) => ({
        re: Xk.re + X2[k].re,
        im: Xk.im + X2[k].im
      }));

      setSequence(x1);
      setOriginalDFT(Xsum);
      setTransformedSequence(y);
      setTransformedDFT(Y);
      setExperimentRun(true);
      return;
    }

    if (property === "timeShift") {
      const N = x1.length;
      const n0 = 1;
      y = x1.map((_, n) => x1[(n - n0 + N) % N]);
    }

    if (property === "frequencyShift") {
      const N = x1.length;
      const w0 = (2 * Math.PI) / N;
      y = x1.map((val, n) => val * Math.cos(w0 * n));
    }

    const Y = computeDFT(y);

    setSequence(x1);
    setOriginalDFT(X);
    setTransformedSequence(y);
    setTransformedDFT(Y);
    setExperimentRun(true);
  };

  const renderPropertyNote = () => {
    if (property === "linearity") {
      return "Linearity: DFT{x1[n] + x2[n]} = X1[k] + X2[k].";
    }
    if (property === "timeShift") {
      return "Time Shift: magnitude remains similar, while phase changes due to shifting.";
    }
    if (property === "frequencyShift") {
      return "Frequency Shift: modulation redistributes spectral energy across bins.";
    }
    return "";
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
        "Code execution for this DFT Properties experiment will be connected next. Structure is ready."
    }));
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – DFT Properties</h1>

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
            <DTSPDFTPropertiesOverview />
          )}

          {activeSection === "simulation" && (
            <DTSPDFTPropertiesSimulation
              inputText={inputText}
              setInputText={setInputText}
              property={property}
              setProperty={setProperty}
              propertyOptions={PROPERTY_OPTIONS}
              sequence={sequence}
              originalDFT={originalDFT}
              transformedSequence={transformedSequence}
              transformedDFT={transformedDFT}
              error={error}
              handleRunDemo={handleRunDemo}
              renderPropertyNote={renderPropertyNote}
              formatNumber={formatNumber}
              getMagnitude={getMagnitude}
              getPhase={getPhase}
            />
          )}

          {activeSection === "graphs" && (
            <DTSPDFTPropertiesGraphs
              sequence={sequence}
              transformedSequence={transformedSequence}
              originalDFT={originalDFT}
              transformedDFT={transformedDFT}
              property={property}
              formatNumber={formatNumber}
              getMagnitude={getMagnitude}
              getPhase={getPhase}
            />
          )}

          {activeSection === "quiz" && (
            <DTSPDFTPropertiesQuiz
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
            <DTSPDFTPropertiesCoding
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