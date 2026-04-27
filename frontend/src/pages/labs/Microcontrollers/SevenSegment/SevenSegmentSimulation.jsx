import React, { useEffect } from "react";
import { PlayCircle, Cpu, Zap, Lightbulb } from "lucide-react";

const SEGMENTS = ["a", "b", "c", "d", "e", "f", "g"];

const SEGMENT_SHAPES = {
  a: "M 130 40 L 270 40 L 295 65 L 270 90 L 130 90 L 105 65 Z",
  b: "M 300 70 L 325 95 L 325 205 L 300 230 L 275 205 L 275 95 Z",
  c: "M 300 250 L 325 275 L 325 385 L 300 410 L 275 385 L 275 275 Z",
  d: "M 130 390 L 270 390 L 295 415 L 270 440 L 130 440 L 105 415 Z",
  e: "M 100 250 L 125 275 L 125 385 L 100 410 L 75 385 L 75 275 Z",
  f: "M 100 70 L 125 95 L 125 205 L 100 230 L 75 205 L 75 95 Z",
  g: "M 130 215 L 270 215 L 295 240 L 270 265 L 130 265 L 105 240 Z"
};

const SEGMENT_LABEL_POS = {
  a: [200, 68],
  b: [305, 154],
  c: [305, 324],
  d: [200, 422],
  e: [95, 324],
  f: [95, 154],
  g: [200, 246]
};

const SEGMENT_ENDPOINTS = {
  a: [640, 125],
  b: [725, 190],
  c: [725, 315],
  d: [640, 385],
  e: [555, 315],
  f: [555, 190],
  g: [640, 255]
};

