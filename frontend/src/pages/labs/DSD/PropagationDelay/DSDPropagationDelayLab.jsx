import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DSDPropagationDelayOverview from "./DSDPropagationDelayOverview";
import DSDPropagationDelaySimulation from "./DSDPropagationDelaySimulation";
import DSDPropagationDelayCircuits from "./DSDPropagationDelayCircuits";
import DSDPropagationDelayTruthTable from "./DSDPropagationDelayTruthTable";
import DSDPropagationDelayQuiz from "./DSDPropagationDelayQuiz";
import DSDPropagationDelayCoding from "./DSDPropagationDelayCoding";

function gateOutput(gate, input) {
  if (gate === "NOT") return input === 1 ? 0 : 1;
  if (gate === "BUFFER") return input;
  return input;
}

export default function DSDPropagationDelayLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedGate, setSelectedGate] = useState("NOT");
  const [inputBit, setInputBit] = useState(0);
  const [delayNs, setDelayNs] = useState(5);
  const [timeNs, setTimeNs] = useState(0);
  const [transitionCount, setTransitionCount] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const initialOutput = gateOutput(selectedGate, inputBit === 1 ? 0 : 1);
    const finalOutput = gateOutput(selectedGate, inputBit);

    const inputChangedAt = 0;
    const outputChangesAt = delayNs;

    let observedOutput = initialOutput;
    let state = "Waiting";

    if (timeNs >= outputChangesAt) {
      observedOutput = finalOutput;
      state = "Output Updated";
    }

    return {
      initialOutput,
      finalOutput,
      observedOutput,
      inputChangedAt,
      outputChangesAt,
      state,
      note:
        timeNs < delayNs
          ? `The output has not yet responded because the propagation delay of ${delayNs} ns has not elapsed.`
          : `The propagation delay has elapsed, so the output now reflects the new input.`
    };
  }, [selectedGate, inputBit, delayNs, timeNs]);

  const handleToggleInput = () => {
    setInputBit((prev) => (prev === 1 ? 0 : 1));
    setTimeNs(0);
    setTransitionCount((prev) => prev + 1);
    setExperimentRun(true);
  };

  const handleAdvanceTime = () => {
    setTimeNs((prev) => prev + 1);
    setExperimentRun(true);
  };

  const handleResetTime = () => {
    setTimeNs(0);
    setExperimentRun(true);
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Propagation Delay</h1>

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
          {activeSection === "overview" && <DSDPropagationDelayOverview />}

          {activeSection === "simulation" && (
            <DSDPropagationDelaySimulation
              selectedGate={selectedGate}
              setSelectedGate={setSelectedGate}
              inputBit={inputBit}
              delayNs={delayNs}
              setDelayNs={setDelayNs}
              timeNs={timeNs}
              analysis={analysis}
              transitionCount={transitionCount}
              handleToggleInput={handleToggleInput}
              handleAdvanceTime={handleAdvanceTime}
              handleResetTime={handleResetTime}
            />
          )}

          {activeSection === "circuits" && (
            <DSDPropagationDelayCircuits
              selectedGate={selectedGate}
              inputBit={inputBit}
              delayNs={delayNs}
              timeNs={timeNs}
              analysis={analysis}
            />
          )}

          {activeSection === "truth table" && (
            <DSDPropagationDelayTruthTable
              selectedGate={selectedGate}
              inputBit={inputBit}
              delayNs={delayNs}
              timeNs={timeNs}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DSDPropagationDelayQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DSDPropagationDelayCoding />}
        </main>
      </div>
    </div>
  );
}