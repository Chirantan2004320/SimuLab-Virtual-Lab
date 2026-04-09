import React from "react";

export default function DTSPDFTPropertiesOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study and verify important properties of the Discrete Fourier Transform
          such as linearity, time shift, and frequency shift using numerical examples.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          The Discrete Fourier Transform is a powerful tool for representing a
          finite-length sequence in the frequency domain.
        </p>
        <p>
          <strong>Linearity:</strong> The DFT of a sum of signals equals the sum
          of their DFTs.
        </p>
        <p>
          <strong>Time Shift:</strong> Shifting a sequence in time changes the phase
          of the DFT coefficients while often preserving magnitude characteristics.
        </p>
        <p>
          <strong>Frequency Shift:</strong> Multiplying a sequence by a sinusoidal
          signal shifts its spectrum in the frequency domain.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Enter a discrete-time sequence as comma-separated values.</li>
          <li>Select a DFT property from the dropdown.</li>
          <li>Click <strong>Run Property Demo</strong>.</li>
          <li>Observe the transformed sequence and compare DFT values.</li>
          <li>Use graphs to compare time-domain and frequency-domain changes.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          Different operations in time domain produce predictable changes in the
          frequency-domain spectrum, making DFT properties very useful in signal processing.
        </p>
      </section>
    </div>
  );
}