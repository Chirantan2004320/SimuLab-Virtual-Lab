import React, { useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  Table2,
  Brain,
  Code2,
  FlaskConical,
  ChevronsLeft
} from "lucide-react";

import DSDLogicGatesOverview from "./DSDLogicGatesOverview";
import DSDLogicGatesSimulation from "./DSDLogicGatesSimulation";
import DSDLogicGatesCircuits from "./DSDLogicGatesCircuits";
import DSDLogicGatesTruthTable from "./DSDLogicGatesTruthTable";
import DSDLogicGatesQuiz from "./DSDLogicGatesQuiz";
import DSDLogicGatesCoding from "./DSDLogicGatesCoding";

const simulabLogo = "/assets/logo.png";

function boolToBit(value) {
  return value ? 1 : 0;
}

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "truth", label: "Truth Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding", icon: Code2 }
];

export default function DSDLogicGatesLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [selectedGate, setSelectedGate] = useState("AND");
  const [experimentRun, setExperimentRun] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const analysis = useMemo(() => {
    const A = boolToBit(a);
    const B = boolToBit(b);

    const gates = {
      BUFFER: {
        output: A,
        expression: "Y = A",
        note: "BUFFER passes the input directly to the output.",
        inputsRequired: 1,
        category: "Single Input"
      },
      NOT: {
        output: 1 - A,
        expression: "Y = ¬A",
        note: "NOT gate inverts the input.",
        inputsRequired: 1,
        category: "Single Input"
      },
      AND: {
        output: A & B,
        expression: "Y = A · B",
        note: "AND gate gives 1 only when both inputs are 1.",
        inputsRequired: 2,
        category: "Basic Logic"
      },
      OR: {
        output: A | B,
        expression: "Y = A + B",
        note: "OR gate gives 1 when at least one input is 1.",
        inputsRequired: 2,
        category: "Basic Logic"
      },
      NAND: {
        output: 1 - (A & B),
        expression: "Y = ¬(A · B)",
        note: "NAND is the inverse of AND.",
        inputsRequired: 2,
        category: "Universal Gate"
      },
      NOR: {
        output: 1 - (A | B),
        expression: "Y = ¬(A + B)",
        note: "NOR is the inverse of OR.",
        inputsRequired: 2,
        category: "Universal Gate"
      },
      XOR: {
        output: A ^ B,
        expression: "Y = A ⊕ B",
        note: "XOR gives 1 only when the inputs are different.",
        inputsRequired: 2,
        category: "Exclusive Logic"
      },
      XNOR: {
        output: 1 - (A ^ B),
        expression: "Y = ¬(A ⊕ B)",
        note: "XNOR gives 1 only when the inputs are equal.",
        inputsRequired: 2,
        category: "Exclusive Logic"
      }
    };

    return {
      A,
      B,
      gates,
      selected: gates[selectedGate],
      isSingleInput: gates[selectedGate].inputsRequired === 1
    };
  }, [a, b, selectedGate]);

  const progressPercent =
    activeSection === "coding"
      ? 75
      : activeSection === "quiz"
      ? 68
      : experimentRun
      ? 55
      : 35;

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
                  {sidebarItems.find((i) => i.key === activeSection)?.label || "Logic Gates"}
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
            <h1 className="er-page-title">Basic Logic Gates</h1>
            <p className="er-page-subtitle">
              Learn digital gate behavior through simulation, symbolic circuits,
              truth tables, quiz practice, and logic coding.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Logic Gate Configuration</h2>
              <p>Select a gate and explore how its logic changes with the inputs.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <FlaskConical size={18} />
              </div>
              <div>
                <strong>{selectedGate}</strong>
                <span>{analysis.selected.expression}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Selected Gate</label>
              <select
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value)}
                className="sorting-select"
              >
                {Object.keys(analysis.gates).map((gate) => (
                  <option key={gate} value={gate}>
                    {gate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="sorting-label">Gate Category</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {analysis.selected.category}
              </div>
            </div>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DSDLogicGatesOverview
                selectedGate={selectedGate}
                analysis={analysis}
              />
            )}

            {activeSection === "simulation" && (
              <DSDLogicGatesSimulation
                a={a}
                setA={setA}
                b={b}
                setB={setB}
                selectedGate={selectedGate}
                setSelectedGate={setSelectedGate}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DSDLogicGatesCircuits
                selectedGate={selectedGate}
                analysis={analysis}
              />
            )}

            {activeSection === "truth" && (
              <DSDLogicGatesTruthTable
                selectedGate={selectedGate}
                analysis={analysis}
              />
            )}

            {activeSection === "quiz" && (
              <DSDLogicGatesQuiz experimentRun={experimentRun} />
            )}

            {activeSection === "coding" && (
              <DSDLogicGatesCoding selectedGate={selectedGate} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}