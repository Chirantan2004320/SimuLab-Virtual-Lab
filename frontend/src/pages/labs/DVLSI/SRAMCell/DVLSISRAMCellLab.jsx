import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSISRAMCellOverview from "./DVLSISRAMCellOverview";
import DVLSISRAMCellSimulation from "./DVLSISRAMCellSimulation";
import DVLSISRAMCellCircuits from "./DVLSISRAMCellCircuits";
import DVLSISRAMCellQuiz from "./DVLSISRAMCellQuiz";
import DVLSISRAMCellCoding from "./DVLSISRAMCellCoding";

export default function DVLSISRAMCellLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [storedBit, setStoredBit] = useState(0);
  const [bitline, setBitline] = useState(1);
  const [bitlineBar, setBitlineBar] = useState(0);
  const [wordline, setWordline] = useState(0);
  const [operation, setOperation] = useState("hold");
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    let q = storedBit;
    let qBar = storedBit === 1 ? 0 : 1;
    let note = "";
    let logicCase = "";
    let accessLeft = "OFF";
    let accessRight = "OFF";

    if (wordline === 1) {
      accessLeft = "ON";
      accessRight = "ON";
    }

    if (operation === "hold") {
      logicCase = "Hold State";
      note =
        "The cross-coupled inverters maintain the stored value as long as power is present.";
    } else if (operation === "write") {
      if (wordline === 1) {
        q = bitline;
        qBar = bitlineBar;
        logicCase = "Write Enabled";
        note =
          "With wordline enabled, the bitline pair forces the SRAM cell into a new stable state.";
      } else {
        logicCase = "Write Requested but Wordline OFF";
        note =
          "Write cannot occur because the access transistors are OFF and the cell is isolated from the bitlines.";
      }
    } else if (operation === "read") {
      logicCase = wordline === 1 ? "Read Enabled" : "Read Requested but Wordline OFF";
      note =
        wordline === 1
          ? "With wordline enabled, the internal nodes connect to the bitlines so the stored value can be sensed."
          : "Read cannot occur because the access transistors are OFF.";
    }

    return {
      q,
      qBar,
      logicCase,
      note,
      accessLeft,
      accessRight,
      readableValue: q
    };
  }, [storedBit, bitline, bitlineBar, wordline, operation]);

  return (
    <div className="lab-page">
      <h1>SimuLab: SRAM Cell Basics</h1>

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
          {activeSection === "overview" && <DVLSISRAMCellOverview />}

          {activeSection === "simulation" && (
            <DVLSISRAMCellSimulation
              storedBit={storedBit}
              setStoredBit={setStoredBit}
              bitline={bitline}
              setBitline={setBitline}
              bitlineBar={bitlineBar}
              setBitlineBar={setBitlineBar}
              wordline={wordline}
              setWordline={setWordline}
              operation={operation}
              setOperation={setOperation}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DVLSISRAMCellCircuits
              bitline={bitline}
              bitlineBar={bitlineBar}
              wordline={wordline}
              operation={operation}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSISRAMCellQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DVLSISRAMCellCoding />}
        </main>
      </div>
    </div>
  );
}