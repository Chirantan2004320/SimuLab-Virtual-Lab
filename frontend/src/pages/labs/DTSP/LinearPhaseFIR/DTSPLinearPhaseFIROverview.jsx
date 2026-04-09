import React from "react";

export default function DTSPLinearPhaseFIROverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To analyze the impulse response and frequency response of FIR filters
          and determine whether they exhibit linear phase characteristics.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A Finite Impulse Response (FIR) filter has a finite-duration impulse response,
          which makes it inherently stable.
        </p>
        <p>
          FIR filters have linear phase when their impulse response is symmetric or
          antisymmetric about the center.
        </p>
        <p>
          Linear phase is important because it preserves the waveform shape of signals
          by delaying all frequency components equally.
        </p>
        <p>
          Depending on symmetry and filter length, linear phase FIR filters are classified
          into four types: Type I, II, III, and IV.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Enter FIR impulse response coefficients as comma-separated values.</li>
          <li>Click <strong>Analyze FIR</strong>.</li>
          <li>Observe whether the sequence is symmetric or antisymmetric.</li>
          <li>Check the detected FIR type.</li>
          <li>Study the magnitude and phase response in the graph section.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          Symmetry in the impulse response is the main indicator of linear phase behavior
          in FIR filters.
        </p>
      </section>
    </div>
  );
}