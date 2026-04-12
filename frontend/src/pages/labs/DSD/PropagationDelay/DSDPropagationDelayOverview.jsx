import React from "react";

export default function DSDPropagationDelayOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand the concept of propagation delay in digital circuits and observe how an output changes after a finite time interval when the input changes.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          In real digital circuits, outputs do not change instantaneously when inputs change. A small amount of time is required for the signal to travel through the circuit and for the gate to respond.
        </p>
        <p>
          This time difference between an input transition and the corresponding output transition is called <strong>propagation delay</strong>.
        </p>
        <p>
          Propagation delay is usually measured in nanoseconds and is important in timing analysis, clock design, and high-speed digital systems.
        </p>
      </section>

      <section className="card">
        <h2>Why It Matters</h2>
        <p>
          If delays are ignored, digital systems can produce incorrect outputs, race conditions, or timing failures.
        </p>
        <p>
          Understanding delay helps in designing reliable combinational and sequential circuits.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select a gate such as NOT or BUFFER.</li>
          <li>Set the propagation delay value.</li>
          <li>Toggle the input.</li>
          <li>Advance time step by step.</li>
          <li>Observe when the output changes relative to the input transition.</li>
        </ol>
      </section>
    </div>
  );
}