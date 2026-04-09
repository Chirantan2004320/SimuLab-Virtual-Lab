import React from "react";

export default function DTSPFFTvsDFTOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To compare the Discrete Fourier Transform (DFT) and the Fast Fourier
          Transform (FFT) in terms of output and computational efficiency.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          The DFT converts a time-domain sequence into its frequency-domain representation.
          However, direct computation of DFT requires O(N²) operations.
        </p>
        <p>
          The FFT is an efficient algorithm to compute the same spectrum as the DFT,
          usually in O(N log N) time by recursively dividing the sequence into smaller parts.
        </p>
        <p>
          FFT is especially efficient when the sequence length is a power of two.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Enter a numeric sequence.</li>
          <li>Click <strong>Analyze FFT vs DFT</strong>.</li>
          <li>Observe padding to power-of-two length if needed.</li>
          <li>Compare DFT and FFT outputs.</li>
          <li>Study operation counts and FFT stage breakdown.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          FFT does not change the transform result. It computes the same spectrum
          as the DFT, but far more efficiently for larger input sizes.
        </p>
      </section>
    </div>
  );
}