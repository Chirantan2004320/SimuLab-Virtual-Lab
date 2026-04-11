import React from "react";

export default function DVLSITransmissionGateOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the operation of a transmission gate and compare it with single
          pass transistor logic for signal transmission in digital VLSI circuits.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A transmission gate is formed by connecting one nMOS transistor and one pMOS
          transistor in parallel. Their control signals are complementary.
        </p>
        <p>
          When the control input is active, both transistors turn ON and the gate behaves
          like a bidirectional switch. When the control input is inactive, both transistors
          turn OFF and the signal path is isolated.
        </p>
        <p>
          A single pass transistor can also transmit signals, but it may not pass both logic
          levels equally well. An nMOS passes logic 0 strongly but logic 1 weakly, while a
          pMOS behaves oppositely. A transmission gate solves this issue by combining both.
        </p>
      </section>

      <section className="card">
        <h2>Why Transmission Gates Matter</h2>
        <p>
          Transmission gates are widely used in multiplexers, latches, flip-flops, clock
          gating circuits, and switch-based logic design.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select the operating mode: Transmission Gate or Single Pass nMOS.</li>
          <li>Choose the input signal value.</li>
          <li>Change the control signal.</li>
          <li>Observe whether the output is passed or isolated.</li>
          <li>Compare the conduction behavior of the two approaches.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          Transmission gates provide better signal integrity than a single pass transistor
          because they can pass both logic 0 and logic 1 more effectively.
        </p>
      </section>
    </div>
  );
}