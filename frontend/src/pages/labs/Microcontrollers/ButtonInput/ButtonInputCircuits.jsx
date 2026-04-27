import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap } from "lucide-react";

export default function ButtonInputCircuits({ inputMode, buttonPressed, analysis }) {
  const isHigh = analysis.readValue === 1;

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <CircuitBoard size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Circuits</h2>
            <p className="sorting-sim-subtitle">
              Symbolic view of button input biasing and GPIO reading.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Mode</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {inputMode === "PULL_DOWN" ? "Pull-down" : "Pull-up"}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Button</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.buttonLabel}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">GPIO D2</span>
          <span className="sorting-stat-value" style={{ color: isHigh ? "#22c55e" : "#ef4444" }}>
            {analysis.readLabel}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Voltage</span>
          <span className="sorting-stat-value" style={{ color: isHigh ? "#22c55e" : "#ef4444", fontSize: "1rem" }}>
            {analysis.voltage}
          </span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Button Input Circuit</h3>
          <div className="dsd-circuit-badge">
            <Zap size={16} />
            GPIO Read Path
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ minHeight: 470 }}>
          <svg width="100%" height="100%" viewBox="0 0 1100 470" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="btnCircuitGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="115" y="155" width="220" height="160" rx="22" fill="rgba(59,130,246,0.13)" stroke="#60a5fa" strokeWidth="3" />
            <text x="225" y="230" textAnchor="middle" fill="#f8fafc" fontSize="32" fontWeight="900">MCU</text>
            <text x="225" y="262" textAnchor="middle" fill="#7dd3fc" fontSize="18" fontWeight="800">GPIO D2</text>

            <path d="M 335 235 L 505 235" stroke={isHigh ? "#22c55e" : "#ef4444"} strokeWidth="7" strokeLinecap="round" filter={isHigh ? "url(#btnCircuitGlow)" : undefined} />

            <rect x="505" y="190" width="160" height="90" rx="18" fill={buttonPressed ? "rgba(34,197,94,.18)" : "rgba(51,65,85,.9)"} stroke={buttonPressed ? "#22c55e" : "#94a3b8"} strokeWidth="4" />
            <circle cx="585" cy="235" r={buttonPressed ? 20 : 28} fill={buttonPressed ? "#22c55e" : "#64748b"} stroke="#e2e8f0" strokeWidth="3" />
            <text x="585" y="315" textAnchor="middle" fill="#e2e8f0" fontSize="20" fontWeight="900">
              {buttonPressed ? "BUTTON PRESSED" : "BUTTON RELEASED"}
            </text>

            {inputMode === "PULL_DOWN" ? (
              <>
                <path d="M 585 280 L 585 345" stroke="#94a3b8" strokeWidth="6" />
                <rect x="540" y="345" width="90" height="38" rx="10" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
                <text x="585" y="369" textAnchor="middle" fill="#111827" fontSize="16" fontWeight="900">10kΩ</text>
                <line x1="545" y1="405" x2="625" y2="405" stroke="#94a3b8" strokeWidth="5" />
                <line x1="558" y1="418" x2="612" y2="418" stroke="#94a3b8" strokeWidth="4" />
                <line x1="570" y1="430" x2="600" y2="430" stroke="#94a3b8" strokeWidth="3" />
                <path d="M 665 235 L 850 235 L 850 130" stroke={buttonPressed ? "#22c55e" : "#475569"} strokeWidth="6" fill="none" strokeLinecap="round" />
                <text x="835" y="112" fill="#22c55e" fontSize="24" fontWeight="900">5V</text>
              </>
            ) : (
              <>
                <path d="M 585 190 L 585 120" stroke="#22c55e" strokeWidth="6" />
                <text x="600" y="110" fill="#22c55e" fontSize="24" fontWeight="900">5V</text>
                <rect x="540" y="125" width="90" height="38" rx="10" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
                <text x="585" y="150" textAnchor="middle" fill="#111827" fontSize="16" fontWeight="900">10kΩ</text>
                <path d="M 665 235 L 850 235 L 850 405" stroke={buttonPressed ? "#94a3b8" : "#475569"} strokeWidth="6" fill="none" strokeLinecap="round" />
                <line x1="810" y1="405" x2="890" y2="405" stroke="#94a3b8" strokeWidth="5" />
                <line x1="823" y1="418" x2="877" y2="418" stroke="#94a3b8" strokeWidth="4" />
                <line x1="835" y1="430" x2="865" y2="430" stroke="#94a3b8" strokeWidth="3" />
              </>
            )}

            <rect x="770" y="305" width="250" height="86" rx="20" fill={isHigh ? "rgba(34,197,94,.13)" : "rgba(239,68,68,.10)"} stroke={isHigh ? "rgba(34,197,94,.42)" : "rgba(239,68,68,.35)"} />
            <text x="895" y="338" textAnchor="middle" fill="#94a3b8" fontSize="16" fontWeight="800">GPIO INPUT RESULT</text>
            <text x="895" y="370" textAnchor="middle" fill={isHigh ? "#22c55e" : "#ef4444"} fontSize="28" fontWeight="900">
              D2 = {analysis.readLabel}
            </text>
          </svg>
        </div>

        <div className="dsd-circuit-note-grid">
          <div className="overview-card">
            <div className="overview-card-head">
              <Info size={18} />
              <h4>Circuit Interpretation</h4>
            </div>
            <p>
              The button is <strong>{analysis.buttonLabel}</strong> and the input mode is{" "}
              <strong>{inputMode === "PULL_DOWN" ? "pull-down" : "pull-up"}</strong>.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Observation</h4>
            </div>
            <p>{analysis.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}