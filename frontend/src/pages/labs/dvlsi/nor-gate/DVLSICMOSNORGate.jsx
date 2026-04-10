import React, { useMemo, useState } from "react";
import ExperimentLayout from "../../../../components/experiments/ExperimentLayout";
import "../../../../styles/Lab.css";

function bit(v) {
  return v ? 1 : 0;
}

export default function DVLSICMOSNORGate() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);

  const A = bit(a);
  const B = bit(b);

  const analysis = useMemo(() => {
    const output = A || B ? 0 : 1;

    let pullUp = "";
    let pullDown = "";
    let note = "";

    if (A === 0 && B === 0) {
      pullUp = "pMOS pull-up network provides a path to VDD";
      pullDown = "nMOS pull-down network is OFF";
      note =
        "Both inputs are LOW, so both pMOS transistors conduct and the output is pulled HIGH.";
    } else if (A === 1 && B === 0) {
      pullUp = "One pMOS is OFF, so pull-up path is broken";
      pullDown = "At least one nMOS conducts to GND";
      note =
        "Since A is HIGH, the pull-down network conducts and the output is pulled LOW.";
    } else if (A === 0 && B === 1) {
      pullUp = "One pMOS is OFF, so pull-up path is broken";
      pullDown = "At least one nMOS conducts to GND";
      note =
        "Since B is HIGH, the pull-down network conducts and the output is pulled LOW.";
    } else {
      pullUp = "Both pMOS transistors are OFF";
      pullDown = "Both nMOS transistors conduct strongly to GND";
      note =
        "Both inputs are HIGH, so the output is strongly pulled LOW through the pull-down network.";
    }

    return { output, pullUp, pullDown, note };
  }, [A, B]);

  const aim = (
    <p>
      To study the operation of a 2-input CMOS NOR gate and understand how the
      pull-up and pull-down transistor networks determine the output.
    </p>
  );

  const theory = (
    <>
      <p>
        A CMOS NOR gate is built using complementary transistor networks:
        a pull-up network made of pMOS transistors and a pull-down network made
        of nMOS transistors.
      </p>
      <p>
        For a 2-input NOR gate, the output is HIGH only when both inputs are LOW.
        If either input is HIGH, the pull-down path conducts and the output becomes LOW.
      </p>
      <p>
        The Boolean expression for a 2-input NOR gate is:
        <strong> Y = ¬(A + B) </strong>
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Toggle the input values A and B.</li>
      <li>Observe the NOR output Y for each input combination.</li>
      <li>Read the pull-up and pull-down network explanation.</li>
      <li>Verify that the output is HIGH only when both inputs are LOW.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ minWidth: 150 }}>
          Input A:
          <button
            type="button"
            className="btn primary"
            onClick={() => setA((prev) => !prev)}
            style={{ marginTop: "0.5rem", minWidth: 80 }}
          >
            {A}
          </button>
        </label>

        <label className="lab-label" style={{ minWidth: 150 }}>
          Input B:
          <button
            type="button"
            className="btn primary"
            onClick={() => setB((prev) => !prev)}
            style={{ marginTop: "0.5rem", minWidth: 80 }}
          >
            {B}
          </button>
        </label>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>CMOS NOR Output</h3>
        <p style={{ marginTop: "0.5rem" }}>
          Current inputs: A = <span className="lab-output-value">{A}</span>, B = <span className="lab-output-value">{B}</span>
        </p>
        <p style={{ marginTop: "0.75rem" }}>
          Output Y = <span className="lab-output-value">{analysis.output}</span>
        </p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Network Interpretation</h3>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Pull-up network:</strong>{" "}
          <span className="lab-output-value">{analysis.pullUp}</span>
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Pull-down network:</strong>{" "}
          <span className="lab-output-value">{analysis.pullDown}</span>
        </p>
        <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>{analysis.note}</p>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <h3>Truth Table</h3>
        <table style={{ width: "100%", marginTop: "0.75rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#9ca3af" }}>
              <th style={{ padding: "0.35rem" }}>A</th>
              <th style={{ padding: "0.35rem" }}>B</th>
              <th style={{ padding: "0.35rem" }}>Y = NOR(A, B)</th>
            </tr>
          </thead>
          <tbody>
            {[
              [0, 0, 1],
              [0, 1, 0],
              [1, 0, 0],
              [1, 1, 0],
            ].map(([aVal, bVal, yVal], index) => (
              <tr key={index}>
                <td style={{ padding: "0.35rem" }}>{aVal}</td>
                <td style={{ padding: "0.35rem" }}>{bVal}</td>
                <td style={{ padding: "0.35rem" }}>
                  <span className="lab-output-value">{yVal}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const result = (
    <p>
      This experiment verifies the truth table and transistor-level behavior of
      a CMOS NOR gate. It shows how the complementary pull-up and pull-down
      networks work together to produce the NOR logic function.
    </p>
  );

  return (
    <ExperimentLayout
      title="DVLSI Experiment 5: CMOS NOR Gate"
      subtitle="Toggle two inputs and observe the output and transistor-network behavior of a CMOS NOR gate."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}