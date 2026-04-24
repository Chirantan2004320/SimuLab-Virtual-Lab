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

import DSDDecoderEncoderOverview from "./DSDDecoderEncoderOverview";
import DSDDecoderEncoderSimulation from "./DSDDecoderEncoderSimulation";
import DSDDecoderEncoderCircuits from "./DSDDecoderEncoderCircuits";
import DSDDecoderEncoderTruthTable from "./DSDDecoderEncoderTruthTable";
import DSDDecoderEncoderQuiz from "./DSDDecoderEncoderQuiz";
import DSDDecoderEncoderCoding from "./DSDDecoderEncoderCoding";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "truth table", label: "Truth Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Design Practice", icon: FileCode2 }
];

export default function DSDDecoderEncoderLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mode, setMode] = useState("decoder");

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [inputs, setInputs] = useState([1, 0, 0, 0]);
  const [experimentRun, setExperimentRun] = useState(false);

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

    const index = inputs.findIndex((v) => v === 1);
    const safeIndex = index === -1 ? 0 : index;
    const binary = safeIndex.toString(2).padStart(2, "0");

    return {
      index,
      binary,
      encodedBinary: binary,
      outputs: [],
      note:
        index === -1
          ? "No input line is active. A standard encoder expects one active input line."
          : `Active input I${index} is converted into binary output ${binary}.`
    };
  }, [mode, a, b, inputs]);

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
          <div className="er-brand-logo">
            <img
              src={simulabLogo}
              alt="SimuLab"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
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
                className={`er-nav-item ${activeSection === item.key ? "active" : ""}`}
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
                  {sidebarItems.find((i) => i.key === activeSection)?.label || "Encoder Decoder"}
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
              Explore how a decoder expands binary inputs into one active output line, and how an encoder compresses one active input line into a binary code. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Logic Configuration</h2>
              <p>Switch between decoder and encoder modes to observe how binary information is expanded or compressed.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <CircuitBoard size={18} />
              </div>
              <div>
                <strong>{mode === "decoder" ? "2-to-4 Decoder" : "4-to-2 Encoder"}</strong>
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
                onChange={(e) => setMode(e.target.value)}
                className="sorting-select"
              >
                <option value="decoder">Decoder</option>
                <option value="encoder">Encoder</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Current Result</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
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
              </>
            ) : (
              <>
                <button className="er-chip active">I0 = {inputs[0]}</button>
                <button className="er-chip active">I1 = {inputs[1]}</button>
                <button className="er-chip active">I2 = {inputs[2]}</button>
                <button className="er-chip active">I3 = {inputs[3]}</button>
              </>
            )}
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
              <DSDDecoderEncoderQuiz experimentRun={experimentRun} />
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