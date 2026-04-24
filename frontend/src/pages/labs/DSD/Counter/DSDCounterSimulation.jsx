import React, { useEffect } from "react";
import {
  PlayCircle,
  RotateCcw,
  Zap,
  Clock3,
  Activity,
  Binary,
  TimerReset,
  CheckCircle2
} from "lucide-react";

function bitColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

function seqBoxStyle(active) {
  return {
    fill: active ? "rgba(56,189,248,0.18)" : "rgba(15,23,42,0.78)",
    stroke: active ? "#38bdf8" : "rgba(148,163,184,0.25)",
    strokeWidth: active ? 2 : 1
  };
}

export default function DSDCounterSimulation({
  count,
  clockPulses,
  analysis,
  handleClockPulse,
  handleReset,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [count, clockPulses, setExperimentRun]);

  const q0On = analysis.q0 === 1;
  const q1On = analysis.q1 === 1;

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
              Apply clock pulses and watch the 2-bit counter move through the Mod-4 sequence.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Decimal Count</span>
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

      <div className="sorting-info-box">{analysis.note}</div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Clock Control</h4>
          </div>
          <div className="sorting-btn-group" style={{ marginTop: 12 }}>
            <button className="sim-btn sim-btn-primary" onClick={handleClockPulse}>
              <Zap size={16} />
              Apply Clock Pulse
            </button>
            <button className="sim-btn sim-btn-muted" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Output Bits</h4>
          </div>
          <p>
            Q1 = <strong style={{ color: bitColor(analysis.q1) }}>{analysis.q1}</strong>{" "}
            and Q0 = <strong style={{ color: bitColor(analysis.q0) }}>{analysis.q0}</strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Counter Type</h4>
          </div>
          <p>2-bit binary counter with states 00, 01, 10, 11.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <TimerReset size={18} />
            <h4>Reset Behavior</h4>
          </div>
          <p>Reset brings the counter back to 00.</p>
        </div>
      </div>

      <div className="hardware-board-shell">
        <div className="hardware-board-header">
          <div className="hardware-board-title">
            <Clock3 size={20} />
            Counter Hardware View
          </div>
          <div className="hardware-board-badge">
            <Zap size={16} />
            Live Clock Flow
          </div>
        </div>

        <div className="counter-circuit-board">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1100 520"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="counterGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="110"
              cy="210"
              r="58"
              fill="#f59e0b"
              stroke="#fbbf24"
              strokeWidth="6"
              filter="url(#counterGlow)"
              style={{ cursor: "pointer" }}
              onClick={handleClockPulse}
            />
            <text x="110" y="220" textAnchor="middle" fill="#07111f" fontSize="26" fontWeight="900">
              CLK
            </text>

            <rect x="65" y="300" width="90" height="82" rx="16" fill="rgba(15,23,42,0.85)" stroke="rgba(148,163,184,0.25)" />
            <text x="110" y="330" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">
              Pulses
            </text>
            <text x="110" y="365" textAnchor="middle" fill="#facc15" fontSize="30" fontWeight="900">
              {clockPulses}
            </text>

            {/* clean clock wire */}
            <path
              d="M 168 210 L 260 210 L 260 145 L 365 145"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#counterGlow)"
            />

            {/* FF0 */}
            <rect x="365" y="105" width="160" height="120" rx="18" fill="#172234" stroke="rgba(148,163,184,0.35)" />
            <circle cx="508" cy="122" r="7" fill={q0On ? "#22c55e" : "#ef4444"} />
            <text x="445" y="162" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="900">
              FF0
            </text>
            <text x="445" y="190" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">
              Q0 stage
            </text>

            {/* FF1 */}
            <rect x="640" y="105" width="160" height="120" rx="18" fill="#172234" stroke="rgba(148,163,184,0.35)" />
            <circle cx="783" cy="122" r="7" fill={q1On ? "#22c55e" : "#ef4444"} />
            <text x="720" y="162" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="900">
              FF1
            </text>
            <text x="720" y="190" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">
              Q1 stage
            </text>

            {/* carry wire — moved above label, no overlap */}
            <path
              d="M 525 145 L 640 145"
              fill="none"
              stroke={q0On ? "#22c55e" : "#64748b"}
              strokeWidth="6"
              strokeLinecap="round"
              filter={q0On ? "url(#counterGlow)" : undefined}
            />
            <text x="582" y="126" textAnchor="middle" fill="#86efac" fontSize="16" fontWeight="900">
              Toggle / Carry
            </text>

            {/* Q0 output wire */}
            <path
              d="M 525 175 L 845 175 L 845 120 L 910 120"
              fill="none"
              stroke={q0On ? "#22c55e" : "#475569"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={q0On ? "url(#counterGlow)" : undefined}
            />

            {/* Q1 output wire */}
            <path
              d="M 800 175 L 870 175 L 870 245 L 910 245"
              fill="none"
              stroke={q1On ? "#3b82f6" : "#475569"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={q1On ? "url(#counterGlow)" : undefined}
            />

            {/* Q0 LED + value */}
            <circle cx="940" cy="120" r="18" fill={q0On ? "#22c55e" : "#3f1d1d"} filter={q0On ? "url(#counterGlow)" : undefined} />
            <text x="940" y="158" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="900">
              Q0 = {analysis.q0}
            </text>
            <rect x="985" y="92" width="70" height="62" rx="16" fill={q0On ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.10)"} stroke={q0On ? "rgba(34,197,94,0.45)" : "rgba(239,68,68,0.35)"} />
            <text x="1020" y="133" textAnchor="middle" fill={q0On ? "#86efac" : "#fca5a5"} fontSize="30" fontWeight="900">
              {analysis.q0}
            </text>

            {/* Q1 LED + value */}
            <circle cx="940" cy="245" r="18" fill={q1On ? "#3b82f6" : "#3f1d1d"} filter={q1On ? "url(#counterGlow)" : undefined} />
            <text x="940" y="283" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="900">
              Q1 = {analysis.q1}
            </text>
            <rect x="985" y="217" width="70" height="62" rx="16" fill={q1On ? "rgba(59,130,246,0.14)" : "rgba(239,68,68,0.10)"} stroke={q1On ? "rgba(59,130,246,0.45)" : "rgba(239,68,68,0.35)"} />
            <text x="1020" y="258" textAnchor="middle" fill={q1On ? "#93c5fd" : "#fca5a5"} fontSize="30" fontWeight="900">
              {analysis.q1}
            </text>

            {/* sequence */}
            <rect x="260" y="340" width="560" height="70" rx="20" fill="rgba(15,23,42,0.72)" stroke="rgba(148,163,184,0.18)" />

            {["00", "01", "10", "11"].map((state, i) => {
              const x = 320 + i * 125;
              return (
                <g key={state}>
                  <rect x={x} y="355" width="78" height="40" rx="12" {...seqBoxStyle(analysis.binary === state)} />
                  <text
                    x={x + 39}
                    y="382"
                    textAnchor="middle"
                    fill={analysis.binary === state ? "#38bdf8" : "#94a3b8"}
                    fontSize="22"
                    fontWeight="900"
                  >
                    {state}
                  </text>
                  {i < 3 && (
                    <text x={x + 100} y="382" textAnchor="middle" fill="#94a3b8" fontSize="24" fontWeight="900">
                      →
                    </text>
                  )}
                </g>
              );
            })}

            <rect x="365" y="430" width="330" height="48" rx="16" fill="rgba(15,23,42,0.9)" stroke="rgba(148,163,184,0.2)" />
            <text x="530" y="461" textAnchor="middle" fill="#e2e8f0" fontSize="20" fontWeight="900">
              Current:{" "}
              <tspan fill="#38bdf8">{analysis.binary}</tspan>
              {" "}→ Next:{" "}
              <tspan fill="#facc15">{analysis.nextBinary}</tspan>
            </text>
          </svg>
        </div>
      </div>

      <div className="overview-grid" style={{ marginTop: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Current Output</h4>
          </div>
          <p>
            Current state is <strong>{analysis.binary}</strong>. Q1 is the MSB and Q0 is the LSB.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Observation</h4>
          </div>
          <p>{analysis.note}</p>
        </div>
      </div>
    </section>
  );
}