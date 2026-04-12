import React, { useEffect } from "react";

function LED({ active, label, color = "#22c55e" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px"
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: active ? color : "#1f2937",
          boxShadow: active
            ? `0 0 12px ${color}, 0 0 24px ${color}`
            : "inset 0 0 6px #000",
          border: "2px solid #374151",
          transition: "all 0.3s ease"
        }}
      />
      <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>{label}</span>
    </div>
  );
}

export default function DSDCounterSimulation({
  count,
  clockPulses,
  analysis,
  handleClockPulse,
  handleReset,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [count, clockPulses, setExperimentRun]);

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Apply clock pulses to move the counter through its binary sequence.
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "1rem" }}>
        <button className="btn primary" onClick={handleClockPulse}>
          Apply Clock Pulse
        </button>
        <button className="btn secondary" onClick={handleReset}>
          Reset Counter
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="stat-card">
          <strong>Decimal Count</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>
            {count}
          </div>
        </div>

        <div className="stat-card">
          <strong>Binary State</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>
            {analysis.binary}
          </div>
        </div>

        <div className="stat-card">
          <strong>Next State</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>
            {analysis.nextBinary}
          </div>
        </div>

        <div className="stat-card">
          <strong>Clock Pulses</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>
            {clockPulses}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Output Bits</h3>
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            justifyItems: "center"
          }}
        >
          <LED active={analysis.q1 === 1} label={`Q1 = ${analysis.q1}`} color="#38bdf8" />
          <LED active={analysis.q0 === 1} label={`Q0 = ${analysis.q0}`} color="#22c55e" />
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Observation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>{analysis.note}</p>
      </div>
    </section>
  );
}