import React, { useState } from "react";
import ExperimentLayout from "../../../../components/experiments/ExperimentLayout";
import "../../../../styles/Lab.css";

function bit(v) {
  return v ? 1 : 0;
}

export default function DSDMultiplexer() {
  const [i0, setI0] = useState(false);
  const [i1, setI1] = useState(false);
  const [i2, setI2] = useState(false);
  const [i3, setI3] = useState(false);
  const [s0, setS0] = useState(false);
  const [s1, setS1] = useState(false);

  const I0 = bit(i0);
  const I1 = bit(i1);
  const I2 = bit(i2);
  const I3 = bit(i3);
  const S0 = bit(s0);
  const S1 = bit(s1);

  const selectedIndex = S1 * 2 + S0;
  const inputs = [I0, I1, I2, I3];
  const output = inputs[selectedIndex];

  const aim = (
    <p>
      To study the working of a 4-to-1 multiplexer by selecting one of several
      input lines using select signals and observing the output.
    </p>
  );

  const theory = (
    <>
      <p>
        A multiplexer (MUX) is a combinational circuit that selects one of many
        input lines and forwards it to a single output line.
      </p>
      <p>
        In a 4-to-1 multiplexer, there are four data inputs (I0, I1, I2, I3),
        two select lines (S1, S0), and one output Y.
      </p>
      <p>
        The select lines determine which input appears at the output:
      </p>
      <p>
        00 → I0, 01 → I1, 10 → I2, 11 → I3
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Toggle the four input lines I0, I1, I2, and I3.</li>
      <li>Toggle the select lines S1 and S0.</li>
      <li>Observe which input is selected based on the select-line combination.</li>
      <li>Verify that the output Y matches the selected input.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        {[
          ["I0", I0, setI0],
          ["I1", I1, setI1],
          ["I2", I2, setI2],
          ["I3", I3, setI3],
          ["S0", S0, setS0],
          ["S1", S1, setS1],
        ].map(([label, value, setter]) => (
          <label key={label} className="lab-label" style={{ minWidth: 130 }}>
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

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Current Selection</h3>
        <p style={{ marginTop: "0.5rem", color: "#9ca3af" }}>
          Select lines: S1 = {S1}, S0 = {S0}
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Selected input: <span className="lab-output-value">I{selectedIndex}</span>
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Output Y: <span className="lab-output-value">{output}</span>
        </p>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <h3>Input Summary</h3>
        <table style={{ width: "100%", marginTop: "0.75rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#9ca3af" }}>
              <th style={{ padding: "0.35rem" }}>Input</th>
              <th style={{ padding: "0.35rem" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["I0", I0],
              ["I1", I1],
              ["I2", I2],
              ["I3", I3],
            ].map(([name, value]) => (
              <tr key={name}>
                <td style={{ padding: "0.35rem" }}>{name}</td>
                <td style={{ padding: "0.35rem" }}>
                  <span className="lab-output-value">{value}</span>
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
      By changing the select lines and observing the output, the operation of a
      4-to-1 multiplexer is verified. The experiment shows how multiplexers are
      used to route one of many input signals to a single output.
    </p>
  );

  return (
    <ExperimentLayout
      title="DSD Experiment 3: Multiplexer"
      subtitle="Toggle input and select lines to observe how a 4-to-1 multiplexer chooses one input at the output."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}