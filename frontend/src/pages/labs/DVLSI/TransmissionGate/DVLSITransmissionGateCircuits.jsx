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

export default function DVLSITransmissionGateCircuits({
  inputSignal,
  control,
  mode,
  analysis
}) {
  const isTG = mode === "transmission-gate";

  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        {isTG
          ? "A transmission gate uses one nMOS and one pMOS in parallel, driven by complementary control signals."
          : "A single pass transistor uses only one nMOS switch. It is simpler but may pass logic 1 weakly."}
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
          <strong>Input</strong>
          <div>{inputSignal}</div>
        </div>
        <div className="stat-card">
          <strong>Control</strong>
          <div>{control}</div>
        </div>
        <div className="stat-card">
          <strong>Output</strong>
          <div>{analysis.output}</div>
        </div>
        <div className="stat-card">
          <strong>Current Path</strong>
          <div>{analysis.currentPath}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>
          {isTG ? "Transmission Gate Visual" : "Single Pass nMOS Visual"}
        </h3>

        <div
          style={{
            position: "relative",
            height: "420px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 420" preserveAspectRatio="xMidYMid meet">
            {/* Input/output line */}
            <line x1="100" y1="210" x2="660" y2="210" stroke="#fbbf24" strokeWidth="4" />
            <circle cx="150" cy="210" r="6" fill="#fbbf24" />
            <circle cx="610" cy="210" r="6" fill="#fbbf24" />

            {/* Labels */}
            <text x="70" y="215" fill="#fcd34d" fontSize="18" fontWeight="bold">IN = {inputSignal}</text>
            <text x="620" y="215" fill="#fcd34d" fontSize="18" fontWeight="bold">OUT = {analysis.output}</text>

            {isTG ? (
              <>
                {/* nMOS */}
                <rect
                  x="300"
                  y="150"
                  width="90"
                  height="60"
                  rx="10"
                  fill={analysis.nmosState === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
                  stroke={analysis.nmosState === "ON" ? "#22c55e" : "#ef4444"}
                  strokeWidth="3"
                />
                <text x="345" y="186" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">nMOS</text>

                {/* pMOS */}
                <rect
                  x="300"
                  y="240"
                  width="90"
                  height="60"
                  rx="10"
                  fill={analysis.pmosState === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
                  stroke={analysis.pmosState === "ON" ? "#22c55e" : "#ef4444"}
                  strokeWidth="3"
                />
                <text x="345" y="276" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">pMOS</text>

                {/* parallel branches */}
                <line x1="260" y1="210" x2="300" y2="180" stroke="#fbbf24" strokeWidth="4" />
                <line x1="390" y1="180" x2="430" y2="210" stroke="#fbbf24" strokeWidth="4" />
                <line x1="260" y1="210" x2="300" y2="270" stroke="#fbbf24" strokeWidth="4" />
                <line x1="390" y1="270" x2="430" y2="210" stroke="#fbbf24" strokeWidth="4" />

                {/* gate controls */}
                <line x1="170" y1="110" x2="300" y2="110" stroke="#c084fc" strokeWidth="4" />
                <line x1="300" y1="110" x2="300" y2="150" stroke="#c084fc" strokeWidth="4" />
                <text x="80" y="115" fill="#d8b4fe" fontSize="18" fontWeight="bold">C = {control}</text>

                <line x1="590" y1="330" x2="390" y2="330" stroke="#f9a8d4" strokeWidth="4" />
                <line x1="390" y1="300" x2="390" y2="330" stroke="#f9a8d4" strokeWidth="4" />
                <text x="600" y="335" fill="#fbcfe8" fontSize="18" fontWeight="bold">C̅ = {analysis.controlBar}</text>
              </>
            ) : (
              <>
                {/* single nmos */}
                <rect
                  x="320"
                  y="180"
                  width="100"
                  height="60"
                  rx="10"
                  fill={analysis.nmosState === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
                  stroke={analysis.nmosState === "ON" ? "#22c55e" : "#ef4444"}
                  strokeWidth="3"
                />
                <text x="370" y="216" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">nMOS</text>

                <line x1="160" y1="120" x2="320" y2="120" stroke="#c084fc" strokeWidth="4" />
                <line x1="320" y1="120" x2="320" y2="180" stroke="#c084fc" strokeWidth="4" />
                <text x="70" y="125" fill="#d8b4fe" fontSize="18" fontWeight="bold">C = {control}</text>
              </>
            )}
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
        <div style={transistorStyle(analysis.nmosState)}>
          <strong>nMOS</strong>
          <div style={{ marginTop: "8px" }}>{analysis.nmosState}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            ON when control = 1
          </div>
        </div>

        {isTG && (
          <div style={transistorStyle(analysis.pmosState)}>
            <strong>pMOS</strong>
            <div style={{ marginTop: "8px" }}>{analysis.pmosState}</div>
            <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
              ON when control̅ = 0
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Comparison Insight</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          {isTG
            ? "Because both transistor types conduct together, the transmission gate can pass both logic 0 and logic 1 more effectively."
            : "A single nMOS pass transistor is simple, but it may not pass a strong logic 1 because of threshold voltage loss."}
        </p>
      </div>
    </section>
  );
}