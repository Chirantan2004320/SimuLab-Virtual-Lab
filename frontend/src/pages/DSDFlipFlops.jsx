import React, { useState } from "react";
import ExperimentLayout from "../components/experiments/ExperimentLayout";
import "./Lab.css";

function bit(v) {
  return v ? 1 : 0;
}

export default function DSDFlipFlops() {
  const [s, setS] = useState(false);
  const [r, setR] = useState(false);
  const [d, setD] = useState(false);
  const [j, setJ] = useState(false);
  const [k, setK] = useState(false);

  const [qSR, setQSR] = useState(0);
  const [qD, setQD] = useState(0);
  const [qJK, setQJK] = useState(0);

  const S = bit(s);
  const R = bit(r);
  const D = bit(d);
  const J = bit(j);
  const K = bit(k);

  const pulseClock = () => {
    // SR Flip-Flop
    if (S === 0 && R === 0) {
      setQSR((prev) => prev);
    } else if (S === 0 && R === 1) {
      setQSR(0);
    } else if (S === 1 && R === 0) {
      setQSR(1);
    } else {
      // Invalid/forbidden state for basic SR
      setQSR("X");
    }

    // D Flip-Flop
    setQD(D);

    // JK Flip-Flop
    setQJK((prev) => {
      if (J === 0 && K === 0) return prev;
      if (J === 0 && K === 1) return 0;
      if (J === 1 && K === 0) return 1;
      return prev === 1 ? 0 : 1;
    });
  };

  const aim = (
    <p>
      To study the behavior of basic sequential circuits by simulating SR, D,
      and JK flip-flops using input toggles and clock pulses.
    </p>
  );

  const theory = (
    <>
      <p>
        Flip-flops are bistable sequential circuits that store one bit of data.
        Their outputs depend not only on the current inputs, but also on the
        previous state.
      </p>
      <p>
        <strong>SR Flip-Flop:</strong> Uses Set (S) and Reset (R) inputs to control
        the output state.
      </p>
      <p>
        <strong>D Flip-Flop:</strong> Stores the value of the D input at the clock edge.
      </p>
      <p>
        <strong>JK Flip-Flop:</strong> A refinement of SR flip-flop where J and K inputs
        remove the invalid condition and allow toggling.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Toggle the input values for SR, D, and JK flip-flops.</li>
      <li>Click the <strong>Clock Pulse</strong> button.</li>
      <li>Observe how the output Q changes for each flip-flop.</li>
      <li>Repeat with different input combinations to verify the truth tables.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        {[
          ["S", S, setS],
          ["R", R, setR],
          ["D", D, setD],
          ["J", J, setJ],
          ["K", K, setK],
        ].map(([label, value, setter]) => (
          <label key={label} className="lab-label" style={{ minWidth: 120 }}>
            {label}:
            <button
              type="button"
              className="btn primary"
              onClick={() => setter((prev) => !prev)}
              style={{ marginTop: "0.5rem", minWidth: 80 }}
            >
              {value}
            </button>
          </label>
        ))}
      </div>

      <button
        type="button"
        className="btn primary"
        onClick={pulseClock}
        style={{ marginBottom: "1rem" }}
      >
        Clock Pulse
      </button>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Current Inputs</h3>
        <p style={{ marginTop: "0.5rem", color: "#9ca3af" }}>
          SR: S = {S}, R = {R}
        </p>
        <p style={{ color: "#9ca3af" }}>
          D: D = {D}
        </p>
        <p style={{ color: "#9ca3af" }}>
          JK: J = {J}, K = {K}
        </p>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <h3>Flip-Flop Outputs</h3>
        <table style={{ width: "100%", marginTop: "0.75rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#9ca3af" }}>
              <th style={{ padding: "0.35rem" }}>Flip-Flop</th>
              <th style={{ padding: "0.35rem" }}>Q</th>
              <th style={{ padding: "0.35rem" }}>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.35rem" }}>SR</td>
              <td style={{ padding: "0.35rem" }}>
                <span className="lab-output-value">{qSR}</span>
              </td>
              <td style={{ padding: "0.35rem" }}>
                {S === 1 && R === 1 ? "Invalid state" : "Stored output after pulse"}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem" }}>D</td>
              <td style={{ padding: "0.35rem" }}>
                <span className="lab-output-value">{qD}</span>
              </td>
              <td style={{ padding: "0.35rem" }}>Q follows D on clock pulse</td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem" }}>JK</td>
              <td style={{ padding: "0.35rem" }}>
                <span className="lab-output-value">{qJK}</span>
              </td>
              <td style={{ padding: "0.35rem" }}>
                {J === 1 && K === 1 ? "Toggle mode" : "Stored output after pulse"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const result = (
    <p>
      By applying clock pulses and changing inputs, the characteristic behavior
      of SR, D, and JK flip-flops can be observed. This demonstrates how
      sequential circuits store and update binary information.
    </p>
  );

  return (
    <ExperimentLayout
      title="DSD Experiment 4: Flip-Flops"
      subtitle="Toggle inputs and apply clock pulses to observe the behavior of SR, D, and JK flip-flops."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}