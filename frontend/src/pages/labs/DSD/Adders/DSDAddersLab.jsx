import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DSDAddersOverview from "./DSDAddersOverview";
import DSDAddersSimulation from "./DSDAddersSimulation";
import DSDAddersCircuits from "./DSDAddersCircuits";
import DSDAddersTruthTable from "./DSDAddersTruthTable";
import DSDAddersQuiz from "./DSDAddersQuiz";
import DSDAddersCoding from "./DSDAddersCoding";

function boolToBit(value) {
  return value ? 1 : 0;
}

export default function DSDAddersLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedAdder, setSelectedAdder] = useState("half");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const A = boolToBit(a);
    const B = boolToBit(b);
    const Cin = boolToBit(cin);

    const halfSum = A ^ B;
    const halfCarry = A & B;

    const fullSum = A ^ B ^ Cin;
    const fullCarry = (A & B) | (B & Cin) | (A & Cin);

    const adders = {
      half: {
        title: "Half Adder",
        sum: halfSum,
        carry: halfCarry,
        expressionSum: "A ⊕ B",
        expressionCarry: "A · B",
        note: "A Half Adder adds two input bits and produces Sum and Carry.",
        inputsRequired: 2
      },
      full: {
        title: "Full Adder",
        sum: fullSum,
        carry: fullCarry,
        expressionSum: "A ⊕ B ⊕ Cin",
        expressionCarry: "(A·B) + (B·Cin) + (A·Cin)",
        note: "A Full Adder adds A, B, and Carry-in to produce Sum and Carry-out.",
        inputsRequired: 3
      }
    };

    return {
      A,
      B,
      Cin,
      adders,
      selected: adders[selectedAdder],
      isHalfAdder: selectedAdder === "half"
    };
  }, [a, b, cin, selectedAdder]);

  return (
    <div className="lab-page">
      <h1>SimuLab: Half Adder and Full Adder</h1>

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
          {activeSection === "overview" && <DSDAddersOverview />}

          {activeSection === "simulation" && (
            <DSDAddersSimulation
              selectedAdder={selectedAdder}
              setSelectedAdder={setSelectedAdder}
              a={a}
              setA={setA}
              b={b}
              setB={setB}
              cin={cin}
              setCin={setCin}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DSDAddersCircuits
              selectedAdder={selectedAdder}
              analysis={analysis}
            />
          )}

          {activeSection === "truth table" && (
            <DSDAddersTruthTable
              selectedAdder={selectedAdder}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DSDAddersQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DSDAddersCoding />}
        </main>
      </div>
    </div>
  );
}