import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSICMOSNOROverview from "./DVLSICMOSNORGateOverview.jsx";
import DVLSICMOSNORSimulation from "./DVLSICMOSNORGateSimulation.jsx";
import DVLSICMOSNORCircuits from "./DVLSICMOSNORGateCircuits.jsx";
import DVLSICMOSNORQuiz from "./DVLSICMOSNORGateQuiz.jsx";
import DVLSICMOSNORCoding from "./DVLSICMOSNORGateCoding.jsx";

export default function DVLSICMOSNORGateLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const output = !(A || B) ? 1 : 0;

    const pmosA = A === 0 ? "ON" : "OFF";
    const pmosB = B === 0 ? "ON" : "OFF";
    const nmosA = A === 1 ? "ON" : "OFF";
    const nmosB = B === 1 ? "ON" : "OFF";

    let note = "";
    let currentPath = "";
    let logicCase = "";

    if (output === 1) {
      logicCase = "Both inputs LOW";
      currentPath = "VDD → pMOS A → pMOS B → Output";
      note =
        "Both pMOS transistors are ON and both nMOS transistors are OFF, so the output is pulled HIGH.";
    } else if (A === 1 && B === 0) {
      logicCase = "A HIGH, B LOW";
      currentPath = "Output → nMOS A → GND";
      note =
        "nMOS A provides a pull-down path to ground, so the output becomes LOW.";
    } else if (A === 0 && B === 1) {
      logicCase = "A LOW, B HIGH";
      currentPath = "Output → nMOS B → GND";
      note =
        "nMOS B provides a pull-down path to ground, so the output becomes LOW.";
    } else {
      logicCase = "Both inputs HIGH";
      currentPath = "Output → nMOS A or nMOS B → GND";
      note =
        "Both nMOS transistors are ON and the pull-up path is broken, so the output is LOW.";
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
      <h1>SimuLab: CMOS NOR Gate</h1>

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
          {activeSection === "overview" && <DVLSICMOSNOROverview />}

          {activeSection === "simulation" && (
            <DVLSICMOSNORSimulation
              A={A}
              setA={setA}
              B={B}
              setB={setB}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DVLSICMOSNORCircuits
              A={A}
              B={B}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSICMOSNORQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DVLSICMOSNORCoding />}
        </main>
      </div>
    </div>
  );
}