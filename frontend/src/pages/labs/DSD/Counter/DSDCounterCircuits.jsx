import React from "react";

function signalColor(v) {
  return v === 1 ? "#22c55e" : "#374151";
}

export default function DSDCounterCircuits({ count, clockPulses, analysis }) {
  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This diagram shows a symbolic 2-bit counter with two output stages and a clock-driven state change.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "1rem"
        }}
      >
        <div className="stat-card">
          <strong>Current Count</strong>
          <div>{count}</div>
        </div>
        <div className="stat-card">
          <strong>Binary State</strong>
          <div>{analysis.binary}</div>
        </div>
        <div className="stat-card">
          <strong>Clock Pulses</strong>
          <div>{clockPulses}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Counter Flow</h3>

        <div
          style={{
            position: "relative",
            height: "360px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #09101d, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 820 360">
            <line x1="60" y1="290" x2="220" y2="290" stroke="#f59e0b" strokeWidth="5" />
            <text x="20" y="295" fill="#fbbf24" fontSize="20" fontWeight="bold">
              CLK
            </text>

            <rect
              x="220"
              y="90"
              width="140"
              height="180"
              rx="16"
              fill="rgba(59,130,246,0.14)"
              stroke="#60a5fa"
              strokeWidth="3"
            />
            <text x="290" y="175" textAnchor="middle" fill="#e5e7eb" fontSize="24" fontWeight="bold">
              FF0
            </text>
            <text x="290" y="205" textAnchor="middle" fill="#93c5fd" fontSize="16" fontWeight="bold">
              Q0 Stage
            </text>

            <rect
              x="470"
              y="90"
              width="140"
              height="180"
              rx="16"
              fill="rgba(59,130,246,0.14)"
              stroke="#60a5fa"
              strokeWidth="3"
            />
            <text x="540" y="175" textAnchor="middle" fill="#e5e7eb" fontSize="24" fontWeight="bold">
              FF1
            </text>
            <text x="540" y="205" textAnchor="middle" fill="#93c5fd" fontSize="16" fontWeight="bold">
              Q1 Stage
            </text>

            <line x1="360" y1="180" x2="470" y2="180" stroke="#64748b" strokeWidth="4" />
            <text x="415" y="165" textAnchor="middle" fill="#cbd5e1" fontSize="14">
              carry/toggle path
            </text>

            <line x1="360" y1="130" x2="740" y2="130" stroke={signalColor(analysis.q0)} strokeWidth="5" />
            <line x1="610" y1="230" x2="740" y2="230" stroke={signalColor(analysis.q1)} strokeWidth="5" />

            <text x="752" y="135" fill={analysis.q0 === 1 ? "#22c55e" : "#9ca3af"} fontSize="18" fontWeight="bold">
              Q0 = {analysis.q0}
            </text>
            <text x="752" y="235" fill={analysis.q1 === 1 ? "#22c55e" : "#9ca3af"} fontSize="18" fontWeight="bold">
              Q1 = {analysis.q1}
            </text>

            <text x="410" y="330" textAnchor="middle" fill="#fbbf24" fontSize="18" fontWeight="bold">
              Current State → {analysis.binary}
            </text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The counter advances by one binary step on each clock pulse.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For the current state, the outputs are <strong>Q1 = {analysis.q1}</strong> and <strong>Q0 = {analysis.q0}</strong>.
        </p>
      </div>
    </section>
  );
}