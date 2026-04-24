import React, { useEffect } from "react";
import { PlayCircle, Zap, ToggleLeft, Activity, Route, Binary } from "lucide-react";

function bitColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

function SwitchBlock({ label, value, x, y, onClick }) {
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <text x={x + 21} y={y - 14} fill="#cbd5e1" fontSize="16" fontWeight="800" textAnchor="middle">
        {label}
      </text>
      <rect x={x} y={y} width="42" height="74" rx="12" fill="#111827" stroke="#334155" strokeWidth="2" />
      <rect x={x + 7} y={value ? y + 8 : y + 39} width="28" height="28" rx="8" fill={bitColor(value)} />
      <text x={x + 21} y={y + 100} fill={bitColor(value)} fontSize="14" fontWeight="800" textAnchor="middle">
        {value ? "HIGH" : "LOW"}
      </text>
    </g>
  );
}

function OutputLed({ label, active, color, x, y }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="17"
        fill={active ? color : "#4b1d1d"}
        stroke={active ? color : "#7f1d1d"}
        strokeWidth="2"
        filter={active ? "url(#glow)" : undefined}
      />
      <text x={x} y={y + 43} fill="#cbd5e1" fontSize="16" fontWeight="800" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Wire({ d, active, color }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={active ? color : "#334155"}
      strokeWidth={active ? "5" : "4"}
      strokeLinecap="round"
      strokeLinejoin="round"
      filter={active ? "url(#glow)" : undefined}
    />
  );
}

export default function DSDComparatorSimulation({
  a,
  setA,
  b,
  setB,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [a, b, setExperimentRun]);

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
              Toggle A and B to watch the comparator activate one result line.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">A</span>
          <span className="sorting-stat-value">{a}</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">B</span>
          <span className="sorting-stat-value">{b}</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Relation</span>
          <span className="sorting-stat-value">{analysis.relation}</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Active Output</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.activeOutput}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.note}</div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <ToggleLeft size={18} />
            <h4>Input Controls</h4>
          </div>
          <div className="sorting-btn-group" style={{ marginTop: 12 }}>
            <button className="sim-btn sim-btn-primary" onClick={() => setA(a ^ 1)}>A = {a}</button>
            <button className="sim-btn sim-btn-muted" onClick={() => setB(b ^ 1)}>B = {b}</button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Output Pattern</h4>
          </div>
          <p>
            GT = {analysis.greater}, EQ = {analysis.equal}, LT = {analysis.less}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Route size={18} />
            <h4>Signal Route</h4>
          </div>
          <p>Only one output path is active for each pair of inputs.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Observation</h4>
          </div>
          <p>{analysis.note}</p>
        </div>
      </div>

      <div className="hardware-board-shell">
        <div className="hardware-board-header">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Comparator Hardware View</h3>
          <div className="hardware-board-badge">
            <Zap size={16} />
            Live Comparator Flow
          </div>
        </div>

        <div
          style={{
            height: 430,
            borderRadius: 22,
            border: "1px solid rgba(56,189,248,0.22)",
            background: "radial-gradient(circle at center, rgba(17,24,39,0.72), rgba(2,8,23,0.98))",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1050 430" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="compGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="rgba(56,189,248,0.15)" />
              </pattern>
            </defs>

            <rect width="1050" height="430" fill="url(#compGrid)" opacity="0.35" />

            <SwitchBlock label="A" value={a} x={80} y={100} onClick={() => setA(a ^ 1)} />
            <SwitchBlock label="B" value={b} x={80} y={240} onClick={() => setB(b ^ 1)} />

            <Wire d="M122 137 L260 137 L260 185 L420 185" active={a === 1} color="#38bdf8" />
            <Wire d="M122 277 L260 277 L260 245 L420 245" active={b === 1} color="#38bdf8" />

            <rect x="420" y="145" width="220" height="150" rx="20" fill="#172236" stroke="#60a5fa" strokeWidth="2" />
            <circle cx="620" cy="165" r="6" fill="#22c55e" />
            <text x="530" y="210" textAnchor="middle" fill="#f8fafc" fontSize="24" fontWeight="900">
              COMPARATOR
            </text>
            <text x="530" y="245" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">
              1-bit Magnitude
            </text>

            <Wire d="M640 170 L760 170 L760 90 L850 90" active={analysis.greater === 1} color="#22c55e" />
            <Wire d="M640 220 L850 220" active={analysis.equal === 1} color="#38bdf8" />
            <Wire d="M640 270 L760 270 L760 350 L850 350" active={analysis.less === 1} color="#f59e0b" />

            <OutputLed label="A > B" active={analysis.greater === 1} color="#22c55e" x={890} y={90} />
            <OutputLed label="A = B" active={analysis.equal === 1} color="#38bdf8" x={890} y={220} />
            <OutputLed label="A < B" active={analysis.less === 1} color="#f59e0b" x={890} y={350} />

            <rect x="650" y="32" width="210" height="50" rx="16" fill="rgba(15,23,42,0.82)" stroke="rgba(148,163,184,0.18)" />
            <text x="755" y="64" fill="#e2e8f0" fontSize="18" fontWeight="900" textAnchor="middle">
              Relation: <tspan fill="#38bdf8">{analysis.relation}</tspan>
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}