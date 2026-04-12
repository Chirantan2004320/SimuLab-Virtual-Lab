import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DSDComparatorOverview from "./DSDComparatorOverview";
import DSDComparatorSimulation from "./DSDComparatorSimulation";
import DSDComparatorCircuits from "./DSDComparatorCircuits";
import DSDComparatorTruthTable from "./DSDComparatorTruthTable";
import DSDComparatorQuiz from "./DSDComparatorQuiz";
import DSDComparatorCoding from "./DSDComparatorCoding";

export default function DSDComparatorLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const greater = a > b ? 1 : 0;
    const equal = a === b ? 1 : 0;
    const less = a < b ? 1 : 0;

    let relation = "";
    let note = "";

    if (greater) {
      relation = "A > B";
      note = "Since A is greater than B, the A > B output becomes active.";
    } else if (equal) {
      relation = "A = B";
      note = "Since both inputs are equal, only the equality output becomes active.";
    } else {
      relation = "A < B";
      note = "Since A is less than B, the A < B output becomes active.";
    }

    return {
      greater,
      equal,
      less,
      relation,
      note
    };
  }, [a, b]);

  return (
    <div className="lab-page">
      <h1>SimuLab: Comparator</h1>

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
          {activeSection === "overview" && <DSDComparatorOverview />}

          {activeSection === "simulation" && (
            <DSDComparatorSimulation
              a={a}
              setA={setA}
              b={b}
              setB={setB}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DSDComparatorCircuits
              a={a}
              b={b}
              analysis={analysis}
            />
          )}

          {activeSection === "truth table" && (
            <DSDComparatorTruthTable
              a={a}
              b={b}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DSDComparatorQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DSDComparatorCoding />}
        </main>
      </div>
    </div>
  );
}