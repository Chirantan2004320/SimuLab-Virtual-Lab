import React from "react";

export default function DTSPLinearPhaseFIRSimulation({
  impulseText,
  setImpulseText,
  impulseResponse,
  symmetryType,
  frequencyData,
  error,
  handleAnalyze,
  formatNumber
}) {
  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="controls" style={{ flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <label>Impulse Response h[n]</label>
          <input
            value={impulseText}
            onChange={(e) => setImpulseText(e.target.value)}
            placeholder="e.g. 0.2, 0.3, 0.5, 0.3, 0.2"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={handleAnalyze}>
            Analyze FIR
          </button>
        </div>
      </div>

      {error && (
        <div className="info-box" style={{ marginTop: "1rem", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {impulseResponse.length > 0 && (
        <>
          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Impulse Response</h3>
            <div className="workspace">
              {impulseResponse.map((value, index) => (
                <div
                  key={index}
                  className="cell"
                  style={{ minWidth: "72px", textAlign: "center" }}
                >
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>h[{index}]</div>
                  <div>{formatNumber(value)}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px"
            }}
          >
            <div className="stat-card">
              <strong>Filter Length</strong>
              <div>{impulseResponse.length}</div>
            </div>

            <div className="stat-card">
              <strong>Detected Type</strong>
              <div>{symmetryType}</div>
            </div>

            <div className="stat-card">
              <strong>Linear Phase?</strong>
              <div>{symmetryType === "Not Linear Phase" ? "No" : "Yes"}</div>
            </div>
          </div>

          <div className="info-box" style={{ marginTop: "1rem" }}>
            {symmetryType === "Not Linear Phase"
              ? "The impulse response is neither symmetric nor antisymmetric, so the filter is not linear phase."
              : `The impulse response pattern matches ${symmetryType}, so the FIR filter shows linear phase behavior.`}
          </div>

          {frequencyData.magnitude.length > 0 && (
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>Frequency Response Summary</h3>
              <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
                Magnitude and phase response have been computed over sampled frequencies between 0 and π.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}