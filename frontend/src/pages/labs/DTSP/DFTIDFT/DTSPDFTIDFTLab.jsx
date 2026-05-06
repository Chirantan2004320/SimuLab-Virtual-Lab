import React, { useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  LineChart,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import SimuLabLogo from "../../../../components/SimuLabLogo";
import { saveQuizResult } from "../../../../API/progressApi";

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

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [inputText, setInputText] = useState("1, 2, 3, 4");
  const [sequence, setSequence] = useState([]);
  const [dftResult, setDftResult] = useState([]);
  const [reconstructed, setReconstructed] = useState([]);
  const [error, setError] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);
  const [selectedK, setSelectedK] = useState(0);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const parseSequence = () => {
    const parts = inputText
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const nums = parts.map(Number);

    if (nums.length === 0) {
      setError("Please enter at least one numeric value.");
      setSequence([]);
      setDftResult([]);
      setReconstructed([]);
      return null;
    }

    if (nums.some((n) => Number.isNaN(n))) {
      setError("Please enter a valid numeric sequence using comma-separated values.");
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

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-dft-idft", time: Date.now() })
    );
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

  const submitQuiz = async () => {
    let score = 0;

    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dtsp",
        experimentSlug: "dft-idft",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("DFT IDFT quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const selectedBinSteps = useMemo(() => {
    if (!sequence.length) return [];
    return buildDFTSteps(sequence, selectedK);
  }, [sequence, selectedK]);

  const selectedBinResult = dftResult[selectedK] || null;

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 45
      : activeSection === "graphs"
      ? 65
      : activeSection === "quiz"
      ? 82
      : 95;

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
          <div className="er-brand-logo simulab-sidebar-logo">
            <SimuLabLogo size={58} showText={false} variant="default" />
          </div>

          {!sidebarCollapsed && (
            <div>
              <div className="er-brand-title">SimuLab</div>
              <div className="er-brand-subtitle">DTSP Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        <div className="er-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                className={`er-nav-item ${
                  activeSection === item.key ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.key)}
                title={item.label}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div className="er-progress-card">
            <div className="er-progress-title">Your Progress</div>
            <div className="er-progress-ring">
              <div
                className="er-progress-circle"
                style={{
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`
                }}
              >
                <div className="er-progress-inner">
                  <div className="er-progress-value">{progressPercent}%</div>
                  <div className="er-progress-text">Complete</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">DFT & IDFT</h1>
            <p className="er-page-subtitle">
              Convert discrete-time signals into frequency-domain coefficients,
              inspect magnitude and phase, and reconstruct using IDFT.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Enter a sequence, compute DFT coefficients, inspect bins, and
                reconstruct using IDFT.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Fourier Transform</strong>
                <span>
                  Study how time-domain samples map to frequency-domain
                  magnitude and phase.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Input Sequence</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {inputText}
              </div>
            </div>

            <div>
              <label className="sorting-label">Sequence Length</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                N = {sequence.length || inputText.split(",").filter(Boolean).length}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              DFT Coefficients = {dftResult.length || "-"}
            </button>
            <button className="er-chip active">
              Selected Bin = k {dftResult.length ? selectedK : "-"}
            </button>
            <button className={`er-chip ${reconstructed.length ? "active" : ""}`}>
              {reconstructed.length ? "IDFT Complete" : "IDFT Pending"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="dft-idft"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
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
                quizSaveStatus={quizSaveStatus}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && <DTSPDFTIDFTCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}