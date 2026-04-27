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

import SevenSegmentOverview from "./SevenSegmentOverview";
import SevenSegmentSimulation from "./SevenSegmentSimulation";
import SevenSegmentCircuits from "./SevenSegmentCircuits";
import SevenSegmentWorking from "./SevenSegmentWorking";
import SevenSegmentStateTable from "./SevenSegmentStateTable";
import SevenSegmentQuiz from "./SevenSegmentQuiz";
import SevenSegmentDesignPractice from "./SevenSegmentDesignPractice";

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

const DIGIT_PATTERNS = {
  0: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 },
  1: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  2: { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 },
  3: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 },
  4: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 },
  5: { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 },
  6: { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 },
  7: { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
  8: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 },
  9: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 }
};

export default function SevenSegmentLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [digit, setDigit] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const pattern = DIGIT_PATTERNS[digit];
    const activeSegments = Object.entries(pattern)
      .filter(([, value]) => value === 1)
      .map(([key]) => key.toUpperCase());

    const binaryPattern = ["a", "b", "c", "d", "e", "f", "g"]
      .map((seg) => pattern[seg])
      .join("");

    return {
      digit,
      pattern,
      activeSegments,
      binaryPattern,
      activeCount: activeSegments.length,
      note: `Digit ${digit} is displayed by turning ON segments ${activeSegments.join(", ")}.`
    };
  }, [digit]);

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
            <h1 className="er-page-title">7-Segment Display</h1>
            <p className="er-page-subtitle">
              Drive a numeric display using GPIO segment patterns and digital output logic. 🔢
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Display Configuration</h2>
              <p>Select a digit and observe which display segments turn ON.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>GPIO Segment Driver</strong>
                <span>Seven GPIO outputs control segments a to g.</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Digit</label>
              <select
                className="sorting-select"
                value={digit}
                onChange={(e) => {
                  setDigit(Number(e.target.value));
                  setExperimentRun(true);
                }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i} value={i}>
                    Digit {i}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="sorting-label">Segment Pattern</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                abcdefg = {analysis.binaryPattern}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">DIGIT = {digit}</button>
            <button className="er-chip active">ACTIVE = {analysis.activeSegments.join(", ")}</button>
            <button className="er-chip active">COUNT = {analysis.activeCount}</button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <SevenSegmentOverview analysis={analysis} />}
            {activeSection === "simulation" && (
              <SevenSegmentSimulation
                digit={digit}
                setDigit={setDigit}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}
            {activeSection === "circuits" && <SevenSegmentCircuits analysis={analysis} />}
            {activeSection === "working" && <SevenSegmentWorking analysis={analysis} />}
            {activeSection === "state table" && <SevenSegmentStateTable analysis={analysis} />}
            {activeSection === "quiz" && <SevenSegmentQuiz experimentRun={experimentRun} />}
            {activeSection === "design practice" && <SevenSegmentDesignPractice analysis={analysis} />}
          </section>
        </div>
      </main>
    </div>
  );
}