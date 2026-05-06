import React from "react";
import {
  CircuitBoard,
  Info,
  Lock,
  Star
} from "lucide-react";

export default function DVLSIMOSFETCircuits({
  deviceType,
  vgs,
  vds,
  vt,
  analysis,
  formatNumber
}) {
  const isCutoff = analysis.region === "Cutoff";
  const isTriode = analysis.region === "Triode";
  const isSaturation = analysis.region === "Saturation";

  const activeColor = isCutoff ? "#ef4444" : "#22c55e";
  const regionColor = isSaturation ? "#22c55e" : isTriode ? "#38bdf8" : "#ef4444";

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <CircuitBoard size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Circuits</h2>
          <p className="sorting-sim-subtitle">
            Premium MOSFET device view showing gate control, channel formation, pinch-off, and current flow.
          </p>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Device Type</span>
          <span className="sorting-stat-value">{deviceType.toUpperCase()}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Region</span>
          <span className="sorting-stat-value" style={{ color: regionColor }}>
            {analysis.region}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">VGS</span>
          <span className="sorting-stat-value">{formatNumber(vgs)} V</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">VDS</span>
          <span className="sorting-stat-value">{formatNumber(vds)} V</span>
        </div>
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <CircuitBoard size={18} />
          <h4>MOSFET Device View</h4>
        </div>

        <div
          style={{
            position: "relative",
            minHeight: 480,
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid rgba(56,189,248,0.25)",
            background:
              "radial-gradient(circle at 30% 15%, rgba(56,189,248,0.12), transparent 35%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.12), transparent 35%), linear-gradient(135deg, #020617, #08111f)"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(148,163,184,0.16) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              opacity: 0.22
            }}
          />

          <svg
            width="100%"
            height="480"
            viewBox="0 0 980 480"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "relative", zIndex: 1 }}
          >
            {/* Left voltage cards */}
            <foreignObject x="30" y="88" width="155" height="95">
              <div className="stat-card" style={{ height: "100%" }}>
                <strong style={{ color: "#22c55e" }}>VGS</strong>
                <div style={{ color: "#22c55e", fontWeight: 800 }}>
                  {formatNumber(vgs)} V
                </div>
                <span style={{ fontSize: 12, color: "#cbd5e1" }}>
                  Gate to Source
                </span>
              </div>
            </foreignObject>

            <foreignObject x="30" y="270" width="155" height="95">
              <div className="stat-card" style={{ height: "100%" }}>
                <strong style={{ color: "#f59e0b" }}>VDS</strong>
                <div style={{ color: "#f59e0b", fontWeight: 800 }}>
                  {formatNumber(vds)} V
                </div>
                <span style={{ fontSize: 12, color: "#cbd5e1" }}>
                  Drain to Source
                </span>
              </div>
            </foreignObject>

            {/* Dashed control wires */}
            <path
              d="M185 135 C230 135, 230 190, 285 190"
              stroke="#22c55e"
              strokeWidth="2"
              strokeDasharray="5 5"
              fill="none"
            />
            <path
              d="M185 318 C230 318, 230 245, 285 245"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 5"
              fill="none"
            />

            {/* Gate and oxide */}
            <rect
              x="285"
              y="165"
              width="70"
              height="150"
              rx="12"
              fill="url(#gateGrad)"
              stroke="#a855f7"
              strokeWidth="3"
            />
            <text
              x="320"
              y="245"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="20"
              fontWeight="800"
              transform="rotate(-90 320 245)"
            >
              Gate
            </text>

            <rect x="375" y="150" width="28" height="180" fill="#cbd5e1" opacity="0.85" />
            <text
              x="395"
              y="245"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="12"
              fontWeight="800"
              transform="rotate(-90 395 245)"
            >
              SiO₂ Oxide
            </text>

            {/* Main body */}
            <rect
              x="440"
              y="135"
              width="300"
              height="235"
              rx="22"
              fill="rgba(16,185,129,0.14)"
              stroke="#5eead4"
              strokeWidth="2.5"
            />

            <text x="590" y="250" textAnchor="middle" fill="#e2e8f0" fontSize="20" fontWeight="700">
              p-type
            </text>
            <text x="590" y="276" textAnchor="middle" fill="#cbd5e1" fontSize="16">
              Body
            </text>

            {/* Drain and source regions */}
            <rect x="650" y="158" width="70" height="34" rx="12" fill="#0f3b72" stroke="#38bdf8" />
            <text x="685" y="181" textAnchor="middle" fill="#e0f2fe" fontSize="17" fontWeight="800">
              n+
            </text>
            <text x="685" y="215" textAnchor="middle" fill="#e5e7eb" fontSize="14">
              Drain Region
            </text>

            <rect x="650" y="300" width="70" height="34" rx="12" fill="#0f3b72" stroke="#38bdf8" />
            <text x="685" y="323" textAnchor="middle" fill="#e0f2fe" fontSize="17" fontWeight="800">
              n+
            </text>
            <text x="685" y="358" textAnchor="middle" fill="#e5e7eb" fontSize="14">
              Source Region
            </text>

            {/* Drain / source labels */}
            <rect x="505" y="45" width="125" height="42" rx="10" fill="#111827" stroke="#cbd5e1" />
            <text x="568" y="72" textAnchor="middle" fill="#f8fafc" fontSize="19" fontWeight="800">
              Drain
            </text>

            <rect x="505" y="400" width="125" height="42" rx="10" fill="#111827" stroke="#cbd5e1" />
            <text x="568" y="427" textAnchor="middle" fill="#f8fafc" fontSize="19" fontWeight="800">
              Source
            </text>

            {/* Current path */}
            {!isCutoff && (
              <>
                <line
                  x1="568"
                  y1="87"
                  x2="568"
                  y2="400"
                  stroke="#22c55e"
                  strokeWidth="5"
                  opacity="0.9"
                />
                <polygon points="568,394 557,374 579,374" fill="#22c55e" />

                <text x="590" y="455" fill="#22c55e" fontSize="15" fontWeight="700">
                  Current flow: Drain → Source
                </text>
              </>
            )}

            {/* Channel visualization */}
            {isTriode && (
              <rect
                x="510"
                y="135"
                width="48"
                height="235"
                rx="22"
                fill="rgba(34,197,94,0.75)"
                stroke="#86efac"
                strokeWidth="2"
              />
            )}

            {isSaturation && (
              <>
                <path
                  d="M512 155 C535 220, 535 290, 512 350"
                  fill="rgba(34,197,94,0.72)"
                  stroke="#86efac"
                  strokeWidth="2"
                />
                <path
                  d="M560 155 C535 220, 535 290, 560 350"
                  fill="rgba(34,197,94,0.72)"
                  stroke="#86efac"
                  strokeWidth="2"
                />
                <line
                  x1="492"
                  y1="155"
                  x2="610"
                  y2="155"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="10 8"
                />
                <text x="488" y="126" fill="#f8fafc" fontSize="14" fontWeight="700">
                  Pinch-off
                </text>
                <ArrowDownIcon x={500} y={128} />
              </>
            )}

            {isCutoff && (
              <>
                <line
                  x1="510"
                  y1="150"
                  x2="560"
                  y2="350"
                  stroke="#ef4444"
                  strokeWidth="5"
                  opacity="0.8"
                />
                <line
                  x1="560"
                  y1="150"
                  x2="510"
                  y2="350"
                  stroke="#ef4444"
                  strokeWidth="5"
                  opacity="0.8"
                />
                <text x="505" y="125" fill="#ef4444" fontSize="15" fontWeight="800">
                  No Channel
                </text>
              </>
            )}

            {/* Right information panel */}
            <foreignObject x="780" y="92" width="170" height="290">
              <div
                style={{
                  height: "100%",
                  borderRadius: 18,
                  padding: 18,
                  background:
                    "linear-gradient(180deg, rgba(15,23,42,0.94), rgba(2,6,23,0.9))",
                  border: "1px solid rgba(148,163,184,0.25)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    color: "#e5e7eb",
                    fontWeight: 800,
                    marginBottom: 18
                  }}
                >
                  <Info size={16} color="#38bdf8" />
                  Device Information
                </div>

                <InfoRow label="Device Region" value={analysis.region} color={regionColor} />
                <InfoRow label="Channel State" value={analysis.channelState} />
                <InfoRow
                  label="Conduction State"
                  value={analysis.conductionState}
                  color={activeColor}
                />
                <InfoRow
                  label="Current Direction"
                  value={isCutoff ? "No current" : "Drain → Source"}
                  color={isCutoff ? "#ef4444" : "#22c55e"}
                />
              </div>
            </foreignObject>

            <defs>
              <linearGradient id="gateGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Star size={18} />
          <h4>Circuit Interpretation</h4>
        </div>

        <p>
          {isCutoff &&
            "The gate voltage is below threshold, so no strong inversion channel forms. Drain and source are effectively disconnected."}
          {isTriode &&
            "A continuous inversion channel exists between drain and source. The MOSFET behaves like a voltage-controlled resistor."}
          {isSaturation &&
            "The channel pinches off near the drain side. Current still flows, but becomes much less dependent on VDS."}
        </p>
      </div>
    </section>
  );
}

function InfoRow({ label, value, color = "#cbd5e1" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: 13,
          color: "#cbd5e1",
          marginBottom: 5
        }}
      >
        <Lock size={12} />
        {label}
      </div>
      <div style={{ color, fontWeight: 800, fontSize: 15 }}>{value}</div>
    </div>
  );
}

function ArrowDownIcon({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="12" y1="0" x2="12" y2="32" stroke="#f8fafc" strokeWidth="3" />
      <polygon points="12,42 3,28 21,28" fill="#f8fafc" />
    </g>
  );
}