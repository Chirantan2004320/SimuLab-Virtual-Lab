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

import DSDDecoderEncoderOverview from "./DSDDecoderEncoderOverview";
import DSDDecoderEncoderSimulation from "./DSDDecoderEncoderSimulation";
import DSDDecoderEncoderCircuits from "./DSDDecoderEncoderCircuits";
import DSDDecoderEncoderTruthTable from "./DSDDecoderEncoderTruthTable";
import DSDDecoderEncoderQuiz from "./DSDDecoderEncoderQuiz";
import DSDDecoderEncoderCoding from "./DSDDecoderEncoderCoding";

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
    q: "A decoder converts:",
    options: [
      "Output lines to binary",
      "Binary input to one active output line",
      "Analog signal to digital",
      "Clock to pulse"
    ],
    correct: 1
  },
  {
    q: "A 2-to-4 decoder has how many outputs?",
    options: ["2", "3", "4", "8"],
    correct: 2
  },
  {
    q: "An encoder performs the reverse operation of a:",
    options: ["Flip-Flop", "Comparator", "Decoder", "Counter"],
    correct: 2
  },
  {
    q: "If input I2 is active in a 4-to-2 encoder, the binary output is:",
    options: ["00", "01", "10", "11"],
    correct: 2
  },
  {
    q: "For a decoder, input 11 activates:",
    options: ["Y0", "Y1", "Y2", "Y3"],
    correct: 3
  }
];

export default function DSDDecoderEncoderLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mode, setMode] = useState("decoder");

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [inputs, setInputs] = useState([1, 0, 0, 0]);
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const analysis = useMemo(() => {
    if (mode === "decoder") {
      const index = a * 2 + b;
      const outputs = [0, 0, 0, 0];
      outputs[index] = 1;

      return {
        index,
        outputs,
        binary: `${a}${b}`,
        encodedBinary: `${a}${b}`,
        note: `For input AB = ${a}${b}, only output Y${index} becomes active.`
      };
    }

    const activeIndexes = inputs
      .map((value, index) => (value === 1 ? index : -1))
      .filter((index) => index !== -1);

    const index = activeIndexes.length === 1 ? activeIndexes[0] : -1;
    const safeIndex = index === -1 ? 0 : index;
    const binary = safeIndex.toString(2).padStart(2, "0");

    return {
      index,
      binary,
      encodedBinary: binary,
      outputs: [],
      note:
        index === -1
          ? "A standard encoder expects exactly one active input line."
          : `Active input I${index} is converted into binary output ${binary}.`
    };
  }, [mode, a, b, inputs]);

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
        experimentSlug: "decoder-encoder",
        correctAnswers: total,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Decoder Encoder quiz save failed:", error);
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
                    "Encoder Decoder"}
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
            <h1 className="er-page-title">Encoder & Decoder</h1>
            <p className="er-page-subtitle">
              Explore how a decoder expands binary inputs into one active output
              line, and how an encoder compresses one active input line into a
              binary code.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Logic Configuration</h2>
              <p>
                Switch between decoder and encoder modes to observe how binary
                information is expanded or compressed.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <CircuitBoard size={18} />
              </div>
              <div>
                <strong>
                  {mode === "decoder" ? "2-to-4 Decoder" : "4-to-2 Encoder"}
                </strong>
                <span>
                  {mode === "decoder"
                    ? `Input code ${analysis.binary} activates Y${analysis.index}`
                    : analysis.index === -1
                    ? "No valid active input line"
                    : `I${analysis.index} encodes to ${analysis.binary}`}
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Mode</label>
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  setExperimentRun(true);
                }}
                className="sorting-select"
              >
                <option value="decoder">Decoder</option>
                <option value="encoder">Encoder</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Current Result</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {mode === "decoder"
                  ? `Y${analysis.index} active`
                  : analysis.index === -1
                  ? "No active input"
                  : `${analysis.binary} output`}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className={`er-chip ${mode === "decoder" ? "active" : ""}`}>
              Decoder Mode
            </button>
            <button className={`er-chip ${mode === "encoder" ? "active" : ""}`}>
              Encoder Mode
            </button>

            {mode === "decoder" ? (
              <>
                <button className="er-chip active">A = {a}</button>
                <button className="er-chip active">B = {b}</button>
                <button className="er-chip active">AB = {analysis.binary}</button>
                <button className="er-chip active">
                  Active Output = Y{analysis.index}
                </button>
              </>
            ) : (
              <>
                <button className="er-chip active">I0 = {inputs[0]}</button>
                <button className="er-chip active">I1 = {inputs[1]}</button>
                <button className="er-chip active">I2 = {inputs[2]}</button>
                <button className="er-chip active">I3 = {inputs[3]}</button>
              </>
            )}

            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dsd"
              experimentSlug="decoder-encoder"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DSDDecoderEncoderOverview mode={mode} />
            )}

            {activeSection === "simulation" && (
              <DSDDecoderEncoderSimulation
                mode={mode}
                setMode={setMode}
                a={a}
                setA={setA}
                b={b}
                setB={setB}
                inputs={inputs}
                setInputs={setInputs}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DSDDecoderEncoderCircuits
                mode={mode}
                a={a}
                b={b}
                inputs={inputs}
                analysis={analysis}
              />
            )}

            {activeSection === "truth table" && (
              <DSDDecoderEncoderTruthTable
                mode={mode}
                a={a}
                b={b}
                inputs={inputs}
                analysis={analysis}
              />
            )}

            {activeSection === "quiz" && (
              <DSDDecoderEncoderQuiz
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
              <DSDDecoderEncoderCoding
                mode={mode}
                a={a}
                b={b}
                inputs={inputs}
                analysis={analysis}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}