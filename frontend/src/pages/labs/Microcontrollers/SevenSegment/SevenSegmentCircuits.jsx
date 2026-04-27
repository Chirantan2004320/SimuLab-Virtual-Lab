import React from "react";
import { CircuitBoard, Cpu, Info, CheckCircle2, Zap } from "lucide-react";

export default function SevenSegmentCircuits({ analysis }) {
  const active = (seg) => analysis.pattern[seg] === 1;

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
              Symbolic GPIO wiring from microcontroller pins to the seven display segments.
            </p>
          </div>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            7-Segment GPIO Circuit
          </h3>
          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Digit {analysis.digit}
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ minHeight: 520 }}>
          <svg width="100%" height="100%" viewBox="0 0 1150 520" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="wireGlow7">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="90" y="120" width="260" height="280" rx="28" fill="rgba(59,130,246,.14)" stroke="#60a5fa" strokeWidth="3" />
            <text x="220" y="230" textAnchor="middle" fill="#f8fafc" fontSize="36" fontWeight="900">
              MCU
            </text>
            <text x="220" y="268" textAnchor="middle" fill="#7dd3fc" fontSize="18" fontWeight="800">
              GPIO Driver
            </text>

            {["a", "b", "c", "d", "e", "f", "g"].map((seg, index) => {
              const y = 145 + index * 38;
              return (
                <g key={seg}>
                  <text x="365" y={y + 6} fill={active(seg) ? "#38bdf8" : "#64748b"} fontSize="14" fontWeight="900">
                    D{index + 2} → {seg.toUpperCase()}
                  </text>
                  <path
                    d={`M 350 ${y} C 500 ${y - 25}, 560 ${y - 25}, 690 ${y}`}
                    fill="none"
                    stroke={active(seg) ? "#22c55e" : "#475569"}
                    strokeWidth="5"
                    strokeLinecap="round"
                    filter={active(seg) ? "url(#wireGlow7)" : undefined}
                  />
                </g>
              );
            })}

            <rect x="690" y="85" width="340" height="365" rx="36" fill="#020617" stroke="rgba(148,163,184,.26)" strokeWidth="4" />

            {[
              ["a", 790, 115, 140, 24],
              ["b", 935, 145, 24, 110],
              ["c", 935, 285, 24, 110],
              ["d", 790, 405, 140, 24],
              ["e", 760, 285, 24, 110],
              ["f", 760, 145, 24, 110],
              ["g", 790, 262, 140, 24]
            ].map(([seg, x, y, w, h]) => (
              <rect
                key={seg}
                x={x}
                y={y}
                width={w}
                height={h}
                rx="12"
                fill={active(seg) ? "#ef4444" : "rgba(127,29,29,.34)"}
                stroke={active(seg) ? "#fca5a5" : "rgba(127,29,29,.45)"}
                strokeWidth="3"
                filter={active(seg) ? "url(#wireGlow7)" : undefined}
              />
            ))}

            <text x="860" y="485" textAnchor="middle" fill="#facc15" fontSize="22" fontWeight="900">
              Displaying Digit {analysis.digit}
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
              Each display segment is controlled by one GPIO output pin through a current-limiting resistor.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Cpu size={18} />
              <h4>GPIO Mapping</h4>
            </div>
            <p>
              D2 to D8 are mapped to segments A to G.
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