export default function SevenSegmentSimulation({
  digit,
  setDigit,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [digit, setExperimentRun]);

  const segmentActive = (seg) => analysis.pattern[seg] === 1;

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
              Select a digit and observe how GPIO pins light the required segments.
            </p>
          </div>
        </div>

        <div className="hardware-board-badge">
          <Zap size={16} />
          Live Segment Driver
        </div>
      </div>

      <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <button
            key={i}
            className={`sim-btn ${digit === i ? "sim-btn-primary" : "sim-btn-muted"}`}
            onClick={() => {
              setDigit(i);
              setExperimentRun(true);
            }}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Digit</span>
          <span className="sorting-stat-value">{digit}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Pattern abcdefg</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.binaryPattern}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Active Segments</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.activeSegments.join(", ")}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">GPIO HIGH</span>
          <span className="sorting-stat-value">{analysis.activeCount}</span>
        </div>
      </div>

      <div className="hardware-board-shell">
        <div className="hardware-board-header">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            7-Segment Hardware View
          </h3>

          <div className="hardware-board-badge">
            <Cpu size={16} />
            GPIO Driver Board
          </div>
        </div>

        <div
          style={{
            position: "relative",
            minHeight: 650,
            borderRadius: 26,
            border: "1px solid rgba(56,189,248,0.18)",
            background:
              "radial-gradient(circle at 50% 28%, rgba(56,189,248,0.14), transparent 35%), linear-gradient(135deg, rgba(2,6,23,0.98), rgba(15,23,42,0.95))",
            overflow: "hidden",
            padding: 28
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(30,41,59,.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,41,59,.35) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.12
            }}
          />

          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1150 620"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "relative", zIndex: 2 }}
          >
            <defs>
              <filter id="segStrongGlow">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="blueBoardGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="mcuBlue7Seg" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f4f7a" />
                <stop offset="100%" stopColor="#0b2b52" />
              </linearGradient>

              <linearGradient id="displayGlass" x1="0" x2="1">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="50%" stopColor="#050816" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            <rect
              x="55"
              y="130"
              width="270"
              height="340"
              rx="30"
              fill="url(#mcuBlue7Seg)"
              stroke="#38bdf8"
              strokeWidth="3"
              filter="url(#blueBoardGlow)"
            />

            <text x="190" y="220" textAnchor="middle" fill="#f8fafc" fontSize="34" fontWeight="900">
              MCU
            </text>
            <text x="190" y="255" textAnchor="middle" fill="#7dd3fc" fontSize="17" fontWeight="800">
              GPIO Segment Driver
            </text>

            <rect x="95" y="305" width="190" height="82" rx="18" fill="rgba(2,6,23,0.65)" stroke="rgba(148,163,184,0.18)" />
            <text x="190" y="335" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="900">
              DIGIT INPUT
            </text>
            <text x="190" y="372" textAnchor="middle" fill="#38bdf8" fontSize="42" fontWeight="900">
              {digit}
            </text>

            <rect x="72" y="495" width="235" height="70" rx="18" fill="rgba(15,23,42,0.84)" stroke="rgba(56,189,248,0.26)" />
            <text x="190" y="522" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="900">
              PATTERN abcdefg
            </text>
            <text x="190" y="552" textAnchor="middle" fill="#facc15" fontSize="24" fontWeight="900">
              {analysis.binaryPattern}
            </text>

            {SEGMENTS.map((seg, index) => {
              const y = 150 + index * 36;
              const active = segmentActive(seg);
              const [endX, endY] = SEGMENT_ENDPOINTS[seg];

              return (
                <g key={`wire-${seg}`}>
                  <circle cx="325" cy={y} r="5" fill={active ? "#22c55e" : "#475569"} />
                  <text
                    x="340"
                    y={y + 5}
                    fill={active ? "#7dd3fc" : "#64748b"}
                    fontSize="12"
                    fontWeight="900"
                  >
                    D{index + 2} → {seg.toUpperCase()}
                  </text>

                  <path
                    d={`M 420 ${y} C 505 ${y}, 485 ${endY}, ${endX - 18} ${endY}`}
                    fill="none"
                    stroke={active ? "#22c55e" : "rgba(71,85,105,0.55)"}
                    strokeWidth={active ? "5" : "3"}
                    strokeLinecap="round"
                    filter={active ? "url(#segStrongGlow)" : undefined}
                  />

                  {active && (
                    <circle r="4" fill="#ffffff" filter="url(#segStrongGlow)">
                      <animateMotion
                        dur="1.4s"
                        repeatCount="indefinite"
                        path={`M 420 ${y} C 505 ${y}, 485 ${endY}, ${endX - 18} ${endY}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            <rect
              x="505"
              y="55"
              width="300"
              height="470"
              rx="42"
              fill="url(#displayGlass)"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="5"
            />

            <rect
              x="535"
              y="85"
              width="240"
              height="410"
              rx="34"
              fill="rgba(0,0,0,0.45)"
              stroke="rgba(56,189,248,0.12)"
            />

            {Object.entries(SEGMENT_SHAPES).map(([seg, path]) => {
              const active = segmentActive(seg);
              const [labelX, labelY] = SEGMENT_LABEL_POS[seg];

              return (
                <g key={seg}>
                  <path
                    d={path}
                    transform="translate(455, 35)"
                    fill={active ? "#ef4444" : "rgba(127,29,29,0.24)"}
                    stroke={active ? "#fca5a5" : "rgba(127,29,29,0.3)"}
                    strokeWidth="3"
                    filter={active ? "url(#segStrongGlow)" : undefined}
                  />
                  <text
                    x={labelX + 455}
                    y={labelY + 35}
                    textAnchor="middle"
                    fill={active ? "#fff" : "#475569"}
                    fontSize="13"
                    fontWeight="900"
                  >
                    {seg.toUpperCase()}
                  </text>
                </g>
              );
            })}

            <text x="655" y="575" textAnchor="middle" fill="#38bdf8" fontSize="24" fontWeight="900">
              Displaying Digit {digit}
            </text>

            <rect x="845" y="80" width="250" height="415" rx="28" fill="rgba(15,23,42,0.78)" stroke="rgba(148,163,184,0.16)" />
            <text x="970" y="120" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="900">
              Segment Status
            </text>

            {SEGMENTS.map((seg, index) => {
              const active = segmentActive(seg);
              return (
                <g key={`status-${seg}`}>
                  <rect
                    x="875"
                    y={150 + index * 45}
                    width="190"
                    height="34"
                    rx="12"
                    fill={active ? "rgba(239,68,68,0.16)" : "rgba(2,6,23,0.55)"}
                    stroke={active ? "rgba(239,68,68,0.55)" : "rgba(148,163,184,0.12)"}
                  />
                  <text x="895" y={172 + index * 45} fill="#e2e8f0" fontSize="13" fontWeight="900">
                    {seg.toUpperCase()}
                  </text>
                  <text
                    x="1038"
                    y={172 + index * 45}
                    textAnchor="end"
                    fill={active ? "#ef4444" : "#94a3b8"}
                    fontSize="13"
                    fontWeight="900"
                  >
                    {active ? "HIGH" : "LOW"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        <Lightbulb size={16} />
        {analysis.note}
      </div>
    </section>
  );
}