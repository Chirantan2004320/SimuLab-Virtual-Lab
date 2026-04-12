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
          width: "28px",
          height: "28px",
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

export default function DSDComparatorSimulation({
  a,
  setA,
  b,
  setB,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [a, b, setExperimentRun]);

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Toggle inputs A and B to observe how the comparator determines whether A is greater than, equal to, or less than B.
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>Inputs</h3>
        <div style={{ display: "flex", gap: "12px", marginTop: "0.75rem", flexWrap: "wrap" }}>
          <button className="btn primary" onClick={() => setA(a ^ 1)}>
            A = {a}
          </button>
          <button className="btn primary" onClick={() => setB(b ^ 1)}>
            B = {b}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Comparator Outputs</h3>
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            justifyItems: "center"
          }}
        >
          <LED active={analysis.greater === 1} label="A > B" color="#22c55e" />
          <LED active={analysis.equal === 1} label="A = B" color="#38bdf8" />
          <LED active={analysis.less === 1} label="A < B" color="#f59e0b" />
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
          <strong>Input A</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>{a}</div>
        </div>

        <div className="stat-card">
          <strong>Input B</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>{b}</div>
        </div>

        <div className="stat-card">
          <strong>Relation</strong>
          <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "1.2rem" }}>
            {analysis.relation}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Observation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>{analysis.note}</p>
      </div>
    </section>
  );
}