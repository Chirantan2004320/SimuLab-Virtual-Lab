import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DSDDecoderEncoderOverview from "./DSDDecoderEncoderOverview";
import DSDDecoderEncoderSimulation from "./DSDDecoderEncoderSimulation";
import DSDDecoderEncoderCircuits from "./DSDDecoderEncoderCircuits";
import DSDDecoderEncoderTruthTable from "./DSDDecoderEncoderTruthTable";
import DSDDecoderEncoderQuiz from "./DSDDecoderEncoderQuiz";
import DSDDecoderEncoderCoding from "./DSDDecoderEncoderCoding";

export default function DSDDecoderEncoderLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mode, setMode] = useState("decoder");

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [inputs, setInputs] = useState([1, 0, 0, 0]);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    if (mode === "decoder") {
      const index = a * 2 + b;
      const outputs = [0, 0, 0, 0];
      outputs[index] = 1;

      return {
        index,
        outputs,
        binary: `${a}${b}`,
        note: `For input AB = ${a}${b}, only output Y${index} becomes active.`
      };
    }

    const index = inputs.findIndex((v) => v === 1);
    const safeIndex = index === -1 ? 0 : index;
    const binary = safeIndex.toString(2).padStart(2, "0");

    return {
      index,
      binary,
      outputs: [],
      note:
        index === -1
          ? "No input line is active. A standard encoder expects one active input line."
          : `Active input I${index} is converted into binary output ${binary}.`
    };
  }, [mode, a, b, inputs]);

  return (
    <div className="lab-page">
      <h1>SimuLab: Decoder & Encoder</h1>

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
          {activeSection === "overview" && <DSDDecoderEncoderOverview />}

          {activeSection === "simulation" && (
            <DSDDecoderEncoderSimulation
              mode={mode}
              setMode={setMode}
              a={a}
              setA={setA}
              b={b}
              setB={setB}
              inputs={inputs}
              setInputs={setInputs}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "circuits" && (
            <DSDDecoderEncoderCircuits
              mode={mode}
              a={a}
              b={b}
              inputs={inputs}
              analysis={analysis}
            />
          )}

          {activeSection === "truth table" && (
            <DSDDecoderEncoderTruthTable
              mode={mode}
              a={a}
              b={b}
              inputs={inputs}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DSDDecoderEncoderQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DSDDecoderEncoderCoding />}
        </main>
      </div>
    </div>
  );
}