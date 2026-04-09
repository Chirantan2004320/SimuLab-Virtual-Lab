import React from "react";

export default function DTSPAliasingOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study sampling and aliasing effects when a continuous signal is sampled at different rates.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          According to the Nyquist Theorem, a signal must be sampled at least twice its highest frequency
          to avoid aliasing.
        </p>
        <p>
          If the sampling frequency is too low, different signals become indistinguishable — this is called aliasing.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Set signal frequency</li>
          <li>Set sampling frequency</li>
          <li>Observe graph behavior</li>
        </ol>
      </section>
    </div>
  );
}