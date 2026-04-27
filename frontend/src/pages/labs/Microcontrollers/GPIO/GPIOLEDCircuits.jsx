import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap, Cpu } from "lucide-react";

export default function GPIOLEDCircuits({ pinMode, pinState, analysis }) {
  const isActive = pinMode === "OUTPUT" && pinState === 1;

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <CircuitBoard size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">GPIO LED Circuit</h2>
            <p className="sorting-sim-subtitle">
              Symbolic circuit showing how GPIO D13 drives an LED through a 220Ω resistor.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Pin Mode</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {pinMode}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">GPIO D13</span>
          <span
            className="sorting-stat-value"
            style={{ color: pinState ? "#22c55e" : "#ef4444" }}
          >
            {pinState ? "HIGH" : "LOW"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">LED</span>
          <span
            className="sorting-stat-value"
            style={{ color: isActive ? "#22c55e" : "#ef4444" }}
          >
            {isActive ? "ON" : "OFF"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current</span>
          <span
            className="sorting-stat-value"
            style={{ color: isActive ? "#facc15" : "#94a3b8", fontSize: "1rem" }}
          >
            {isActive ? "Flowing" : "Stopped"}
          </span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            Premium Symbolic GPIO Circuit
          </h3>

          <div className="dsd-circuit-badge">
            <Zap size={16} />
            {isActive ? "Live Current Flow" : "Circuit Idle"}
          </div>
        </div>

        <div
          className="dsd-circuit-canvas"
          style={{
            minHeight: 500,
            background:
              "radial-gradient(circle at 50% 35%, rgba(56,189,248,0.10), rgba(2,6,23,0.98) 62%)",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1150 500"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="gpioGlowGreen">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="gpioGlowRed">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="mcuBlue" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f3b63" />
                <stop offset="100%" stopColor="#0a2542" />
              </linearGradient>

              <linearGradient id="resistorBody" x1="0" x2="1">
                <stop offset="0%" stopColor="#d9b26f" />
                <stop offset="50%" stopColor="#f6d28b" />
                <stop offset="100%" stopColor="#c99445" />
              </linearGradient>

              <marker
                id="arrowGreen"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
              </marker>
            </defs>

            {/* Background grid */}
            <g opacity="0.16">
              {Array.from({ length: 28 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={40 + i * 40}
                  y1="30"
                  x2={40 + i * 40}
                  y2="470"
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

            {/* MCU block */}
            <rect
              x="95"
              y="145"
              width="250"
              height="210"
              rx="26"
              fill="url(#mcuBlue)"
              stroke="#38bdf8"
              strokeWidth="3"
              opacity="0.95"
            />

            <rect
              x="128"
              y="182"
              width="52"
              height="112"
              rx="8"
              fill="#020617"
              stroke="rgba(148,163,184,0.45)"
            />

            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={i}
                x1="138"
                y1={195 + i * 10}
                x2="170"
                y2={195 + i * 10}
                stroke="#1e293b"
                strokeWidth="2"
              />
            ))}

            <text
              x="245"
              y="215"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="36"
              fontWeight="900"
            >
              MCU
            </text>

            <text
              x="245"
              y="250"
              textAnchor="middle"
              fill="#7dd3fc"
              fontSize="18"
              fontWeight="800"
            >
              GPIO Controller
            </text>

            <circle
              cx="310"
              cy="170"
              r="10"
              fill={pinState ? "#22c55e" : "#ef4444"}
              filter={pinState ? "url(#gpioGlowGreen)" : undefined}
            />

            {/* GPIO pin */}
            <circle cx="345" cy="250" r="6" fill="#93c5fd" />
            <text x="360" y="242" fill="#38bdf8" fontSize="18" fontWeight="800">
              D13
            </text>

            {/* resistor */}
            <path
              d="M 351 250 L 480 250"
              stroke={isActive ? "#22c55e" : "#475569"}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isActive ? "url(#gpioGlowGreen)" : undefined}
            />

            <rect
              x="480"
              y="224"
              width="130"
              height="52"
              rx="14"
              fill="url(#resistorBody)"
              stroke="#fbbf24"
              strokeWidth="3"
            />

            <rect x="500" y="224" width="8" height="52" fill="#ef4444" />
            <rect x="520" y="224" width="8" height="52" fill="#ef4444" />
            <rect x="542" y="224" width="8" height="52" fill="#7c2d12" />
            <rect x="570" y="224" width="8" height="52" fill="#facc15" />

            <text
              x="545"
              y="257"
              textAnchor="middle"
              fill="#111827"
              fontSize="18"
              fontWeight="900"
            >
              220Ω
            </text>

            <path
              d="M 610 250 L 730 250"
              stroke={isActive ? "#22c55e" : "#475569"}
              strokeWidth="7"
              strokeLinecap="round"
              filter={isActive ? "url(#gpioGlowGreen)" : undefined}
            />

            {/* LED */}
            <circle
              cx="775"
              cy="250"
              r="32"
              fill={
                isActive
                  ? "rgba(239,68,68,0.95)"
                  : "rgba(127,29,29,0.55)"
              }
              stroke={isActive ? "#fca5a5" : "#7f1d1d"}
              strokeWidth="4"
              filter={isActive ? "url(#gpioGlowRed)" : undefined}
            />

            <circle
              cx="764"
              cy="238"
              r="9"
              fill="rgba(255,255,255,0.38)"
            />

            <text
              x="775"
              y="315"
              textAnchor="middle"
              fill={isActive ? "#fca5a5" : "#94a3b8"}
              fontSize="22"
              fontWeight="900"
            >
              LED {isActive ? "ON" : "OFF"}
            </text>

            {/* ground path */}
            <path
              d="M 775 282 L 775 360 L 245 360 L 245 355"
              stroke={isActive ? "#64748b" : "#334155"}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <line x1="735" y1="360" x2="815" y2="360" stroke="#94a3b8" strokeWidth="5" />
            <line x1="745" y1="374" x2="805" y2="374" stroke="#94a3b8" strokeWidth="4" />
            <line x1="758" y1="386" x2="792" y2="386" stroke="#94a3b8" strokeWidth="3" />

            <text
              x="835"
              y="365"
              fill="#cbd5e1"
              fontSize="20"
              fontWeight="800"
            >
              GND
            </text>

            {/* Active current arrows */}
            {isActive && (
              <>
                <path
                  d="M 372 225 C 420 190, 465 190, 515 220"
                  stroke="#22c55e"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8 8"
                  markerEnd="url(#arrowGreen)"
                  filter="url(#gpioGlowGreen)"
                />
                <path
                  d="M 620 220 C 675 185, 735 190, 760 220"
                  stroke="#22c55e"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8 8"
                  markerEnd="url(#arrowGreen)"
                  filter="url(#gpioGlowGreen)"
                />
              </>
            )}

            {/* Status panel */}
            <rect
              x="410"
              y="75"
              width="340"
              height="74"
              rx="20"
              fill="rgba(15,23,42,0.75)"
              stroke={isActive ? "rgba(34,197,94,0.45)" : "rgba(239,68,68,0.35)"}
            />

            <text
              x="580"
              y="105"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="16"
              fontWeight="800"
            >
              CIRCUIT CONDITION
            </text>

            <text
              x="580"
              y="132"
              textAnchor="middle"
              fill={isActive ? "#22c55e" : "#ef4444"}
              fontSize="22"
              fontWeight="900"
            >
              {isActive ? "GPIO HIGH → CURRENT FLOWING" : "GPIO LOW → LED OFF"}
            </text>

            {/* Output label */}
            <rect
              x="855"
              y="205"
              width="205"
              height="92"
              rx="20"
              fill={isActive ? "rgba(34,197,94,0.13)" : "rgba(239,68,68,0.10)"}
              stroke={isActive ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.35)"}
            />
            <text
              x="958"
              y="240"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="18"
              fontWeight="800"
            >
              Output Status
            </text>
            <text
              x="958"
              y="272"
              textAnchor="middle"
              fill={isActive ? "#22c55e" : "#ef4444"}
              fontSize="26"
              fontWeight="900"
            >
              {analysis.status}
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
              The microcontroller pin <strong>D13</strong> is configured as{" "}
              <strong>{pinMode}</strong>. When the output is{" "}
              <strong style={{ color: pinState ? "#22c55e" : "#ef4444" }}>
                {pinState ? "HIGH" : "LOW"}
              </strong>
              , the LED is{" "}
              <strong style={{ color: isActive ? "#22c55e" : "#ef4444" }}>
                {isActive ? "ON" : "OFF"}
              </strong>
              .
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Observation</h4>
            </div>
            <p>{analysis.note}</p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Cpu size={18} />
              <h4>Hardware Rule</h4>
            </div>
            <p>
              The resistor limits current, protecting the LED and the GPIO pin from excess current.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}