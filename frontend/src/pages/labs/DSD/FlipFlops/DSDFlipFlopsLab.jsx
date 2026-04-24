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

import DSDFlipFlopsOverview from "./DSDFlipFlopsOverview";
import DSDFlipFlopsSimulation from "./DSDFlipFlopsSimulation";
import DSDFlipFlopsCircuits from "./DSDFlipFlopsCircuits";
import DSDFlipFlopsTruthTable from "./DSDFlipFlopsTruthTable";
import DSDFlipFlopsQuiz from "./DSDFlipFlopsQuiz";
import DSDFlipFlopsCoding from "./DSDFlipFlopsCoding";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "truth table", label: "Truth Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Design Practice", icon: FileCode2 }
];

export default function DSDFlipFlopsLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedType, setSelectedType] = useState("sr");

  const [s, setS] = useState(0);
  const [r, setR] = useState(0);
  const [d, setD] = useState(0);
  const [j, setJ] = useState(0);
  const [k, setK] = useState(0);
  const [t, setT] = useState(0);
  const [clk, setClk] = useState(0);

  const [q, setQ] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    let nextQ = q;
    let note = "";
    let stateName = "";
    let qBar;

    if (selectedType === "sr") {
      if (s === 0 && r === 0) {
        nextQ = q;
        stateName = "Hold";
        note = "SR latch keeps the previous state when S = 0 and R = 0.";
      } else if (s === 1 && r === 0) {
        nextQ = 1;
        stateName = "Set";
        note = "SR latch sets Q to 1 when S = 1 and R = 0.";
      } else if (s === 0 && r === 1) {
        nextQ = 0;
        stateName = "Reset";
        note = "SR latch resets Q to 0 when S = 0 and R = 1.";
      } else {
        nextQ = q;
        stateName = "Invalid";
        note = "S = 1 and R = 1 is an invalid condition for the basic SR latch.";
      }
    }

    if (selectedType === "d") {
      if (clk === 1) {
        nextQ = d;
        stateName = d === 1 ? "Load 1" : "Load 0";
        note = "When CLK = 1, the D Flip-Flop transfers D directly to Q.";
      } else {
        nextQ = q;
        stateName = "Hold";
        note = "When CLK = 0, the D Flip-Flop holds the previous state.";
      }
    }

    if (selectedType === "jk") {
      if (clk === 1) {
        if (j === 0 && k === 0) {
          nextQ = q;
          stateName = "Hold";
          note = "JK Flip-Flop holds state for J = 0 and K = 0.";
        } else if (j === 1 && k === 0) {
          nextQ = 1;
          stateName = "Set";
          note = "JK Flip-Flop sets Q for J = 1 and K = 0.";
        } else if (j === 0 && k === 1) {
          nextQ = 0;
          stateName = "Reset";
          note = "JK Flip-Flop resets Q for J = 0 and K = 1.";
        } else {
          nextQ = q === 1 ? 0 : 1;
          stateName = "Toggle";
          note = "JK Flip-Flop toggles Q when J = 1 and K = 1.";
        }
      } else {
        nextQ = q;
        stateName = "Hold";
        note = "When CLK = 0, the JK Flip-Flop holds the previous state.";
      }
    }

    if (selectedType === "t") {
      if (clk === 1) {
        if (t === 0) {
          nextQ = q;
          stateName = "Hold";
          note = "T Flip-Flop holds the previous state when T = 0.";
        } else {
          nextQ = q === 1 ? 0 : 1;
          stateName = "Toggle";
          note = "T Flip-Flop toggles the stored state when T = 1 and CLK = 1.";
        }
      } else {
        nextQ = q;
        stateName = "Hold";
        note = "When CLK = 0, the T Flip-Flop holds the previous state.";
      }
    }

    qBar = nextQ === 1 ? 0 : 1;

    return {
      nextQ,
      qBar,
      stateName,
      note
    };
  }, [selectedType, s, r, d, j, k, t, clk, q]);

  const applyClockedUpdate = () => {
    setQ(analysis.nextQ);
    setExperimentRun(true);
  };

  const typeMeta = {
    sr: {
      title: "SR Latch",
      description: "Basic set-reset storage element"
    },
    d: {
      title: "D Flip-Flop",
      description: "Single data input controlled by clock"
    },
    jk: {
      title: "JK Flip-Flop",
      description: "Improved clocked flip-flop with toggle state"
    },
    t: {
      title: "T Flip-Flop",
      description: "Toggle flip-flop used in counters"
    }
  };

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 46
      : activeSection === "circuits"
      ? 60
      : activeSection === "truth table"
      ? 75
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
                  {sidebarItems.find((i) => i.key === activeSection)?.label || "Flip-Flops"}
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
            <h1 className="er-page-title">Flip-Flops</h1>
            <p className="er-page-subtitle">
              Explore SR, D, JK, and T flip-flops and understand how sequential circuits store state, respond to clock signals, and transition from present output to next output. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Flip-Flop Configuration</h2>
              <p>Choose a flip-flop type, adjust its inputs, and observe how the next state is generated.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <CircuitBoard size={18} />
              </div>
              <div>
                <strong>{typeMeta[selectedType].title}</strong>
                <span>{typeMeta[selectedType].description}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Flip-Flop Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="sorting-select"
              >
                <option value="sr">SR Latch</option>
                <option value="d">D Flip-Flop</option>
                <option value="jk">JK Flip-Flop</option>
                <option value="t">T Flip-Flop</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Operation</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {analysis.stateName}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            {selectedType === "sr" && (
              <>
                <button className="er-chip active">S = {s}</button>
                <button className="er-chip active">R = {r}</button>
              </>
            )}

            {selectedType === "d" && (
              <>
                <button className="er-chip active">D = {d}</button>
                <button className="er-chip active">CLK = {clk}</button>
              </>
            )}

            {selectedType === "jk" && (
              <>
                <button className="er-chip active">J = {j}</button>
                <button className="er-chip active">K = {k}</button>
                <button className="er-chip active">CLK = {clk}</button>
              </>
            )}

            {selectedType === "t" && (
              <>
                <button className="er-chip active">T = {t}</button>
                <button className="er-chip active">CLK = {clk}</button>
              </>
            )}

            <button className="er-chip active">Q = {q}</button>
            <button className="er-chip active">Next Q = {analysis.nextQ}</button>
            <button className="er-chip active">Q̅ = {analysis.qBar}</button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DSDFlipFlopsOverview selectedType={selectedType} />
            )}

            {activeSection === "simulation" && (
              <DSDFlipFlopsSimulation
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                s={s}
                setS={setS}
                r={r}
                setR={setR}
                d={d}
                setD={setD}
                j={j}
                setJ={setJ}
                k={k}
                setK={setK}
                t={t}
                setT={setT}
                clk={clk}
                setClk={setClk}
                q={q}
                analysis={analysis}
                applyClockedUpdate={applyClockedUpdate}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DSDFlipFlopsCircuits
                selectedType={selectedType}
                q={q}
                analysis={analysis}
                s={s}
                r={r}
                d={d}
                j={j}
                k={k}
                t={t}
                clk={clk}
              />
            )}

            {activeSection === "truth table" && (
              <DSDFlipFlopsTruthTable
                selectedType={selectedType}
                s={s}
                r={r}
                d={d}
                j={j}
                k={k}
                t={t}
                clk={clk}
                q={q}
                analysis={analysis}
              />
            )}

            {activeSection === "quiz" && (
              <DSDFlipFlopsQuiz experimentRun={experimentRun} />
            )}

            {activeSection === "coding" && (
              <DSDFlipFlopsCoding selectedType={selectedType} analysis={analysis} q={q} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}