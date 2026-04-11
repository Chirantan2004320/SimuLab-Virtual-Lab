import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSICMOSNANDOverview from "./DVLSICMOSNANDGateOverview.jsx";
import DVLSICMOSNANDSimulation from "./DVLSICMOSNANDGateSimulation.jsx";
import DVLSICMOSNANDCircuits from "./DVLSICMOSNANDGateCircuits.jsx";
import DVLSICMOSNANDQuiz from "./DVLSICMOSNANDGateQuiz.jsx";
import DVLSICMOSNANDCoding from "./DVLSICMOSNANDGateCoding.jsx";

export default function DVLSICMOSNANDGateLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const output = !(A && B) ? 1 : 0;

    const pmosA = A === 0 ? "ON" : "OFF";
    const pmosB = B === 0 ? "ON" : "OFF";
    const nmosA = A === 1 ? "ON" : "OFF";
    const nmosB = B === 1 ? "ON" : "OFF";

    let note = "";
    let currentPath = "";
    let logicCase = "";

    if (output === 1 && A === 0 && B === 0) {
      logicCase = "Both inputs LOW";
      currentPath = "VDD → pMOS A or pMOS B → Output";
      note =
        "Both pMOS transistors are ON and both nMOS transistors are OFF, so the output is pulled HIGH.";
    } else if (output === 1 && A === 0 && B === 1) {
      logicCase = "A LOW, B HIGH";
      currentPath = "VDD → pMOS A → Output";
      note =
        "pMOS A provides a pull-up path to VDD, while the nMOS series path is broken, so the output stays HIGH.";
    } else if (output === 1 && A === 1 && B === 0) {
      logicCase = "A HIGH, B LOW";
      currentPath = "VDD → pMOS B → Output";
      note =
        "pMOS B provides a pull-up path to VDD, while the nMOS series path is broken, so the output stays HIGH.";
    } else {
      logicCase = "Both inputs HIGH";
      currentPath = "Output → nMOS A → nMOS B → GND";
      note =
        "Both nMOS transistors are ON in series, creating a pull-down path to ground, so the output becomes LOW.";
    }

    return {
      output,
      pmosA,
      pmosB,
      nmosA,
      nmosB,
      currentPath,
      logicCase,
      note
    };
  }, [A, B]);

  return (
    <div className="lab-page">
      <h1>SimuLab: CMOS NAND Gate</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "circuits", "quiz", "coding"].map((sec) => (
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
          {activeSection === "overview" && <DVLSICMOSNANDOverview />}

          {activeSection === "simulation" && (
            <DVLSICMOSNANDSimulation
              A={A}
              setA={setA}
              B={B}
              setB={setB}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DVLSICMOSNANDCircuits
              A={A}
              B={B}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSICMOSNANDQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DVLSICMOSNANDCoding />}
        </main>
      </div>
    </div>
  );
}