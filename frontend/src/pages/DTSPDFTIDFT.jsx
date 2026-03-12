import React, { useState } from "react";
import ExperimentLayout from "../components/experiments/ExperimentLayout";
import "./Lab.css";

function computeDFT(sequence) {
  const N = sequence.length;
  if (N === 0) return [];
  const X = [];
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      re += sequence[n] * Math.cos(angle);
      im -= sequence[n] * Math.sin(angle);
    }
    X.push({ re, im });
  }
  return X;
}

function computeIDFT(X) {
  const N = X.length;
  if (N === 0) return [];
  const x = [];
  for (let n = 0; n < N; n++) {
    let re = 0;
    let im = 0;
    for (let k = 0; k < N; k++) {
      const angle = (2 * Math.PI * k * n) / N;
      const xr = X[k].re * Math.cos(angle) - X[k].im * Math.sin(angle);
      const xi = X[k].re * Math.sin(angle) + X[k].im * Math.cos(angle);
      re += xr;
      im += xi;
    }
    // IDFT theoretical result may have tiny imaginary parts due to rounding.
    // Here we keep only the real part and normalize by N.
    x.push(re / N);
  }
  return x;
}

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

export default function DTSPDFTIDFT() {
  const [inputText, setInputText] = useState("1, 2, 3, 4");
  const [sequence, setSequence] = useState([]);
  const [dftResult, setDftResult] = useState([]);
  const [reconstructed, setReconstructed] = useState([]);
  const [error, setError] = useState("");

  const handleComputeDFT = () => {
    setError("");
    setReconstructed([]);
    const parts = inputText
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const nums = parts.map(Number);
    if (nums.some((n) => Number.isNaN(n))) {
      setError("Please enter a valid numeric sequence (comma-separated).");
      setSequence([]);
      setDftResult([]);
      return;
    }

    const X = computeDFT(nums);
    setSequence(nums);
    setDftResult(X);
  };

  const handleComputeIDFT = () => {
    if (!dftResult.length) return;
    const xRec = computeIDFT(dftResult);
    setReconstructed(xRec);
  };

  const aim = (
    <p>
      To compute the Discrete Fourier Transform (DFT) and Inverse Discrete Fourier Transform
      (IDFT) of a finite-length discrete-time sequence and observe the relationship between the
      time-domain and frequency-domain representations.
    </p>
  );

  const theory = (
    <>
      <p>
        For a finite-length discrete-time sequence x[n] of length N, the Discrete Fourier Transform
        (DFT) produces a set of N complex values X[k] that describe how much of each discrete
        frequency component is present in the signal.
      </p>
      <p>
        Conceptually, the DFT at index k is obtained by multiplying the sequence x[n] by a
        complex exponential that rotates with frequency k/N and summing over all n. This gives a
        complex number X[k] with a real part and an imaginary part.
      </p>
      <p>
        The Inverse Discrete Fourier Transform (IDFT) uses all of the X[k] values to reconstruct
        the original sequence x[n]. Each time-domain sample is recovered by adding up all the
        sinusoidal frequency components with appropriate amplitudes and phase shifts, and then
        dividing by N.
      </p>
      <p>
        Each complex DFT coefficient X[k] can be represented in polar form using its magnitude
        (how strong that frequency is) and its phase (how shifted in time that frequency component
        is). Together, these describe the frequency-domain view of the original discrete-time
        signal.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Enter a finite-length discrete-time sequence as comma-separated values in the input box.</li>
      <li>Click on <strong>Compute DFT</strong> to obtain the complex DFT coefficients.</li>
      <li>Observe the real, imaginary, magnitude, and phase values for each frequency index k.</li>
      <li>Click on <strong>Compute IDFT</strong> to reconstruct the original sequence from the DFT.</li>
      <li>Compare the reconstructed sequence with the original input sequence (allowing for small numerical rounding errors).</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem" }}>
        <label className="lab-label" style={{ flex: 1, minWidth: 260 }}>
          Input sequence (comma-separated):
          <input
            className="lab-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 1, 2, 3, 4"
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button className="btn primary" type="button" onClick={handleComputeDFT}>
          Compute DFT
        </button>
        <button
          className="btn secondary"
          type="button"
          onClick={handleComputeIDFT}
          disabled={!dftResult.length}
        >
          Compute IDFT
        </button>
      </div>

      {error && (
        <div className="stack-warning show" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {sequence.length > 0 && (
        <section className="lab-output" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <span>Input sequence:</span>
          <span className="lab-output-value">
            {sequence.map((v, i) => (i === 0 ? v : `, ${v}`))}
          </span>
        </section>
      )}

      {dftResult.length > 0 && (
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          <div className="card" style={{ padding: "1rem" }}>
            <h3>DFT Coefficients X[k]</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
              <thead>
                <tr style={{ textAlign: "left", fontSize: "0.9rem", color: "#9ca3af" }}>
                  <th style={{ padding: "0.25rem 0.5rem" }}>k</th>
                  <th style={{ padding: "0.25rem 0.5rem" }}>Real</th>
                  <th style={{ padding: "0.25rem 0.5rem" }}>Imag</th>
                  <th style={{ padding: "0.25rem 0.5rem" }}>|X[k]|</th>
                  <th style={{ padding: "0.25rem 0.5rem" }}>∠X[k] (rad)</th>
                </tr>
              </thead>
              <tbody>
                {dftResult.map((Xk, k) => {
                  const mag = Math.sqrt(Xk.re * Xk.re + Xk.im * Xk.im);
                  const phase = Math.atan2(Xk.im, Xk.re);
                  return (
                    <tr key={k} style={{ fontSize: "0.9rem" }}>
                      <td style={{ padding: "0.25rem 0.5rem" }}>{k}</td>
                      <td style={{ padding: "0.25rem 0.5rem" }}>{formatNumber(Xk.re)}</td>
                      <td style={{ padding: "0.25rem 0.5rem" }}>{formatNumber(Xk.im)}</td>
                      <td style={{ padding: "0.25rem 0.5rem" }}>{formatNumber(mag)}</td>
                      <td style={{ padding: "0.25rem 0.5rem" }}>{formatNumber(phase)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {reconstructed.length > 0 && (
            <div className="card" style={{ padding: "1rem" }}>
              <h3>Reconstructed Sequence (IDFT)</h3>
              <p style={{ marginTop: "0.5rem" }}>
                {reconstructed.map((v, i) =>
                  i === 0 ? formatNumber(v, 4) : `, ${formatNumber(v, 4)}`
                )}
              </p>
              <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
                (Values are real parts of the IDFT result, normalized by N. Small rounding
                differences compared to the original sequence are expected.)
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );

  const result = (
    <p>
      By computing the DFT and IDFT of the given input sequence, we verify that the original
      discrete-time signal can be reconstructed from its frequency-domain representation (up to
      numerical rounding errors). This confirms the duality between time and frequency domains
      for finite-length sequences.
    </p>
  );

  return (
    <ExperimentLayout
      title="DTSP Experiment 2: DFT and IDFT"
      subtitle="Compute the Discrete Fourier Transform and its inverse for a finite-length discrete-time sequence."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}

