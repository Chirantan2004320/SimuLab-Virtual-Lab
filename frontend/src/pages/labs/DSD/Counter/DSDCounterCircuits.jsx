import React from "react";
import { CircuitBoard, Zap, Info, CheckCircle2 } from "lucide-react";

function onColor(v, color) {
  return v === 1 ? color : "#475569";
}

function BitBox({ label, value, color }) {
  return (
    <div
      style={{
        width: 82,
        height: 74,
        borderRadius: 16,
        border: value
          ? `1px solid ${color}`
          : "1px solid rgba(148,163,184,0.16)",
        background: value ? `${color}22` : "rgba(15,23,42,0.72)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: value ? color : "#94a3b8",
        fontWeight: 900
      }}
    >
      <div style={{ fontSize: "0.78rem" }}>{label}</div>
      <div style={{ fontSize: "1.7rem" }}>{value}</div>
    </div>
  );
}

export default function DSDCounterCircuits({ count, clockPulses, analysis }) {
  const sequence = ["00", "01", "10", "11"];
  const q0 = analysis.q0;
  const q1 = analysis.q1;

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
              Study the symbolic 2-bit counter circuit using two flip-flop stages and output lines.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current Count</span>
          <span className="sorting-stat-value">{count}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Binary State</span>
          <span className="sorting-stat-value">{analysis.binary}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Next State</span>
          <span className="sorting-stat-value" style={{ color: "#facc15" }}>
            {analysis.nextBinary}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Clock Pulses</span>
          <span className="sorting-stat-value">{clockPulses}</span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>2-bit Counter Circuit</h3>

          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Symbolic Circuit View
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ height: 560 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1100 560"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="counterCircuitGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Clock waveform */}
            <text x="65" y="222" fill="#fbbf24" fontSize="30" fontWeight="900">
              CLK
            </text>

            <path
              d="M 58 260 L 95 260 L 95 235 L 120 235 L 120 260 L 145 260 L 145 235 L 170 235 L 170 260 L 195 260 L 195 235 L 220 235 L 220 260 L 260 260"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#counterCircuitGlow)"
            />

            {/* Reset line */}
            <text x="65" y="345" fill="#a855f7" fontSize="24" fontWeight="900">
              RESET
            </text>
            <path
              d="M 65 375 L 265 375 L 265 425 L 410 425 L 410 360"
              fill="none"
              stroke="#a855f7"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 410 425 L 690 425 L 690 360"
              fill="none"
              stroke="#a855f7"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Clock to FF0 and FF1 */}
            <path
              d="M 260 260 L 310 260"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 260 260 L 260 320 L 610 320"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* FF0 */}
            <rect
              x="310"
              y="150"
              width="190"
              height="210"
              rx="22"
              fill="rgba(59,130,246,0.12)"
              stroke="#60a5fa"
              strokeWidth="3"
            />
            <text x="405" y="235" textAnchor="middle" fill="#f8fafc" fontSize="38" fontWeight="900">
              FF0
            </text>
            <text x="405" y="274" textAnchor="middle" fill="#93c5fd" fontSize="18" fontWeight="800">
              Q0 Stage
            </text>
            <text x="330" y="278" fill="#93c5fd" fontSize="16" fontWeight="800">CLK</text>
            <text x="470" y="258" fill="#e2e8f0" fontSize="18" fontWeight="800">Q</text>
            <text x="388" y="342" fill="#c4b5fd" fontSize="16" fontWeight="800">CLR</text>

            {/* FF1 */}
            <rect
              x="610"
              y="150"
              width="190"
              height="210"
              rx="22"
              fill="rgba(59,130,246,0.12)"
              stroke="#60a5fa"
              strokeWidth="3"
            />
            <text x="705" y="235" textAnchor="middle" fill="#f8fafc" fontSize="38" fontWeight="900">
              FF1
            </text>
            <text x="705" y="274" textAnchor="middle" fill="#93c5fd" fontSize="18" fontWeight="800">
              Q1 Stage
            </text>
            <text x="630" y="278" fill="#93c5fd" fontSize="16" fontWeight="800">CLK</text>
            <text x="770" y="258" fill="#e2e8f0" fontSize="18" fontWeight="800">Q</text>
            <text x="688" y="342" fill="#c4b5fd" fontSize="16" fontWeight="800">CLR</text>

            {/* Carry/toggle path */}
            <path
              d="M 500 255 L 610 255"
              fill="none"
              stroke={onColor(q0, "#22c55e")}
              strokeWidth="5"
              strokeLinecap="round"
              filter={q0 ? "url(#counterCircuitGlow)" : undefined}
            />
            <path
              d="M 500 285 L 610 285"
              fill="none"
              stroke="#64748b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text x="555" y="238" textAnchor="middle" fill={q0 ? "#86efac" : "#94a3b8"} fontSize="18" fontWeight="900">
              Toggle / Carry
            </text>

            {/* Q0 output */}
            <path
              d="M 800 235 L 930 235"
              fill="none"
              stroke={onColor(q0, "#22c55e")}
              strokeWidth="6"
              strokeLinecap="round"
              filter={q0 ? "url(#counterCircuitGlow)" : undefined}
            />
            <circle cx="950" cy="235" r="14" fill={q0 ? "#22c55e" : "#1f2937"} />
            <text x="980" y="242" fill={q0 ? "#86efac" : "#94a3b8"} fontSize="24" fontWeight="900">
              Q0 = {q0}
            </text>
            <text x="980" y="268" fill="#94a3b8" fontSize="15" fontWeight="800">
              LSB
            </text>

            {/* Q1 output */}
            <path
              d="M 800 315 L 930 315"
              fill="none"
              stroke={onColor(q1, "#3b82f6")}
              strokeWidth="6"
              strokeLinecap="round"
              filter={q1 ? "url(#counterCircuitGlow)" : undefined}
            />
            <circle cx="950" cy="315" r="14" fill={q1 ? "#3b82f6" : "#1f2937"} />
            <text x="980" y="322" fill={q1 ? "#93c5fd" : "#94a3b8"} fontSize="24" fontWeight="900">
              Q1 = {q1}
            </text>
            <text x="980" y="348" fill="#94a3b8" fontSize="15" fontWeight="800">
              MSB
            </text>

            {/* Sequence panel */}
            <rect
              x="235"
              y="455"
              width="540"
              height="70"
              rx="18"
              fill="rgba(15,23,42,0.72)"
              stroke="rgba(148,163,184,0.18)"
            />

            {sequence.map((state, index) => {
              const x = 270 + index * 125;
              const active = state === analysis.binary;

              return (
                <g key={state}>
                  <rect
                    x={x}
                    y="470"
                    width="80"
                    height="40"
                    rx="11"
                    fill={active ? "rgba(56,189,248,0.20)" : "rgba(15,23,42,0.72)"}
                    stroke={active ? "#38bdf8" : "rgba(148,163,184,0.18)"}
                  />
                  <text
                    x={x + 40}
                    y="497"
                    textAnchor="middle"
                    fill={active ? "#38bdf8" : "#94a3b8"}
                    fontSize="22"
                    fontWeight="900"
                  >
                    {state}
                  </text>

                  {index < sequence.length - 1 && (
                    <text x={x + 97} y="497" fill="#94a3b8" fontSize="22" fontWeight="900">
                      →
                    </text>
                  )}
                </g>
              );
            })}

            <rect
              x="805"
              y="455"
              width="220"
              height="70"
              rx="18"
              fill="rgba(15,23,42,0.72)"
              stroke="rgba(148,163,184,0.18)"
            />
            <text x="845" y="483" fill="#e2e8f0" fontSize="16" fontWeight="800">
              Current
            </text>
            <text x="950" y="483" fill="#e2e8f0" fontSize="16" fontWeight="800">
              Next
            </text>
            <text x="855" y="512" fill="#38bdf8" fontSize="28" fontWeight="900">
              {analysis.binary}
            </text>
            <text x="920" y="512" fill="#94a3b8" fontSize="24" fontWeight="900">
              →
            </text>
            <text x="965" y="512" fill="#facc15" fontSize="28" fontWeight="900">
              {analysis.nextBinary}
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
              FF0 represents the least significant bit Q0. FF1 represents the most significant bit Q1.
              Every clock pulse moves the counter to the next binary state.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Observation</h4>
            </div>
            <p>
              Current state is <strong>{analysis.binary}</strong>. After the next clock pulse,
              the counter moves to <strong>{analysis.nextBinary}</strong>.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Zap size={18} />
              <h4>Output Bits</h4>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
              <BitBox label="Q0 / LSB" value={q0} color="#22c55e" />
              <BitBox label="Q1 / MSB" value={q1} color="#3b82f6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}