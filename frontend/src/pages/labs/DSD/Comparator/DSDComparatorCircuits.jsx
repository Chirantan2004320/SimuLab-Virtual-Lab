import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap } from "lucide-react";

function bitColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDComparatorCircuits({ a, b, analysis }) {
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
              Clean symbolic view of a 1-bit comparator and its three result outputs.
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

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>1-bit Comparator Circuit</h3>
          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Symbolic Circuit View
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ height: 460 }}>
          <svg width="100%" height="100%" viewBox="0 0 1050 460" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="compSymbolicGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <text x="80" y="170" fill={bitColor(a)} fontSize="28" fontWeight="800">
              A = {a}
            </text>
            <text x="80" y="285" fill={bitColor(b)} fontSize="28" fontWeight="800">
              B = {b}
            </text>

            <path
              d="M 180 160 L 420 160"
              fill="none"
              stroke={bitColor(a)}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 180 275 L 420 275"
              fill="none"
              stroke={bitColor(b)}
              strokeWidth="5"
              strokeLinecap="round"
            />

            <rect
              x="420"
              y="110"
              width="240"
              height="220"
              rx="24"
              fill="rgba(59,130,246,0.12)"
              stroke="#60a5fa"
              strokeWidth="3"
            />

            <text x="540" y="205" textAnchor="middle" fill="#e5e7eb" fontSize="34" fontWeight="900">
              COMP
            </text>
            <text x="540" y="245" textAnchor="middle" fill="#93c5fd" fontSize="20" fontWeight="800">
              Magnitude Logic
            </text>

            <path
              d="M 660 145 L 780 145 L 780 95 L 900 95"
              fill="none"
              stroke={analysis.greater ? "#22c55e" : "#475569"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={analysis.greater ? "12 9" : "0"}
              filter={analysis.greater ? "url(#compSymbolicGlow)" : undefined}
            />
            <path
              d="M 660 220 L 900 220"
              fill="none"
              stroke={analysis.equal ? "#38bdf8" : "#475569"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={analysis.equal ? "12 9" : "0"}
              filter={analysis.equal ? "url(#compSymbolicGlow)" : undefined}
            />
            <path
              d="M 660 295 L 780 295 L 780 350 L 900 350"
              fill="none"
              stroke={analysis.less ? "#f59e0b" : "#475569"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={analysis.less ? "12 9" : "0"}
              filter={analysis.less ? "url(#compSymbolicGlow)" : undefined}
            />

            <circle cx="925" cy="95" r="15" fill={analysis.greater ? "#22c55e" : "#1f2937"} />
            <circle cx="925" cy="220" r="15" fill={analysis.equal ? "#38bdf8" : "#1f2937"} />
            <circle cx="925" cy="350" r="15" fill={analysis.less ? "#f59e0b" : "#1f2937"} />

            <text x="960" y="103" fill={analysis.greater ? "#22c55e" : "#94a3b8"} fontSize="24" fontWeight="900">
              A &gt; B = {analysis.greater}
            </text>
            <text x="960" y="228" fill={analysis.equal ? "#38bdf8" : "#94a3b8"} fontSize="24" fontWeight="900">
              A = B = {analysis.equal}
            </text>
            <text x="960" y="358" fill={analysis.less ? "#f59e0b" : "#94a3b8"} fontSize="24" fontWeight="900">
              A &lt; B = {analysis.less}
            </text>

            <rect
              x="420"
              y="365"
              width="270"
              height="52"
              rx="16"
              fill="rgba(15,23,42,0.75)"
              stroke="rgba(250,204,21,0.28)"
            />
            <text x="555" y="399" textAnchor="middle" fill="#fbbf24" fontSize="20" fontWeight="900">
              Active Relation → {analysis.relation}
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
              The comparator checks A and B and activates only one result line: greater,
              equal, or less.
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