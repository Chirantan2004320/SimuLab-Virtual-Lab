import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSIRingOscillatorOverview from "./DVLSIRingOscillatorOverview";
import DVLSIRingOscillatorSimulation from "./DVLSIRingOscillatorSimulation";
import DVLSIRingOscillatorCircuits from "./DVLSIRingOscillatorCircuits";
import DVLSIRingOscillatorGraphs from "./DVLSIRingOscillatorGraphs";
import DVLSIRingOscillatorQuiz from "./DVLSIRingOscillatorQuiz";
import DVLSIRingOscillatorCoding from "./DVLSIRingOscillatorCoding";

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

export default function DVLSIRingOscillatorLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [stages, setStages] = useState(3);
  const [tpd, setTpd] = useState(1.0);
  const [vdd, setVdd] = useState(5.0);
  const [enabled, setEnabled] = useState(true);

  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const oddStages = stages % 2 === 1;
    const oscillates = enabled && oddStages;

    const period = oscillates ? 2 * stages * tpd : 0;
    const frequency = oscillates && period > 0 ? 1 / period : 0;

    let note = "";
    let logicCase = "";

    if (!enabled) {
      logicCase = "Disabled";
      note =
        "The ring oscillator is disabled, so the loop is inactive and no oscillation occurs.";
    } else if (!oddStages) {
      logicCase = "Even Number of Stages";
      note =
        "A ring oscillator requires an odd number of inverter stages. With an even number, the loop settles instead of oscillating.";
    } else {
      logicCase = "Oscillating";
      note =
        "The odd number of inversions and finite propagation delay cause the signal to keep toggling around the loop.";
    }

    return {
      oddStages,
      oscillates,
      period,
      frequency,
      logicCase,
      note
    };
  }, [stages, tpd, enabled]);

  return (
    <div className="lab-page">
      <h1>SimuLab: Ring Oscillator</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "circuits", "graphs", "quiz", "coding"].map((sec) => (
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
          {activeSection === "overview" && <DVLSIRingOscillatorOverview />}

          {activeSection === "simulation" && (
            <DVLSIRingOscillatorSimulation
              stages={stages}
              setStages={setStages}
              tpd={tpd}
              setTpd={setTpd}
              vdd={vdd}
              setVdd={setVdd}
              enabled={enabled}
              setEnabled={setEnabled}
              analysis={analysis}
              formatNumber={formatNumber}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DVLSIRingOscillatorCircuits
              stages={stages}
              enabled={enabled}
              analysis={analysis}
            />
          )}

          {activeSection === "graphs" && (
            <DVLSIRingOscillatorGraphs
              stages={stages}
              tpd={tpd}
              analysis={analysis}
              formatNumber={formatNumber}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSIRingOscillatorQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DVLSIRingOscillatorCoding />}
        </main>
      </div>
    </div>
  );
}