import React, { useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import SimuLabLogo from "../../../../components/SimuLabLogo";

import DVLSICMOSNOROverview from "./DVLSICMOSNORGateOverview.jsx";
import DVLSICMOSNORSimulation from "./DVLSICMOSNORGateSimulation.jsx";
import DVLSICMOSNORCircuits from "./DVLSICMOSNORGateCircuits.jsx";
import DVLSICMOSNORQuiz from "./DVLSICMOSNORGateQuiz.jsx";
import DVLSICMOSNORCoding from "./DVLSICMOSNORGateCoding.jsx";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

export default function DVLSICMOSNORGateLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [A, setA] = useState(0);
  const [B, setB] = useState(0);

  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const output = !(A || B) ? 1 : 0;

    const pmosA = A === 0 ? "ON" : "OFF";
    const pmosB = B === 0 ? "ON" : "OFF";
    const nmosA = A === 1 ? "ON" : "OFF";
    const nmosB = B === 1 ? "ON" : "OFF";

    let note = "";
    let currentPath = "";
    let logicCase = "";

    if (output === 1) {
      logicCase = "Both inputs LOW";
      currentPath = "VDD → pMOS A → pMOS B → Output";
      note =
        "Both pMOS transistors are ON and both nMOS transistors are OFF, so the output is pulled HIGH.";
    } else if (A === 1 && B === 0) {
      logicCase = "A HIGH, B LOW";
      currentPath = "Output → nMOS A → GND";
      note =
        "nMOS A provides a pull-down path to ground, so the output becomes LOW.";
    } else if (A === 0 && B === 1) {
      logicCase = "A LOW, B HIGH";
      currentPath = "Output → nMOS B → GND";
      note =
        "nMOS B provides a pull-down path to ground, so the output becomes LOW.";
    } else {
      logicCase = "Both inputs HIGH";
      currentPath = "Output → nMOS A or nMOS B → GND";
      note =
        "Both nMOS transistors are ON and the pull-up path is broken, so the output is LOW.";
    }

    return {
      output,
      pmosA,
      pmosB,
      nmosA,
      nmosB,
      currentPath,
      logicCase,
      note
    };
  }, [A, B]);

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 45
      : activeSection === "circuits"
      ? 68
      : activeSection === "quiz"
      ? 86
      : 96;

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
              <div className="er-brand-subtitle">DVLSI Lab</div>
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
                    "CMOS NOR"}
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
            <h1 className="er-page-title">CMOS NOR Gate</h1>
            <p className="er-page-subtitle">
              Study transistor-level NOR logic behavior, conduction paths, and
              circuit-level operation for all input combinations.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Change the input combinations and observe the resulting CMOS NOR
                gate behavior.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Output Y = {analysis.output}</strong>
                <span>{analysis.logicCase}</span>
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">A = {A}</button>
            <button className="er-chip active">B = {B}</button>
            <button className="er-chip active">Y = {analysis.output}</button>
            <button className="er-chip active">{analysis.logicCase}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dvlsi"
              experimentSlug="cmos-nor-gate"
              points={10}
              onComplete={() => {
                window.dispatchEvent(new Event("progress-updated"));
              }}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DVLSICMOSNOROverview />}

            {activeSection === "simulation" && (
              <DVLSICMOSNORSimulation
                A={A}
                setA={setA}
                B={B}
                setB={setB}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DVLSICMOSNORCircuits A={A} B={B} analysis={analysis} />
            )}

            {activeSection === "quiz" && (
              <DVLSICMOSNORQuiz experimentRun={experimentRun} />
            )}

            {activeSection === "coding" && (
              <DVLSICMOSNORCoding analysis={analysis} A={A} B={B} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}