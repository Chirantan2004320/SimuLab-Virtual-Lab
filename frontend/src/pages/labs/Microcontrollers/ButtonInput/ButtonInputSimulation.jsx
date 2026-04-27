import React, { useEffect } from "react";
import { PlayCircle, Power, Lightbulb } from "lucide-react";

export default function ButtonInputSimulation({
  inputMode,
  setInputMode,
  buttonPressed,
  setButtonPressed,
  analysis,
  setExperimentRun
}) {
  const isHigh = analysis.readValue === 1;

  useEffect(() => {
    setExperimentRun(true);
  }, [inputMode, buttonPressed, setExperimentRun]);

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <PlayCircle size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Press the button and watch how GPIO D2 reads HIGH or LOW.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
        <button
          className={`sim-btn ${
            inputMode === "PULL_DOWN" ? "sim-btn-primary" : "sim-btn-muted"
          }`}
          onClick={() => setInputMode("PULL_DOWN")}
        >
          Pull-down
        </button>

        <button
          className={`sim-btn ${
            inputMode === "PULL_UP" ? "sim-btn-primary" : "sim-btn-muted"
          }`}
          onClick={() => setInputMode("PULL_UP")}
        >
          Pull-up
        </button>

        <button
          className={`sim-btn ${
            buttonPressed ? "sim-btn-primary" : "sim-btn-muted"
          }`}
          onClick={() => setButtonPressed((prev) => !prev)}
        >
          <Power size={16} />
          {buttonPressed ? "Release Button" : "Press Button"}
        </button>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Input Mode</span>
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
          <span
            className="sorting-stat-value"
            style={{ color: isHigh ? "#22c55e" : "#ef4444" }}
          >
            {analysis.readLabel}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Voltage</span>
          <span
            className="sorting-stat-value"
            style={{ color: isHigh ? "#22c55e" : "#ef4444", fontSize: "1rem" }}
          >
            {analysis.voltage}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.note}</div>

      <div className="gpio-premium-shell">
        <div className="gpio-premium-hardware-canvas" style={{ minHeight: 520 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(30,41,59,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,41,59,.35) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              opacity: 0.12
            }}
          />

          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1150 520"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "relative", zIndex: 2 }}
          >
            <defs>
              <filter id="btnGreenGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="buttonMcuBlue" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f4f7a" />
                <stop offset="100%" stopColor="#0b2b52" />
              </linearGradient>
            </defs>

            {/* Arduino */}
            <rect x="95" y="135" width="320" height="250" rx="26" fill="url(#buttonMcuBlue)" stroke="#38bdf8" strokeWidth="3" />
            <text x="255" y="245" textAnchor="middle" fill="#f8fafc" fontSize="42" fontWeight="900">UNO</text>
            <text x="255" y="282" textAnchor="middle" fill="#7dd3fc" fontSize="18" fontWeight="800">GPIO INPUT D2</text>

            <rect x="135" y="168" width="65" height="130" rx="8" fill="#020617" stroke="rgba(148,163,184,.35)" />
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i} x1="145" y1={185 + i * 10} x2="190" y2={185 + i * 10} stroke="#1e293b" strokeWidth="2" />
            ))}

            <circle cx="375" cy="165" r="10" fill={isHigh ? "#22c55e" : "#ef4444"} filter={isHigh ? "url(#btnGreenGlow)" : undefined} />

            {/* Breadboard */}
            <rect x="580" y="105" width="440" height="290" rx="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="615" y1="145" x2="990" y2="145" stroke="#ef4444" strokeWidth="3" />
            <line x1="615" y1="355" x2="990" y2="355" stroke="#3b82f6" strokeWidth="3" />
            <line x1="615" y1="250" x2="990" y2="250" stroke="#cbd5e1" strokeWidth="6" />

            {Array.from({ length: 15 }).map((_, row) =>
              Array.from({ length: 24 }).map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={625 + col * 15}
                  cy={170 + row * 12}
                  r="3"
                  fill="#64748b"
                  opacity="0.65"
                />
              ))
            )}

            {/* Button */}
            <rect
              x="735"
              y="185"
              width="105"
              height="72"
              rx="16"
              fill={buttonPressed ? "#22c55e" : "#334155"}
              stroke={buttonPressed ? "#86efac" : "#94a3b8"}
              strokeWidth="4"
              filter={buttonPressed ? "url(#btnGreenGlow)" : undefined}
            />
            <circle
              cx="788"
              cy="220"
              r={buttonPressed ? 19 : 24}
              fill={buttonPressed ? "#16a34a" : "#64748b"}
              stroke="#e2e8f0"
              strokeWidth="3"
            />
            <text x="788" y="285" textAnchor="middle" fill="#0f172a" fontSize="18" fontWeight="900">
              PUSH BUTTON
            </text>

            {/* Pull resistor */}
            <rect x="750" y="315" width="90" height="36" rx="10" fill="#f6d28b" stroke="#facc15" strokeWidth="3" />
            <text x="795" y="338" textAnchor="middle" fill="#111827" fontSize="15" fontWeight="900">
              10kΩ
            </text>

            {/* GPIO wire */}
            <path
              d="M 415 260 C 500 260, 500 220, 735 220"
              fill="none"
              stroke={isHigh ? "#22c55e" : "#3b82f6"}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isHigh ? "url(#btnGreenGlow)" : undefined}
            />

            {/* Supply / ground wire */}
            {inputMode === "PULL_DOWN" ? (
              <>
                <path d="M 788 257 L 788 315" stroke="#64748b" strokeWidth="6" />
                <path d="M 795 351 L 795 385" stroke="#64748b" strokeWidth="6" />
                <line x1="765" y1="385" x2="825" y2="385" stroke="#94a3b8" strokeWidth="5" />
                <line x1="775" y1="398" x2="815" y2="398" stroke="#94a3b8" strokeWidth="4" />
                <line x1="785" y1="410" x2="805" y2="410" stroke="#94a3b8" strokeWidth="3" />
                <path
                  d="M 840 220 L 930 220 L 930 145"
                  stroke={buttonPressed ? "#22c55e" : "#334155"}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
                <text x="930" y="130" fill="#22c55e" fontSize="18" fontWeight="900">5V</text>
              </>
            ) : (
              <>
                <path d="M 788 185 L 788 145" stroke="#22c55e" strokeWidth="6" />
                <text x="800" y="132" fill="#22c55e" fontSize="18" fontWeight="900">5V</text>
                <path
                  d="M 840 220 L 930 220 L 930 385"
                  stroke={buttonPressed ? "#64748b" : "#334155"}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
                <line x1="900" y1="385" x2="960" y2="385" stroke="#94a3b8" strokeWidth="5" />
                <line x1="910" y1="398" x2="950" y2="398" stroke="#94a3b8" strokeWidth="4" />
                <line x1="920" y1="410" x2="940" y2="410" stroke="#94a3b8" strokeWidth="3" />
              </>
            )}

            {/* Status */}
            <rect x="430" y="75" width="300" height="70" rx="18" fill="rgba(15,23,42,.75)" stroke={isHigh ? "rgba(34,197,94,.45)" : "rgba(239,68,68,.35)"} />
            <text x="580" y="104" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">GPIO INPUT READ</text>
            <text x="580" y="130" textAnchor="middle" fill={isHigh ? "#22c55e" : "#ef4444"} fontSize="24" fontWeight="900">
              D2 = {analysis.readLabel}
            </text>
          </svg>
        </div>

        <div className="gpio-bottom-flow" style={{ marginTop: 18 }}>
          <div className="flow-box">
            <div className="flow-title">Button</div>
            <div className={buttonPressed ? "flow-val yellow" : "flow-val gray"}>
              {analysis.buttonLabel}
            </div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-box">
            <div className="flow-title">Resistor Bias</div>
            <div className="flow-val yellow">
              {inputMode === "PULL_DOWN" ? "Pull-down" : "Pull-up"}
            </div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-box">
            <div className="flow-title">GPIO D2</div>
            <div className={isHigh ? "flow-val green" : "flow-val red"}>
              {analysis.readLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        <Lightbulb size={16} /> {analysis.note}
      </div>
    </section>
  );
}