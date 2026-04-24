import React from "react";
import { CircuitBoard, Info, Sigma, Cpu, Sparkles } from "lucide-react";

function signalColor(v) {
  return v === 1 ? "#38bdf8" : "#64748b";
}

function signalGlow(v) {
  return v === 1 ? "drop-shadow(0 0 8px rgba(56,189,248,0.6))" : "none";
}

function outColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDAddersCircuits({ selectedAdder, analysis }) {
  const isHalf = selectedAdder === "half";

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
              Study the symbolic circuit representation of the selected adder.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Circuit</span>
          <span className="sorting-stat-value">{analysis.selected.title}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Sum</span>
          <span
            className="sorting-stat-value"
            style={{ color: outColor(analysis.selected.sum) }}
          >
            {analysis.selected.sum}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Carry</span>
          <span
            className="sorting-stat-value"
            style={{ color: outColor(analysis.selected.carry) }}
          >
            {analysis.selected.carry}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Design Style</span>
          <span className="sorting-stat-value">{isHalf ? "XOR + AND" : "2 XOR + 2 AND + OR"}</span>
        </div>
      </div>

      <div className="card dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            {isHalf ? "Half Adder Circuit Diagram" : "Full Adder Circuit Diagram"}
          </h3>

          <div className="dsd-circuit-badge">
            <Sparkles size={16} />
            Blueprint View
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ height: isHalf ? 430 : 500 }}>
          <svg
            width="100%"
            height="100%"
            viewBox={isHalf ? "0 0 1100 430" : "0 0 1200 500"}
            preserveAspectRatio="xMidYMid meet"
          >
            {isHalf ? (
              <>
                {/* Inputs */}
                <text x="70" y="120" fill="#d8b4fe" fontSize="28" fontWeight="800">
                  A = {analysis.A}
                </text>
                <text x="70" y="280" fill="#d8b4fe" fontSize="28" fontWeight="800">
                  B = {analysis.B}
                </text>

                <line
                  x1="180"
                  y1="110"
                  x2="330"
                  y2="110"
                  stroke={signalColor(analysis.A)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.A === 1 ? "url(#adderGlow)" : undefined}
                />
                <line
                  x1="180"
                  y1="270"
                  x2="330"
                  y2="270"
                  stroke={signalColor(analysis.B)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.B === 1 ? "url(#adderGlow)" : undefined}
                />

                {/* XOR */}
                <rect
                  x="330"
                  y="70"
                  width="150"
                  height="90"
                  rx="18"
                  fill="rgba(59,130,246,0.10)"
                  stroke="#60a5fa"
                  strokeWidth="4"
                />
                <text x="405" y="124" textAnchor="middle" fill="#f8fafc" fontSize="30" fontWeight="800">
                  XOR
                </text>

                {/* AND */}
                <rect
                  x="330"
                  y="230"
                  width="150"
                  height="90"
                  rx="18"
                  fill="rgba(34,197,94,0.10)"
                  stroke="#22c55e"
                  strokeWidth="4"
                />
                <text x="405" y="284" textAnchor="middle" fill="#f8fafc" fontSize="30" fontWeight="800">
                  AND
                </text>

                {/* Outputs */}
                <line
                  x1="480"
                  y1="115"
                  x2="820"
                  y2="115"
                  stroke={analysis.selected.sum === 1 ? "#facc15" : "#64748b"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.selected.sum === 1 ? "url(#adderGlow)" : undefined}
                />
                <line
                  x1="480"
                  y1="275"
                  x2="820"
                  y2="275"
                  stroke={analysis.selected.carry === 1 ? "#facc15" : "#64748b"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.selected.carry === 1 ? "url(#adderGlow)" : undefined}
                />

                <circle cx="825" cy="115" r="10" fill={analysis.selected.sum === 1 ? "#22c55e" : "#ef4444"} />
                <circle cx="825" cy="275" r="10" fill={analysis.selected.carry === 1 ? "#22c55e" : "#ef4444"} />

                <text x="850" y="122" fill={outColor(analysis.selected.sum)} fontSize="28" fontWeight="800">
                  Sum = {analysis.selected.sum}
                </text>
                <text x="850" y="282" fill={outColor(analysis.selected.carry)} fontSize="28" fontWeight="800">
                  Carry = {analysis.selected.carry}
                </text>

                <text x="405" y="385" textAnchor="middle" fill="#7dd3fc" fontSize="30" fontWeight="800">
                  HALF ADDER
                </text>
              </>
            ) : (
              <>
                {/* Inputs */}
                <text x="50" y="95" fill="#d8b4fe" fontSize="26" fontWeight="800">
                  A = {analysis.A}
                </text>
                <text x="50" y="210" fill="#d8b4fe" fontSize="26" fontWeight="800">
                  B = {analysis.B}
                </text>
                <text x="30" y="410" fill="#f9a8d4" fontSize="26" fontWeight="800">
                  Cin = {analysis.Cin}
                </text>

                {/* Main input lines */}
                <line
                  x1="150"
                  y1="85"
                  x2="300"
                  y2="85"
                  stroke={signalColor(analysis.A)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.A === 1 ? "url(#adderGlow)" : undefined}
                />
                <line
                  x1="150"
                  y1="200"
                  x2="300"
                  y2="200"
                  stroke={signalColor(analysis.B)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.B === 1 ? "url(#adderGlow)" : undefined}
                />
                <line
                  x1="170"
                  y1="400"
                  x2="510"
                  y2="400"
                  stroke={signalColor(analysis.Cin)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.Cin === 1 ? "url(#adderGlow)" : undefined}
                />

                {/* XOR1 */}
                <rect
                  x="300"
                  y="45"
                  width="140"
                  height="90"
                  rx="18"
                  fill="rgba(59,130,246,0.10)"
                  stroke="#60a5fa"
                  strokeWidth="4"
                />
                <text x="370" y="100" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="800">
                  XOR
                </text>

                {/* XOR2 */}
                <rect
                  x="560"
                  y="45"
                  width="140"
                  height="90"
                  rx="18"
                  fill="rgba(59,130,246,0.10)"
                  stroke="#60a5fa"
                  strokeWidth="4"
                />
                <text x="630" y="100" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="800">
                  XOR
                </text>

                {/* AND1 */}
                <rect
                  x="300"
                  y="180"
                  width="140"
                  height="90"
                  rx="18"
                  fill="rgba(34,197,94,0.10)"
                  stroke="#22c55e"
                  strokeWidth="4"
                />
                <text x="370" y="235" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="800">
                  AND
                </text>

                {/* AND2 */}
                <rect
                  x="560"
                  y="180"
                  width="140"
                  height="90"
                  rx="18"
                  fill="rgba(34,197,94,0.10)"
                  stroke="#22c55e"
                  strokeWidth="4"
                />
                <text x="630" y="235" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="800">
                  AND
                </text>

                {/* OR */}
                <rect
                  x="820"
                  y="180"
                  width="140"
                  height="90"
                  rx="18"
                  fill="rgba(250,204,21,0.10)"
                  stroke="#facc15"
                  strokeWidth="4"
                />
                <text x="890" y="235" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="800">
                  OR
                </text>

                {/* Connections */}
                <line
                  x1="440"
                  y1="90"
                  x2="560"
                  y2="90"
                  stroke={signalColor(analysis.A ^ analysis.B)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={(analysis.A ^ analysis.B) === 1 ? "url(#adderGlow)" : undefined}
                />
                <line
                  x1="510"
                  y1="400"
                  x2="510"
                  y2="90"
                  stroke={signalColor(analysis.Cin)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.Cin === 1 ? "url(#adderGlow)" : undefined}
                />
                <line
                  x1="510"
                  y1="90"
                  x2="560"
                  y2="90"
                  stroke={signalColor(analysis.Cin)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.Cin === 1 ? "url(#adderGlow)" : undefined}
                />

                <line
                  x1="440"
                  y1="220"
                  x2="820"
                  y2="220"
                  stroke={signalColor(analysis.A & analysis.B)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={(analysis.A & analysis.B) === 1 ? "url(#adderGlow)" : undefined}
                />

                <line
                  x1="510"
                  y1="400"
                  x2="510"
                  y2="250"
                  stroke={signalColor(analysis.Cin)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.Cin === 1 ? "url(#adderGlow)" : undefined}
                />
                <line
                  x1="510"
                  y1="250"
                  x2="560"
                  y2="250"
                  stroke={signalColor(analysis.Cin)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.Cin === 1 ? "url(#adderGlow)" : undefined}
                />

                <line
                  x1="700"
                  y1="225"
                  x2="820"
                  y2="225"
                  stroke={signalColor((analysis.A ^ analysis.B) & analysis.Cin)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={((analysis.A ^ analysis.B) & analysis.Cin) === 1 ? "url(#adderGlow)" : undefined}
                />

                {/* Outputs */}
                <line
                  x1="700"
                  y1="90"
                  x2="1030"
                  y2="90"
                  stroke={analysis.selected.sum === 1 ? "#facc15" : "#64748b"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.selected.sum === 1 ? "url(#adderGlow)" : undefined}
                />
                <line
                  x1="960"
                  y1="225"
                  x2="1030"
                  y2="225"
                  stroke={analysis.selected.carry === 1 ? "#facc15" : "#64748b"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.selected.carry === 1 ? "url(#adderGlow)" : undefined}
                />

                <circle cx="1035" cy="90" r="10" fill={analysis.selected.sum === 1 ? "#22c55e" : "#ef4444"} />
                <circle cx="1035" cy="225" r="10" fill={analysis.selected.carry === 1 ? "#22c55e" : "#ef4444"} />

                <text x="1060" y="97" fill={outColor(analysis.selected.sum)} fontSize="26" fontWeight="800">
                  Sum = {analysis.selected.sum}
                </text>
                <text x="1060" y="232" fill={outColor(analysis.selected.carry)} fontSize="26" fontWeight="800">
                  Carry = {analysis.selected.carry}
                </text>

                <text x="620" y="470" textAnchor="middle" fill="#7dd3fc" fontSize="30" fontWeight="800">
                  FULL ADDER
                </text>
              </>
            )}

            <defs>
              <filter id="adderGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      <div className="dsd-circuit-note-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Info size={18} />
            <h4>Circuit Interpretation</h4>
          </div>
          <p>
            {isHalf
              ? "The Half Adder uses one XOR gate for Sum and one AND gate for Carry."
              : "The Full Adder combines XOR, AND, and OR logic to add A, B, and Carry-in."}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Current Result</h4>
          </div>
          <p>
            Sum = <strong>{analysis.selected.sum}</strong>
            <br />
            Carry = <strong>{analysis.selected.carry}</strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Sigma size={18} />
            <h4>Design Note</h4>
          </div>
          <p>
            {isHalf
              ? "Half Adder is suitable for single-bit addition without carry input."
              : "Full Adder is suitable for cascading into multi-bit binary adders."}
          </p>
        </div>
      </div>
    </section>
  );
}