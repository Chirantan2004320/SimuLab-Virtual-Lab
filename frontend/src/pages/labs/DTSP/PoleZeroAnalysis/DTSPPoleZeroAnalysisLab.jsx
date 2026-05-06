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

import DTSPPoleZeroAnalysisOverview from "./DTSPPoleZeroAnalysisOverview.jsx";
import DTSPPoleZeroAnalysisSimulation from "./DTSPPoleZeroAnalysisSimulation.jsx";
import DTSPPoleZeroAnalysisGraphs from "./DTSPPoleZeroAnalysisGraphs.jsx";
import DTSPPoleZeroAnalysisQuiz from "./DTSPPoleZeroAnalysisQuiz.jsx";
import DTSPPoleZeroAnalysisCoding from "./DTSPPoleZeroAnalysisCoding.jsx";

import {
  parseCoefficients,
  computeRoots,
  magnitude
} from "../../../../utils/dtsp/polezero";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const quizQuestions = [
  {
    question: "What are the roots of the numerator polynomial called?",
    options: ["Poles", "Zeros", "Samples", "Modes"],
    correct: 1
  },
  {
    question: "What are the roots of the denominator polynomial called?",
    options: ["Zeros", "Poles", "Inputs", "Shifts"],
    correct: 1
  },
  {
    question: "A causal discrete-time system is stable if all poles are:",
    options: [
      "On the unit circle",
      "Inside the unit circle",
      "Outside the unit circle",
      "At the origin only"
    ],
    correct: 1
  },
  {
    question:
      "Which geometric object is used as the main stability reference in the z-plane?",
    options: ["Real axis", "Imaginary axis", "Unit circle", "Parabola"],
    correct: 2
  },
  {
    question: "If a pole lies outside the unit circle, the system is:",
    options: ["Stable", "Marginally stable", "Unstable", "Always FIR"],
    correct: 2
  }
];

export default function DTSPPoleZeroAnalysisLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [numText, setNumText] = useState("1, 0, -0.5");
  const [denText, setDenText] = useState("1, -0.8");

  const [zeros, setZeros] = useState([]);
  const [poles, setPoles] = useState([]);
  const [stabilityText, setStabilityText] = useState("");
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

    const num = parseCoefficients(numText);
    const den = parseCoefficients(denText);

    if (!num || !den) {
      setError("Invalid coefficients. Please enter comma-separated numeric values.");
      setZeros([]);
      setPoles([]);
      setStabilityText("");
      return;
    }

    const z = computeRoots(num);
    const p = computeRoots(den);

    setZeros(z.roots);
    setPoles(p.roots);

    if (!p.roots.length) {
      setStabilityText("No poles available for stability analysis.");
      setExperimentRun(true);
      return;
    }

    const mags = p.roots.map(magnitude);

    if (mags.every((m) => m < 1)) {
      setStabilityText("Stable system: all poles lie inside the unit circle.");
    } else if (mags.some((m) => m > 1)) {
      setStabilityText(
        "Unstable system: at least one pole lies outside the unit circle."
      );
    } else {
      setStabilityText(
        "Marginally stable system: one or more poles lie on the unit circle."
      );
    }

    setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-pole-zero-analysis", time: Date.now() })
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
        experimentSlug: "pole-zero-analysis",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Pole-Zero quiz save failed:", error);
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
            <h1 className="er-page-title">Pole-Zero Analysis</h1>
            <p className="er-page-subtitle">
              Determine zeros, poles, z-plane locations, unit-circle behavior,
              and system stability.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Enter numerator and denominator polynomial coefficients to
                analyze the z-plane.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Pole-Zero Stability</strong>
                <span>
                  For causal DT systems, poles inside the unit circle indicate
                  stability.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Numerator N(z)</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {numText}
              </div>
            </div>

            <div>
              <label className="sorting-label">Denominator D(z)</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {denText}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Zeros = {zeros.length || "-"}</button>
            <button className="er-chip active">Poles = {poles.length || "-"}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
            <button className={`er-chip ${stabilityText ? "active" : ""}`}>
              {stabilityText ? "Stability Checked" : "Pending"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="pole-zero-analysis"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DTSPPoleZeroAnalysisOverview />}

            {activeSection === "simulation" && (
              <DTSPPoleZeroAnalysisSimulation
                numText={numText}
                setNumText={setNumText}
                denText={denText}
                setDenText={setDenText}
                handleAnalyze={handleAnalyze}
                zeros={zeros}
                poles={poles}
                stabilityText={stabilityText}
                error={error}
              />
            )}

            {activeSection === "graphs" && (
              <DTSPPoleZeroAnalysisGraphs zeros={zeros} poles={poles} />
            )}

            {activeSection === "quiz" && (
              <DTSPPoleZeroAnalysisQuiz
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

            {activeSection === "coding" && <DTSPPoleZeroAnalysisCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}