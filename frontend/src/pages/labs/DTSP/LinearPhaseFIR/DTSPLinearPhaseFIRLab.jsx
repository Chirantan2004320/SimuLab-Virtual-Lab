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

import DTSPLinearPhaseFIROverview from "./DTSPLinearPhaseFIROverview";
import DTSPLinearPhaseFIRSimulation from "./DTSPLinearPhaseFIRSimulation";
import DTSPLinearPhaseFIRGraphs from "./DTSPLinearPhaseFIRGraphs";
import DTSPLinearPhaseFIRQuiz from "./DTSPLinearPhaseFIRQuiz";
import DTSPLinearPhaseFIRCoding from "./DTSPLinearPhaseFIRCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

function parseSequence(text) {
  const parts = text.split(",").map((v) => v.trim()).filter(Boolean);
  const nums = parts.map(Number);
  if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) return null;
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

    magnitude.push({
      index: i,
      omega: w,
      value: Math.sqrt(re * re + im * im)
    });

    phase.push({
      index: i,
      omega: w,
      value: Math.atan2(im, re)
    });
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

export default function DTSPLinearPhaseFIRLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [impulseText, setImpulseText] = useState("0.2, 0.3, 0.5, 0.3, 0.2");
  const [impulseResponse, setImpulseResponse] = useState([]);
  const [symmetryType, setSymmetryType] = useState("");
  const [frequencyData, setFrequencyData] = useState({
    magnitude: [],
    phase: []
  });
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

    const h = parseSequence(impulseText);

    if (!h) {
      setError("Please enter a valid impulse response.");
      setImpulseResponse([]);
      setSymmetryType("");
      setFrequencyData({ magnitude: [], phase: [] });
      return;
    }

    setImpulseResponse(h);
    setSymmetryType(detectSymmetryType(h));
    setFrequencyData(computeFrequencyResponse(h));
    setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-linear-phase-fir", time: Date.now() })
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
        experimentSlug: "linear-phase-fir",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Linear Phase FIR quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

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
            <h1 className="er-page-title">Linear Phase FIR Analysis</h1>
            <p className="er-page-subtitle">
              Analyze FIR impulse response symmetry, classify FIR type, and
              study magnitude and phase response.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Enter FIR impulse response coefficients and check whether the
                filter has linear phase.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Linear Phase FIR</strong>
                <span>
                  Symmetric or antisymmetric impulse responses indicate linear
                  phase behavior.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Impulse Response h[n]</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {impulseText}
              </div>
            </div>

            <div>
              <label className="sorting-label">Detected FIR Type</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {symmetryType || "-"}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              Length = {impulseResponse.length || "-"}
            </button>
            <button
              className={`er-chip ${
                symmetryType && symmetryType !== "Not Linear Phase"
                  ? "active"
                  : ""
              }`}
            >
              {symmetryType && symmetryType !== "Not Linear Phase"
                ? "Linear Phase"
                : "Pending"}
            </button>
            <button className="er-chip active">
              Samples = {frequencyData.magnitude.length || "-"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="linear-phase-fir"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DTSPLinearPhaseFIROverview />}

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
                quizSaveStatus={quizSaveStatus}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && <DTSPLinearPhaseFIRCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}