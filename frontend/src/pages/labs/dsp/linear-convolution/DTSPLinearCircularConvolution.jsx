import React, { useState } from "react";
import ExperimentLayout from "../../../../components/experiments/ExperimentLayout";
import "../../../../styles/Lab.css";

function parseSequence(text) {
  const parts = text
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
  const nums = parts.map(Number);
  if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) {
    return null;
  }
  return nums;
}

function linearConvolution(x, h) {
  const N = x.length;
  const M = h.length;
  const yLength = N + M - 1;
  const y = new Array(yLength).fill(0);
  for (let n = 0; n < yLength; n++) {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      const hIndex = n - k;
      if (hIndex >= 0 && hIndex < M) {
        sum += x[k] * h[hIndex];
      }
    }
    y[n] = sum;
  }
  return y;
}

function circularConvolution(x, h, L) {
  const N = x.length;
  const M = h.length;
  const len = L || Math.max(N, M);
  const xa = new Array(len).fill(0);
  const ha = new Array(len).fill(0);

  for (let n = 0; n < len; n++) {
    if (n < N) xa[n] = x[n];
    if (n < M) ha[n] = h[n];
  }

  const y = new Array(len).fill(0);
  for (let n = 0; n < len; n++) {
    let sum = 0;
    for (let k = 0; k < len; k++) {
      const index = (n - k + len) % len;
      sum += xa[k] * ha[index];
    }
    y[n] = sum;
  }
  return y;
}

function formatSequence(seq, digits = 3) {
  return seq.map((v, i) => {
    const value = Math.abs(v) < 1e-10 ? 0 : v;
    const text = Number.isFinite(value) ? value.toFixed(digits) : "0";
    return i === 0 ? text : `, ${text}`;
  });
}

