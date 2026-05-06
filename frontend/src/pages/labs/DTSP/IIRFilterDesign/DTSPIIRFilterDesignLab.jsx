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

import DTSPIIRFilterDesignOverview from "./DTSPIIRFilterDesignOverview";
import DTSPIIRFilterDesignSimulation from "./DTSPIIRFilterDesignSimulation";
import DTSPIIRFilterDesignGraphs from "./DTSPIIRFilterDesignGraphs";
import DTSPIIRFilterDesignQuiz from "./DTSPIIRFilterDesignQuiz";
import DTSPIIRFilterDesignCoding from "./DTSPIIRFilterDesignCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

function formatNumber(value, digits = 4) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

function computeButterworthMagnitude(order, cutoff, type, samples = 120) {
  const response = [];

  for (let i = 0; i <= samples; i++) {
    const f = i / samples;
    const safeF = Math.max(f, 1e-6);
    let mag;

    if (type === "lowpass") {
      mag = 1 / Math.sqrt(1 + Math.pow(safeF / cutoff, 2 * order));
    } else {
      mag = 1 / Math.sqrt(1 + Math.pow(cutoff / safeF, 2 * order));
    }

    response.push({
      index: i,
      frequency: Number(f.toFixed(4)),
      magnitude: mag
    });
  }

  return response;
}

function computeButterworthPoles(order, cutoff) {
  const poles = [];

  for (let k = 0; k < order; k++) {
    const angle = Math.PI / 2 + ((2 * k + 1) * Math.PI) / (2 * order);

    poles.push({
      re: cutoff * Math.cos(angle),
      im: cutoff * Math.sin(angle),
      magnitude: cutoff
    });
  }

  return poles;
}

function generateTestSignal(response, type) {
  const input = [];
  const output = [];

  const lowGain =
    response.find((point) => Math.abs(point.frequency - 0.1) < 0.01)
      ?.magnitude || 1;

  const highGain =
    response.find((point) => Math.abs(point.frequency - 0.4) < 0.01)
      ?.magnitude || 1;

  for (let n = 0; n < 100; n++) {
    const low = Math.sin(2 * Math.PI * 0.1 * n);
    const high = 0.6 * Math.sin(2 * Math.PI * 0.4 * n);

    const x = low + high;
    const y = lowGain * low + highGain * high;

    input.push({ n, value: x });
    output.push({ n, value: y });
  }

  return {
    input,
    output,
    note:
      type === "lowpass"
        ? "Low-pass filter keeps low-frequency content and suppresses high-frequency content."
        : "High-pass filter suppresses low-frequency content and keeps high-frequency content."
  };
}

const quizQuestions = [
  {
    question: "Butterworth filters are known for:",
    options: [
      "Flat passband response",
      "Always linear phase",
      "Only FIR behavior",
      "Random pole locations"
    ],
    correct: 0
  },
  {
    question: "An IIR filter usually has:",
    options: [
      "Only zeros and no poles",
      "Feedback and recursive behavior",
      "No frequency response",
      "Only finite impulse response"
    ],
    correct: 1
  },
  {
    question: "Increasing Butterworth filter order generally makes the transition band:",
    options: ["Wider", "Sharper", "Random", "Disappear completely"],
    correct: 1
  },
  {
    question: "For digital IIR stability, poles should lie:",
    options: [
      "Outside the unit circle",
      "Inside the unit circle",
      "Only on real axis",
      "Only at zero"
    ],
    correct: 1
  },
  {
    question: "A high-pass filter mainly allows:",
    options: [
      "Low frequencies",
      "High frequencies",
      "Only DC component",
      "No signal"
    ],
    correct: 1
  }
];

export default function DTSPIIRFilterDesignLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [filterType, setFilterType] = useState("lowpass");
  const [order, setOrder] = useState(3);
  const [cutoff, setCutoff] = useState(0.3);

  const [frequencyResponse, setFrequencyResponse] = useState([]);
  const [poles, setPoles] = useState([]);
  const [inputSignal, setInputSignal] = useState([]);
  const [outputSignal, setOutputSignal] = useState([]);
  const [observation, setObservation] = useState("");
  const [stabilityText, setStabilityText] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const runDesign = () => {
    const response = computeButterworthMagnitude(order, cutoff, filterType);
    const poleData = computeButterworthPoles(order, cutoff);
    const signalData = generateTestSignal(response, filterType);

    setFrequencyResponse(response);
    setPoles(poleData);
    setInputSignal(signalData.input);
    setOutputSignal(signalData.output);
    setObservation(signalData.note);
    setStabilityText(
      cutoff < 1
        ? "Stable design: poles are represented within the normalized unit-circle range."
        : "Check stability: cutoff should remain below normalized value 1."
    );
    setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-iir-filter-design", time: Date.now() })
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
        experimentSlug: "iir-filter-design",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("IIR Filter Design quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const filterLabel = filterType === "lowpass" ? "Low Pass" : "High Pass";

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
            <h1 className="er-page-title">IIR Filter Design</h1>
            <p className="er-page-subtitle">
              Design Butterworth-style IIR filters and analyze order, cutoff,
              magnitude response, pole locations, and filtering behavior.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Choose filter type, order, and cutoff frequency to observe the
                Butterworth response.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{filterLabel} Butterworth</strong>
                <span>
                  Higher order gives a sharper transition between passband and
                  stopband.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Filter Type</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {filterLabel}
              </div>
            </div>

            <div>
              <label className="sorting-label">Order</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {order}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Cutoff = {cutoff}</button>
            <button className="er-chip active">Poles = {poles.length || "-"}</button>
            <button className="er-chip active">
              Samples = {frequencyResponse.length || "-"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="iir-filter-design"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DTSPIIRFilterDesignOverview />}

            {activeSection === "simulation" && (
              <DTSPIIRFilterDesignSimulation
                filterType={filterType}
                setFilterType={setFilterType}
                order={order}
                setOrder={setOrder}
                cutoff={cutoff}
                setCutoff={setCutoff}
                runDesign={runDesign}
                frequencyResponse={frequencyResponse}
                poles={poles}
                observation={observation}
                stabilityText={stabilityText}
                formatNumber={formatNumber}
              />
            )}

            {activeSection === "graphs" && (
              <DTSPIIRFilterDesignGraphs
                frequencyResponse={frequencyResponse}
                poles={poles}
                inputSignal={inputSignal}
                outputSignal={outputSignal}
                filterType={filterType}
              />
            )}

            {activeSection === "quiz" && (
              <DTSPIIRFilterDesignQuiz
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

            {activeSection === "coding" && <DTSPIIRFilterDesignCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}