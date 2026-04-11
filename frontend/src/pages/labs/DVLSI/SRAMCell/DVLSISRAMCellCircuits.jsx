import React from "react";

function transistorStyle(state) {
  const active = state === "ON";

  return {
    border: active ? "2px solid #22c55e" : "2px solid #ef4444",
    background: active ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.12)",
    color: "#e5e7eb",
    borderRadius: "12px",
    padding: "12px 14px",
    minWidth: "120px",
    textAlign: "center",
    boxShadow: active
      ? "0 0 14px rgba(34,197,94,0.25)"
      : "0 0 10px rgba(239,68,68,0.12)"
  };
}

export default function DVLSISRAMCellCircuits({
  bitline,
  bitlineBar,
  wordline,
  operation,
  analysis
}) {
  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        A basic SRAM cell uses two cross-coupled inverters to hold data and two access
        transistors controlled by the wordline to connect the cell to the bitlines.
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
          <strong>Operation</strong>
          <div>{operation.toUpperCase()}</div>
        </div>
        <div className="stat-card">
          <strong>Wordline</strong>
          <div>{wordline}</div>
        </div>
        <div className="stat-card">
          <strong>Bitline</strong>
          <div>{bitline}</div>
        </div>
        <div className="stat-card">
          <strong>Bitline̅</strong>
          <div>{bitlineBar}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>6T SRAM Cell Visual</h3>

        <div
          style={{
            position: "relative",
            height: "500px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 500" preserveAspectRatio="xMidYMid meet">
            {/* Bitlines */}
            <line x1="180" y1="40" x2="180" y2="460" stroke="#60a5fa" strokeWidth="4" />
            <line x1="580" y1="40" x2="580" y2="460" stroke="#60a5fa" strokeWidth="4" />

            {/* Wordline */}
            <line x1="80" y1="250" x2="680" y2="250" stroke="#f59e0b" strokeWidth="4" />

            {/* Access transistors */}
            <rect
              x="220"
              y="220"
              width="70"
              height="60"
              rx="10"
              fill={analysis.accessLeft === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
              stroke={analysis.accessLeft === "ON" ? "#22c55e" : "#ef4444"}
              strokeWidth="3"
            />
            <rect
              x="470"
              y="220"
              width="70"
              height="60"
              rx="10"
              fill={analysis.accessRight === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
              stroke={analysis.accessRight === "ON" ? "#22c55e" : "#ef4444"}
              strokeWidth="3"
            />

            {/* Internal nodes */}
            <circle cx="330" cy="180" r="7" fill="#22c55e" />
            <circle cx="430" cy="320" r="7" fill="#ef4444" />

            {/* Cross-coupled inverter style lines */}
            <line x1="330" y1="180" x2="430" y2="180" stroke="#c084fc" strokeWidth="4" />
            <line x1="430" y1="180" x2="430" y2="320" stroke="#c084fc" strokeWidth="4" />
            <line x1="430" y1="320" x2="330" y2="320" stroke="#c084fc" strokeWidth="4" />
            <line x1="330" y1="320" x2="330" y2="180" stroke="#c084fc" strokeWidth="4" />

            {/* Access connections */}
            <line x1="180" y1="250" x2="220" y2="250" stroke="#60a5fa" strokeWidth="4" />
            <line x1="290" y1="250" x2="330" y2="180" stroke="#fbbf24" strokeWidth="4" />
            <line x1="470" y1="250" x2="430" y2="320" stroke="#fbbf24" strokeWidth="4" />
            <line x1="540" y1="250" x2="580" y2="250" stroke="#60a5fa" strokeWidth="4" />

            {/* Labels */}
            <text x="150" y="35" fill="#93c5fd" fontSize="18" fontWeight="bold">BL = {bitline}</text>
            <text x="545" y="35" fill="#93c5fd" fontSize="18" fontWeight="bold">BL̅ = {bitlineBar}</text>
            <text x="40" y="255" fill="#fcd34d" fontSize="18" fontWeight="bold">WL = {wordline}</text>
            <text x="315" y="165" fill="#86efac" fontSize="18" fontWeight="bold">Q = {analysis.q}</text>
            <text x="405" y="345" fill="#fca5a5" fontSize="18" fontWeight="bold">Q̅ = {analysis.qBar}</text>

            <text x="255" y="255" textAnchor="middle" fill="#e5e7eb" fontSize="14">AX-L</text>
            <text x="505" y="255" textAnchor="middle" fill="#e5e7eb" fontSize="14">AX-R</text>
          </svg>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px"
        }}
      >
        <div style={transistorStyle(analysis.accessLeft)}>
          <strong>Access Left</strong>
          <div style={{ marginTop: "8px" }}>{analysis.accessLeft}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            Controlled by wordline
          </div>
        </div>

        <div style={transistorStyle(analysis.accessRight)}>
          <strong>Access Right</strong>
          <div style={{ marginTop: "8px" }}>{analysis.accessRight}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            Controlled by wordline
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Circuit Insight</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The cross-coupled inverter loop stores the bit, while the wordline activates the
          access transistors so the cell can interact with the bitline pair during read or write operations.
        </p>
      </div>
    </section>
  );
}