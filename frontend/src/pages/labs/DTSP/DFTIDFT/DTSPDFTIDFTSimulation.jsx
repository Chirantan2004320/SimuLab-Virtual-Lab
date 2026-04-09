import React from "react";

export default function DTSPDFTIDFTSimulation({
  inputText,
  setInputText,
  sequence,
  dftResult,
  reconstructed,
  error,
  selectedK,
  setSelectedK,
  selectedBinSteps,
  selectedBinResult,
  handleComputeDFT,
  handleComputeIDFT,
  formatNumber,
  getMagnitude,
  getPhase
}) {
  const reconstructionError =
    sequence.length > 0 && reconstructed.length > 0
      ? sequence.map((val, i) => Math.abs(val - (reconstructed[i] || 0)))
      : [];

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="controls">
        <div style={{ flex: 1 }}>
          <label>Input Sequence</label>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 1, 2, 3, 4"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={handleComputeDFT}>
            Compute DFT
          </button>
          <button
            className="btn secondary"
            onClick={handleComputeIDFT}
            disabled={!dftResult.length}
          >
            Compute IDFT
          </button>
        </div>
      </div>

      {error && (
        <div className="info-box" style={{ marginTop: "1rem", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {sequence.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Input Sequence x[n]</h3>
          <div className="workspace">
            {sequence.map((value, index) => (
              <div
                key={index}
                className="cell"
                style={{
                  minWidth: "64px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>n={index}</div>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dftResult.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>DFT Coefficients X[k]</h3>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Select frequency bin to inspect
            </label>
            <select
              value={selectedK}
              onChange={(e) => setSelectedK(Number(e.target.value))}
              style={{
                color: "#000",
                padding: "10px 12px",
                borderRadius: "8px",
                minWidth: "180px"
              }}
            >
              {dftResult.map((_, k) => (
                <option key={k} value={k}>
                  k = {k}
                </option>
              ))}
            </select>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="dbms-table">
              <thead>
                <tr>
                  <th>k</th>
                  <th>Real</th>
                  <th>Imag</th>
                  <th>|X[k]|</th>
                  <th>Phase (rad)</th>
                </tr>
              </thead>
              <tbody>
                {dftResult.map((Xk, k) => (
                  <tr key={k} className={k === selectedK ? "highlight-row" : ""}>
                    <td>{k}</td>
                    <td>{formatNumber(Xk.re)}</td>
                    <td>{formatNumber(Xk.im)}</td>
                    <td>{formatNumber(getMagnitude(Xk))}</td>
                    <td>{formatNumber(getPhase(Xk))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedBinResult && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Step-by-Step Computation for X[{selectedK}]</h3>

          <div className="info-box" style={{ marginBottom: "1rem" }}>
            For the selected frequency bin k = {selectedK}, each input sample x[n]
            contributes to the final coefficient X[{selectedK}] through a rotating
            complex exponential term.
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="dbms-table">
              <thead>
                <tr>
                  <th>n</th>
                  <th>x[n]</th>
                  <th>Angle</th>
                  <th>cos()</th>
                  <th>sin()</th>
                  <th>Real Contribution</th>
                  <th>Imag Contribution</th>
                  <th>Partial Real Sum</th>
                  <th>Partial Imag Sum</th>
                </tr>
              </thead>
              <tbody>
                {selectedBinSteps.map((step) => (
                  <tr key={step.n}>
                    <td>{step.n}</td>
                    <td>{formatNumber(step.x)}</td>
                    <td>{formatNumber(step.angle)}</td>
                    <td>{formatNumber(step.cosTerm)}</td>
                    <td>{formatNumber(step.sinTerm)}</td>
                    <td>{formatNumber(step.reContribution)}</td>
                    <td>{formatNumber(step.imContribution)}</td>
                    <td>{formatNumber(step.partialRe)}</td>
                    <td>{formatNumber(step.partialIm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <strong>Selected Bin</strong>
              <div>k = {selectedK}</div>
            </div>

            <div className="stat-card">
              <strong>Real Part</strong>
              <div>{formatNumber(selectedBinResult.re)}</div>
            </div>

            <div className="stat-card">
              <strong>Imaginary Part</strong>
              <div>{formatNumber(selectedBinResult.im)}</div>
            </div>

            <div className="stat-card">
              <strong>Magnitude</strong>
              <div>{formatNumber(getMagnitude(selectedBinResult))}</div>
            </div>

            <div className="stat-card">
              <strong>Phase</strong>
              <div>{formatNumber(getPhase(selectedBinResult))} rad</div>
            </div>
          </div>
        </div>
      )}

      {reconstructed.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Reconstructed Sequence using IDFT</h3>

          <div className="workspace">
            {reconstructed.map((value, index) => (
              <div
                key={index}
                className="cell"
                style={{
                  minWidth: "64px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>n={index}</div>
                <div>{formatNumber(value, 4)}</div>
              </div>
            ))}
          </div>

          <p style={{ color: "#22c55e", marginTop: "1rem" }}>
            Reconstruction Error: {reconstructionError.map((e) => e.toFixed(4)).join(", ")}
          </p>

          <div className="info-box" style={{ marginTop: "1rem" }}>
            Observation: The IDFT reconstructs the original sequence from the
            DFT coefficients. Small differences can appear because of floating-point
            rounding.
          </div>
        </div>
      )}
    </section>
  );
}