export default function DTSPLinearCircularConvolution() {
  const [xText, setXText] = useState("1, 2, 1");
  const [hText, setHText] = useState("1, -1, 1");
  const [x, setX] = useState([]);
  const [h, setH] = useState([]);
  const [yLinear, setYLinear] = useState([]);
  const [yCircularNoPad, setYCircularNoPad] = useState([]);
  const [yCircularPadded, setYCircularPadded] = useState([]);
  const [error, setError] = useState("");

  const handleCompute = () => {
    setError("");

    const xSeq = parseSequence(xText);
    const hSeq = parseSequence(hText);

    if (!xSeq || !hSeq) {
      setError("Please enter valid numeric sequences for x[n] and h[n].");
      setX([]);
      setH([]);
      setYLinear([]);
      setYCircularNoPad([]);
      setYCircularPadded([]);
      return;
    }

    const yLin = linearConvolution(xSeq, hSeq);
    const L = Math.max(xSeq.length, hSeq.length);
    const Lfull = xSeq.length + hSeq.length - 1;
    const yCircNoPad = circularConvolution(xSeq, hSeq, L);
    const yCircPad = circularConvolution(xSeq, hSeq, Lfull);

    setX(xSeq);
    setH(hSeq);
    setYLinear(yLin);
    setYCircularNoPad(yCircNoPad);
    setYCircularPadded(yCircPad);
  };

  const aim = (
    <p>
      To compute the linear convolution of two discrete-time sequences and to show how the same
      result can be obtained using circular convolution with appropriate zero padding.
    </p>
  );

  const theory = (
    <>
      <p>
        Linear convolution of two sequences x[n] and h[n] gives the output of a linear time-invariant
        (LTI) system with input x[n] and impulse response h[n]. The length of the linear convolution
        is (N + M − 1), where N and M are the lengths of x[n] and h[n].
      </p>
      <p>
        Circular convolution treats sequences as periodic and wraps values around modulo a chosen
        length L. Without zero padding, circular convolution does not generally match linear
        convolution because of the wrap-around effect.
      </p>
      <p>
        If both sequences are zero padded so that their lengths add up to at least N + M − 1 and
        circular convolution is computed with that length, the result is identical to the linear
        convolution. This forms the basis for using the DFT to implement fast convolution.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Enter the sequences x[n] and h[n] as comma-separated numbers.</li>
      <li>Click on <strong>Compute Convolutions</strong>.</li>
      <li>
        Observe the linear convolution result and compare it to the circular convolution without
        zero padding.
      </li>
      <li>
        Observe how circular convolution with proper zero padding matches the linear convolution
        result.
      </li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ flex: 1, minWidth: 260 }}>
          x[n] (input sequence):
          <input
            className="lab-input"
            value={xText}
            onChange={(e) => setXText(e.target.value)}
            placeholder="e.g. 1, 2, 1"
          />
        </label>
        <label className="lab-label" style={{ flex: 1, minWidth: 260 }}>
          h[n] (impulse response):
          <input
            className="lab-input"
            value={hText}
            onChange={(e) => setHText(e.target.value)}
            placeholder="e.g. 1, -1, 1"
          />
        </label>
      </div>

      <button className="btn primary" type="button" onClick={handleCompute}>
        Compute Convolutions
      </button>

      {error && (
        <div className="stack-warning show" style={{ marginTop: "1rem" }}>
          {error}
        </div>
      )}

      {x.length > 0 && h.length > 0 && (
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          <div className="card" style={{ padding: "1rem" }}>
            <h3>Input Sequences</h3>
            <p>
              <strong>x[n]: </strong>
              <span className="lab-output-value">
                {x.map((v, i) => (i === 0 ? v : `, ${v}`))}
              </span>
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              <strong>h[n]: </strong>
              <span className="lab-output-value">
                {h.map((v, i) => (i === 0 ? v : `, ${v}`))}
              </span>
            </p>
          </div>

          <div className="card" style={{ padding: "1rem" }}>
            <h3>Linear Convolution y<sub>lin</sub>[n] = x[n] * h[n]</h3>
            {yLinear.length > 0 && (
              <p style={{ marginTop: "0.5rem" }}>
                <span className="lab-output-value">
                  {formatSequence(yLinear, 3)}
                </span>
              </p>
            )}
          </div>

          <div className="card" style={{ padding: "1rem" }}>
            <h3>Circular Convolution (no padding)</h3>
            {yCircularNoPad.length > 0 && (
              <p style={{ marginTop: "0.5rem" }}>
                <span className="lab-output-value">
                  {formatSequence(yCircularNoPad, 3)}
                </span>
              </p>
            )}
            <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
              Computed using circular convolution of length max(len(x), len(h)). Differences from
              the linear convolution are due to wrap-around effects.
            </p>
          </div>

          <div className="card" style={{ padding: "1rem" }}>
            <h3>Circular Convolution (with zero padding)</h3>
            {yCircularPadded.length > 0 && (
              <p style={{ marginTop: "0.5rem" }}>
                <span className="lab-output-value">
                  {formatSequence(yCircularPadded, 3)}
                </span>
              </p>
            )}
            <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
              Computed using circular convolution of length len(x) + len(h) − 1. This matches the
              linear convolution result.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: "1rem",
              gridColumn: "1 / -1",
              background: "rgba(15,23,42,0.9)"
            }}
          >
            <h3>Summary Comparison</h3>
            <p style={{ marginTop: "0.5rem", color: "#d1d5db", fontSize: "0.95rem" }}>
              Circular convolution without zero padding assumes the sequences repeat periodically,
              so part of the output from the "tail" of the linear convolution wraps around and adds
              back into earlier samples. This wrap-around changes the values compared to true linear
              convolution.
            </p>
            <p style={{ marginTop: "0.5rem", color: "#d1d5db", fontSize: "0.95rem" }}>
              When both sequences are zero padded so that the circular length is N + M − 1, there
              is enough room for the entire linear convolution to fit without overlap. In that
              case, circular convolution reproduces exactly the same result as the linear
              convolution.
            </p>
          </div>
        </div>
      )}
    </>
  );

  const result = (
    <p>
      The experiment shows that linear convolution can be implemented using circular convolution
      when both sequences are properly zero padded. Without zero padding, circular convolution
      produces aliasing due to wrap-around, which changes the output compared to true linear
      convolution.
    </p>
  );

  return (
    <ExperimentLayout
      title="DTSP Experiment 4: Linear Convolution using Circular Convolution"
      subtitle="Compare linear convolution with circular convolution, with and without appropriate zero padding."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}

