import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DSDLogicGatesOverview from "./DSDLogicGatesOverview";
import DSDLogicGatesSimulation from "./DSDLogicGatesSimulation";
import DSDLogicGatesCircuits from "./DSDLogicGatesCircuits";
import DSDLogicGatesTruthTable from "./DSDLogicGatesTruthTable";
import DSDLogicGatesQuiz from "./DSDLogicGatesQuiz";
import DSDLogicGatesCoding from "./DSDLogicGatesCoding";

function boolToBit(value) {
  return value ? 1 : 0;
}

export default function DSDLogicGatesLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [selectedGate, setSelectedGate] = useState("AND");
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const A = boolToBit(a);
    const B = boolToBit(b);

    const gates = {
      BUFFER: {
        output: A,
        expression: "Y = A",
        note: "BUFFER passes the input directly to the output.",
        inputsRequired: 1
      },
      NOT: {
        output: 1 - A,
        expression: "Y = ¬A",
        note: "NOT gate inverts the input.",
        inputsRequired: 1
      },
      AND: {
        output: A & B,
        expression: "Y = A · B",
        note: "AND gate gives 1 only when both inputs are 1.",
        inputsRequired: 2
      },
      OR: {
        output: A | B,
        expression: "Y = A + B",
        note: "OR gate gives 1 when at least one input is 1.",
        inputsRequired: 2
      },
      NAND: {
        output: 1 - (A & B),
        expression: "Y = ¬(A · B)",
        note: "NAND is the inverse of AND.",
        inputsRequired: 2
      },
      NOR: {
        output: 1 - (A | B),
        expression: "Y = ¬(A + B)",
        note: "NOR is the inverse of OR.",
        inputsRequired: 2
      },
      XOR: {
        output: A ^ B,
        expression: "Y = A ⊕ B",
        note: "XOR gives 1 only when the inputs are different.",
        inputsRequired: 2
      },
      XNOR: {
        output: 1 - (A ^ B),
        expression: "Y = ¬(A ⊕ B)",
        note: "XNOR gives 1 only when the inputs are equal.",
        inputsRequired: 2
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

  return (
    <div className="lab-page">
      <h1>SimuLab: Basic Logic Gates</h1>

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
          {activeSection === "overview" && <DSDLogicGatesOverview />}

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

          {activeSection === "truth table" && (
            <DSDLogicGatesTruthTable
              selectedGate={selectedGate}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DSDLogicGatesQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DSDLogicGatesCoding />}
        </main>
      </div>
    </div>
  );
}