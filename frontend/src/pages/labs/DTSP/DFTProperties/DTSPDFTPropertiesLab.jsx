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

const PROPERTY_OPTIONS = [
  { value: "linearity", label: "Linearity" },
  { value: "timeShift", label: "Time Shift" },
  { value: "frequencyShift", label: "Frequency Shift" }
];

const quizQuestions = [
  {
    question:
      "Which DFT property states that the DFT of a sum equals the sum of the DFTs?",
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

export default function DTSPDFTPropertiesLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [inputText, setInputText] = useState("1, 2, 3, 4");
  const [property, setProperty] = useState("linearity");
  const [sequence, setSequence] = useState([]);
  const [originalDFT, setOriginalDFT] = useState([]);
  const [transformedSequence, setTransformedSequence] = useState([]);
  const [transformedDFT, setTransformedDFT] = useState([]);
  const [error, setError] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const handleRunDemo = () => {
    setError("");

    const parts = inputText
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const nums = parts.map(Number);

    if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) {
      setError("Please enter a valid numeric sequence using comma-separated values.");
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

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: "dtsp-dft-properties", time: Date.now() })
      );

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

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-dft-properties", time: Date.now() })
    );
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
        experimentSlug: "dft-properties",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("DFT Properties quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const selectedPropertyLabel =
    PROPERTY_OPTIONS.find((item) => item.value === property)?.label ||
    "DFT Property";

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
            <h1 className="er-page-title">DFT Properties</h1>
            <p className="er-page-subtitle">
              Verify linearity, time shift, and frequency shift properties using
              numerical sequences and spectrum comparison.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Select a DFT property and compare original versus transformed
                signals.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{selectedPropertyLabel}</strong>
                <span>{renderPropertyNote()}</span>
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
              <label className="sorting-label">Selected Property</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {selectedPropertyLabel}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              Original N = {sequence.length || "-"}
            </button>
            <button className="er-chip active">
              Property = {selectedPropertyLabel}
            </button>
            <button className="er-chip active">
              DFT Bins = {originalDFT.length || "-"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="dft-properties"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DTSPDFTPropertiesOverview />}

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
                quizSaveStatus={quizSaveStatus}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && <DTSPDFTPropertiesCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}