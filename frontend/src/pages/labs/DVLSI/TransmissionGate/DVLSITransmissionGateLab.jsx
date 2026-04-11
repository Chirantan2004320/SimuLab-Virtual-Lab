import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSITransmissionGateOverview from "./DVLSITransmissionGateOverview";
import DVLSITransmissionGateSimulation from "./DVLSITransmissionGateSimulation";
import DVLSITransmissionGateCircuits from "./DVLSITransmissionGateCircuits";
import DVLSITransmissionGateQuiz from "./DVLSITransmissionGateQuiz";
import DVLSITransmissionGateCoding from "./DVLSITransmissionGateCoding";

export default function DVLSITransmissionGateLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [inputSignal, setInputSignal] = useState(0);
  const [control, setControl] = useState(0);
  const [mode, setMode] = useState("transmission-gate");
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const controlBar = control === 1 ? 0 : 1;

    let output = "Z";
    let pmosState = "OFF";
    let nmosState = "OFF";
    let note = "";
    let currentPath = "";
    let logicCase = "";

    if (mode === "transmission-gate") {
      nmosState = control === 1 ? "ON" : "OFF";
      pmosState = controlBar === 0 ? "ON" : "OFF";

      if (control === 1) {
        output = inputSignal;
        logicCase = "Switch Closed";
        currentPath = "Input ↔ Transmission Gate ↔ Output";
        note =
          "Both nMOS and pMOS are ON, so the transmission gate conducts and passes the input to the output.";
      } else {
        output = "Z";
        logicCase = "Switch Open";
        currentPath = "No conduction path";
        note =
          "Both transistors are OFF, so the transmission gate isolates the output from the input.";
      }
    } else {
      nmosState = control === 1 ? "ON" : "OFF";
      pmosState = "NOT USED";

      if (control === 1) {
        output = inputSignal;
        logicCase = "Single nMOS Pass ON";
        currentPath = "Input → nMOS → Output";
        note =
          inputSignal === 1
            ? "A single nMOS can pass logic 1 weakly and may suffer from threshold voltage drop."
            : "A single nMOS passes logic 0 strongly.";
      } else {
        output = "Z";
        logicCase = "Single nMOS Pass OFF";
        currentPath = "No conduction path";
        note =
          "The pass transistor is OFF, so the output is isolated from the input.";
      }
    }

    return {
      output,
      controlBar,
      pmosState,
      nmosState,
      note,
      currentPath,
      logicCase
    };
  }, [inputSignal, control, mode]);

  return (
    <div className="lab-page">
      <h1>SimuLab: Transmission Gate / Pass Transistor Logic</h1>

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
          {activeSection === "overview" && <DVLSITransmissionGateOverview />}

          {activeSection === "simulation" && (
            <DVLSITransmissionGateSimulation
              inputSignal={inputSignal}
              setInputSignal={setInputSignal}
              control={control}
              setControl={setControl}
              mode={mode}
              setMode={setMode}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DVLSITransmissionGateCircuits
              inputSignal={inputSignal}
              control={control}
              mode={mode}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSITransmissionGateQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DVLSITransmissionGateCoding />}
        </main>
      </div>
    </div>
  );
}