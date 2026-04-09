import React from "react";

export default function DTSPPoleZeroAnalysisOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To determine the zeros and poles of simple discrete-time transfer
          functions and interpret system stability using their locations in the
          z-plane.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A discrete-time LTI system can be represented by its transfer function
          H(z) = N(z) / D(z), where the roots of the numerator polynomial are
          called zeros and the roots of the denominator polynomial are called
          poles.
        </p>
        <p>
          The position of poles and zeros in the z-plane gives important
          information about the system behavior, including stability and
          frequency selectivity.
        </p>
        <p>
          For a causal discrete-time system, stability depends on the pole
          locations. If all poles lie strictly inside the unit circle, the
          system is stable. If any pole lies outside the unit circle, the system
          is unstable.
        </p>
        <p>
          Zeros affect how certain frequency components are attenuated, while
          poles influence resonant behavior and system response.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Enter numerator coefficients in descending powers of z.</li>
          <li>Enter denominator coefficients in descending powers of z.</li>
          <li>Click on <strong>Analyze</strong>.</li>
          <li>Observe the computed zeros and poles.</li>
          <li>Check the z-plane graph and read the stability interpretation.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          The unit circle is the most important reference in pole-zero analysis.
          Poles inside it indicate stability, while poles outside it indicate
          instability.
        </p>
      </section>
    </div>
  );
}