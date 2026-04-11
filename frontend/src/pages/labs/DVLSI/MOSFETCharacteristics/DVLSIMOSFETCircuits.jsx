import React from "react";

export default function DVLSIMOSFETCircuits({
  deviceType,
  vgs,
  vds,
  vt,
  analysis,
  formatNumber
}) {
  const activeColor = analysis.region === "Cutoff" ? "#ef4444" : "#22c55e";
  const bodyFill = analysis.region === "Cutoff" ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.14)";
  const channelHeight =
    analysis.region === "Cutoff" ? 0 : analysis.region === "Triode" ? 70 : 55;

  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This section visualizes the MOSFET structure and shows whether a conduction channel
        is formed between drain and source.
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
          <strong>Device Type</strong>
          <div>{deviceType.toUpperCase()}</div>
        </div>
        <div className="stat-card">
          <strong>Region</strong>
          <div>{analysis.region}</div>
        </div>
        <div className="stat-card">
          <strong>VGS</strong>
          <div>{formatNumber(vgs)} V</div>
        </div>
        <div className="stat-card">
          <strong>VDS</strong>
          <div>{formatNumber(vds)} V</div>
        </div>
      </div>

      <div className="card" style={{ background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>MOSFET Device View</h3>

        <div
          style={{
            position: "relative",
            height: "360px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 720 360" preserveAspectRatio="xMidYMid meet">
            {/* Drain and Source */}
            <rect x="295" y="40" width="130" height="36" rx="8" fill="#1e293b" stroke="#cbd5e1" />
            <rect x="295" y="284" width="130" height="36" rx="8" fill="#1e293b" stroke="#cbd5e1" />

            <text x="360" y="63" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">
              Drain
            </text>
            <text x="360" y="307" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">
              Source
            </text>

            {/* Semiconductor body */}
            <rect
              x="250"
              y="90"
              width="220"
              height="180"
              rx="16"
              fill={bodyFill}
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Gate */}
            <rect x="110" y="140" width="90" height="80" rx="10" fill="#172554" stroke="#60a5fa" strokeWidth="2.5" />
            <text x="155" y="185" textAnchor="middle" fill="#93c5fd" fontSize="20" fontWeight="bold">
              Gate
            </text>

            {/* Oxide gap */}
            <line x1="220" y1="115" x2="220" y2="245" stroke="#cbd5e1" strokeWidth="4" />

            {/* Channel */}
            {analysis.region !== "Cutoff" && (
              <rect
                x="236"
                y={analysis.region === "Triode" ? 110 : 125}
                width="16"
                height={channelHeight}
                rx="8"
                fill={activeColor}
                opacity="0.9"
              />
            )}

            {/* Pinch-off indication */}
            {analysis.region === "Saturation" && (
              <polygon
                points="244,125 254,135 244,145"
                fill="#f59e0b"
              />
            )}

            {/* Current direction */}
            {analysis.region !== "Cutoff" && (
              <>
                <line x1="360" y1="76" x2="360" y2="284" stroke={activeColor} strokeWidth="4" opacity="0.8" />
                <polygon points="360,275 354,263 366,263" fill={activeColor} />
              </>
            )}

            {/* Labels */}
            <text x="488" y="120" fill="#e5e7eb" fontSize="18" fontWeight="bold">Device Region</text>
            <text x="488" y="150" fill={activeColor} fontSize="18">{analysis.region}</text>

            <text x="488" y="200" fill="#e5e7eb" fontSize="18" fontWeight="bold">Channel State</text>
            <text x="488" y="230" fill="#cbd5e1" fontSize="16">{analysis.channelState}</text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Circuit Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          {analysis.region === "Cutoff" &&
            "The gate voltage is too small to form an inversion channel, so the drain and source are effectively disconnected."}
          {analysis.region === "Triode" &&
            "A strong channel is formed from source to drain. The device behaves like a controllable resistor."}
          {analysis.region === "Saturation" &&
            "The channel pinches off near the drain side. Current still flows, but it becomes much less dependent on VDS."}
        </p>
      </div>
    </section>
  );
}