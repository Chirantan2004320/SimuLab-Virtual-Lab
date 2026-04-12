import React from "react";

function bitColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDPropagationDelaySimulation({
  selectedGate,
  setSelectedGate,
  inputBit,
  delayNs,
  setDelayNs,
  timeNs,
  analysis,
  transitionCount,
  handleToggleInput,
  handleAdvanceTime,
  handleResetTime
}) {
  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Toggle the input, then advance time to see when the output actually changes.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="stat-card">
          <strong>Gate Type</strong>
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            style={{
              marginTop: "10px",
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="NOT">NOT Gate</option>
            <option value="BUFFER">BUFFER Gate</option>
          </select>
        </div>

        <div className="stat-card">
          <strong>Propagation Delay</strong>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={delayNs}
            onChange={(e) => setDelayNs(Number(e.target.value))}
            style={{ marginTop: "10px", width: "100%" }}
          />
          <div style={{ marginTop: "8px" }}>{delayNs} ns</div>
        </div>

        <div className="stat-card">
          <strong>Current Time</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>
            {timeNs} ns
          </div>
        </div>

        <div className="stat-card">
          <strong>Transitions</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>
            {transitionCount}
          </div>
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
          <strong>Input</strong>
          <div style={{ color: bitColor(inputBit), fontWeight: "bold", fontSize: "1.3rem" }}>
            {inputBit}
          </div>
        </div>

        <div className="stat-card">
          <strong>Initial Output</strong>
          <div style={{ color: bitColor(analysis.initialOutput), fontWeight: "bold", fontSize: "1.3rem" }}>
            {analysis.initialOutput}
          </div>
        </div>

        <div className="stat-card">
          <strong>Observed Output</strong>
          <div style={{ color: bitColor(analysis.observedOutput), fontWeight: "bold", fontSize: "1.3rem" }}>
            {analysis.observedOutput}
          </div>
        </div>

        <div className="stat-card">
          <strong>Status</strong>
          <div>{analysis.state}</div>
        </div>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button className="btn primary" onClick={handleToggleInput}>
          Toggle Input
        </button>
        <button className="btn secondary" onClick={handleAdvanceTime}>
          Advance Time +1 ns
        </button>
        <button className="btn secondary" onClick={handleResetTime}>
          Reset Time
        </button>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>
    </section>
  );
}