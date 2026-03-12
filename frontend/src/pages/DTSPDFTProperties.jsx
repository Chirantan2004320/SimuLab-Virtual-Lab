import React, { useState } from "react";
import ExperimentLayout from "../components/experiments/ExperimentLayout";
import { computeDFT, getMagnitude, getPhase } from "../utils/dtsp/fourier";
import "./Lab.css";

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

const PROPERTY_OPTIONS = [
  { value: "linearity", label: "Linearity" },
  { value: "timeShift", label: "Time Shift" },
  { value: "frequencyShift", label: "Frequency Shift" }
];

export default function DTSPDFTProperties() {
  const [inputText, setInputText] = useState("1, 2, 3, 4");
  const [property, setProperty] = useState("linearity");
  const [sequence, setSequence] = useState([]);
  const [originalDFT, setOriginalDFT] = useState([]);
  const [transformedSequence, setTransformedSequence] = useState([]);
  const [transformedDFT, setTransformedDFT] = useState([]);
  const [error, setError] = useState("");

  const handleRunDemo = () => {
    setError("");

    const parts = inputText
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const nums = parts.map(Number);
    if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) {
      setError("Please enter a valid numeric sequence (comma-separated).");
      setSequence([]);
      setOriginalDFT([]);
      setTransformedSequence([]);
      setTransformedDFT([]);
      return;
    }

    const x1 = nums;
    const X1 = computeDFT(x1);

    let y = [];
    let X = X1;
    if (property === "linearity") {
      // Demonstrate linearity: DFT{x1[n] + x2[n]} = X1[k] + X2[k]
      // Use x1[n] as entered sequence and x2[n] as a circularly shifted version.
      const N = x1.length;
      const x2 = x1.map((_, n) => x1[(n - 1 + N) % N]);
      y = x1.map((_, n) => x1[n] + x2[n]);
      const X2 = computeDFT(x2);
      const Y = computeDFT(y);
      const Xsum = X1.map((Xk, k) => ({
        re: Xk.re + X2[k].re,
        im: Xk.im + X2[k].im
      }));
      // For linearity, treat originalDFT as X1[k] + X2[k] and transformedDFT as DFT{y[n]}.
      setSequence(x1);
      setOriginalDFT(Xsum);
      setTransformedSequence(y);
      setTransformedDFT(Y);
      return;
    } else if (property === "timeShift") {
      // Demonstrate time shift: DFT{x[(n - n0) mod N]} = X[k]·e^(-j2πk n0 / N)
      const N = x1.length;
      const n0 = 1; // shift by 1 sample
      y = x1.map((_, n) => x1[(n - n0 + N) % N]);
    } else if (property === "frequencyShift") {
      // Demonstrate modulation: multiplying x[n] by a cosine changes frequency content.
      const N = x1.length;
      const w0 = (2 * Math.PI) / N; // basic digital frequency
      y = x1.map((val, n) => val * Math.cos(w0 * n));
    }

    const Y = computeDFT(y);

    setSequence(x1);
    setOriginalDFT(X);
    setTransformedSequence(y);
    setTransformedDFT(Y);
  };

  const aim = (
    <p>
      To study and verify basic properties of the Discrete Fourier Transform (DFT) such as
      linearity, time shift, and frequency shift using simple numerical experiments on a
      discrete-time sequence.
    </p>
  );

  const theory = (
    <>
      <p>
        The Discrete Fourier Transform (DFT) has several important properties that make it a
        powerful tool for signal analysis and processing.
      </p>
      <p>
        <strong>Linearity:</strong> The DFT of a linear combination of signals equals the same
        linear combination of their individual DFTs. In particular, scaling a sequence by a
        constant scales all of its DFT coefficients by that constant.
      </p>
      <p>
        <strong>Time Shift:</strong> Shifting a sequence in time corresponds to multiplying its DFT
        coefficients by a complex exponential that changes the phase but not the magnitude. The
        energy in each frequency bin stays the same, but the phase pattern changes.
      </p>
      <p>
        <strong>Frequency Shift (Modulation):</strong> Multiplying a sequence by a sinusoid in the
        time domain shifts its spectrum in the frequency domain. This is the discrete-time
        counterpart of frequency translation used in modulation and communications.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Enter a finite-length discrete-time sequence as comma-separated values.</li>
      <li>Select one DFT property (Linearity, Time Shift, or Frequency Shift) from the dropdown.</li>
      <li>Click on <strong>Run Property Demo</strong> to generate the transformed sequence.</li>
      <li>Observe the original sequence, transformed sequence, and their DFTs.</li>
      <li>Compare magnitudes and phases to see how the chosen property manifests in the DFT.</li>
    </ol>
  );

  const renderPropertyNote = () => {
    if (property === "linearity") {
      return (
        <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
          In this demo, linearity is illustrated using two signals: x1[n] (the entered sequence) and
          x2[n] (the same sequence circularly shifted by one sample). Their sum y[n] = x1[n] + x2[n]
          is compared against the sum of their individual DFTs.
        </p>
      );
    }
    if (property === "timeShift") {
      return (
        <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
          In this demo, the sequence is circularly shifted by 1 sample. The magnitudes of the DFT
          coefficients remain the same, while their phases change according to the shift.
        </p>
      );
    }
    if (property === "frequencyShift") {
      return (
        <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
          In this demo, the sequence is multiplied by a cosine. This modulation redistributes
          energy across neighboring frequency bins in the DFT.
        </p>
      );
    }
    return null;
  };

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

        <label className="lab-label" style={{ minWidth: 220 }}>
          DFT property:
          <select
            className="lab-select"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
          >
            {PROPERTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button className="btn primary" type="button" onClick={handleRunDemo}>
        Run Property Demo
      </button>

      {error && (
        <div className="stack-warning show" style={{ marginTop: "1rem" }}>
          {error}
        </div>
      )}

      {sequence.length > 0 && (
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          <div className="card" style={{ padding: "1rem" }}>
            <h3>Sequences</h3>
            <p>
              <strong>Original x[n]: </strong>
              <span className="lab-output-value">
                {sequence.map((v, i) => (i === 0 ? v : `, ${v}`))}
              </span>
            </p>
            {transformedSequence.length > 0 && (
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Transformed y[n]: </strong>
                <span className="lab-output-value">
                  {transformedSequence.map((v, i) =>
                    i === 0 ? formatNumber(v, 3) : `, ${formatNumber(v, 3)}`
                  )}
                </span>
              </p>
            )}
            {renderPropertyNote()}
          </div>

          {originalDFT.length > 0 && transformedDFT.length > 0 && (
            <div className="card" style={{ padding: "1rem" }}>
              <h3>DFT Comparison</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", fontSize: "0.9rem", color: "#9ca3af" }}>
                    <th style={{ padding: "0.25rem 0.5rem" }}>k</th>
                    <th style={{ padding: "0.25rem 0.5rem" }}>|X[k]|</th>
                    <th style={{ padding: "0.25rem 0.5rem" }}>∠X[k] (rad)</th>
                    <th style={{ padding: "0.25rem 0.5rem" }}>|Y[k]|</th>
                    <th style={{ padding: "0.25rem 0.5rem" }}>∠Y[k] (rad)</th>
                  </tr>
                </thead>
                <tbody>
                  {originalDFT.map((Xk, k) => {
                    const Yk = transformedDFT[k] || { re: 0, im: 0 };
                    const magX = getMagnitude(Xk);
                    const phaseX = getPhase(Xk);
                    const magY = getMagnitude(Yk);
                    const phaseY = getPhase(Yk);
                    return (
                      <tr key={k} style={{ fontSize: "0.9rem" }}>
                        <td style={{ padding: "0.25rem 0.5rem" }}>{k}</td>
                        <td style={{ padding: "0.25rem 0.5rem" }}>{formatNumber(magX)}</td>
                        <td style={{ padding: "0.25rem 0.5rem" }}>{formatNumber(phaseX)}</td>
                        <td style={{ padding: "0.25rem 0.5rem" }}>{formatNumber(magY)}</td>
                        <td style={{ padding: "0.25rem 0.5rem" }}>{formatNumber(phaseY)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );

  const result = (
    <p>
      By comparing the original and transformed sequences and their DFTs, the key properties of
      the Discrete Fourier Transform—linearity, time shift, and frequency shift—are illustrated
      numerically for simple finite-length signals.
    </p>
  );

  return (
    <ExperimentLayout
      title="DTSP Experiment 3: DFT Properties"
      subtitle="Explore linearity, time shift, and frequency shift properties of the DFT using simple numerical examples."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}

