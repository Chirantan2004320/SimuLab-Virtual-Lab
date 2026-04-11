import React from "react";

export default function DVLSIRingOscillatorCircuits({ stages, enabled, analysis }) {
  const inverterPositions = [];
  const centerX = 380;
  const centerY = 220;
  const radius = 120;

  for (let i = 0; i < stages; i++) {
    const angle = (2 * Math.PI * i) / stages - Math.PI / 2;
    inverterPositions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }

  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        A ring oscillator is a closed loop of inverters. Oscillation occurs only when the
        loop has an odd number of inverting stages and the circuit is enabled.
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
          <strong>Stages</strong>
          <div>{stages}</div>
        </div>
        <div className="stat-card">
          <strong>Enabled</strong>
          <div>{enabled ? "Yes" : "No"}</div>
        </div>
        <div className="stat-card">
          <strong>Oscillating</strong>
          <div>{analysis.oscillates ? "Yes" : "No"}</div>
        </div>
        <div className="stat-card">
          <strong>Condition</strong>
          <div>{analysis.logicCase}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Ring Oscillator Loop</h3>

        <div
          style={{
            position: "relative",
            height: "460px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 460" preserveAspectRatio="xMidYMid meet">
            {/* Loop connections */}
            {inverterPositions.map((pos, i) => {
              const next = inverterPositions[(i + 1) % inverterPositions.length];
              return (
                <line
                  key={`line-${i}`}
                  x1={pos.x}
                  y1={pos.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={analysis.oscillates ? "#22c55e" : "#64748b"}
                  strokeWidth="4"
                  opacity="0.8"
                />
              );
            })}

            {/* Inverters */}
            {inverterPositions.map((pos, i) => (
              <g key={`inv-${i}`}>
                <rect
                  x={pos.x - 36}
                  y={pos.y - 24}
                  width="72"
                  height="48"
                  rx="10"
                  fill={analysis.oscillates ? "rgba(34,197,94,0.18)" : "rgba(148,163,184,0.14)"}
                  stroke={analysis.oscillates ? "#22c55e" : "#94a3b8"}
                  strokeWidth="2.5"
                />
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  fill="#e5e7eb"
                  fontSize="16"
                  fontWeight="bold"
                >
                  INV{i + 1}
                </text>
              </g>
            ))}

            {/* Center label */}
            <text x="380" y="225" textAnchor="middle" fill="#fcd34d" fontSize="20" fontWeight="bold">
              {analysis.oscillates ? "OSCILLATING" : "NO OSCILLATION"}
            </text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Circuit Insight</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          When the loop contains an odd number of inverters, the feedback cannot settle to a single
          consistent logic state. Because each inverter also has delay, the signal keeps toggling,
          producing oscillation.
        </p>
      </div>
    </section>
  );
}