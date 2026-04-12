import React from "react";

export default function DSDMultiplexerCircuits({ analysis }) {
  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The circuit below shows a symbolic 4-to-1 multiplexer. The selected input is routed to the output based on S1 and S0.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "1rem"
        }}
      >
        <div className="stat-card">
          <strong>S1</strong>
          <div>{analysis.S1}</div>
        </div>

        <div className="stat-card">
          <strong>S0</strong>
          <div>{analysis.S0}</div>
        </div>

        <div className="stat-card">
          <strong>Selected Input</strong>
          <div>I{analysis.selectedIndex}</div>
        </div>

        <div className="stat-card">
          <strong>Output</strong>
          <div style={{ color: analysis.output === 1 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
            {analysis.output}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>4-to-1 Multiplexer Symbol</h3>

        <div
          style={{
            position: "relative",
            height: "400px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid meet">
            {/* Input lines */}
            {[0, 1, 2, 3].map((idx) => {
              const y = 70 + idx * 70;
              const isSelected = analysis.selectedIndex === idx;
              return (
                <g key={idx}>
                  <line
                    x1="60"
                    y1={y}
                    x2="260"
                    y2={y}
                    stroke={isSelected ? "#22c55e" : "#c084fc"}
                    strokeWidth={isSelected ? "5" : "4"}
                  />
                  <text
                    x="15"
                    y={y + 5}
                    fill={isSelected ? "#86efac" : "#d8b4fe"}
                    fontSize="22"
                    fontWeight="bold"
                  >
                    I{idx} = {analysis.inputs[idx]}
                  </text>
                </g>
              );
            })}

            {/* MUX body */}
            <path
              d="M260 40 L480 90 L480 310 L260 360 Z"
              fill="rgba(59,130,246,0.14)"
              stroke="#60a5fa"
              strokeWidth="3"
            />

            {/* Output line */}
            <line
              x1="480"
              y1="200"
              x2="660"
              y2="200"
              stroke="#fbbf24"
              strokeWidth="4"
            />

            {/* Select lines */}
            <line x1="300" y1="390" x2="300" y2="315" stroke="#f472b6" strokeWidth="4" />
            <line x1="380" y1="390" x2="380" y2="335" stroke="#f472b6" strokeWidth="4" />

            {/* Labels */}
            <text x="670" y="205" fill="#fcd34d" fontSize="22" fontWeight="bold">
              Y = {analysis.output}
            </text>

            <text x="310" y="392" fill="#f9a8d4" fontSize="20" fontWeight="bold">
              S1 = {analysis.S1}
            </text>
            <text x="390" y="392" fill="#f9a8d4" fontSize="20" fontWeight="bold">
              S0 = {analysis.S0}
            </text>

            <text
              x="360"
              y="210"
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="28"
              fontWeight="bold"
            >
              4:1 MUX
            </text>

            <text
              x="360"
              y="245"
              textAnchor="middle"
              fill="#e5e7eb"
              fontSize="20"
              fontWeight="bold"
            >
              Selected: I{analysis.selectedIndex}
            </text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Circuit Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The select lines <strong>S1S0 = {analysis.S1}{analysis.S0}</strong> choose input
          <strong> I{analysis.selectedIndex}</strong>, so the output becomes
          <strong> {analysis.output}</strong>.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          Multiplexers are data selectors, allowing one of many inputs to be routed to a single output.
        </p>
      </div>
    </section>
  );
}