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
  Scale
} from "lucide-react";

import DSDComparatorOverview from "./DSDComparatorOverview";
import DSDComparatorSimulation from "./DSDComparatorSimulation";
import DSDComparatorCircuits from "./DSDComparatorCircuits";
import DSDComparatorTruthTable from "./DSDComparatorTruthTable";
import DSDComparatorQuiz from "./DSDComparatorQuiz";
import DSDComparatorCoding from "./DSDComparatorCoding";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "truth table", label: "Truth Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Design Practice", icon: FileCode2 }
];

export default function DSDComparatorLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const greater = a > b ? 1 : 0;
    const equal = a === b ? 1 : 0;
    const less = a < b ? 1 : 0;

    if (greater) {
      return {
        greater,
        equal,
        less,
        relation: "A > B",
        activeOutput: "Greater",
        note: "Since A is greater than B, the A > B output becomes active.",
        expressions: {
          greater: "A · B̅",
          equal: "A̅B̅ + AB",
          less: "A̅ · B"
        }
      };
    }

    if (equal) {
      return {
        greater,
        equal,
        less,
        relation: "A = B",
        activeOutput: "Equal",
        note: "Since both inputs are equal, only the equality output becomes active.",
        expressions: {
          greater: "A · B̅",
          equal: "A̅B̅ + AB",
          less: "A̅ · B"
        }
      };
    }

    return {
      greater,
      equal,
      less,
      relation: "A < B",
      activeOutput: "Less",
      note: "Since A is less than B, the A < B output becomes active.",
      expressions: {
        greater: "A · B̅",
        equal: "A̅B̅ + AB",
        less: "A̅ · B"
      }
    };
  }, [a, b]);

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
      ? 86
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
                  {sidebarItems.find((i) => i.key === activeSection)?.label || "Comparator"}
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
            <h1 className="er-page-title">Comparator</h1>
            <p className="er-page-subtitle">
              Compare two 1-bit binary inputs and observe greater-than, equal-to, and less-than outputs. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Comparator Configuration</h2>
              <p>Toggle A and B to see which comparison output becomes active.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Scale size={18} />
              </div>
              <div>
                <strong>1-bit Comparator</strong>
                <span>Three outputs: A &gt; B, A = B, and A &lt; B.</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Current Inputs</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                A = {a}, B = {b}
              </div>
            </div>

            <div>
              <label className="sorting-label">Active Relation</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {analysis.relation}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active" onClick={() => setA(a ^ 1)}>A = {a}</button>
            <button className="er-chip active" onClick={() => setB(b ^ 1)}>B = {b}</button>
            <button className="er-chip active">A &gt; B = {analysis.greater}</button>
            <button className="er-chip active">A = B = {analysis.equal}</button>
            <button className="er-chip active">A &lt; B = {analysis.less}</button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <DSDComparatorOverview analysis={analysis} />}

            {activeSection === "simulation" && (
              <DSDComparatorSimulation
                a={a}
                setA={setA}
                b={b}
                setB={setB}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DSDComparatorCircuits a={a} b={b} analysis={analysis} />
            )}

            {activeSection === "truth table" && (
              <DSDComparatorTruthTable a={a} b={b} analysis={analysis} />
            )}

            {activeSection === "quiz" && (
              <DSDComparatorQuiz experimentRun={experimentRun} />
            )}

            {activeSection === "coding" && (
              <DSDComparatorCoding a={a} b={b} analysis={analysis} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}