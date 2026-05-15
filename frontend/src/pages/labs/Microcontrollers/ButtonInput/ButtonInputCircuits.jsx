import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap } from "lucide-react";

export default function ButtonInputCircuits({ inputMode, buttonPressed, analysis }) {
  const isHigh = analysis.readValue === 1;

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
              Standard electronic schematic of button input biasing and GPIO reading.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Mode</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {inputMode === "PULL_DOWN" ? "Pull-down" : "Pull-up"}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Button</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.buttonLabel}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">GPIO D2</span>
          <span className="sorting-stat-value" style={{ color: isHigh ? "#22c55e" : "#ef4444" }}>
            {analysis.readLabel}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Voltage</span>
          <span className="sorting-stat-value" style={{ color: isHigh ? "#22c55e" : "#ef4444", fontSize: "1rem" }}>
            {analysis.voltage}
          </span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Standard Electronic Schematic</h3>
          <div className="dsd-circuit-badge">
            <Zap size={16} />
            GPIO Read Path
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ minHeight: 470 }}>
          <svg width="100%" height="100%" viewBox="0 0 1100 470" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="btnCircuitGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
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
              {y: 110, label: "AREF"}, {y: 125, label: "GND"}, {y: 140, label: "D13"}, 
              {y: 155, label: "D12"}, {y: 170, label: "D11"}, {y: 185, label: "D10"}, 
              {y: 215, label: "D9"}, {y: 230, label: "D8"}, {y: 245, label: "D7"}, 
              {y: 275, label: "D6"}, {y: 290, label: "D5"}
            ].map(pin => (
              <g key={`r-${pin.label}`}>
                <line x1="230" y1={pin.y} x2="250" y2={pin.y} stroke="#475569" strokeWidth="2" />
                <circle cx="250" cy={pin.y} r="2.5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                <text x="220" y={pin.y + 4} fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">{pin.label}</text>
              </g>
            ))}
            
            {/* D2 Pin */}
            <line x1="230" y1="200" x2="270" y2="200" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="270" cy="200" r="4" fill="#38bdf8" />
            <text x="220" y="204" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="end">D2</text>
            <text x="260" y="180" fill="#cbd5e1" fontSize="12" fontStyle="italic">INPUT</text>

            {/* Signal Paths */}
            {(() => {
              const v5Color = "#22c55e";
              const gndColor = "#3b82f6";
              const d2Color = isHigh ? v5Color : gndColor;

              return (
                <g>
                  {/* Top Wire */}
                  <line x1="500" y1="50" x2="500" y2="100" stroke={v5Color} strokeWidth="4" />
                  <text x="500" y="40" textAnchor="middle" fill={v5Color} fontSize="20" fontWeight="bold">5V</text>

                  {/* Bottom Wire */}
                  <line x1="500" y1="300" x2="500" y2="350" stroke={gndColor} strokeWidth="4" />
                  <g transform="translate(500, 350)">
                    <circle cx="0" cy="0" r="4" fill={gndColor} />
                    <line x1="0" y1="0" x2="0" y2="20" stroke={gndColor} strokeWidth="4" />
                    <line x1="-25" y1="20" x2="25" y2="20" stroke={gndColor} strokeWidth="4" />
                    <line x1="-15" y1="30" x2="15" y2="30" stroke={gndColor} strokeWidth="4" />
                    <line x1="-5" y1="40" x2="5" y2="40" stroke={gndColor} strokeWidth="4" />
                  </g>
                  <text x="545" y="355" fill={gndColor} fontSize="16" fontWeight="bold">GND</text>

                  {/* D2 Wire */}
                  <line x1="270" y1="200" x2="500" y2="200" stroke={d2Color} strokeWidth="4" />
                  <circle cx="500" cy="200" r="5" fill={d2Color} />
                  
                  {/* Direction Arrow */}
                  <path d="M 330 200 L 350 190 L 350 210 Z" fill={d2Color} />

                  {inputMode === "PULL_DOWN" ? (
                    <>
                      {/* Switch (Top) */}
                      <circle cx="500" cy="100" r="4" fill={v5Color} />
                      <circle cx="500" cy="160" r="4" fill={d2Color} />
                      <line x1="500" y1="160" x2={buttonPressed ? 500 : 470} y2={100} stroke={buttonPressed ? v5Color : "#94a3b8"} strokeWidth="4" />
                      <text x="440" y="135" fill="#cbd5e1" fontSize="16" fontWeight="bold">SW1</text>
                      
                      <line x1="500" y1="160" x2="500" y2="200" stroke={d2Color} strokeWidth="4" />

                      {/* Resistor (Bottom) */}
                      <line x1="500" y1="200" x2="500" y2="240" stroke={d2Color} strokeWidth="4" />
                      <path d="M 500 240 L 515 247.5 L 485 262.5 L 515 277.5 L 485 292.5 L 500 300" stroke={d2Color} strokeWidth="4" fill="none" />
                      <text x="540" y="275" fill="#cbd5e1" fontSize="16" fontWeight="bold">10kΩ</text>
                    </>
                  ) : (
                    <>
                      {/* Resistor (Top) */}
                      <path d="M 500 100 L 515 107.5 L 485 122.5 L 515 137.5 L 485 152.5 L 500 160" stroke={v5Color} strokeWidth="4" fill="none" />
                      <text x="540" y="135" fill="#cbd5e1" fontSize="16" fontWeight="bold">10kΩ</text>
                      
                      <line x1="500" y1="160" x2="500" y2="200" stroke={d2Color} strokeWidth="4" />

                      {/* Switch (Bottom) */}
                      <line x1="500" y1="200" x2="500" y2="240" stroke={d2Color} strokeWidth="4" />
                      <circle cx="500" cy="240" r="4" fill={d2Color} />
                      <circle cx="500" cy="300" r="4" fill={gndColor} />
                      <line x1="500" y1="300" x2={buttonPressed ? 500 : 470} y2={240} stroke={buttonPressed ? gndColor : "#94a3b8"} strokeWidth="4" />
                      <text x="440" y="275" fill="#cbd5e1" fontSize="16" fontWeight="bold">SW1</text>
                    </>
                  )}

                  {/* Current Animation (only when active) */}
                  {buttonPressed && (
                    <path
                      d="M 500 50 L 500 350"
                      stroke="#fff"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="8 12"
                    >
                      <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
                    </path>
                  )}
                  
                  {/* Status Panel Overlay */}
                  <rect x="740" y="275" width="250" height="86" rx="20" fill={isHigh ? "rgba(34,197,94,.13)" : "rgba(59,130,246,.10)"} stroke={isHigh ? "rgba(34,197,94,.42)" : "rgba(59,130,246,.35)"} />
                  <text x="865" y="308" textAnchor="middle" fill="#94a3b8" fontSize="16" fontWeight="800">GPIO INPUT RESULT</text>
                  <text x="865" y="340" textAnchor="middle" fill={isHigh ? "#22c55e" : "#3b82f6"} fontSize="28" fontWeight="900">
                    D2 = {analysis.readLabel}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        <div className="dsd-circuit-note-grid">
          <div className="overview-card">
            <div className="overview-card-head">
              <Info size={18} />
              <h4>Circuit Interpretation</h4>
            </div>
            <p>
              The button is <strong>{analysis.buttonLabel}</strong> and the input mode is{" "}
              <strong>{inputMode === "PULL_DOWN" ? "pull-down" : "pull-up"}</strong>.
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