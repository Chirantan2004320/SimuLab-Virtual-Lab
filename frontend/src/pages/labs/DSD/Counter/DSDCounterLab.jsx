import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DSDCounterOverview from "./DSDCounterOverview";
import DSDCounterSimulation from "./DSDCounterSimulation";
import DSDCounterCircuits from "./DSDCounterCircuits";
import DSDCounterTruthTable from "./DSDCounterTruthTable";
import DSDCounterQuiz from "./DSDCounterQuiz";
import DSDCounterCoding from "./DSDCounterCoding";

export default function DSDCounterLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [count, setCount] = useState(0);
  const [clockPulses, setClockPulses] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const q1 = Math.floor(count / 2);
    const q0 = count % 2;
    const binary = `${q1}${q0}`;
    const nextCount = (count + 1) % 4;
    const nextQ1 = Math.floor(nextCount / 2);
    const nextQ0 = nextCount % 2;
    const nextBinary = `${nextQ1}${nextQ0}`;

    return {
      q1,
      q0,
      binary,
      nextCount,
      nextBinary,
      note: `After the next clock pulse, the counter will move from ${binary} to ${nextBinary}.`
    };
  }, [count]);

  const handleClockPulse = () => {
    setCount((prev) => (prev + 1) % 4);
    setClockPulses((prev) => prev + 1);
    setExperimentRun(true);
  };

  const handleReset = () => {
    setCount(0);
    setClockPulses(0);
    setExperimentRun(true);
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Counter</h1>

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
          {activeSection === "overview" && <DSDCounterOverview />}

          {activeSection === "simulation" && (
            <DSDCounterSimulation
              count={count}
              clockPulses={clockPulses}
              analysis={analysis}
              handleClockPulse={handleClockPulse}
              handleReset={handleReset}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DSDCounterCircuits
              count={count}
              clockPulses={clockPulses}
              analysis={analysis}
            />
          )}

          {activeSection === "truth table" && (
            <DSDCounterTruthTable
              count={count}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DSDCounterQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DSDCounterCoding />}
        </main>
      </div>
    </div>
  );
}