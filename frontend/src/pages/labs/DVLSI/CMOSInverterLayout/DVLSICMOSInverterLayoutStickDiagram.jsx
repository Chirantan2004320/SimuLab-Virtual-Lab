import React from "react";

export default function DVLSICMOSInverterLayoutStickDiagram({
  polyWidth,
  metalWidth,
  contactSize,
  spacing,
  lambdaValue
}) {
  const scale = 10 * lambdaValue;

  return (
    <section className="card experiment">
      <h2>Stick Diagram</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        A stick diagram is an abstract layout representation. It shows the relative placement
        and connectivity of layers without exact manufacturing detail.
      </div>

      <div className="card" style={{ background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>CMOS Inverter Stick Diagram</h3>

        <div
          style={{
            position: "relative",
            height: "420px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 420" preserveAspectRatio="xMidYMid meet">
            {/* Rails */}
            <line x1="120" y1="70" x2="640" y2="70" stroke="#60a5fa" strokeWidth={metalWidth} />
            <line x1="120" y1="350" x2="640" y2="350" stroke="#f87171" strokeWidth={metalWidth} />

            {/* Diffusion regions */}
            <line x1="250" y1="150" x2="500" y2="150" stroke="#22c55e" strokeWidth={18} />
            <line x1="250" y1="270" x2="500" y2="270" stroke="#22c55e" strokeWidth={18} />

            {/* Poly gate */}
            <line
              x1="375"
              y1="110"
              x2="375"
              y2="310"
              stroke="#ef4444"
              strokeWidth={polyWidth * scale * 0.15}
            />

            {/* Output connection */}
            <line x1="500" y1="150" x2="560" y2="150" stroke="#60a5fa" strokeWidth={metalWidth} />
            <line x1="500" y1="270" x2="560" y2="270" stroke="#60a5fa" strokeWidth={metalWidth} />
            <line x1="560" y1="150" x2="560" y2="270" stroke="#60a5fa" strokeWidth={metalWidth} />
            <line x1="560" y1="210" x2="650" y2="210" stroke="#60a5fa" strokeWidth={metalWidth} />

            {/* Contacts */}
            <rect x="310" y="56" width={contactSize * 7} height={contactSize * 7} fill="#ffffff" />
            <rect x="310" y="336" width={contactSize * 7} height={contactSize * 7} fill="#ffffff" />
            <rect x="493" y="143" width={contactSize * 7} height={contactSize * 7} fill="#ffffff" />
            <rect x="493" y="263" width={contactSize * 7} height={contactSize * 7} fill="#ffffff" />

            {/* Labels */}
            <text x="655" y="214" fill="#93c5fd" fontSize="18" fontWeight="bold">OUT</text>
            <text x="385" y="104" fill="#fecaca" fontSize="18" fontWeight="bold">IN</text>
            <text x="650" y="75" fill="#93c5fd" fontSize="18" fontWeight="bold">VDD</text>
            <text x="650" y="355" fill="#fca5a5" fontSize="18" fontWeight="bold">GND</text>
            <text x="185" y="145" fill="#86efac" fontSize="16" fontWeight="bold">pMOS Diffusion</text>
            <text x="185" y="285" fill="#86efac" fontSize="16" fontWeight="bold">nMOS Diffusion</text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Stick Diagram Insight</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The single vertical poly line forms the input gate for both pMOS and nMOS.
          The metal output node connects the drain regions of both transistors.
        </p>
      </div>
    </section>
  );
}