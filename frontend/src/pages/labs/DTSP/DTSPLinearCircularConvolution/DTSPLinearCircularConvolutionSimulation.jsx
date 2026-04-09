import React from "react";

function formatSequence(seq, formatNumber) {
  return seq.map((v, i) => (i === 0 ? formatNumber(v) : `, ${formatNumber(v)}`));
}

function ContributionTable({ title, steps, formatNumber, explanation }) {
  if (!steps.length) return null;

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h3>{title}</h3>

      {explanation ? (
        <div className="info-box" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
          {explanation}
        </div>
      ) : null}

      <div style={{ overflowX: "auto" }}>
        <table className="dbms-table">
          <thead>
            <tr>
              <th>k</th>
              <th>x index</th>
              <th>x[k]</th>
              <th>h index</th>
              <th>h value</th>
              <th>Product</th>
              <th>Running Sum</th>
              <th>Wrap?</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, index) => (
              <tr key={index} className={step.wrapped ? "highlight-row" : ""}>
                <td>{step.k}</td>
                <td>{step.xIndex}</td>
                <td>{formatNumber(step.xValue)}</td>
                <td>{step.hIndex}</td>
                <td>{formatNumber(step.hValue)}</td>
                <td>{formatNumber(step.product)}</td>
                <td>{formatNumber(step.runningSum)}</td>
                <td>{step.wrapped ? "Yes" : "No"}</td>
                <td>{step.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DTSPLinearCircularConvolutionSimulation({
  xText,
  setXText,
  hText,
  setHText,
  x,
  h,
  yLinear,
  yCircularNoPad,
  yCircularPadded,
  error,
  handleCompute,
  formatNumber,
  selectedLinearIndex,
  setSelectedLinearIndex,
  selectedCircularIndex,
  setSelectedCircularIndex,
  selectedPaddedIndex,
  setSelectedPaddedIndex,
  linearSteps,
  circularNoPadAnalysis,
  circularPaddedAnalysis
}) {
  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="controls" style={{ flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <label>x[n] (input sequence)</label>
          <input
            value={xText}
            onChange={(e) => setXText(e.target.value)}
            placeholder="e.g. 1, 2, 1"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <label>h[n] (impulse response)</label>
          <input
            value={hText}
            onChange={(e) => setHText(e.target.value)}
            placeholder="e.g. 1, -1, 1"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={handleCompute}>
            Compute Convolutions
          </button>
        </div>
      </div>

      {error && (
        <div className="info-box" style={{ marginTop: "1rem", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {x.length > 0 && h.length > 0 && (
        <>
          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Input Sequences</h3>

            <p style={{ marginTop: "0.75rem" }}>
              <strong>x[n]: </strong>
              <span className="lab-output-value">{formatSequence(x, formatNumber)}</span>
            </p>

            <p style={{ marginTop: "0.75rem" }}>
              <strong>h[n]: </strong>
              <span className="lab-output-value">{formatSequence(h, formatNumber)}</span>
            </p>

            <div className="workspace" style={{ marginTop: "1rem" }}>
              {x.map((value, index) => (
                <div
                  key={`x-${index}`}
                  className="cell"
                  style={{ minWidth: "64px", textAlign: "center" }}
                >
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>x[{index}]</div>
                  <div>{formatNumber(value)}</div>
                </div>
              ))}
            </div>

            <div className="workspace" style={{ marginTop: "1rem" }}>
              {h.map((value, index) => (
                <div
                  key={`h-${index}`}
                  className="cell"
                  style={{ minWidth: "64px", textAlign: "center" }}
                >
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>h[{index}]</div>
                  <div>{formatNumber(value)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Linear Convolution</h3>
            <p className="lab-output-value" style={{ marginTop: "0.75rem" }}>
              {formatSequence(yLinear, formatNumber)}
            </p>
            <div className="info-box" style={{ marginTop: "1rem" }}>
              This is the true linear convolution output of length N + M - 1.
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Circular Convolution (without zero padding)</h3>
            <p className="lab-output-value" style={{ marginTop: "0.75rem" }}>
              {formatSequence(yCircularNoPad, formatNumber)}
            </p>
            <div className="info-box" style={{ marginTop: "1rem" }}>
              This uses circular length max(len(x), len(h)). It differs from linear convolution due
              to wrap-around.
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Circular Convolution (with zero padding)</h3>
            <p className="lab-output-value" style={{ marginTop: "0.75rem" }}>
              {formatSequence(yCircularPadded, formatNumber)}
            </p>
            <div className="info-box" style={{ marginTop: "1rem" }}>
              This uses circular length len(x) + len(h) - 1, so it matches the linear convolution.
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Advanced Output Sample Builder</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px",
                marginTop: "1rem"
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Linear output index n
                </label>
                <select
                  value={selectedLinearIndex}
                  onChange={(e) => setSelectedLinearIndex(Number(e.target.value))}
                  style={{ color: "#000", padding: "10px 12px", borderRadius: "8px", width: "100%" }}
                >
                  {yLinear.map((_, n) => (
                    <option key={n} value={n}>
                      y_lin[{n}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Circular output index n (no padding)
                </label>
                <select
                  value={selectedCircularIndex}
                  onChange={(e) => setSelectedCircularIndex(Number(e.target.value))}
                  style={{ color: "#000", padding: "10px 12px", borderRadius: "8px", width: "100%" }}
                >
                  {yCircularNoPad.map((_, n) => (
                    <option key={n} value={n}>
                      y_circ[{n}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Circular output index n (with padding)
                </label>
                <select
                  value={selectedPaddedIndex}
                  onChange={(e) => setSelectedPaddedIndex(Number(e.target.value))}
                  style={{ color: "#000", padding: "10px 12px", borderRadius: "8px", width: "100%" }}
                >
                  {yCircularPadded.map((_, n) => (
                    <option key={n} value={n}>
                      y_pad[{n}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px"
              }}
            >
              <div className="stat-card">
                <strong>Linear Output</strong>
                <div>y_lin[{selectedLinearIndex}] = {formatNumber(yLinear[selectedLinearIndex])}</div>
              </div>

              <div className="stat-card">
                <strong>Circular Output</strong>
                <div>
                  y_circ[{selectedCircularIndex}] = {formatNumber(yCircularNoPad[selectedCircularIndex])}
                </div>
              </div>

              <div className="stat-card">
                <strong>Padded Circular Output</strong>
                <div>
                  y_pad[{selectedPaddedIndex}] = {formatNumber(yCircularPadded[selectedPaddedIndex])}
                </div>
              </div>
            </div>
          </div>

          <ContributionTable
            title={`Detailed Linear Convolution for y_lin[${selectedLinearIndex}]`}
            steps={linearSteps}
            formatNumber={formatNumber}
          />

          <ContributionTable
            title={`Detailed Circular Convolution (No Padding) for y_circ[${selectedCircularIndex}]`}
            steps={circularNoPadAnalysis.steps}
            formatNumber={formatNumber}
            explanation={circularNoPadAnalysis.explanation}
          />

          <ContributionTable
            title={`Detailed Circular Convolution (With Zero Padding) for y_pad[${selectedPaddedIndex}]`}
            steps={circularPaddedAnalysis.steps}
            formatNumber={formatNumber}
            explanation={circularPaddedAnalysis.explanation}
          />

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Summary Comparison</h3>

            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              Circular convolution without zero padding assumes the sequences repeat periodically.
              Because of that, part of the tail wraps around and overlaps earlier values.
            </p>

            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              In the contribution table, any highlighted row shows wrap-around. That is the exact
              reason the output differs from true linear convolution.
            </p>

            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              With zero padding, the circular length is increased to N + M - 1, so the overlap is
              avoided and circular convolution reproduces the linear convolution result.
            </p>
          </div>
        </>
      )}
    </section>
  );
}