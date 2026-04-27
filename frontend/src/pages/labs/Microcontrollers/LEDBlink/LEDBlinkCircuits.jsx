import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap, Timer } from "lucide-react";

export default function LEDBlinkCircuits({ analysis }) {
  const ledOn = analysis.ledState === 1;

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
              Symbolic circuit showing GPIO D13 toggling an LED through a delay loop.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">GPIO D13</span>
          <span className="sorting-stat-value" style={{ color: ledOn ? "#22c55e" : "#ef4444" }}>
            {ledOn ? "HIGH" : "LOW"}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">LED</span>
          <span className="sorting-stat-value" style={{ color: ledOn ? "#22c55e" : "#ef4444" }}>
            {ledOn ? "ON" : "OFF"}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Delay</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>{analysis.delayMs} ms</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Cycle Count</span>
          <span className="sorting-stat-value">{analysis.cycleCount}</span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>LED Blink Circuit</h3>
          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Timed Toggle View
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ minHeight: 470 }}>
          <svg width="100%" height="100%" viewBox="0 0 1100 470" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="blinkCircuitGreen">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="blinkCircuitRed">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="110" y="140" width="230" height="170" rx="24" fill="rgba(59,130,246,.13)" stroke="#60a5fa" strokeWidth="3" />
            <text x="225" y="215" textAnchor="middle" fill="#f8fafc" fontSize="34" fontWeight="900">MCU</text>
            <text x="225" y="250" textAnchor="middle" fill="#7dd3fc" fontSize="18" fontWeight="800">GPIO D13</text>

            <path d="M 340 225 L 500 225" stroke={ledOn ? "#22c55e" : "#475569"} strokeWidth="7" strokeLinecap="round" filter={ledOn ? "url(#blinkCircuitGreen)" : undefined} />

            <rect x="500" y="200" width="120" height="50" rx="13" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
            <text x="560" y="232" textAnchor="middle" fill="#111827" fontSize="18" fontWeight="900">220Ω</text>

            <path d="M 620 225 L 745 225" stroke={ledOn ? "#22c55e" : "#475569"} strokeWidth="7" strokeLinecap="round" filter={ledOn ? "url(#blinkCircuitGreen)" : undefined} />

            <circle cx="790" cy="225" r="34" fill={ledOn ? "rgba(239,68,68,.95)" : "rgba(127,29,29,.55)"} stroke={ledOn ? "#fca5a5" : "#7f1d1d"} strokeWidth="4" filter={ledOn ? "url(#blinkCircuitRed)" : undefined} />
            <circle cx="778" cy="212" r="9" fill="rgba(255,255,255,.4)" />
            <text x="790" y="292" textAnchor="middle" fill={ledOn ? "#fca5a5" : "#94a3b8"} fontSize="22" fontWeight="900">
              LED {ledOn ? "ON" : "OFF"}
            </text>

            <path d="M 790 259 L 790 350 L 225 350 L 225 310" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            <line x1="750" y1="350" x2="830" y2="350" stroke="#94a3b8" strokeWidth="5" />
            <line x1="762" y1="365" x2="818" y2="365" stroke="#94a3b8" strokeWidth="4" />
            <line x1="775" y1="378" x2="805" y2="378" stroke="#94a3b8" strokeWidth="3" />

            <rect x="400" y="70" width="310" height="78" rx="18" fill="rgba(15,23,42,.78)" stroke="rgba(250,204,21,.35)" />
            <text x="555" y="101" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">PROGRAM LOOP</text>
            <text x="555" y="130" textAnchor="middle" fill="#facc15" fontSize="23" fontWeight="900">
              HIGH → delay → LOW → delay
            </text>

            <text x="555" y="430" textAnchor="middle" fill="#fbbf24" fontSize="20" fontWeight="900">
              Current Phase: {analysis.phase}
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
              The GPIO pin changes between HIGH and LOW. When HIGH, current flows through the resistor and LED.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Timer size={18} />
              <h4>Timing Rule</h4>
            </div>
            <p>
              The output remains in each phase for <strong>{analysis.delayMs} ms</strong>.
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