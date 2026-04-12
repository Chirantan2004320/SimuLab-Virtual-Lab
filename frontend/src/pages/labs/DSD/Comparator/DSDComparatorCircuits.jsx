import React from "react";

function signalColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDComparatorCircuits({ a, b, analysis }) {
  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This diagram shows a symbolic 1-bit comparator and the active comparison result.
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
          <strong>A</strong>
          <div>{a}</div>
        </div>
        <div className="stat-card">
          <strong>B</strong>
          <div>{b}</div>
        </div>
        <div className="stat-card">
          <strong>Relation</strong>
          <div>{analysis.relation}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Comparator Flow</h3>

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
            <line x1="80" y1="120" x2="300" y2="120" stroke={signalColor(a)} strokeWidth="4" />
            <line x1="80" y1="220" x2="300" y2="220" stroke={signalColor(b)} strokeWidth="4" />

            <text x="20" y="125" fill={signalColor(a)} fontSize="20" fontWeight="bold">
              A = {a}
            </text>
            <text x="20" y="225" fill={signalColor(b)} fontSize="20" fontWeight="bold">
              B = {b}
            </text>

            <rect
              x="300"
              y="70"
              width="200"
              height="220"
              rx="18"
              fill="rgba(59,130,246,0.14)"
              stroke="#60a5fa"
              strokeWidth="3"
            />

            <text
              x="400"
              y="170"
              textAnchor="middle"
              fill="#e5e7eb"
              fontSize="28"
              fontWeight="bold"
            >
              COMPARATOR
            </text>

            <line x1="500" y1="110" x2="700" y2="110" stroke={analysis.greater ? "#22c55e" : "#374151"} strokeWidth="5" />
            <line x1="500" y1="180" x2="700" y2="180" stroke={analysis.equal ? "#38bdf8" : "#374151"} strokeWidth="5" />
            <line x1="500" y1="250" x2="700" y2="250" stroke={analysis.less ? "#f59e0b" : "#374151"} strokeWidth="5" />

            <text x="720" y="115" fill={analysis.greater ? "#22c55e" : "#9ca3af"} fontSize="18" fontWeight="bold">
              A &gt; B
            </text>
            <text x="720" y="185" fill={analysis.equal ? "#38bdf8" : "#9ca3af"} fontSize="18" fontWeight="bold">
              A = B
            </text>
            <text x="720" y="255" fill={analysis.less ? "#f59e0b" : "#9ca3af"} fontSize="18" fontWeight="bold">
              A &lt; B
            </text>

            <text
              x="400"
              y="325"
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="18"
              fontWeight="bold"
            >
              Active Relation → {analysis.relation}
            </text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The comparator checks the two inputs and activates only one of the three outputs: greater, equal, or less.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For the current values, the active relation is <strong>{analysis.relation}</strong>.
        </p>
      </div>
    </section>
  );
}