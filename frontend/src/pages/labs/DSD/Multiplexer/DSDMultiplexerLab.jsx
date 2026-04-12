import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DSDMultiplexerOverview from "./DSDMultiplexerOverview";
import DSDMultiplexerSimulation from "./DSDMultiplexerSimulation";
import DSDMultiplexerCircuits from "./DSDMultiplexerCircuits";
import DSDMultiplexerTruthTable from "./DSDMultiplexerTruthTable";
import DSDMultiplexerQuiz from "./DSDMultiplexerQuiz";
import DSDMultiplexerCoding from "./DSDMultiplexerCoding";

function bit(v) {
  return v ? 1 : 0;
}

export default function DSDMultiplexerLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [i0, setI0] = useState(false);
  const [i1, setI1] = useState(false);
  const [i2, setI2] = useState(false);
  const [i3, setI3] = useState(false);
  const [s0, setS0] = useState(false);
  const [s1, setS1] = useState(false);

  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const I0 = bit(i0);
    const I1 = bit(i1);
    const I2 = bit(i2);
    const I3 = bit(i3);
    const S0 = bit(s0);
    const S1 = bit(s1);

    const selectedIndex = S1 * 2 + S0;
    const inputs = [I0, I1, I2, I3];
    const output = inputs[selectedIndex];

    let note = "";
    if (selectedIndex === 0) note = "Since S1S0 = 00, input I0 is connected to the output.";
    if (selectedIndex === 1) note = "Since S1S0 = 01, input I1 is connected to the output.";
    if (selectedIndex === 2) note = "Since S1S0 = 10, input I2 is connected to the output.";
    if (selectedIndex === 3) note = "Since S1S0 = 11, input I3 is connected to the output.";

    return {
      I0,
      I1,
      I2,
      I3,
      S0,
      S1,
      selectedIndex,
      inputs,
      output,
      expression:
        "Y = I0·S1̅·S0̅ + I1·S1̅·S0 + I2·S1·S0̅ + I3·S1·S0",
      note
    };
  }, [i0, i1, i2, i3, s0, s1]);

  return (
    <div className="lab-page">
      <h1>SimuLab: Multiplexer</h1>

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
          {activeSection === "overview" && <DSDMultiplexerOverview />}

          {activeSection === "simulation" && (
            <DSDMultiplexerSimulation
              i0={i0}
              setI0={setI0}
              i1={i1}
              setI1={setI1}
              i2={i2}
              setI2={setI2}
              i3={i3}
              setI3={setI3}
              s0={s0}
              setS0={setS0}
              s1={s1}
              setS1={setS1}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DSDMultiplexerCircuits analysis={analysis} />
          )}

          {activeSection === "truth table" && (
            <DSDMultiplexerTruthTable analysis={analysis} />
          )}

          {activeSection === "quiz" && (
            <DSDMultiplexerQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DSDMultiplexerCoding />}
        </main>
      </div>
    </div>
  );
}