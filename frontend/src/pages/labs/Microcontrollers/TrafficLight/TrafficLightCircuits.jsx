import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap, Cpu } from "lucide-react";

export default function TrafficLightCircuits({ analysis }) {
  const activeState = analysis.state;

  const isRed = activeState === "RED";
  const isYellow = activeState === "YELLOW";
  const isGreen = activeState === "GREEN";

  const wireColor = (active, color) => (active ? color : "#475569");

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
              Microcontroller GPIO pins driving red, yellow, and green traffic LEDs.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current State</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {activeState}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Red LED</span>
          <span className="sorting-stat-value" style={{ color: isRed ? "#ef4444" : "#64748b" }}>
            {isRed ? "ON" : "OFF"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Yellow LED</span>
          <span className="sorting-stat-value" style={{ color: isYellow ? "#facc15" : "#64748b" }}>
            {isYellow ? "ON" : "OFF"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Green LED</span>
          <span className="sorting-stat-value" style={{ color: isGreen ? "#22c55e" : "#64748b" }}>
            {isGreen ? "ON" : "OFF"}
          </span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            Traffic Light GPIO Circuit
          </h3>

          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Active State: {activeState}
          </div>
        </div>

        <div
          className="dsd-circuit-canvas"
          style={{
            minHeight: 520,
            background:
              "radial-gradient(circle at 50% 30%, rgba(56,189,248,0.10), rgba(2,6,23,0.98) 62%)"
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1150 520"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="trafficRedGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="trafficYellowGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="trafficGreenGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="trafficMcuBlue" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f4f7a" />
                <stop offset="100%" stopColor="#0b2b52" />
              </linearGradient>

              <linearGradient id="trafficResistor" x1="0" x2="1">
                <stop offset="0%" stopColor="#d9b26f" />
                <stop offset="50%" stopColor="#f6d28b" />
                <stop offset="100%" stopColor="#c99445" />
              </linearGradient>
            </defs>

            {/* Background grid */}
            <g opacity="0.15">
              {Array.from({ length: 28 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={40 + i * 40}
                  y1="30"
                  x2={40 + i * 40}
                  y2="490"
                  stroke="#1e293b"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="40"
                  y1={40 + i * 40}
                  x2="1110"
                  y2={40 + i * 40}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
              ))}
            </g>

            {/* MCU */}
            <rect
              x="95"
              y="145"
              width="270"
              height="230"
              rx="28"
              fill="url(#trafficMcuBlue)"
              stroke="#38bdf8"
              strokeWidth="3"
            />

            <rect
              x="130"
              y="190"
              width="64"
              height="130"
              rx="8"
              fill="#020617"
              stroke="rgba(148,163,184,0.45)"
            />

            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={i}
                x1="142"
                y1={207 + i * 10}
                x2="182"
                y2={207 + i * 10}
                stroke="#1e293b"
                strokeWidth="2"
              />
            ))}

            <text
              x="245"
              y="235"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="38"
              fontWeight="900"
            >
              MCU
            </text>

            <text
              x="245"
              y="270"
              textAnchor="middle"
              fill="#7dd3fc"
              fontSize="18"
              fontWeight="800"
            >
              GPIO Controller
            </text>

            <text x="380" y="180" fill="#fca5a5" fontSize="16" fontWeight="900">
              D8
            </text>
            <text x="380" y="260" fill="#fde68a" fontSize="16" fontWeight="900">
              D9
            </text>
            <text x="380" y="340" fill="#86efac" fontSize="16" fontWeight="900">
              D10
            </text>

            {/* GPIO Wires */}
            <path
              d="M 365 175 C 465 120, 550 120, 650 155"
              fill="none"
              stroke={wireColor(isRed, "#ef4444")}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isRed ? "url(#trafficRedGlow)" : undefined}
            />

            <path
              d="M 365 255 C 465 240, 550 240, 650 255"
              fill="none"
              stroke={wireColor(isYellow, "#facc15")}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isYellow ? "url(#trafficYellowGlow)" : undefined}
            />

            <path
              d="M 365 335 C 465 390, 550 390, 650 355"
              fill="none"
              stroke={wireColor(isGreen, "#22c55e")}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isGreen ? "url(#trafficGreenGlow)" : undefined}
            />

            {/* Resistors */}
            {[
              { x: 650, y: 135, label: "220Ω", active: isRed },
              { x: 650, y: 235, label: "220Ω", active: isYellow },
              { x: 650, y: 335, label: "220Ω", active: isGreen }
            ].map((r, i) => (
              <g key={i}>
                <rect
                  x={r.x}
                  y={r.y}
                  width="105"
                  height="42"
                  rx="12"
                  fill="url(#trafficResistor)"
                  stroke={r.active ? "#facc15" : "#a16207"}
                  strokeWidth="3"
                />
                <rect x={r.x + 18} y={r.y} width="7" height="42" fill="#ef4444" />
                <rect x={r.x + 38} y={r.y} width="7" height="42" fill="#ef4444" />
                <rect x={r.x + 58} y={r.y} width="7" height="42" fill="#7c2d12" />
                <text
                  x={r.x + 52}
                  y={r.y + 27}
                  textAnchor="middle"
                  fill="#111827"
                  fontSize="15"
                  fontWeight="900"
                >
                  {r.label}
                </text>
              </g>
            ))}

            {/* Wires from resistors to lamps */}
            <path
              d="M 755 156 L 835 156"
              stroke={wireColor(isRed, "#ef4444")}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isRed ? "url(#trafficRedGlow)" : undefined}
            />
            <path
              d="M 755 256 L 835 256"
              stroke={wireColor(isYellow, "#facc15")}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isYellow ? "url(#trafficYellowGlow)" : undefined}
            />
            <path
              d="M 755 356 L 835 356"
              stroke={wireColor(isGreen, "#22c55e")}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isGreen ? "url(#trafficGreenGlow)" : undefined}
            />

            {/* Traffic signal housing */}
            <rect
              x="835"
              y="95"
              width="150"
              height="320"
              rx="32"
              fill="#020617"
              stroke="rgba(148,163,184,0.35)"
              strokeWidth="4"
            />

            <circle
              cx="910"
              cy="155"
              r="38"
              fill={isRed ? "#ef4444" : "rgba(127,29,29,0.55)"}
              stroke={isRed ? "#fca5a5" : "#7f1d1d"}
              strokeWidth="4"
              filter={isRed ? "url(#trafficRedGlow)" : undefined}
            />

            <circle
              cx="910"
              cy="255"
              r="38"
              fill={isYellow ? "#facc15" : "rgba(113,63,18,0.5)"}
              stroke={isYellow ? "#fde68a" : "#713f12"}
              strokeWidth="4"
              filter={isYellow ? "url(#trafficYellowGlow)" : undefined}
            />

            <circle
              cx="910"
              cy="355"
              r="38"
              fill={isGreen ? "#22c55e" : "rgba(20,83,45,0.5)"}
              stroke={isGreen ? "#86efac" : "#14532d"}
              strokeWidth="4"
              filter={isGreen ? "url(#trafficGreenGlow)" : undefined}
            />

            {/* Ground return */}
            <path
              d="M 985 155 L 1040 155 L 1040 430 L 245 430 L 245 375"
              fill="none"
              stroke="#64748b"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 985 255 L 1040 255"
              fill="none"
              stroke="#64748b"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 985 355 L 1040 355"
              fill="none"
              stroke="#64748b"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <line x1="1000" y1="430" x2="1080" y2="430" stroke="#94a3b8" strokeWidth="5" />
            <line x1="1012" y1="445" x2="1068" y2="445" stroke="#94a3b8" strokeWidth="4" />
            <line x1="1026" y1="458" x2="1054" y2="458" stroke="#94a3b8" strokeWidth="3" />
            <text x="955" y="435" fill="#cbd5e1" fontSize="18" fontWeight="900">
              GND
            </text>

            {/* Current particles */}
            {isRed && (
              <circle r="5" fill="#fff" filter="url(#trafficRedGlow)">
                <animateMotion
                  dur="1.6s"
                  repeatCount="indefinite"
                  path="M 365 175 C 465 120, 550 120, 650 155 L 835 156"
                />
              </circle>
            )}

            {isYellow && (
              <circle r="5" fill="#fff" filter="url(#trafficYellowGlow)">
                <animateMotion
                  dur="1.6s"
                  repeatCount="indefinite"
                  path="M 365 255 C 465 240, 550 240, 650 255 L 835 256"
                />
              </circle>
            )}

            {isGreen && (
              <circle r="5" fill="#fff" filter="url(#trafficGreenGlow)">
                <animateMotion
                  dur="1.6s"
                  repeatCount="indefinite"
                  path="M 365 335 C 465 390, 550 390, 650 355 L 835 356"
                />
              </circle>
            )}

            {/* Status panel */}
            <rect
              x="410"
              y="55"
              width="330"
              height="78"
              rx="20"
              fill="rgba(15,23,42,0.78)"
              stroke="rgba(56,189,248,0.25)"
            />

            <text
              x="575"
              y="86"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="15"
              fontWeight="800"
            >
              ACTIVE TRAFFIC STATE
            </text>

            <text
              x="575"
              y="116"
              textAnchor="middle"
              fill={
                isRed ? "#ef4444" : isYellow ? "#facc15" : "#22c55e"
              }
              fontSize="25"
              fontWeight="900"
            >
              {activeState} LIGHT ON
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
              The microcontroller activates only one GPIO output at a time:
              red, yellow, or green.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Cpu size={18} />
              <h4>GPIO Mapping</h4>
            </div>
            <p>
              D8 controls red, D9 controls yellow, and D10 controls green.
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