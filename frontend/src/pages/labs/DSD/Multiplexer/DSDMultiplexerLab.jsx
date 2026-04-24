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
} from "lucide-react";

import DSDMultiplexerOverview from "./DSDMultiplexerOverview";
import DSDMultiplexerSimulation from "./DSDMultiplexerSimulation";
import DSDMultiplexerCircuits from "./DSDMultiplexerCircuits";
import DSDMultiplexerTruthTable from "./DSDMultiplexerTruthTable";
import DSDMultiplexerQuiz from "./DSDMultiplexerQuiz";
import DSDMultiplexerCoding from "./DSDMultiplexerCoding";

const simulabLogo = "/assets/logo.png";

function bit(v) {
  return v ? 1 : 0;
}

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "truth table", label: "Truth Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Design Practice", icon: FileCode2 },
];

export default function DSDMultiplexerLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [i0, setI0] = useState(false);
  const [i1, setI1] = useState(false);
  const [i2, setI2] = useState(false);
  const [i3, setI3] = useState(false);
  const [s0, setS0] = useState(false);
  const [s1, setS1] = useState(false);

  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const I0 = bit(i0);
    const I1 = bit(i1);
    const I2 = bit(i2);
    const I3 = bit(i3);
    const S0 = bit(s0);
    const S1 = bit(s1);

    const selectedIndex = S1 * 2 + S0;
    const inputs = [I0, I1, I2, I3];
    const output = inputs[selectedIndex];

    let note = "";
    if (selectedIndex === 0) note = "Since S1S0 = 00, input I0 is routed to the output.";
    if (selectedIndex === 1) note = "Since S1S0 = 01, input I1 is routed to the output.";
    if (selectedIndex === 2) note = "Since S1S0 = 10, input I2 is routed to the output.";
    if (selectedIndex === 3) note = "Since S1S0 = 11, input I3 is routed to the output.";

    return {
      I0,
      I1,
      I2,
      I3,
      S0,
      S1,
      selectedIndex,
      inputs,
      output,
      expression: "Y = I0·S1̅·S0̅ + I1·S1̅·S0 + I2·S1·S0̅ + I3·S1·S0",
      note,
      selectedInputLabel: `I${selectedIndex}`,
      selectCode: `${S1}${S0}`,
      category: "Combinational Data Selector",
    };
  }, [i0, i1, i2, i3, s0, s1]);

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 45
      : activeSection === "circuits"
      ? 58
      : activeSection === "truth table"
      ? 72
      : activeSection === "quiz"
      ? 84
      : 92;

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
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`,
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
                  {sidebarItems.find((i) => i.key === activeSection)?.label || "Multiplexer"}
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
            <h1 className="er-page-title">Multiplexer</h1>
            <p className="er-page-subtitle">
              Explore how a 4-to-1 multiplexer selects one of four data inputs using two select lines and forwards it to a single output. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>MUX Configuration</h2>
              <p>Control data inputs and select lines to observe routing behavior in real time.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <CircuitBoard size={18} />
              </div>
              <div>
                <strong>4-to-1 Multiplexer</strong>
                <span>One output, four data inputs, two select lines.</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Select Code</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                S1S0 = {analysis.selectCode}
              </div>
            </div>

            <div>
              <label className="sorting-label">Selected Input</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {analysis.selectedInputLabel}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">I0 = {analysis.I0}</button>
            <button className="er-chip active">I1 = {analysis.I1}</button>
            <button className="er-chip active">I2 = {analysis.I2}</button>
            <button className="er-chip active">I3 = {analysis.I3}</button>
            <button className="er-chip active">S1 = {analysis.S1}</button>
            <button className="er-chip active">S0 = {analysis.S0}</button>
            <button className="er-chip active">Y = {analysis.output}</button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DSDMultiplexerOverview analysis={analysis} />}

            {activeSection === "simulation" && (
              <DSDMultiplexerSimulation
                i0={i0}
                setI0={setI0}
                i1={i1}
                setI1={setI1}
                i2={i2}
                setI2={setI2}
                i3={i3}
                setI3={setI3}
                s0={s0}
                setS0={setS0}
                s1={s1}
                setS1={setS1}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DSDMultiplexerCircuits analysis={analysis} />
            )}

            {activeSection === "truth table" && (
              <DSDMultiplexerTruthTable analysis={analysis} />
            )}

            {activeSection === "quiz" && (
              <DSDMultiplexerQuiz experimentRun={experimentRun} />
            )}

            {activeSection === "coding" && (
              <DSDMultiplexerCoding analysis={analysis} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}