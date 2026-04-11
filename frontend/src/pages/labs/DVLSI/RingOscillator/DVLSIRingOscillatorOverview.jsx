import React from "react";

export default function DVLSIRingOscillatorOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the working principle of a ring oscillator and understand how
          oscillation depends on an odd number of inverter stages and finite propagation delay.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A ring oscillator is formed by connecting an odd number of inverters in a loop.
          Because each inverter introduces inversion and delay, the signal keeps toggling
          around the loop instead of settling to a fixed value.
        </p>
        <p>
          The oscillation period is approximately:
        </p>
        <p>
          <strong>T ≈ 2 × N × tp</strong>
        </p>
        <p>
          where <strong>N</strong> is the number of stages and <strong>tp</strong> is the propagation delay
          of each inverter.
        </p>
        <p>
          Therefore, the oscillation frequency is approximately:
        </p>
        <p>
          <strong>f ≈ 1 / (2 × N × tp)</strong>
        </p>
      </section>

      <section className="card">
        <h2>Why Odd Number of Stages?</h2>
        <p>
          A loop with an even number of inversions tends to settle to a stable state.
          A loop with an odd number of inversions cannot satisfy the feedback condition
          statically, so oscillation occurs when propagation delay is present.
        </p>
      </section>

      <section className="card">
        <h2>Applications</h2>
        <p>
          Ring oscillators are used in clock generation, on-chip process monitoring,
          random number generation, and timing characterization.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select the number of inverter stages.</li>
          <li>Adjust the propagation delay of each stage.</li>
          <li>Enable or disable the oscillator.</li>
          <li>Observe whether oscillation occurs.</li>
          <li>Study the circuit loop and waveform-style graph.</li>
        </ol>
      </section>
    </div>
  );
}