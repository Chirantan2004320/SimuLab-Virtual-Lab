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

import LEDBlinkOverview from "./LEDBlinkOverview";
import LEDBlinkSimulation from "./LEDBlinkSimulation";
import LEDBlinkCircuits from "./LEDBlinkCircuits";
import LEDBlinkWorking from "./LEDBlinkWorking";
import LEDBlinkStateTable from "./LEDBlinkStateTable";
import LEDBlinkQuiz from "./LEDBlinkQuiz";
import LEDBlinkDesignPractice from "./LEDBlinkDesignPractice";

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

export default function LEDBlinkLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [blinkSpeed, setBlinkSpeed] = useState("MEDIUM");
  const [ledState, setLedState] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const delayMs =
      blinkSpeed === "SLOW" ? 1000 : blinkSpeed === "MEDIUM" ? 500 : 200;

    return {
      blinkSpeed,
      delayMs,
      ledState,
      isRunning,
      cycleCount,
      phase: ledState ? "ON Phase" : "OFF Phase",
      status: ledState ? "LED ON" : "LED OFF",
      voltage: ledState ? "5V / HIGH" : "0V / LOW",
      note: isRunning
        ? `Blinking is active. The LED changes state every ${delayMs} ms.`
        : "Blinking is paused. Start the simulation to toggle the LED repeatedly."
    };
  }, [blinkSpeed, ledState, isRunning, cycleCount]);

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
                <span>{sidebarItems.find((i) => i.key === activeSection)?.label || "LED Blink"}</span>
                <span className="dot-live">Just now</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">LED Blink</h1>
            <p className="er-page-subtitle">
              Learn how a microcontroller repeatedly turns a GPIO pin HIGH and LOW to blink an LED. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Blink Configuration</h2>
              <p>Control blink speed and observe ON/OFF timing behavior.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Timed GPIO Output</strong>
                <span>MCU pin D13 toggles repeatedly using delay logic.</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Blink Speed</label>
              <select
                className="sorting-select"
                value={blinkSpeed}
                onChange={(e) => setBlinkSpeed(e.target.value)}
              >
                <option value="SLOW">Slow</option>
                <option value="MEDIUM">Medium</option>
                <option value="FAST">Fast</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Current Phase</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {analysis.phase}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className={`er-chip ${isRunning ? "active" : ""}`}>
              BLINK = {isRunning ? "RUNNING" : "PAUSED"}
            </button>
            <button className={`er-chip ${ledState ? "active" : ""}`}>
              LED = {ledState ? "ON" : "OFF"}
            </button>
            <button className="er-chip active">DELAY = {analysis.delayMs} ms</button>
            <button className="er-chip active">CYCLES = {cycleCount}</button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <LEDBlinkOverview analysis={analysis} />}

            {activeSection === "simulation" && (
              <LEDBlinkSimulation
                blinkSpeed={blinkSpeed}
                setBlinkSpeed={setBlinkSpeed}
                ledState={ledState}
                setLedState={setLedState}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                cycleCount={cycleCount}
                setCycleCount={setCycleCount}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && <LEDBlinkCircuits analysis={analysis} />}

            {activeSection === "working" && <LEDBlinkWorking analysis={analysis} />}

            {activeSection === "state table" && <LEDBlinkStateTable analysis={analysis} />}

            {activeSection === "quiz" && <LEDBlinkQuiz experimentRun={experimentRun} />}

            {activeSection === "design practice" && <LEDBlinkDesignPractice analysis={analysis} />}
          </section>
        </div>
      </main>
    </div>
  );
}