import React, { useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  Table2,
  Brain,
  FileCode2,
  ChevronsLeft,
  TimerReset
} from "lucide-react";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import SimuLabLogo from "../../../../components/SimuLabLogo";
import { saveQuizResult } from "../../../../API/progressApi";

import DSDCounterOverview from "./DSDCounterOverview";
import DSDCounterSimulation from "./DSDCounterSimulation";
import DSDCounterCircuits from "./DSDCounterCircuits";
import DSDCounterTruthTable from "./DSDCounterTruthTable";
import DSDCounterQuiz from "./DSDCounterQuiz";
import DSDCounterCoding from "./DSDCounterCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "truth table", label: "Truth Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Design Practice", icon: FileCode2 }
];

const quizQuestions = [
  {
    q: "A counter is mainly a:",
    options: [
      "Combinational circuit only",
      "Sequential circuit",
      "Pure analog circuit",
      "Power supply device"
    ],
    correct: 1
  },
  {
    q: "A 2-bit binary counter has how many states?",
    options: ["2", "3", "4", "8"],
    correct: 2
  },
  {
    q: "After state 01, a 2-bit binary counter goes to:",
    options: ["00", "10", "11", "01"],
    correct: 1
  },
  {
    q: "Counters usually advance on:",
    options: [
      "Temperature change",
      "Clock pulse",
      "Mouse click only",
      "Voltage drop only"
    ],
    correct: 1
  },
  {
    q: "The counting sequence for a 2-bit up counter is:",
    options: [
      "00 → 10 → 01 → 11",
      "00 → 01 → 10 → 11",
      "11 → 10 → 01 → 00 only",
      "00 → 11 → 10 → 01"
    ],
    correct: 1
  }
];

export default function DSDCounterLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [count, setCount] = useState(0);
  const [clockPulses, setClockPulses] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const analysis = useMemo(() => {
    const q1 = Math.floor(count / 2);
    const q0 = count % 2;
    const binary = `${q1}${q0}`;

    const nextCount = (count + 1) % 4;
    const nextQ1 = Math.floor(nextCount / 2);
    const nextQ0 = nextCount % 2;
    const nextBinary = `${nextQ1}${nextQ0}`;

    return {
      q1,
      q0,
      binary,
      nextCount,
      nextBinary,
      sequence: "00 → 01 → 10 → 11 → 00",
      note: `After the next clock pulse, the counter will move from ${binary} to ${nextBinary}.`
    };
  }, [count]);

  const handleClockPulse = () => {
    setCount((prev) => (prev + 1) % 4);
    setClockPulses((prev) => prev + 1);
    setExperimentRun(true);
  };

  const handleReset = () => {
    setCount(0);
    setClockPulses(0);
    setExperimentRun(true);
  };

  const handleQuizAnswer = (index, value) => {
    const updated = [...quizAnswers];
    updated[index] = value;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let total = 0;

    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) total++;
    });

    setQuizScore(total);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dsd",
        experimentSlug: "counter",
        correctAnswers: total,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Counter quiz save failed:", error);
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
      : activeSection === "circuits"
      ? 60
      : activeSection === "truth table"
      ? 74
      : activeSection === "quiz"
      ? 86
      : 94;

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
              <div className="er-brand-subtitle">DSD Virtual Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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

            <div className="er-last-activity">
              <div className="er-last-activity-label">Last Activity</div>
              <div className="er-last-activity-row">
                <span>
                  {sidebarItems.find((i) => i.key === activeSection)?.label ||
                    "Counter"}
                </span>
                <span className="dot-live">Just now</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">Counter</h1>
            <p className="er-page-subtitle">
              Explore how a 2-bit binary counter advances through 00, 01, 10,
              and 11 using clock pulses.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Counter Configuration</h2>
              <p>
                Apply clock pulses, observe Q1 and Q0, and track the current and
                next binary state.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <TimerReset size={18} />
              </div>
              <div>
                <strong>2-bit Binary Counter</strong>
                <span>4 states, clock-driven sequential logic.</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Current Binary State</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                Q1Q0 = {analysis.binary}
              </div>
            </div>

            <div>
              <label className="sorting-label">Next Binary State</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                Next = {analysis.nextBinary}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Count = {count}</button>
            <button className="er-chip active">Q1 = {analysis.q1}</button>
            <button className="er-chip active">Q0 = {analysis.q0}</button>
            <button className="er-chip active">
              Clock Pulses = {clockPulses}
            </button>
            <button className="er-chip active">
              Sequence: {analysis.sequence}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dsd"
              experimentSlug="counter"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DSDCounterOverview analysis={analysis} />
            )}

            {activeSection === "simulation" && (
              <DSDCounterSimulation
                count={count}
                clockPulses={clockPulses}
                analysis={analysis}
                handleClockPulse={handleClockPulse}
                handleReset={handleReset}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DSDCounterCircuits
                count={count}
                clockPulses={clockPulses}
                analysis={analysis}
              />
            )}

            {activeSection === "truth table" && (
              <DSDCounterTruthTable count={count} analysis={analysis} />
            )}

            {activeSection === "quiz" && (
              <DSDCounterQuiz
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

            {activeSection === "coding" && (
              <DSDCounterCoding
                count={count}
                clockPulses={clockPulses}
                analysis={analysis}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}