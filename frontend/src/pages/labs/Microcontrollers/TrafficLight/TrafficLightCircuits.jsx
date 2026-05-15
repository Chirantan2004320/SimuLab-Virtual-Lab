import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap, Cpu, Power } from "lucide-react";

export default function TrafficLightCircuits({ analysis }) {
  const activeState = analysis.state;

  const isRed = activeState === "RED";
  const isYellow = activeState === "YELLOW";
  const isGreen = activeState === "GREEN";

  const isAnyActive = isRed || isYellow || isGreen;

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <CircuitBoard size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">GPIO Circuit Diagram</h2>
            <p className="sorting-sim-subtitle">
              Microcontroller-driven traffic light control system with current-limiting resistors
            </p>
          </div>
        </div>
        <div className="dsd-circuit-badge" style={{ marginLeft: 'auto' }}>
          <Zap size={16} />
          Active: {activeState}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="sorting-stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current State</span>
          <span className="sorting-stat-value" style={{ 
            fontSize: "1.25rem",
            color: isRed ? "#ef4444" : isYellow ? "#facc15" : isGreen ? "#22c55e" : "#64748b"
          }}>
            {activeState}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">D8 - Red LED</span>
          <span className="sorting-stat-value" style={{ 
            color: isRed ? "#ef4444" : "#475569",
            fontSize: "1rem" 
          }}>
            {isRed ? "HIGH" : "LOW"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">D9 - Yellow LED</span>
          <span className="sorting-stat-value" style={{ 
            color: isYellow ? "#facc15" : "#475569",
            fontSize: "1rem"
          }}>
            {isYellow ? "HIGH" : "LOW"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">D5 - Green LED</span>
          <span className="sorting-stat-value" style={{ 
            color: isGreen ? "#22c55e" : "#475569",
            fontSize: "1rem"
          }}>
            {isGreen ? "HIGH" : "LOW"}
          </span>
        </div>
      </div>

      {/* Main Circuit Panel */}
      <div className="dsd-circuit-panel">
        <div
          className="dsd-circuit-canvas"
          style={{
            minHeight: 560,
            background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.98) 100%)",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.1)",
            padding: "2rem"
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1400 560"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Glow filters */}
              <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="currentColor" floodOpacity="0.8" />
                <feComposite in2="blur" operator="in" result="glowColor" />
                <feMerge>
                  <feMergeNode in="glowColor" />
                  <feMergeNode in="glowColor" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="wireGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradients */}
              <linearGradient id="mcuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="resistorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              <radialGradient id="powerGlow">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
              </radialGradient>

              <radialGradient id="groundGlow">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
              </radialGradient>
            </defs>

            {/* Subtle grid background */}
            <g opacity="0.08">
              {Array.from({ length: 35 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={40 + i * 40}
                  y1="20"
                  x2={40 + i * 40}
                  y2="540"
                  stroke="#64748b"
                  strokeWidth="0.5"
                />
              ))}
              {Array.from({ length: 14 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="40"
                  y1={20 + i * 40}
                  x2="1360"
                  y2={20 + i * 40}
                  stroke="#64748b"
                  strokeWidth="0.5"
                />
              ))}
            </g>

            {/* Arduino Microcontroller */}
            <g transform="translate(80, 180)">
              <rect
                x="0"
                y="0"
                width="260"
                height="200"
                rx="8"
                fill="url(#mcuGradient)"
                stroke="#3b82f6"
                strokeWidth="2.5"
              />
              
              {/* MCU Label */}
              <text x="130" y="50" textAnchor="middle" fill="#60a5fa" fontSize="18" fontWeight="800" letterSpacing="2">
                ARDUINO UNO
              </text>
              <text x="130" y="72" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="500">
                ATmega328P Microcontroller
              </text>
              
              {/* Power indicator */}
              <circle cx="20" cy="20" r="5" fill="#22c55e" opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="32" y="25" fill="#94a3b8" fontSize="10">PWR</text>

              {/* Left side - Power pins */}
              <g transform="translate(0, 90)">
                <circle cx="0" cy="0" r="6" fill="url(#powerGlow)" stroke="#3b82f6" strokeWidth="2" />
                <line x1="-25" y1="0" x2="0" y2="0" stroke="#3b82f6" strokeWidth="3" />
                <text x="-35" y="5" fill="#60a5fa" fontSize="12" fontWeight="700" textAnchor="end">5V</text>
              </g>

              <g transform="translate(0, 140)">
                <circle cx="0" cy="0" r="6" fill="url(#groundGlow)" stroke="#64748b" strokeWidth="2" />
                <line x1="-25" y1="0" x2="0" y2="0" stroke="#64748b" strokeWidth="3" />
                <text x="-35" y="5" fill="#94a3b8" fontSize="12" fontWeight="700" textAnchor="end">GND</text>
              </g>

              {/* Right side - Digital pins */}
              {[
                { y: 80, label: "D8", color: "#ef4444", active: isRed },
                { y: 120, label: "D9", color: "#facc15", active: isYellow },
                { y: 160, label: "D5", color: "#22c55e", active: isGreen }
              ].map((pin) => (
                <g key={pin.label} transform={`translate(260, ${pin.y})`}>
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="6" 
                    fill={pin.active ? pin.color : "#1e293b"} 
                    stroke={pin.active ? pin.color : "#475569"} 
                    strokeWidth={pin.active ? "3" : "2"}
                    opacity={pin.active ? "1" : "0.6"}
                  />
                  <line 
                    x1="0" 
                    y1="0" 
                    x2="25" 
                    y2="0" 
                    stroke={pin.active ? pin.color : "#475569"} 
                    strokeWidth={pin.active ? "4" : "3"}
                    filter={pin.active ? "url(#wireGlow)" : undefined}
                  />
                  <text 
                    x="35" 
                    y="5" 
                    fill={pin.active ? pin.color : "#94a3b8"} 
                    fontSize="13" 
                    fontWeight="800"
                  >
                    {pin.label}
                  </text>
                </g>
              ))}
            </g>

            {/* Wire paths from MCU to Resistors */}
            {[
              { y: 260, color: isRed ? "#ef4444" : "#334155", active: isRed },
              { y: 300, color: isYellow ? "#facc15" : "#334155", active: isYellow },
              { y: 340, color: isGreen ? "#22c55e" : "#334155", active: isGreen }
            ].map((wire, idx) => (
              <g key={idx}>
                <path
                  d={`M 365 ${wire.y} L 520 ${wire.y}`}
                  stroke={wire.color}
                  strokeWidth={wire.active ? "5" : "3"}
                  fill="none"
                  strokeLinecap="round"
                  filter={wire.active ? "url(#wireGlow)" : undefined}
                  opacity={wire.active ? "1" : "0.4"}
                />
                {wire.active && (
                  <>
                    <circle r="6" fill="#fff" opacity="0.9">
                      <animateMotion dur="1.2s" repeatCount="indefinite" path={`M 365 ${wire.y} L 520 ${wire.y}`} />
                    </circle>
                    <circle r="4" fill={wire.color}>
                      <animateMotion dur="1.2s" repeatCount="indefinite" begin="0.3s" path={`M 365 ${wire.y} L 520 ${wire.y}`} />
                    </circle>
                  </>
                )}
              </g>
            ))}

            {/* Resistors - Enhanced design */}
            {[
              { x: 520, y: 260, label: "R1", value: "220Ω", color: isRed ? "#fbbf24" : "#475569", active: isRed },
              { x: 520, y: 300, label: "R2", value: "220Ω", color: isYellow ? "#fbbf24" : "#475569", active: isYellow },
              { x: 520, y: 340, label: "R3", value: "220Ω", color: isGreen ? "#fbbf24" : "#475569", active: isGreen }
            ].map((res) => (
              <g key={res.label}>
                {/* Resistor body */}
                <rect
                  x={res.x}
                  y={res.y - 12}
                  width="80"
                  height="24"
                  rx="3"
                  fill="url(#resistorGradient)"
                  stroke={res.color}
                  strokeWidth={res.active ? "2.5" : "1.5"}
                  opacity={res.active ? "1" : "0.5"}
                />
                {/* Color bands */}
                <rect x={res.x + 15} y={res.y - 12} width="4" height="24" fill="#dc2626" />
                <rect x={res.x + 30} y={res.y - 12} width="4" height="24" fill="#dc2626" />
                <rect x={res.x + 45} y={res.y - 12} width="4" height="24" fill="#78716c" />
                
                {/* Label */}
                <text x={res.x + 40} y={res.y - 20} textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="700">
                  {res.label}
                </text>
                <text x={res.x + 40} y={res.y + 38} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">
                  {res.value}
                </text>
              </g>
            ))}

            {/* Wire paths from Resistors to LEDs */}
            {[
              { y: 260, color: isRed ? "#ef4444" : "#334155", active: isRed },
              { y: 300, color: isYellow ? "#facc15" : "#334155", active: isYellow },
              { y: 340, color: isGreen ? "#22c55e" : "#334155", active: isGreen }
            ].map((wire, idx) => (
              <g key={`led-wire-${idx}`}>
                <path
                  d={`M 600 ${wire.y} L 780 ${wire.y}`}
                  stroke={wire.color}
                  strokeWidth={wire.active ? "5" : "3"}
                  fill="none"
                  strokeLinecap="round"
                  filter={wire.active ? "url(#wireGlow)" : undefined}
                  opacity={wire.active ? "1" : "0.4"}
                />
                {wire.active && (
                  <circle r="5" fill={wire.color}>
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={`M 600 ${wire.y} L 780 ${wire.y}`} />
                  </circle>
                )}
              </g>
            ))}

            {/* LEDs - Modern design */}
            {[
              { x: 780, y: 260, label: "RED", color: "#ef4444", active: isRed, glowColor: "rgba(239,68,68,0.3)" },
              { x: 780, y: 300, label: "YELLOW", color: "#facc15", active: isYellow, glowColor: "rgba(250,204,21,0.3)" },
              { x: 780, y: 340, label: "GREEN", color: "#22c55e", active: isGreen, glowColor: "rgba(34,197,94,0.3)" }
            ].map((led) => (
              <g key={led.label}>
                {/* LED glow effect */}
                {led.active && (
                  <circle
                    cx={led.x + 30}
                    cy={led.y}
                    r="35"
                    fill={led.glowColor}
                    filter="url(#ledGlow)"
                  >
                    <animate attributeName="r" values="35;40;35" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                
                {/* LED symbol - Triangle */}
                <polygon
                  points={`${led.x},${led.y - 20} ${led.x},${led.y + 20} ${led.x + 40},${led.y}`}
                  fill={led.active ? led.color : "transparent"}
                  stroke={led.active ? led.color : "#475569"}
                  strokeWidth="3"
                  opacity={led.active ? "0.9" : "0.5"}
                />
                
                {/* LED cathode line */}
                <line
                  x1={led.x + 40}
                  y1={led.y - 25}
                  x2={led.x + 40}
                  y2={led.y + 25}
                  stroke={led.active ? led.color : "#475569"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                
                {/* Connection points */}
                <circle cx={led.x} cy={led.y} r="4" fill={led.active ? led.color : "#334155"} />
                <circle cx={led.x + 40} cy={led.y} r="4" fill={led.active ? led.color : "#334155"} />
                
                {/* Light rays when active */}
                {led.active && (
                  <g stroke={led.color} strokeWidth="2.5" fill="none" opacity="0.8">
                    <line x1={led.x + 20} y1={led.y - 35} x2={led.x + 35} y2={led.y - 50}>
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
                    </line>
                    <line x1={led.x + 35} y1={led.y - 30} x2={led.x + 50} y2={led.y - 45}>
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" begin="0.2s" repeatCount="indefinite" />
                    </line>
                    <line x1={led.x + 20} y1={led.y + 35} x2={led.x + 35} y2={led.y + 50}>
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" begin="0.4s" repeatCount="indefinite" />
                    </line>
                    <line x1={led.x + 35} y1={led.y + 30} x2={led.x + 50} y2={led.y + 45}>
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" begin="0.6s" repeatCount="indefinite" />
                    </line>
                  </g>
                )}
                
                {/* LED Label */}
                <text
                  x={led.x + 20}
                  y={led.y + 45}
                  textAnchor="middle"
                  fill={led.active ? led.color : "#94a3b8"}
                  fontSize="13"
                  fontWeight="800"
                >
                  {led.label}
                </text>
              </g>
            ))}

            {/* Ground connections - Cleaner routing */}
            <g stroke="#64748b" strokeWidth="4" fill="none" opacity="0.7">
              <path d="M 820 260 L 900 260 L 900 420" strokeLinecap="round" />
              <path d="M 820 300 L 900 300 L 900 420" strokeLinecap="round" />
              <path d="M 820 340 L 900 340 L 900 420" strokeLinecap="round" />
              
              {/* Main ground bus */}
              <path d="M 900 420 L 60 420 L 60 320" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Ground symbol - Enhanced */}
            <g transform="translate(900, 450)">
              <circle cx="0" cy="0" r="5" fill="url(#groundGlow)" />
              <line x1="0" y1="0" x2="0" y2="20" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
              <line x1="-22" y1="20" x2="22" y2="20" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
              <line x1="-15" y1="28" x2="15" y2="28" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="-8" y1="36" x2="8" y2="36" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              <text x="35" y="25" fill="#94a3b8" fontSize="14" fontWeight="700">GND</text>
            </g>

            {/* Status Panel - Right side */}
            <g transform="translate(1020, 60)">
              {/* Main status box */}
              <rect
                x="0"
                y="0"
                width="340"
                height="160"
                rx="16"
                fill="rgba(15,23,42,0.85)"
                stroke={isRed ? "rgba(239,68,68,0.5)" : isYellow ? "rgba(250,204,21,0.5)" : isGreen ? "rgba(34,197,94,0.5)" : "rgba(100,116,139,0.3)"}
                strokeWidth="2"
              />
              
              <text x="170" y="35" textAnchor="middle" fill="#cbd5e1" fontSize="14" fontWeight="700" letterSpacing="1">
                SYSTEM STATUS
              </text>
              
              <text
                x="170"
                y="75"
                textAnchor="middle"
                fill={isRed ? "#ef4444" : isYellow ? "#facc15" : "#22c55e"}
                fontSize="32"
                fontWeight="900"
                letterSpacing="1"
              >
                {activeState}
              </text>
              
              <text x="170" y="100" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="600">
                LIGHT ACTIVE
              </text>
              
              {/* Mini status indicators */}
              <g transform="translate(0, 115)">
                <rect x="15" y="0" width="100" height="35" rx="8" fill="rgba(239,68,68,0.1)" stroke={isRed ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.15)"} strokeWidth="1.5" />
                <circle cx="30" cy="17.5" r="5" fill={isRed ? "#ef4444" : "#334155"} />
                <text x="42" y="22" fill={isRed ? "#fca5a5" : "#64748b"} fontSize="11" fontWeight="700">RED</text>
                <text x="90" y="22" fill={isRed ? "#22c55e" : "#475569"} fontSize="10" fontWeight="800">{isRed ? "ON" : "OFF"}</text>
              </g>
              
              <g transform="translate(0, 115)">
                <rect x="120" y="0" width="100" height="35" rx="8" fill="rgba(250,204,21,0.1)" stroke={isYellow ? "rgba(250,204,21,0.4)" : "rgba(250,204,21,0.15)"} strokeWidth="1.5" />
                <circle cx="135" cy="17.5" r="5" fill={isYellow ? "#facc15" : "#334155"} />
                <text x="147" y="22" fill={isYellow ? "#fde68a" : "#64748b"} fontSize="11" fontWeight="700">YEL</text>
                <text x="190" y="22" fill={isYellow ? "#22c55e" : "#475569"} fontSize="10" fontWeight="800">{isYellow ? "ON" : "OFF"}</text>
              </g>
              
              <g transform="translate(0, 115)">
                <rect x="225" y="0" width="100" height="35" rx="8" fill="rgba(34,197,94,0.1)" stroke={isGreen ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.15)"} strokeWidth="1.5" />
                <circle cx="240" cy="17.5" r="5" fill={isGreen ? "#22c55e" : "#334155"} />
                <text x="252" y="22" fill={isGreen ? "#86efac" : "#64748b"} fontSize="11" fontWeight="700">GRN</text>
                <text x="295" y="22" fill={isGreen ? "#22c55e" : "#475569"} fontSize="10" fontWeight="800">{isGreen ? "ON" : "OFF"}</text>
              </g>
            </g>

            {/* Circuit Info Panel */}
            <g transform="translate(1020, 240)">
              <rect
                x="0"
                y="0"
                width="340"
                height="280"
                rx="16"
                fill="rgba(15,23,42,0.7)"
                stroke="rgba(100,116,139,0.2)"
                strokeWidth="1.5"
              />
              
              <text x="170" y="30" textAnchor="middle" fill="#e2e8f0" fontSize="15" fontWeight="700" letterSpacing="0.5">
                CIRCUIT PARAMETERS
              </text>
              
              {/* Parameter rows */}
              <g transform="translate(20, 50)">
                <text x="0" y="0" fill="#cbd5e1" fontSize="12" fontWeight="600">Supply Voltage:</text>
                <text x="300" y="0" textAnchor="end" fill="#60a5fa" fontSize="12" fontWeight="700">5.0V DC</text>
              </g>
              
              <g transform="translate(20, 75)">
                <text x="0" y="0" fill="#cbd5e1" fontSize="12" fontWeight="600">Resistor Value:</text>
                <text x="300" y="0" textAnchor="end" fill="#fbbf24" fontSize="12" fontWeight="700">220Ω</text>
              </g>
              
              <g transform="translate(20, 100)">
                <text x="0" y="0" fill="#cbd5e1" fontSize="12" fontWeight="600">LED Forward Voltage:</text>
                <text x="300" y="0" textAnchor="end" fill="#94a3b8" fontSize="12" fontWeight="700">~2.0V</text>
              </g>
              
              <g transform="translate(20, 125)">
                <text x="0" y="0" fill="#cbd5e1" fontSize="12" fontWeight="600">Current per LED:</text>
                <text x="300" y="0" textAnchor="end" fill={isAnyActive ? "#22c55e" : "#64748b"} fontSize="12" fontWeight="700">
                  {isAnyActive ? "~13.6mA" : "0mA"}
                </text>
              </g>
              
              <line x1="20" y1="145" x2="320" y2="145" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
              
              <g transform="translate(20, 170)">
                <text x="0" y="0" fill="#cbd5e1" fontSize="12" fontWeight="600">Active GPIO Pin:</text>
                <text x="300" y="0" textAnchor="end" fill={isRed ? "#ef4444" : isYellow ? "#facc15" : isGreen ? "#22c55e" : "#64748b"} fontSize="12" fontWeight="700">
                  {isRed ? "D8 (RED)" : isYellow ? "D9 (YELLOW)" : isGreen ? "D5 (GREEN)" : "None"}
                </text>
              </g>
              
              <g transform="translate(20, 195)">
                <text x="0" y="0" fill="#cbd5e1" fontSize="12" fontWeight="600">GPIO Logic Level:</text>
                <text x="300" y="0" textAnchor="end" fill={isAnyActive ? "#22c55e" : "#64748b"} fontSize="12" fontWeight="700">
                  {isAnyActive ? "HIGH (5V)" : "LOW (0V)"}
                </text>
              </g>
              
              <line x1="20" y1="215" x2="320" y2="215" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
              
              <g transform="translate(20, 240)">
                <Power size={16} color="#94a3b8" />
                <text x="25" y="13" fill="#94a3b8" fontSize="11" fontWeight="600">
                  Power Consumption: {isAnyActive ? "68mW" : "Idle"}
                </text>
              </g>
            </g>

            {/* Title */}
            <text x="700" y="35" textAnchor="middle" fill="#e2e8f0" fontSize="22" fontWeight="800" letterSpacing="1">
              TRAFFIC LIGHT CONTROL CIRCUIT
            </text>
          </svg>
        </div>

        {/* Info Cards */}
        <div className="dsd-circuit-note-grid" style={{ marginTop: '1.5rem' }}>
          <div className="overview-card">
            <div className="overview-card-head">
              <Info size={18} />
              <h4>Circuit Operation</h4>
            </div>
            <p>
              The microcontroller drives one GPIO pin HIGH (5V) at a time, activating the corresponding LED through a current-limiting resistor. The circuit ensures only one traffic light is illuminated per state.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Cpu size={18} />
              <h4>GPIO Configuration</h4>
            </div>
            <p>
              Pin D8 controls the red LED, D9 manages yellow, and D5 drives green. Each output provides 5V at ~13.6mA when active, limited by 220Ω resistors to protect the LEDs.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Current State</h4>
            </div>
            <p>{analysis.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}