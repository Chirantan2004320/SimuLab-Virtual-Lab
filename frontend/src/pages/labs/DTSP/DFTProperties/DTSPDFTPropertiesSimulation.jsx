import React from "react";

export default function DTSPDFTPropertiesSimulation({
  inputText,
  setInputText,
  property,
  setProperty,
  propertyOptions,
  sequence,
  originalDFT,
  transformedSequence,
  transformedDFT,
  error,
  handleRunDemo,
  renderPropertyNote,
  formatNumber,
  getMagnitude,
  getPhase
}) {
  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="controls" style={{ flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <label>Input Sequence</label>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 1, 2, 3, 4"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div style={{ minWidth: 220 }}>
          <label>DFT Property</label>
          <select
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            {propertyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={handleRunDemo}>
            Run Property Demo
          </button>
        </div>
      </div>

      {error && (
        <div className="info-box" style={{ marginTop: "1rem", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {sequence.length > 0 && (
        <>
          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Sequences</h3>

            <p style={{ marginTop: "0.75rem" }}>
              <strong>Original x[n]: </strong>
              <span className="lab-output-value">
                {sequence.map((v, i) => (i === 0 ? v : `, ${v}`))}
              </span>
            </p>

            {transformedSequence.length > 0 && (
              <p style={{ marginTop: "0.75rem" }}>
                <strong>Transformed y[n]: </strong>
                <span className="lab-output-value">
                  {transformedSequence.map((v, i) =>
                    i === 0 ? formatNumber(v, 3) : `, ${formatNumber(v, 3)}`
                  )}
                </span>
              </p>
            )}

            <div className="info-box" style={{ marginTop: "1rem" }}>
              {renderPropertyNote()}
            </div>
          </div>

          {originalDFT.length > 0 && transformedDFT.length > 0 && (
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>DFT Comparison</h3>

              <div style={{ overflowX: "auto" }}>
                <table className="dbms-table">
                  <thead>
                    <tr>
                      <th>k</th>
                      <th>|X[k]|</th>
                      <th>∠X[k]</th>
                      <th>|Y[k]|</th>
                      <th>∠Y[k]</th>
                    </tr>
                  </thead>
                  <tbody>
                    {originalDFT.map((Xk, k) => {
                      const Yk = transformedDFT[k] || { re: 0, im: 0 };
                      return (
                        <tr key={k}>
                          <td>{k}</td>
                          <td>{formatNumber(getMagnitude(Xk))}</td>
                          <td>{formatNumber(getPhase(Xk))}</td>
                          <td>{formatNumber(getMagnitude(Yk))}</td>
                          <td>{formatNumber(getPhase(Yk))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}