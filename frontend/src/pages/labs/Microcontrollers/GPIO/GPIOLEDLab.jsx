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

import GPIOLEDOverview from "./GPIOLEDOverview";
import GPIOLEDSimulation from "./GPIOLEDSimulation";
import GPIOLEDCircuits from "./GPIOLEDCircuits";
import GPIOLEDWorking from "./GPIOLEDWorking";
import GPIOLEDStateTable from "./GPIOLEDStateTable";
import GPIOLEDQuiz from "./GPIOLEDQuiz";
import GPIOLEDDesignPractice from "./GPIOLEDDesignPractice";

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

export default function GPIOLEDLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [pinMode, setPinMode] = useState("OUTPUT");
  const [pinState, setPinState] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const led = pinMode === "OUTPUT" && pinState === 1 ? 1 : 0;

    return {
      led,
      pinMode,
      pinState,
      status: led ? "LED ON" : "LED OFF",
      voltage: led ? "5V / HIGH" : "0V / LOW",
      note:
        pinMode !== "OUTPUT"
          ? "The pin is not configured as OUTPUT, so the LED cannot be driven properly."
          : pinState === 1
          ? "GPIO pin is HIGH, current flows through the resistor and LED, so it turns ON."
          : "GPIO pin is LOW, no forward current flows through the LED, so it remains OFF."
    };
  }, [pinMode, pinState]);

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
                    "GPIO LED"}
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
            <h1 className="er-page-title">GPIO LED Control</h1>
            <p className="er-page-subtitle">
              Learn how a microcontroller uses a GPIO pin to send HIGH or LOW
              signals and control an LED. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>GPIO Configuration</h2>
              <p>
                Configure the pin mode and output state to observe LED behavior.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Digital Output</strong>
                <span>
                  MCU pin D13 controls one LED through a current-limiting
                  resistor.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Pin Mode</label>
              <select
                className="sorting-select"
                value={pinMode}
                onChange={(e) => setPinMode(e.target.value)}
              >
                <option value="OUTPUT">OUTPUT</option>
                <option value="INPUT">INPUT</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">GPIO State</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                D13 = {pinState ? "HIGH" : "LOW"}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className={`er-chip ${pinMode === "OUTPUT" ? "active" : ""}`}>
              MODE = {pinMode}
            </button>

            <button className={`er-chip ${pinState ? "active" : ""}`}>
              D13 = {pinState}
            </button>

            <button className={`er-chip ${analysis.led ? "active" : ""}`}>
              LED = {analysis.led ? "ON" : "OFF"}
            </button>

            <button className="er-chip active">{analysis.voltage}</button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <GPIOLEDOverview analysis={analysis} />
            )}

            {activeSection === "simulation" && (
              <GPIOLEDSimulation
                ledState={analysis.led}
                setLedState={setPinState}
                pinMode={pinMode}
                setPinMode={setPinMode}
                pinState={pinState}
                setPinState={setPinState}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <GPIOLEDCircuits
                pinMode={pinMode}
                pinState={pinState}
                analysis={analysis}
              />
            )}

            {activeSection === "working" && (
              <GPIOLEDWorking analysis={analysis} />
            )}

            {activeSection === "state table" && (
              <GPIOLEDStateTable
                pinMode={pinMode}
                pinState={pinState}
                analysis={analysis}
              />
            )}

            {activeSection === "quiz" && (
              <GPIOLEDQuiz experimentRun={experimentRun} />
            )}

            {activeSection === "design practice" && (
              <GPIOLEDDesignPractice analysis={analysis} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}