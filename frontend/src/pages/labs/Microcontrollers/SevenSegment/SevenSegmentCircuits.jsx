import React from "react";
import { CircuitBoard, Cpu, Info, CheckCircle2, Zap } from "lucide-react";

export default function SevenSegmentCircuits({ analysis }) {
  const active = (seg) => analysis.pattern[seg] === 1;

  return (
    <section className="sorting-sim-card">
      
      {/* HEADER */}
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <CircuitBoard size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Circuit Visualization</h2>
            <p className="sorting-sim-subtitle">
              Realistic GPIO wiring from Arduino to 7-segment display
            </p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current Digit</span>
          <span className="sorting-stat-value" style={{ color: "#38bdf8", fontSize: "1.2rem" }}>
            {analysis.digit}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Active Segments</span>
          <span className="sorting-stat-value" style={{ color: "#22c55e", fontSize: "1rem" }}>
            {Object.keys(analysis.pattern).filter(k => analysis.pattern[k] === 1).map(k => k.toUpperCase()).join(', ') || 'NONE'}
          </span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">GPIO Pins Active</span>
          <span className="sorting-stat-value">
             {Object.keys(analysis.pattern).filter(k => analysis.pattern[k] === 1).length}
          </span>
        </div>
      </div>

      {/* PANEL */}
      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Realistic Wiring Diagram</h3>
          <div className="dsd-circuit-badge">
            <Zap size={16} /> Digit {analysis.digit}
          </div>
        </div>

        {/* SVG CANVAS */}
        <div className="dsd-circuit-canvas" style={{ minHeight: 560 }}>
          <svg viewBox="0 0 1150 560" width="100%" height="100%">

            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* ================= ARDUINO UNO ================= */}
            <g transform="translate(40, 80)">
              {/* PCB Base */}
              <path 
                d="M 0 10 L 20 0 L 240 0 A 10 10 0 0 1 250 10 L 250 340 A 10 10 0 0 1 240 350 L 20 350 L 0 340 Z" 
                fill="#006b75" stroke="#004d54" strokeWidth="3" 
              />
              
              {/* Mounting Holes */}
              <circle cx="15" cy="15" r="4" fill="#020617" />
              <circle cx="235" cy="15" r="4" fill="#020617" />
              <circle cx="15" cy="335" r="4" fill="#020617" />
              <circle cx="235" cy="335" r="4" fill="#020617" />

              {/* USB Port */}
              <rect x="-10" y="20" width="45" height="40" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
              <line x1="12" y1="30" x2="12" y2="50" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Power Jack */}
              <rect x="-10" y="270" width="35" height="45" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
              <rect x="25" y="285" width="4" height="15" fill="#94a3b8" />
              
              {/* Reset Button */}
              <rect x="200" y="10" width="16" height="16" rx="2" fill="#94a3b8" />
              <circle cx="208" cy="18" r="4" fill="#ef4444" />

              {/* Crystal Oscillator */}
              <rect x="160" y="110" width="30" height="12" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
              <text x="175" y="119" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">16MHz</text>

              {/* TX/RX LEDs */}
              <rect x="140" y="70" width="6" height="8" rx="1" fill="#1e293b" stroke="#eab308" />
              <text x="155" y="77" fill="#f8fafc" fontSize="8" fontWeight="bold">TX</text>
              <rect x="140" y="85" width="6" height="8" rx="1" fill="#1e293b" stroke="#eab308" />
              <text x="155" y="92" fill="#f8fafc" fontSize="8" fontWeight="bold">RX</text>

              {/* Headers */}
              {/* Left Top (Power) */}
              <rect x="25" y="110" width="15" height="65" fill="#0f172a" rx="1" />
              {/* Left Bottom (Analog) */}
              <rect x="25" y="185" width="15" height="65" fill="#0f172a" rx="1" />
              {/* Right Header (Digital Pins) */}
              <rect x="220" y="30" width="15" height="300" fill="#0f172a" rx="1" />

              {/* Main MCU (ATmega328P) */}
              <rect x="90" y="160" width="45" height="130" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
              <text x="112" y="225" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold" transform="rotate(-90 112 225)">ATMEGA328P</text>
              {Array.from({length: 14}).map((_, i) => (
                <g key={`mcu-pin-${i}`}>
                  <line x1="85" y1={170 + i * 8} x2="90" y2={170 + i * 8} stroke="#94a3b8" strokeWidth="2" />
                  <line x1="135" y1={170 + i * 8} x2="140" y2={170 + i * 8} stroke="#94a3b8" strokeWidth="2" />
                </g>
              ))}

              {/* Brand Name */}
              <text x="110" y="315" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold">ARDUINO UNO</text>

              {/* Labels for used digital pins */}
              {["D2","D3","D4","D5","D6","D7","D8"].map((lbl, i) => (
                <text key={lbl} x="200" y={64 + i * 40} fill="#f8fafc" fontSize="11" fontWeight="bold">
                  {lbl}
                </text>
              ))}
              
              {/* Connecting sockets for wires */}
              {["a","b","c","d","e","f","g"].map((seg, i) => (
                <rect key={seg} x="222" y={55 + i * 40} width="10" height="10" fill="#020617" stroke="#334155" strokeWidth="1" rx="2" />
              ))}
            </g>

            {/* ================= WIRES + RESISTORS ================= */}
            {["a","b","c","d","e","f","g"].map((seg, i) => {
              const y = 140 + i * 40;
              const isOn = active(seg);

              return (
                <g key={`wire-${seg}`}>
                  {/* Wire */}
                  <path
                    d={`M 267 ${y} L 675 ${y}`}
                    stroke={isOn ? "#22c55e" : "#475569"}
                    strokeWidth="4"
                    fill="none"
                    filter={isOn ? "url(#glow)" : ""}
                    style={{ transition: "stroke 0.2s ease-in-out" }}
                  />

                  {/* Resistor */}
                  <g transform={`translate(445, ${y})`}>
                    <rect x="0" y="-10" width="52" height="20" fill="#020617" />
                    <rect x="6" y="-6" width="40" height="12" rx="3" fill="#fcd34d" stroke="#b45309" strokeWidth="1" />
                    <rect x="12" y="-6" width="4" height="12" fill="#dc2626" />
                    <rect x="20" y="-6" width="4" height="12" fill="#dc2626" />
                    <rect x="28" y="-6" width="4" height="12" fill="#78350f" />
                    <rect x="36" y="-6" width="4" height="12" fill="#fbbf24" />
                    <text x="26" y="-14" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">220Ω</text>
                  </g>
                </g>
              );
            })}

            {/* ================= 7-SEGMENT DISPLAY MODULE ================= */}
            <g transform="translate(660, 80)">
              {/* PCB Breakout Board */}
              <rect x="0" y="0" width="380" height="360" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="4" />
              
              {/* Component Label */}
              <text x="190" y="25" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="bold">7-SEGMENT DISPLAY MODULE</text>
              
              {/* Pin Labels & Sockets */}
              {["A","B","C","D","E","F","G"].map((lbl, i) => (
                <g key={lbl}>
                  <text x="35" y={64 + i * 40} fill="#94a3b8" fontSize="12" fontWeight="bold">{lbl}</text>
                  <rect x="10" y={55 + i * 40} width="10" height="10" fill="#020617" stroke="#334155" strokeWidth="1" rx="2" />
                  <circle cx="15" cy={60 + i * 40} r="2" fill="#94a3b8" />
                </g>
              ))}

              {/* Display Screen Resin */}
              <rect x="100" y="40" width="220" height="280" rx="8" fill="#020617" stroke="#1e293b" strokeWidth="2" />
              
              {/* The Segments */}
              <g style={{ transform: "skewX(-6deg)", transformOrigin: "210px 180px" }}>
                {[
                  ["a", 160, 60,  100, 18],
                  ["b", 264, 82,  18, 90],
                  ["c", 264, 198, 18, 90],
                  ["d", 160, 292, 100, 18],
                  ["e", 138, 198, 18, 90],
                  ["f", 138, 82,  18, 90],
                  ["g", 160, 176, 100, 18]
                ].map(([seg, x, y, w, h]) => {
                  const isOn = active(seg);
                  return (
                    <rect
                      key={`segment-${seg}`}
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      rx="9"
                      fill={isOn ? "#ef4444" : "#1e1010"}
                      stroke={isOn ? "#fca5a5" : "#3f1515"}
                      strokeWidth="1"
                      filter={isOn ? "url(#glow)" : ""}
                      style={{ transition: "all 0.15s ease-in-out" }}
                    />
                  );
                })}
              </g>
            </g>

          </svg>
        </div>

        {/* INFO CARDS */}
        <div className="dsd-circuit-note-grid">
          <div className="overview-card">
            <div className="overview-card-head">
              <Info size={18}/>
              <h4>Hardware Setup</h4>
            </div>
            <p>Each segment is driven via a current-limiting resistor from Arduino GPIO pins.</p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Cpu size={18}/>
              <h4>Pin Mapping</h4>
            </div>
            <p><strong>D2–D8</strong> are accurately mapped to Segments <strong>A–G</strong> respectively.</p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18}/>
              <h4>Observation</h4>
            </div>
            <p>{analysis.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}