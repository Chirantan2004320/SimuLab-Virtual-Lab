import React, { useState } from "react";
import ExperimentLayout from "../components/experiments/ExperimentLayout";
import "./Lab.css";

function boolToBit(value) {
  return value ? 1 : 0;
}

export default function DSDAdders() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);

  const A = boolToBit(a);
  const B = boolToBit(b);
  const Cin = boolToBit(cin);

  // Half Adder
  const halfSum = A ^ B;
  const halfCarry = A & B;

  // Full Adder
  const fullSum = A ^ B ^ Cin;
  const fullCarry = (A & B) | (B & Cin) | (A & Cin);

  const aim = (
    <p>
      To study the working of Half Adder and Full Adder circuits by toggling
      binary inputs and observing the resulting Sum and Carry outputs.
    </p>
  );

  const theory = (
    <>
      <p>
        An adder is a digital circuit used to perform binary addition.
        Two common adder circuits are the Half Adder and the Full Adder.
      </p>

      <p>
        <strong>Half Adder:</strong>  
        A Half Adder adds two binary inputs A and B and produces two outputs:
        Sum and Carry.
      </p>

      <p>
        Sum = A ⊕ B  
        Carry = A · B
      </p>

      <p>
        <strong>Full Adder:</strong>  
        A Full Adder adds three binary inputs A, B, and Carry-in (Cin) and
        produces Sum and Carry-out.
      </p>

      <p>
        Sum = A ⊕ B ⊕ Cin  
        Carry = (A·B) + (B·Cin) + (A·Cin)
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Toggle the binary inputs A, B, and Cin using the buttons.</li>
      <li>Observe the outputs of the Half Adder (Sum and Carry).</li>
      <li>Observe the outputs of the Full Adder (Sum and Carry).</li>
      <li>Compare the outputs with the expected truth table results.</li>
    </ol>
  );

  const simulation = (
    <>
      {/* Inputs */}
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ minWidth: 150 }}>
          Input A:
          <button
            className="btn primary"
            style={{ marginTop: "0.5rem", minWidth: 80 }}
            onClick={() => setA((prev) => !prev)}
          >
            {A}
          </button>
        </label>

        <label className="lab-label" style={{ minWidth: 150 }}>
          Input B:
          <button
            className="btn primary"
            style={{ marginTop: "0.5rem", minWidth: 80 }}
            onClick={() => setB((prev) => !prev)}
          >
            {B}
          </button>
        </label>

        <label className="lab-label" style={{ minWidth: 150 }}>
          Carry In (Cin):
          <button
            className="btn primary"
            style={{ marginTop: "0.5rem", minWidth: 80 }}
            onClick={() => setCin((prev) => !prev)}
          >
            {Cin}
          </button>
        </label>
      </div>

      {/* Half Adder */}
      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Half Adder Output</h3>
        <p style={{ marginTop: "0.5rem", color: "#9ca3af" }}>
          Inputs: A = {A}, B = {B}
        </p>

        <table style={{ width: "100%", marginTop: "0.75rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#9ca3af" }}>
              <th style={{ padding: "0.35rem" }}>Output</th>
              <th style={{ padding: "0.35rem" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.35rem" }}>Sum (A ⊕ B)</td>
              <td style={{ padding: "0.35rem" }}>
                <span className="lab-output-value">{halfSum}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem" }}>Carry (A · B)</td>
              <td style={{ padding: "0.35rem" }}>
                <span className="lab-output-value">{halfCarry}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Full Adder */}
      <div className="card" style={{ padding: "1rem" }}>
        <h3>Full Adder Output</h3>

        <p style={{ marginTop: "0.5rem", color: "#9ca3af" }}>
          Inputs: A = {A}, B = {B}, Cin = {Cin}
        </p>

        <table style={{ width: "100%", marginTop: "0.75rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#9ca3af" }}>
              <th style={{ padding: "0.35rem" }}>Output</th>
              <th style={{ padding: "0.35rem" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.35rem" }}>Sum (A ⊕ B ⊕ Cin)</td>
              <td style={{ padding: "0.35rem" }}>
                <span className="lab-output-value">{fullSum}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem" }}>Carry Out</td>
              <td style={{ padding: "0.35rem" }}>
                <span className="lab-output-value">{fullCarry}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const result = (
    <p>
      By toggling inputs and observing outputs, the behavior of Half Adder
      and Full Adder circuits can be verified. These circuits form the
      fundamental building blocks of digital arithmetic units used in
      processors and digital systems.
    </p>
  );

  return (
    <ExperimentLayout
      title="DSD Experiment 2: Half Adder and Full Adder"
      subtitle="Toggle binary inputs and observe how Half Adder and Full Adder circuits perform binary addition."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}