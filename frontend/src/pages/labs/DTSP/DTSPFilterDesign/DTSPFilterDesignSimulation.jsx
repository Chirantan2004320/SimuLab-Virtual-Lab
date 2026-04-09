import React from "react";

export default function DTSPFilterDesignSimulation({
  filterType,
  setFilterType,
  cutoff,
  setCutoff,
  length,
  setLength,
  windowType,
  setWindowType,
  generateFilter,
  impulse,
  formatNumber
}) {
  const insight =
    filterType === "lowpass"
      ? "Low-pass filters allow low-frequency components to pass and attenuate high-frequency components."
      : "High-pass filters allow high-frequency components to pass and attenuate low-frequency components.";

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
          marginTop: "1rem"
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Filter Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="lowpass">Low Pass</option>
            <option value="highpass">High Pass</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Window Type
          </label>
          <select
            value={windowType}
            onChange={(e) => setWindowType(e.target.value)}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="rect">Rectangular</option>
            <option value="hamming">Hamming</option>
            <option value="hanning">Hanning</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Cutoff Frequency (normalized): <strong>{cutoff}</strong>
        </label>
        <input
          type="range"
          min="0.1"
          max="0.9"
          step="0.05"
          value={cutoff}
          onChange={(e) => setCutoff(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Filter Length: <strong>{length}</strong>
        </label>
        <input
          type="range"
          min="5"
          max="51"
          step="2"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div className="buttons" style={{ marginTop: "1rem" }}>
        <button className="btn primary" onClick={generateFilter}>
          Generate Filter
        </button>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {insight}
      </div>

      {impulse.length > 0 && (
        <>
          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px"
            }}
          >
            <div className="stat-card">
              <strong>Filter Type</strong>
              <div>{filterType === "lowpass" ? "Low Pass" : "High Pass"}</div>
            </div>

            <div className="stat-card">
              <strong>Window</strong>
              <div>{windowType}</div>
            </div>

            <div className="stat-card">
              <strong>Cutoff</strong>
              <div>{cutoff}</div>
            </div>

            <div className="stat-card">
              <strong>Length</strong>
              <div>{length}</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Generated Coefficients</h3>
            <p className="lab-output-value" style={{ marginTop: "0.75rem" }}>
              {impulse.map((v, i) =>
                i === 0 ? formatNumber(v, 4) : `, ${formatNumber(v, 4)}`
              )}
            </p>
          </div>
        </>
      )}
    </section>
  );
}