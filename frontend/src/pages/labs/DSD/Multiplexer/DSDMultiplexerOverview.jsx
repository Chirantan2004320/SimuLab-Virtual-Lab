import React from "react";

export default function DSDMultiplexerOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the working of a 4-to-1 multiplexer by selecting one of several input
          lines using select signals and observing the output.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A multiplexer (MUX) is a combinational circuit that selects one input from many
          available input lines and forwards it to a single output line.
        </p>
        <p>
          A 4-to-1 multiplexer has four data inputs: I0, I1, I2, and I3, two select lines:
          S1 and S0, and one output Y.
        </p>
        <p>
          The select lines determine which input appears at the output:
        </p>
        <p>
          <strong>00 → I0</strong><br />
          <strong>01 → I1</strong><br />
          <strong>10 → I2</strong><br />
          <strong>11 → I3</strong>
        </p>
      </section>

      <section className="card">
        <h2>Boolean Expression</h2>
        <p>
          The output of a 4-to-1 multiplexer can be written as:
        </p>
        <p>
          <strong>
            Y = I0·S1̅·S0̅ + I1·S1̅·S0 + I2·S1·S0̅ + I3·S1·S0
          </strong>
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Toggle the data inputs I0, I1, I2, and I3.</li>
          <li>Set the select lines S1 and S0.</li>
          <li>Observe which input is selected.</li>
          <li>Verify that the output matches the selected input.</li>
          <li>Compare the result with the circuit diagram and truth table.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          Multiplexers are widely used in communication systems, data routing,
          CPU control logic, ALUs, and digital switching circuits.
        </p>
      </section>
    </div>
  );
}