import React from "react";

export default function DTSPDFTIDFTOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To compute the Discrete Fourier Transform (DFT) and Inverse Discrete
          Fourier Transform (IDFT) of a finite-length sequence and study the
          relation between time-domain and frequency-domain representations.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          The Discrete Fourier Transform converts a discrete-time sequence x[n]
          of length N into N complex-valued frequency-domain coefficients X[k].
        </p>
        <p>
          Each DFT coefficient describes the strength and phase of a frequency
          component present in the original signal.
        </p>
        <p>
          The IDFT reconstructs the original sequence from the frequency-domain
          coefficients, showing that no information is lost when all DFT values
          are preserved.
        </p>
        <p>
          Magnitude tells how strong a frequency component is, while phase tells
          its angular shift.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Enter a discrete-time sequence as comma-separated values.</li>
          <li>Click on <strong>Compute DFT</strong>.</li>
          <li>Observe real, imaginary, magnitude, and phase values.</li>
          <li>Click on <strong>Compute IDFT</strong>.</li>
          <li>Compare the reconstructed sequence with the original input.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Applications</h2>
        <ul>
          <li>Frequency analysis of discrete signals</li>
          <li>Digital communication systems</li>
          <li>Speech and audio processing</li>
          <li>Image and video processing</li>
          <li>Filter design and spectrum analysis</li>
        </ul>
      </section>
    </div>
  );
}