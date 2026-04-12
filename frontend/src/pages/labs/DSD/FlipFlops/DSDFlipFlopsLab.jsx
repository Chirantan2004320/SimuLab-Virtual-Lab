import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DSDFlipFlopsOverview from "./DSDFlipFlopsOverview";
import DSDFlipFlopsSimulation from "./DSDFlipFlopsSimulation";
import DSDFlipFlopsCircuits from "./DSDFlipFlopsCircuits";
import DSDFlipFlopsTruthTable from "./DSDFlipFlopsTruthTable";
import DSDFlipFlopsQuiz from "./DSDFlipFlopsQuiz";
import DSDFlipFlopsCoding from "./DSDFlipFlopsCoding";

export default function DSDFlipFlopsLab() {
  const [activeSection, setActiveSection] = useState("overview");
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
    let qBar = q === 1 ? 0 : 1;
    let note = "";
    let stateName = "";

    if (selectedType === "sr") {
      if (s === 0 && r === 0) {
        nextQ = q;
        stateName = "Hold";
        note = "SR latch keeps the previous state when S=0 and R=0.";
      } else if (s === 1 && r === 0) {
        nextQ = 1;
        stateName = "Set";
        note = "SR latch sets Q to 1 when S=1 and R=0.";
      } else if (s === 0 && r === 1) {
        nextQ = 0;
        stateName = "Reset";
        note = "SR latch resets Q to 0 when S=0 and R=1.";
      } else {
        nextQ = q;
        stateName = "Invalid";
        note = "S=1 and R=1 is invalid for a basic SR latch.";
      }
    }

    if (selectedType === "d") {
      if (clk === 1) {
        nextQ = d;
        stateName = "Clock Active";
        note = "When CLK=1, D Flip-Flop copies D to Q.";
      } else {
        nextQ = q;
        stateName = "Hold";
        note = "When CLK=0, D Flip-Flop holds the previous state.";
      }
    }

    if (selectedType === "jk") {
      if (clk === 1) {
        if (j === 0 && k === 0) {
          nextQ = q;
          stateName = "Hold";
          note = "JK Flip-Flop holds state for J=0 and K=0.";
        } else if (j === 1 && k === 0) {
          nextQ = 1;
          stateName = "Set";
          note = "JK Flip-Flop sets Q for J=1 and K=0.";
        } else if (j === 0 && k === 1) {
          nextQ = 0;
          stateName = "Reset";
          note = "JK Flip-Flop resets Q for J=0 and K=1.";
        } else {
          nextQ = q === 1 ? 0 : 1;
          stateName = "Toggle";
          note = "JK Flip-Flop toggles Q for J=1 and K=1.";
        }
      } else {
        nextQ = q;
        stateName = "Hold";
        note = "When CLK=0, JK Flip-Flop holds the previous state.";
      }
    }

    if (selectedType === "t") {
      if (clk === 1) {
        if (t === 0) {
          nextQ = q;
          stateName = "Hold";
          note = "T Flip-Flop holds state when T=0.";
        } else {
          nextQ = q === 1 ? 0 : 1;
          stateName = "Toggle";
          note = "T Flip-Flop toggles state when T=1 and CLK=1.";
        }
      } else {
        nextQ = q;
        stateName = "Hold";
        note = "When CLK=0, T Flip-Flop holds the previous state.";
      }
    }

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

  return (
    <div className="lab-page">
      <h1>SimuLab: Flip-Flops</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "circuits", "truth table", "quiz", "coding"].map((sec) => (
            <button
              key={sec}
              className={`sorting-sidebar-item ${activeSection === sec ? "active" : ""}`}
              onClick={() => setActiveSection(sec)}
            >
              {sec.toUpperCase()}
            </button>
          ))}
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && <DSDFlipFlopsOverview />}

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

          {activeSection === "coding" && <DSDFlipFlopsCoding />}
        </main>
      </div>
    </div>
  );
}