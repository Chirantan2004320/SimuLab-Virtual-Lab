import React from "react";

export default function DTSPFFTvsDFTSimulation({
  inputText,
  setInputText,
  originalSequence,
  paddedSequence,
  dftResult,
  fftResult,
  dftOps,
  fftOps,
  fftStages,
  error,
  handleAnalyze,
  formatNumber,
  getMagnitude
}) {
  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="controls" style={{ flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <label>Input Sequence</label>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 1, 2, 3, 4"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={handleAnalyze}>
            Analyze FFT vs DFT
          </button>
        </div>
      </div>

      {error && (
        <div className="info-box" style={{ marginTop: "1rem", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {paddedSequence.length > 0 && (
        <>
          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Input Information</h3>

            <p style={{ marginTop: "0.75rem" }}>
              <strong>Original Sequence: </strong>
              <span className="lab-output-value">
                {originalSequence.map((v, i) => (i === 0 ? v : `, ${v}`))}
              </span>
            </p>

            <p style={{ marginTop: "0.75rem" }}>
              <strong>Padded Sequence: </strong>
              <span className="lab-output-value">
                {paddedSequence.map((v, i) => (i === 0 ? v : `, ${v}`))}
              </span>
            </p>
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
              <strong>Sequence Length</strong>
              <div>{paddedSequence.length}</div>
            </div>

            <div className="stat-card">
              <strong>DFT Operations</strong>
              <div>{dftOps}</div>
            </div>

            <div className="stat-card">
              <strong>FFT Operations</strong>
              <div>{fftOps}</div>
            </div>

            <div className="stat-card">
              <strong>Efficiency Gain</strong>
              <div>{fftOps > 0 ? `${(dftOps / fftOps).toFixed(2)}x` : "-"}</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>DFT vs FFT Magnitude Comparison</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="dbms-table">
                <thead>
                  <tr>
                    <th>k</th>
                    <th>|DFT[k]|</th>
                    <th>|FFT[k]|</th>
                  </tr>
                </thead>
                <tbody>
                  {dftResult.map((d, k) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{formatNumber(getMagnitude(d))}</td>
                      <td>{formatNumber(getMagnitude(fftResult[k] || { re: 0, im: 0 }))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {fftStages.length > 0 && (
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>FFT Stage Breakdown</h3>
              {fftStages.map((stage, idx) => (
                <div key={idx} style={{ marginTop: "1rem" }}>
                  <p>
                    <strong>Stage {idx + 1}</strong> — size {stage.size}
                  </p>
                  <div className="workspace">
                    {stage.values.map((value, i) => (
                      <div
                        key={i}
                        className="cell"
                        style={{ minWidth: "88px", textAlign: "center" }}
                      >
                        <div style={{ fontSize: "12px", color: "#9ca3af" }}>X[{i}]</div>
                        <div>
                          {formatNumber(value.re, 2)}
                          {value.im >= 0 ? "+" : ""}
                          {formatNumber(value.im, 2)}j
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}