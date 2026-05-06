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

import DTSPWindowingTechniquesOverview from "./DTSPWindowingTechniquesOverview";
import DTSPWindowingTechniquesSimulation from "./DTSPWindowingTechniquesSimulation";
import DTSPWindowingTechniquesGraphs from "./DTSPWindowingTechniquesGraphs";
import DTSPWindowingTechniquesQuiz from "./DTSPWindowingTechniquesQuiz";
import DTSPWindowingTechniquesCoding from "./DTSPWindowingTechniquesCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const WINDOW_OPTIONS = [
  { value: "rectangular", label: "Rectangular" },
  { value: "hanning", label: "Hanning" },
  { value: "hamming", label: "Hamming" },
  { value: "blackman", label: "Blackman" },
  { value: "bartlett", label: "Bartlett / Triangular" }
];

const quizQuestions = [
  {
    question: "Why are windows used in FIR filter design?",
    options: [
      "To reduce truncation effects and spectral leakage",
      "To make the signal random",
      "To remove all frequencies",
      "To convert FIR into IIR"
    ],
    correct: 0
  },
  {
    question: "Which window has the simplest shape but higher side lobes?",
    options: ["Blackman", "Hamming", "Rectangular", "Hanning"],
    correct: 2
  },
  {
    question: "Which window generally provides better side-lobe suppression?",
    options: ["Rectangular", "Blackman", "No window", "Unit impulse"],
    correct: 1
  },
  {
    question: "The Hamming window is commonly used because it:",
    options: [
      "Balances main-lobe width and side-lobe reduction",
      "Always removes phase",
      "Creates unstable filters",
      "Works only for IIR filters"
    ],
    correct: 0
  },
  {
    question: "Increasing window length generally makes the main lobe:",
    options: ["Wider", "Narrower", "Random", "Always zero"],
    correct: 1
  }
];

function formatNumber(value, digits = 4) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

function getWindowValue(type, n, N) {
  if (N <= 1) return 1;

  if (type === "rectangular") return 1;

  if (type === "hanning") {
    return 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1));
  }

  if (type === "hamming") {
    return 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
  }

  if (type === "blackman") {
    return (
      0.42 -
      0.5 * Math.cos((2 * Math.PI * n) / (N - 1)) +
      0.08 * Math.cos((4 * Math.PI * n) / (N - 1))
    );
  }

  if (type === "bartlett") {
    return 1 - Math.abs((n - (N - 1) / 2) / ((N - 1) / 2));
  }

  return 1;
}

function generateWindow(type, length) {
  return Array.from({ length }, (_, n) => ({
    n,
    value: getWindowValue(type, n, length)
  }));
}

function computeSpectrum(windowData, samples = 128) {
  const values = windowData.map((item) => item.value);
  const spectrum = [];

  for (let i = 0; i < samples; i++) {
    const w = (Math.PI * i) / (samples - 1);
    let re = 0;
    let im = 0;

    values.forEach((value, n) => {
      re += value * Math.cos(w * n);
      im -= value * Math.sin(w * n);
    });

    spectrum.push({
      index: i,
      omega: Number((w / Math.PI).toFixed(4)),
      magnitude: Math.sqrt(re * re + im * im)
    });
  }

  const maxMag = Math.max(...spectrum.map((p) => p.magnitude), 1);

  return spectrum.map((point) => ({
    ...point,
    normalizedMagnitude: point.magnitude / maxMag
  }));
}

function getWindowNote(type) {
  if (type === "rectangular") {
    return "Rectangular window has the narrowest main lobe but high side lobes.";
  }

  if (type === "hanning") {
    return "Hanning window gives smoother tapering and reduces side lobes compared to rectangular.";
  }

  if (type === "hamming") {
    return "Hamming window gives good side-lobe reduction and is widely used in FIR design.";
  }

  if (type === "blackman") {
    return "Blackman window gives strong side-lobe suppression but has a wider main lobe.";
  }

  if (type === "bartlett") {
    return "Bartlett window uses triangular tapering and provides moderate leakage reduction.";
  }

  return "";
}

export default function DTSPWindowingTechniquesLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [windowType, setWindowType] = useState("hamming");
  const [length, setLength] = useState(21);

  const [windowData, setWindowData] = useState([]);
  const [spectrumData, setSpectrumData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [observation, setObservation] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const selectedWindowLabel = useMemo(
    () =>
      WINDOW_OPTIONS.find((item) => item.value === windowType)?.label ||
      "Window",
    [windowType]
  );

  const generateWindowExperiment = () => {
    const win = generateWindow(windowType, length);
    const spectrum = computeSpectrum(win);

    const comparison = WINDOW_OPTIONS.map((item) => {
      const data = generateWindow(item.value, length);
      const energy = data.reduce((sum, point) => sum + point.value * point.value, 0);
      const peak = Math.max(...data.map((point) => point.value));

      return {
        name: item.label,
        energy: Number(energy.toFixed(4)),
        peak: Number(peak.toFixed(4))
      };
    });

    setWindowData(win);
    setSpectrumData(spectrum);
    setComparisonData(comparison);
    setObservation(getWindowNote(windowType));
    setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-windowing-techniques", time: Date.now() })
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
        experimentSlug: "windowing-techniques",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Windowing quiz save failed:", error);
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
            <h1 className="er-page-title">Windowing Techniques</h1>
            <p className="er-page-subtitle">
              Compare Rectangular, Hanning, Hamming, Blackman, and Bartlett
              windows used in FIR filter design and spectral analysis.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Choose a window and length to observe time-domain shape and
                frequency-domain behavior.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{selectedWindowLabel}</strong>
                <span>{getWindowNote(windowType)}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Selected Window</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {selectedWindowLabel}
              </div>
            </div>

            <div>
              <label className="sorting-label">Window Length</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                N = {length}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Window = {selectedWindowLabel}</button>
            <button className="er-chip active">Length = {length}</button>
            <button className="er-chip active">
              Spectrum Samples = {spectrumData.length || "-"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="windowing-techniques"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DTSPWindowingTechniquesOverview />
            )}

            {activeSection === "simulation" && (
              <DTSPWindowingTechniquesSimulation
                windowType={windowType}
                setWindowType={setWindowType}
                windowOptions={WINDOW_OPTIONS}
                length={length}
                setLength={setLength}
                generateWindowExperiment={generateWindowExperiment}
                windowData={windowData}
                spectrumData={spectrumData}
                observation={observation}
                selectedWindowLabel={selectedWindowLabel}
                formatNumber={formatNumber}
              />
            )}

            {activeSection === "graphs" && (
              <DTSPWindowingTechniquesGraphs
                windowData={windowData}
                spectrumData={spectrumData}
                comparisonData={comparisonData}
                selectedWindowLabel={selectedWindowLabel}
              />
            )}

            {activeSection === "quiz" && (
              <DTSPWindowingTechniquesQuiz
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

            {activeSection === "coding" && <DTSPWindowingTechniquesCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}