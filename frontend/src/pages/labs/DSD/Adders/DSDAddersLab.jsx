import React, { useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  Table2,
  Brain,
  Code2,
  Binary,
  ChevronsLeft,
} from "lucide-react";

import DSDAddersOverview from "./DSDAddersOverview";
import DSDAddersSimulation from "./DSDAddersSimulation";
import DSDAddersCircuits from "./DSDAddersCircuits";
import DSDAddersTruthTable from "./DSDAddersTruthTable";
import DSDAddersQuiz from "./DSDAddersQuiz";
import DSDAddersCoding from "./DSDAddersCoding";

function boolToBit(value) {
  return value ? 1 : 0;
}

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "truth table", label: "Truth Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding", icon: Code2 },
];

export default function DSDAddersLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedAdder, setSelectedAdder] = useState("half");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);
  const [experimentRun, setExperimentRun] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const analysis = useMemo(() => {
    const A = boolToBit(a);
    const B = boolToBit(b);
    const Cin = boolToBit(cin);

    const halfSum = A ^ B;
    const halfCarry = A & B;

    const fullSum = A ^ B ^ Cin;
    const fullCarry = (A & B) | (B & Cin) | (A & Cin);

    const adders = {
      half: {
        key: "half",
        title: "Half Adder",
        family: "2-input combinational adder",
        sum: halfSum,
        carry: halfCarry,
        expressionSum: "A ⊕ B",
        expressionCarry: "A · B",
        note: "A Half Adder adds two input bits and produces Sum and Carry.",
        inputsRequired: 2,
        chip: "XOR + AND",
      },
      full: {
        key: "full",
        title: "Full Adder",
        family: "3-input combinational adder",
        sum: fullSum,
        carry: fullCarry,
        expressionSum: "A ⊕ B ⊕ Cin",
        expressionCarry: "(A·B) + (B·Cin) + (A·Cin)",
        note: "A Full Adder adds A, B, and Carry-in to produce Sum and Carry-out.",
        inputsRequired: 3,
        chip: "XOR + AND + OR",
      },
    };

    return {
      A,
      B,
      Cin,
      adders,
      selected: adders[selectedAdder],
      isHalfAdder: selectedAdder === "half",
    };
  }, [a, b, cin, selectedAdder]);

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 45
      : activeSection === "circuits"
      ? 60
      : activeSection === "truth table"
      ? 72
      : activeSection === "quiz"
      ? 85
      : 95;

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
                  {sidebarItems.find((i) => i.key === activeSection)?.label || "Half Adder / Full Adder"}
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
            <h1 className="er-page-title">Half Adder & Full Adder</h1>
            <p className="er-page-subtitle">
              Explore binary addition through interactive inputs, symbolic circuits,
              truth tables, quiz practice, and coding tasks. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Adder Configuration</h2>
              <p>Choose the adder type and inspect its current sum and carry behavior.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Binary size={18} />
              </div>
              <div>
                <strong>{analysis.selected.title}</strong>
                <span>{analysis.selected.family}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Selected Adder</label>
              <select
                value={selectedAdder}
                onChange={(e) => setSelectedAdder(e.target.value)}
                className="sorting-select"
              >
                <option value="half">Half Adder</option>
                <option value="full">Full Adder</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Current Output Summary</label>
              <div className="sorting-info-box" style={{ marginBottom: 0 }}>
                Sum = <strong>{analysis.selected.sum}</strong> &nbsp; | &nbsp; Carry ={" "}
                <strong>{analysis.selected.carry}</strong>
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button
              className={`er-chip ${selectedAdder === "half" ? "active" : ""}`}
              onClick={() => setSelectedAdder("half")}
            >
              Half Adder
            </button>
            <button
              className={`er-chip ${selectedAdder === "full" ? "active" : ""}`}
              onClick={() => setSelectedAdder("full")}
            >
              Full Adder
            </button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DSDAddersOverview selectedAdder={selectedAdder} analysis={analysis} />
            )}

            {activeSection === "simulation" && (
              <DSDAddersSimulation
                selectedAdder={selectedAdder}
                setSelectedAdder={setSelectedAdder}
                a={a}
                setA={setA}
                b={b}
                setB={setB}
                cin={cin}
                setCin={setCin}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DSDAddersCircuits selectedAdder={selectedAdder} analysis={analysis} />
            )}

            {activeSection === "truth table" && (
              <DSDAddersTruthTable selectedAdder={selectedAdder} analysis={analysis} />
            )}

            {activeSection === "quiz" && (
              <DSDAddersQuiz experimentRun={experimentRun} />
            )}

            {activeSection === "coding" && (
              <DSDAddersCoding selectedAdder={selectedAdder} analysis={analysis} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}