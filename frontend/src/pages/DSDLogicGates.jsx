import React, { useState } from "react";
import ExperimentLayout from "../components/experiments/ExperimentLayout";
import "./Lab.css";

function boolToBit(value) {
  return value ? 1 : 0;
}

export default function DSDLogicGates() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);

  const A = boolToBit(a);
  const B = boolToBit(b);

  const and = A & B;
  const or = A | B;
  const nand = 1 - (A & B);
  const nor = 1 - (A | B);
  const xor = A ^ B;
  const xnor = 1 - (A ^ B);

  const aim = (
    <p>
      To study the behavior of basic digital logic gates by interactively toggling binary inputs
      and observing the resulting outputs.
    </p>
  );

  const theory = (
    <>
      <p>
        Basic logic gates implement fundamental Boolean operations on binary inputs. Common gates
        include AND, OR, NAND, NOR, XOR, and XNOR. Each gate follows a specific truth table that
        defines its output for all possible input combinations.
      </p>
      <p>
        By toggling the binary inputs A and B, we can directly observe how each gate transforms the
        inputs into an output, reinforcing the connection between Boolean algebra and digital
        hardware behavior.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Use the buttons in the simulation section to toggle the binary inputs A and B between 0 and 1.</li>
      <li>Observe how the outputs of the AND, OR, NAND, NOR, XOR, and XNOR gates change.</li>
      <li>Compare the displayed outputs with the expected truth tables for each gate.</li>
      <li>Verify that the complement relationships hold (e.g., NAND is the inverse of AND, NOR is the inverse of OR).</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ minWidth: 160 }}>
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
        <label className="lab-label" style={{ minWidth: 160 }}>
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

      <div className="card" style={{ padding: "1rem", marginTop: "0.5rem" }}>
        <h3>Logic Gate Outputs</h3>
        <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
          Current inputs: A = {A}, B = {B}
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.75rem" }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: "0.9rem", color: "#9ca3af" }}>
              <th style={{ padding: "0.35rem 0.5rem" }}>Gate</th>
              <th style={{ padding: "0.35rem 0.5rem" }}>Expression</th>
              <th style={{ padding: "0.35rem 0.5rem" }}>Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.35rem 0.5rem" }}>AND</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>A · B</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>
                <span className="lab-output-value">{and}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem 0.5rem" }}>OR</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>A + B</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>
                <span className="lab-output-value">{or}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem 0.5rem" }}>NAND</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>¬(A · B)</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>
                <span className="lab-output-value">{nand}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem 0.5rem" }}>NOR</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>¬(A + B)</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>
                <span className="lab-output-value">{nor}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem 0.5rem" }}>XOR</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>A ⊕ B</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>
                <span className="lab-output-value">{xor}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem 0.5rem" }}>XNOR</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>¬(A ⊕ B)</td>
              <td style={{ padding: "0.35rem 0.5rem" }}>
                <span className="lab-output-value">{xnor}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const result = (
    <p>
      By interactively toggling the inputs and observing the outputs of different gates, students
      reinforce their understanding of Boolean logic and the fundamental building blocks of digital
      systems.
    </p>
  );

  return (
    <ExperimentLayout
      title="DSD Experiment 1: Basic Logic Gates"
      subtitle="Toggle binary inputs and observe how basic logic gates transform them."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}

