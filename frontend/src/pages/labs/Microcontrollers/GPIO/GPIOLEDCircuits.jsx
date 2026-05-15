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
              Standard schematic diagram showing how GPIO D13 drives an LED through a 220Ω resistor.
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
            Standard Electronic Schematic
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

              <marker
                id="arrowRed"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fca5a5" />
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

            {/* MCU block (Schematic representation) */}
            <rect
              x="50"
              y="100"
              width="180"
              height="200"
              rx="4"
              fill="rgba(15, 23, 42, 0.5)"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="10 5"
            />
            <text x="140" y="150" textAnchor="middle" fill="#94a3b8" fontSize="20" fontWeight="bold" letterSpacing="2">ARDUINO UNO</text>
            <text x="140" y="170" textAnchor="middle" fill="#64748b" fontSize="14">Microcontroller</text>
            
            {/* Unused Pins Left */}
            {[
              {y: 110, label: "RESET"}, {y: 125, label: "3.3V"}, {y: 140, label: "5V"}, 
              {y: 155, label: "GND"}, {y: 170, label: "Vin"}, 
              {y: 215, label: "A0"}, {y: 230, label: "A1"}, {y: 245, label: "A2"}, 
              {y: 260, label: "A3"}, {y: 275, label: "A4"}, {y: 290, label: "A5"}
            ].map(pin => (
              <g key={`l-${pin.label}`}>
                <line x1="30" y1={pin.y} x2="50" y2={pin.y} stroke="#475569" strokeWidth="2" />
                <circle cx="30" cy={pin.y} r="2.5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                <text x="60" y={pin.y + 4} fill="#64748b" fontSize="10" fontWeight="bold">{pin.label}</text>
              </g>
            ))}

            {/* Unused Pins Right */}
            {[
              {y: 110, label: "AREF"}, {y: 125, label: "GND"}, {y: 140, label: "D12"}, 
              {y: 155, label: "D11"}, {y: 170, label: "D10"}, {y: 185, label: "D9"}, 
              {y: 215, label: "D8"}, {y: 230, label: "D7"}, {y: 245, label: "D6"}, 
              {y: 275, label: "D5"}, {y: 290, label: "D4"}
            ].map(pin => (
              <g key={`r-${pin.label}`}>
                <line x1="230" y1={pin.y} x2="250" y2={pin.y} stroke="#475569" strokeWidth="2" />
                <circle cx="250" cy={pin.y} r="2.5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                <text x="220" y={pin.y + 4} fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">{pin.label}</text>
              </g>
            ))}
            
            {/* D13 Pin */}
            <line x1="230" y1="200" x2="270" y2="200" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="270" cy="200" r="4" fill="#38bdf8" />
            <text x="220" y="204" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="end">D13</text>
            <text x="260" y="180" fill="#cbd5e1" fontSize="12" fontStyle="italic">OUTPUT</text>
            
            {/* Ground Pin from MCU */}
            <line x1="230" y1="260" x2="270" y2="260" stroke="#64748b" strokeWidth="3" />
            <circle cx="270" cy="260" r="4" fill="#64748b" />
            <text x="220" y="264" fill="#64748b" fontSize="14" fontWeight="bold" textAnchor="end">GND</text>
            <line x1="270" y1="260" x2="270" y2="350" stroke="#64748b" strokeWidth="3" fill="none" />
            <line x1="270" y1="350" x2="750" y2="350" stroke="#64748b" strokeWidth="3" fill="none" />

            {/* Main Circuit Path */}
            <path
              d="M 270 200 L 370 200 M 470 200 L 600 200 M 640 200 L 750 200 L 750 350"
              stroke={isActive ? "#22c55e" : "#475569"}
              strokeWidth="4"
              fill="none"
              filter={isActive ? "url(#gpioGlowGreen)" : undefined}
            />

            {/* Current Animation (only when active) */}
            {isActive && (
              <g stroke="#fff" strokeWidth="4" fill="none" strokeDasharray="8 12">
                <path d="M 270 200 L 370 200">
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
                </path>
                <path d="M 470 200 L 600 200">
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
                </path>
                <path d="M 640 200 L 750 200 L 750 350 L 270 350 L 270 260">
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
                </path>
              </g>
            )}

            {/* Resistor Schematic Symbol (ZigZag) */}
            <path
              d="M 370 200 L 386 180 L 403 220 L 420 180 L 436 220 L 453 180 L 470 200"
              stroke={isActive ? "#fbbf24" : "#94a3b8"}
              strokeWidth="4"
              strokeLinejoin="miter"
              fill="none"
              filter={isActive ? "url(#gpioGlowRed)" : undefined}
            />
            <text x="420" y="245" textAnchor="middle" fill="#cbd5e1" fontSize="18" fontWeight="bold">R1</text>
            <text x="420" y="265" textAnchor="middle" fill="#94a3b8" fontSize="14">220Ω</text>

            {/* LED Schematic Symbol */}
            <g transform="translate(600, 200)">
              {/* Diode Triangle */}
              <polygon points="0,-20 0,20 40,0" fill={isActive ? "rgba(239,68,68,0.85)" : "transparent"} stroke={isActive ? "#fca5a5" : "#94a3b8"} strokeWidth="3" filter={isActive ? "url(#gpioGlowRed)" : undefined} />
              {/* Diode Line */}
              <line x1="40" y1="-25" x2="40" y2="25" stroke={isActive ? "#fca5a5" : "#94a3b8"} strokeWidth="4" filter={isActive ? "url(#gpioGlowRed)" : undefined} />
              <circle cx="0" cy="0" r="4" fill={isActive ? "#22c55e" : "#475569"} />
              <circle cx="40" cy="0" r="4" fill={isActive ? "#22c55e" : "#475569"} />
              
              {/* Light emission arrows */}
              {isActive && (
                <g stroke="#fca5a5" strokeWidth="2.5" fill="none">
                  <path d="M 15 -35 L 30 -50" markerEnd="url(#arrowRed)" />
                  <path d="M 30 -30 L 45 -45" markerEnd="url(#arrowRed)" />
                </g>
              )}
            </g>
            <text x="620" y="245" textAnchor="middle" fill={isActive ? "#fca5a5" : "#cbd5e1"} fontSize="18" fontWeight="bold">LED1</text>

            {/* Ground Schematic Symbol */}
            <g transform="translate(750, 350)">
              <circle cx="0" cy="0" r="4" fill={isActive ? "#64748b" : "#475569"} />
              <line x1="0" y1="0" x2="0" y2="20" stroke="#94a3b8" strokeWidth="4" />
              <line x1="-25" y1="20" x2="25" y2="20" stroke="#94a3b8" strokeWidth="4" />
              <line x1="-15" y1="30" x2="15" y2="30" stroke="#94a3b8" strokeWidth="4" />
              <line x1="-5" y1="40" x2="5" y2="40" stroke="#94a3b8" strokeWidth="4" />
            </g>
            <text x="800" y="355" fill="#94a3b8" fontSize="16" fontWeight="bold">GND</text>

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