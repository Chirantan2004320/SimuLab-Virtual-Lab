import React, { useState } from "react";
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

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

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

export default function DTSPFFTvsDFTLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

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
      setDftOps(0);
      setFftOps(0);
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

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-fft-vs-dft", time: Date.now() })
    );
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
        experimentSlug: "fft-vs-dft",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("FFT vs DFT quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const efficiencyGain = fftOps > 0 ? (dftOps / fftOps).toFixed(2) : "-";

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
            <h1 className="er-page-title">FFT vs DFT</h1>
            <p className="er-page-subtitle">
              Compare direct DFT and recursive FFT in terms of output spectrum,
              operation count, and computational efficiency.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Analyze how FFT computes the same frequency spectrum as DFT with
                fewer operations.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>FFT Efficiency</strong>
                <span>
                  DFT takes O(N²), while FFT reduces computation to approximately
                  O(N log N).
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
              <label className="sorting-label">Padded Length</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                N = {paddedSequence.length || "-"}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">DFT Ops = {dftOps || "-"}</button>
            <button className="er-chip active">FFT Ops = {fftOps || "-"}</button>
            <button className="er-chip active">Gain = {efficiencyGain}x</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="fft-vs-dft"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
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
                quizSaveStatus={quizSaveStatus}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && <DTSPFFTvsDFTCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}