import React, { useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  Table2,
  Brain,
  FileCode2,
  ChevronsLeft
} from "lucide-react";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import SimuLabLogo from "../../../../components/SimuLabLogo";
import { saveQuizResult } from "../../../../API/progressApi";

import DSDPropagationDelayOverview from "./DSDPropagationDelayOverview";
import DSDPropagationDelaySimulation from "./DSDPropagationDelaySimulation";
import DSDPropagationDelayCircuits from "./DSDPropagationDelayCircuits";
import DSDPropagationDelayTruthTable from "./DSDPropagationDelayTruthTable";
import DSDPropagationDelayQuiz from "./DSDPropagationDelayQuiz";
import DSDPropagationDelayCoding from "./DSDPropagationDelayCoding";

function gateOutput(gate, input) {
  if (gate === "NOT") return input === 1 ? 0 : 1;
  if (gate === "BUFFER") return input;
  return input;
}

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
    q: "Propagation delay is the time between:",
    options: [
      "Power ON and power OFF",
      "Input change and corresponding output change",
      "Two clock cycles only",
      "Two unrelated signals"
    ],
    correct: 1
  },
  {
    q: "Propagation delay is usually measured in:",
    options: ["Amperes", "Volts", "Nanoseconds", "Ohms"],
    correct: 2
  },
  {
    q: "If time is less than the propagation delay:",
    options: [
      "Output must instantly change",
      "Output still shows old value",
      "Circuit turns off",
      "Clock stops"
    ],
    correct: 1
  },
  {
    q: "Ignoring propagation delay can lead to:",
    options: ["Better timing always", "Infinite memory", "Timing errors", "Lower voltage only"],
    correct: 2
  },
  {
    q: "Propagation delay is important in:",
    options: ["Timing analysis", "Painting circuits", "Battery charging only", "Keyboard layout"],
    correct: 0
  }
];

export default function DSDPropagationDelayLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [selectedGate, setSelectedGate] = useState("NOT");
  const [inputBit, setInputBit] = useState(0);
  const [delayNs, setDelayNs] = useState(5);
  const [timeNs, setTimeNs] = useState(0);
  const [transitionCount, setTransitionCount] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const analysis = useMemo(() => {
    const previousInput = inputBit === 1 ? 0 : 1;
    const initialOutput = gateOutput(selectedGate, previousInput);
    const finalOutput = gateOutput(selectedGate, inputBit);

    const inputChangedAt = 0;
    const outputChangesAt = delayNs;

    let observedOutput = initialOutput;
    let state = "Waiting";

    if (timeNs >= outputChangesAt) {
      observedOutput = finalOutput;
      state = "Output Updated";
    }

    return {
      previousInput,
      initialOutput,
      finalOutput,
      observedOutput,
      inputChangedAt,
      outputChangesAt,
      state,
      note:
        timeNs < delayNs
          ? `The output has not yet responded because the propagation delay of ${delayNs} ns has not elapsed.`
          : "The propagation delay has elapsed, so the output now reflects the new input."
    };
  }, [selectedGate, inputBit, delayNs, timeNs]);

  const handleToggleInput = () => {
    setInputBit((prev) => (prev === 1 ? 0 : 1));
    setTimeNs(0);
    setTransitionCount((prev) => prev + 1);
    setExperimentRun(true);
  };

  const handleAdvanceTime = () => {
    setTimeNs((prev) => prev + 1);
    setExperimentRun(true);
  };

  const handleResetTime = () => {
    setTimeNs(0);
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
        experimentSlug: "propagation-delay",
        correctAnswers: total,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Propagation Delay quiz save failed:", error);
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
      ? 46
      : activeSection === "circuits"
      ? 60
      : activeSection === "truth table"
      ? 74
      : activeSection === "quiz"
      ? 87
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
                    "Propagation Delay"}
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
            <h1 className="er-page-title">Propagation Delay</h1>
            <p className="er-page-subtitle">
              Visualize how signals take finite time to travel through logic gates,
              and observe how input transitions appear at the output only after
              the configured delay.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Delay Configuration</h2>
              <p>
                Choose a gate, set the delay, toggle the input transition, and
                track how the output responds in time.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <CircuitBoard size={18} />
              </div>
              <div>
                <strong>{selectedGate} Gate Timing</strong>
                <span>
                  Delay = {delayNs} ns · Current time = {timeNs} ns
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Gate Type</label>
              <select
                value={selectedGate}
                onChange={(e) => {
                  setSelectedGate(e.target.value);
                  setTimeNs(0);
                }}
                className="sorting-select"
              >
                <option value="NOT">NOT Gate</option>
                <option value="BUFFER">BUFFER Gate</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Observed State</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {analysis.state}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Input = {inputBit}</button>
            <button className="er-chip active">
              Initial Output = {analysis.initialOutput}
            </button>
            <button className="er-chip active">
              Observed Output = {analysis.observedOutput}
            </button>
            <button className="er-chip active">
              Final Output = {analysis.finalOutput}
            </button>
            <button className="er-chip active">Delay = {delayNs} ns</button>
            <button className="er-chip active">Time = {timeNs} ns</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dsd"
              experimentSlug="propagation-delay"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DSDPropagationDelayOverview selectedGate={selectedGate} />
            )}

            {activeSection === "simulation" && (
              <DSDPropagationDelaySimulation
                selectedGate={selectedGate}
                setSelectedGate={setSelectedGate}
                inputBit={inputBit}
                delayNs={delayNs}
                setDelayNs={setDelayNs}
                timeNs={timeNs}
                analysis={analysis}
                transitionCount={transitionCount}
                handleToggleInput={handleToggleInput}
                handleAdvanceTime={handleAdvanceTime}
                handleResetTime={handleResetTime}
              />
            )}

            {activeSection === "circuits" && (
              <DSDPropagationDelayCircuits
                selectedGate={selectedGate}
                inputBit={inputBit}
                delayNs={delayNs}
                timeNs={timeNs}
                analysis={analysis}
              />
            )}

            {activeSection === "truth table" && (
              <DSDPropagationDelayTruthTable
                selectedGate={selectedGate}
                inputBit={inputBit}
                delayNs={delayNs}
                timeNs={timeNs}
                analysis={analysis}
              />
            )}

            {activeSection === "quiz" && (
              <DSDPropagationDelayQuiz
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
              <DSDPropagationDelayCoding
                selectedGate={selectedGate}
                inputBit={inputBit}
                delayNs={delayNs}
                timeNs={timeNs}
                analysis={analysis}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}