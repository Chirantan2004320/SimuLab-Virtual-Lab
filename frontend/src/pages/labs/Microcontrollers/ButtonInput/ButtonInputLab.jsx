import React, { useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  ListChecks,
  Table2,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";

import ButtonInputOverview from "./ButtonInputOverview";
import ButtonInputSimulation from "./ButtonInputSimulation";
import ButtonInputCircuits from "./ButtonInputCircuits";
import ButtonInputWorking from "./ButtonInputWorking";
import ButtonInputStateTable from "./ButtonInputStateTable";
import ButtonInputQuiz from "./ButtonInputQuiz";
import ButtonInputDesignPractice from "./ButtonInputDesignPractice";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "working", label: "Working", icon: ListChecks },
  { key: "state table", label: "State Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "design practice", label: "Design Practice", icon: FileCode2 }
];

export default function ButtonInputLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [inputMode, setInputMode] = useState("PULL_DOWN");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const readValue =
      inputMode === "PULL_DOWN"
        ? buttonPressed
          ? 1
          : 0
        : buttonPressed
        ? 0
        : 1;

    return {
      inputMode,
      buttonPressed,
      readValue,
      readLabel: readValue ? "HIGH" : "LOW",
      buttonLabel: buttonPressed ? "PRESSED" : "RELEASED",
      voltage: readValue ? "5V / HIGH" : "0V / LOW",
      note:
        inputMode === "PULL_DOWN"
          ? buttonPressed
            ? "Button is pressed, so GPIO input receives HIGH through the switch."
            : "Button is released, so the pull-down resistor keeps GPIO input LOW."
          : buttonPressed
          ? "Button is pressed, so GPIO input is connected to ground and reads LOW."
          : "Button is released, so the pull-up resistor keeps GPIO input HIGH."
    };
  }, [inputMode, buttonPressed]);

  const progressPercent =
    activeSection === "overview"
      ? 18
      : activeSection === "simulation"
      ? 42
      : activeSection === "circuits"
      ? 58
      : activeSection === "working"
      ? 70
      : activeSection === "state table"
      ? 80
      : activeSection === "quiz"
      ? 90
      : 96;

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
              <div className="er-brand-subtitle">Microcontroller Lab</div>
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
                    "Button Input"}
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
            <h1 className="er-page-title">Button Input</h1>
            <p className="er-page-subtitle">
              Learn how a microcontroller reads push-button input using pull-up
              and pull-down configurations. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Button Input Configuration</h2>
              <p>Press or release the button and observe the GPIO input reading.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Digital Input</strong>
                <span>MCU pin D2 reads button state using resistor biasing.</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Input Mode</label>
              <select
                className="sorting-select"
                value={inputMode}
                onChange={(e) => setInputMode(e.target.value)}
              >
                <option value="PULL_DOWN">Pull-down</option>
                <option value="PULL_UP">Pull-up</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Button State</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {analysis.buttonLabel}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              MODE = {inputMode === "PULL_DOWN" ? "PULL-DOWN" : "PULL-UP"}
            </button>
            <button className={`er-chip ${buttonPressed ? "active" : ""}`}>
              BUTTON = {analysis.buttonLabel}
            </button>
            <button className={`er-chip ${analysis.readValue ? "active" : ""}`}>
              GPIO D2 = {analysis.readLabel}
            </button>
            <button className="er-chip active">{analysis.voltage}</button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <ButtonInputOverview analysis={analysis} />
            )}

            {activeSection === "simulation" && (
              <ButtonInputSimulation
                inputMode={inputMode}
                setInputMode={setInputMode}
                buttonPressed={buttonPressed}
                setButtonPressed={setButtonPressed}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <ButtonInputCircuits
                inputMode={inputMode}
                buttonPressed={buttonPressed}
                analysis={analysis}
              />
            )}

            {activeSection === "working" && (
              <ButtonInputWorking analysis={analysis} />
            )}

            {activeSection === "state table" && (
              <ButtonInputStateTable
                inputMode={inputMode}
                buttonPressed={buttonPressed}
                analysis={analysis}
              />
            )}

            {activeSection === "quiz" && (
              <ButtonInputQuiz experimentRun={experimentRun} />
            )}

            {activeSection === "design practice" && (
              <ButtonInputDesignPractice analysis={analysis} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}