import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap, Timer } from "lucide-react";

export default function LEDBlinkCircuits({ analysis }) {
  const ledOn = analysis.ledState === 1;

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
              Standard electronic schematic showing GPIO D13 toggling an LED through a delay loop.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">GPIO D13</span>
          <span className="sorting-stat-value" style={{ color: ledOn ? "#22c55e" : "#ef4444" }}>
            {ledOn ? "HIGH" : "LOW"}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">LED</span>
          <span className="sorting-stat-value" style={{ color: ledOn ? "#22c55e" : "#ef4444" }}>
            {ledOn ? "ON" : "OFF"}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Delay</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>{analysis.delayMs} ms</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Cycle Count</span>
          <span className="sorting-stat-value">{analysis.cycleCount}</span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Standard Electronic Schematic</h3>
          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Timed Toggle View
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ minHeight: 470 }}>
          <svg width="100%" height="100%" viewBox="0 0 1100 470" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="blinkCircuitGreen">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="blinkCircuitRed">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker id="arrowRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fca5a5" />
              </marker>
            </defs>

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
              stroke={ledOn ? "#22c55e" : "#475569"}
              strokeWidth="4"
              fill="none"
              filter={ledOn ? "url(#blinkCircuitGreen)" : undefined}
            />

            {/* Current Animation (only when active) */}
            {ledOn && (
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
              stroke={ledOn ? "#fbbf24" : "#94a3b8"}
              strokeWidth="4"
              strokeLinejoin="miter"
              fill="none"
              filter={ledOn ? "url(#blinkCircuitRed)" : undefined}
            />
            <text x="420" y="245" textAnchor="middle" fill="#cbd5e1" fontSize="18" fontWeight="bold">R1</text>
            <text x="420" y="265" textAnchor="middle" fill="#94a3b8" fontSize="14">220Ω</text>

            {/* LED Schematic Symbol */}
            <g transform="translate(600, 200)">
              {/* Diode Triangle */}
              <polygon points="0,-20 0,20 40,0" fill={ledOn ? "rgba(239,68,68,0.85)" : "transparent"} stroke={ledOn ? "#fca5a5" : "#94a3b8"} strokeWidth="3" filter={ledOn ? "url(#blinkCircuitRed)" : undefined} />
              {/* Diode Line */}
              <line x1="40" y1="-25" x2="40" y2="25" stroke={ledOn ? "#fca5a5" : "#94a3b8"} strokeWidth="4" filter={ledOn ? "url(#blinkCircuitRed)" : undefined} />
              <circle cx="0" cy="0" r="4" fill={ledOn ? "#22c55e" : "#475569"} />
              <circle cx="40" cy="0" r="4" fill={ledOn ? "#22c55e" : "#475569"} />
              
              {/* Light emission arrows */}
              {ledOn && (
                <g stroke="#fca5a5" strokeWidth="2.5" fill="none">
                  <path d="M 15 -35 L 30 -50" markerEnd="url(#arrowRed)" />
                  <path d="M 30 -30 L 45 -45" markerEnd="url(#arrowRed)" />
                </g>
              )}
            </g>
            <text x="620" y="245" textAnchor="middle" fill={ledOn ? "#fca5a5" : "#cbd5e1"} fontSize="18" fontWeight="bold">LED1</text>

            {/* Ground Schematic Symbol */}
            <g transform="translate(750, 350)">
              <circle cx="0" cy="0" r="4" fill={ledOn ? "#64748b" : "#475569"} />
              <line x1="0" y1="0" x2="0" y2="20" stroke="#94a3b8" strokeWidth="4" />
              <line x1="-25" y1="20" x2="25" y2="20" stroke="#94a3b8" strokeWidth="4" />
              <line x1="-15" y1="30" x2="15" y2="30" stroke="#94a3b8" strokeWidth="4" />
              <line x1="-5" y1="40" x2="5" y2="40" stroke="#94a3b8" strokeWidth="4" />
            </g>
            <text x="800" y="355" fill="#94a3b8" fontSize="16" fontWeight="bold">GND</text>

            <rect x="400" y="30" width="310" height="78" rx="18" fill="rgba(15,23,42,.78)" stroke="rgba(250,204,21,.35)" />
            <text x="555" y="61" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="800">PROGRAM LOOP</text>
            <text x="555" y="90" textAnchor="middle" fill="#facc15" fontSize="23" fontWeight="900">
              HIGH → delay → LOW → delay
            </text>

            <text x="555" y="420" textAnchor="middle" fill="#fbbf24" fontSize="20" fontWeight="900">
              Current Phase: {analysis.phase}
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
              The GPIO pin changes between HIGH and LOW. When HIGH, current flows through the resistor and LED.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Timer size={18} />
              <h4>Timing Rule</h4>
            </div>
            <p>
              The output remains in each phase for <strong>{analysis.delayMs} ms</strong>.
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