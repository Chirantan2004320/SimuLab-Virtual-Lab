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

import PWMLedOverview from "./PWMLedOverview";
import PWMLedSimulation from "./PWMLedSimulation";
import PWMLedCircuits from "./PWMLedCircuits";
import PWMLedWorking from "./PWMLedWorking";
import PWMLedStateTable from "./PWMLedStateTable";
import PWMLedQuiz from "./PWMLedQuiz";
import PWMLedDesignPractice from "./PWMLedDesignPractice";

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

export default function PWMLedLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dutyCycle, setDutyCycle] = useState(50);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const pwmValue = Math.round((dutyCycle / 100) * 255);

    let brightnessLabel = "OFF";
    if (dutyCycle > 0 && dutyCycle <= 25) brightnessLabel = "DIM";
    else if (dutyCycle <= 50 && dutyCycle > 25) brightnessLabel = "MEDIUM";
    else if (dutyCycle <= 75 && dutyCycle > 50) brightnessLabel = "BRIGHT";
    else if (dutyCycle > 75) brightnessLabel = "FULL BRIGHTNESS";

    return {
      dutyCycle,
      pwmValue,
      brightnessLabel,
      ledOn: dutyCycle > 0,
      voltageText: `${((dutyCycle / 100) * 5).toFixed(2)}V avg`,
      note:
        dutyCycle === 0
          ? "Duty cycle is 0%, so the LED remains OFF."
          : dutyCycle === 100
          ? "Duty cycle is 100%, so the LED receives continuous HIGH output and glows at full brightness."
          : `PWM is HIGH for ${dutyCycle}% of each cycle, so the LED appears ${brightnessLabel.toLowerCase()}.`
    };
  }, [dutyCycle]);

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
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">PWM LED Brightness</h1>
            <p className="er-page-subtitle">
              Control LED brightness using pulse width modulation and duty cycle concepts. 🌗
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>PWM Configuration</h2>
              <p>Adjust duty cycle and observe brightness + waveform changes.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>PWM Output</strong>
                <span>MCU pin D9 sends fast HIGH/LOW pulses to control average LED power.</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Duty Cycle</label>
              <select
                className="sorting-select"
                value={dutyCycle}
                onChange={(e) => {
                  setDutyCycle(Number(e.target.value));
                  setExperimentRun(true);
                }}
              >
                <option value={0}>0%</option>
                <option value={25}>25%</option>
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">PWM Value</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                analogWrite(D9, {analysis.pwmValue})
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">DUTY = {dutyCycle}%</button>
            <button className="er-chip active">PWM = {analysis.pwmValue}</button>
            <button className={`er-chip ${analysis.ledOn ? "active" : ""}`}>
              LED = {analysis.brightnessLabel}
            </button>
            <button className="er-chip active">{analysis.voltageText}</button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <PWMLedOverview analysis={analysis} />}
            {activeSection === "simulation" && (
              <PWMLedSimulation
                dutyCycle={dutyCycle}
                setDutyCycle={setDutyCycle}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}
            {activeSection === "circuits" && <PWMLedCircuits analysis={analysis} />}
            {activeSection === "working" && <PWMLedWorking analysis={analysis} />}
            {activeSection === "state table" && <PWMLedStateTable analysis={analysis} />}
            {activeSection === "quiz" && <PWMLedQuiz experimentRun={experimentRun} />}
            {activeSection === "design practice" && <PWMLedDesignPractice analysis={analysis} />}
          </section>
        </div>
      </main>
    </div>
  );
}