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

import DTSPFilterDesignOverview from "./DTSPFilterDesignOverview";
import DTSPFilterDesignSimulation from "./DTSPFilterDesignSimulation";
import DTSPFilterDesignGraphs from "./DTSPFilterDesignGraphs";
import DTSPFilterDesignQuiz from "./DTSPFilterDesignQuiz";
import DTSPFilterDesignCoding from "./DTSPFilterDesignCoding";

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

const quizQuestions = [
  {
    q: "What does a low-pass filter do?",
    options: [
      "Blocks low frequencies",
      "Allows low frequencies",
      "Only removes noise",
      "Amplifies all frequencies"
    ],
    correct: 1
  },
  {
    q: "What is the purpose of a window function in FIR design?",
    options: [
      "To reduce ripple and improve practical filter response",
      "To increase sampling frequency",
      "To convert FIR to IIR",
      "To remove all high frequencies"
    ],
    correct: 0
  },
  {
    q: "Which window usually gives smoother response than a rectangular window?",
    options: ["Hamming", "Impulse", "Unit", "None"],
    correct: 0
  },
  {
    q: "A high-pass filter mainly allows:",
    options: [
      "Low frequencies",
      "High frequencies",
      "Only DC component",
      "Only negative frequencies"
    ],
    correct: 1
  },
  {
    q: "FIR filters are always stable because:",
    options: [
      "They have finite impulse response",
      "They use cosine only",
      "They always have gain less than 1",
      "They have no frequency response"
    ],
    correct: 0
  }
];

export default function DTSPFilterDesignLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [filterType, setFilterType] = useState("lowpass");
  const [cutoff, setCutoff] = useState(0.3);
  const [length, setLength] = useState(11);
  const [windowType, setWindowType] = useState("hamming");

  const [impulse, setImpulse] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [inputSignal, setInputSignal] = useState([]);
  const [outputSignal, setOutputSignal] = useState([]);
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const generateFilter = () => {
    const N = length % 2 === 0 ? length + 1 : length;
    const M = (N - 1) / 2;
    const h = [];

    for (let n = 0; n < N; n++) {
      const k = n - M;
      let val;

      if (k === 0) {
        val = 2 * cutoff;
      } else {
        val = Math.sin(2 * Math.PI * cutoff * k) / (Math.PI * k);
      }

      if (filterType === "highpass") {
        val = (n === M ? 1 : 0) - val;
      }

      let w = 1;

      if (windowType === "hamming") {
        w = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
      }

      if (windowType === "hanning") {
        w = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1));
      }

      h.push(val * w);
    }

    setImpulse(h);

    const freq = [];

    for (let i = 0; i <= 100; i++) {
      const w = (Math.PI * i) / 100;
      let re = 0;
      let im = 0;

      for (let n = 0; n < N; n++) {
        re += h[n] * Math.cos(w * n);
        im -= h[n] * Math.sin(w * n);
      }

      freq.push({
        w: (i / 100).toFixed(2),
        mag: Math.sqrt(re * re + im * im)
      });
    }

    setFrequency(freq);

    const signal = [];
    const output = [];

    for (let n = 0; n < 100; n++) {
      const x =
        Math.sin(2 * Math.PI * 0.1 * n) +
        0.6 * Math.sin(2 * Math.PI * 0.4 * n);

      signal.push({ n, value: x });

      let y = 0;

      for (let k = 0; k < N; k++) {
        if (n - k >= 0) {
          const sample =
            Math.sin(2 * Math.PI * 0.1 * (n - k)) +
            0.6 * Math.sin(2 * Math.PI * 0.4 * (n - k));

          y += h[k] * sample;
        }
      }

      output.push({ n, value: y });
    }

    setInputSignal(signal);
    setOutputSignal(output);
    setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "dtsp-fir-filter-design", time: Date.now() })
    );
  };

  const handleQuizAnswer = (index, value) => {
    const updated = [...quizAnswers];
    updated[index] = value;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let totalScore = 0;

    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) totalScore++;
    });

    setQuizScore(totalScore);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dtsp",
        experimentSlug: "fir-filter-design",
        correctAnswers: totalScore,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("FIR Filter Design quiz save failed:", error);
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
  const windowLabel =
    windowType === "rect"
      ? "Rectangular"
      : windowType === "hamming"
      ? "Hamming"
      : "Hanning";

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
            <h1 className="er-page-title">FIR Filter Design</h1>
            <p className="er-page-subtitle">
              Design low-pass and high-pass FIR filters using the window method
              and observe filtering effect.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Choose filter type, cutoff frequency, length, and window
                function.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{filterLabel} FIR</strong>
                <span>
                  Window method designs practical FIR filters from ideal impulse
                  responses.
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
              <label className="sorting-label">Window Type</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {windowLabel}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Cutoff = {cutoff}</button>
            <button className="er-chip active">Length = {length}</button>
            <button className="er-chip active">
              Coefficients = {impulse.length || "-"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="fir-filter-design"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DTSPFilterDesignOverview />}

            {activeSection === "simulation" && (
              <DTSPFilterDesignSimulation
                filterType={filterType}
                setFilterType={setFilterType}
                cutoff={cutoff}
                setCutoff={setCutoff}
                length={length}
                setLength={setLength}
                windowType={windowType}
                setWindowType={setWindowType}
                generateFilter={generateFilter}
                impulse={impulse}
                formatNumber={formatNumber}
              />
            )}

            {activeSection === "graphs" && (
              <DTSPFilterDesignGraphs
                impulse={impulse}
                frequency={frequency}
                inputSignal={inputSignal}
                outputSignal={outputSignal}
              />
            )}

            {activeSection === "quiz" && (
              <DTSPFilterDesignQuiz
                experimentRun={experimentRun}
                questions={quizQuestions}
                answers={quizAnswers}
                submitted={quizSubmitted}
                score={quizScore}
                quizSaveStatus={quizSaveStatus}
                handleAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && <DTSPFilterDesignCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}