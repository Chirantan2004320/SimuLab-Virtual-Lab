import React from "react";

function isInvertedGate(gate) {
  return ["NOT", "NAND", "NOR", "XNOR"].includes(gate);
}

function isSingleInputGate(gate) {
  return ["BUFFER", "NOT"].includes(gate);
}

function extraLeftCurveGate(gate) {
  return ["OR", "NOR", "XOR", "XNOR"].includes(gate);
}

function extraXorCurve(gate) {
  return ["XOR", "XNOR"].includes(gate);
}

export default function DSDLogicGatesCircuits({ selectedGate, analysis }) {
  const inverted = isInvertedGate(selectedGate);
  const singleInput = isSingleInputGate(selectedGate);
  const curvedGate = extraLeftCurveGate(selectedGate);
  const xorGate = extraXorCurve(selectedGate);

  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This section shows a symbolic digital circuit view of the selected gate using the current input values.
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
          <strong>Selected Gate</strong>
          <div>{selectedGate}</div>
        </div>

        <div className="stat-card">
          <strong>Input A</strong>
          <div>{analysis.A}</div>
        </div>

        {!singleInput && (
          <div className="stat-card">
            <strong>Input B</strong>
            <div>{analysis.B}</div>
          </div>
        )}

        <div className="stat-card">
          <strong>Output Y</strong>
          <div style={{ color: analysis.selected.output === 1 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
            {analysis.selected.output}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Gate Circuit View</h3>

        <div
          style={{
            position: "relative",
            height: "360px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 360" preserveAspectRatio="xMidYMid meet">
            {singleInput ? (
              <>
                <line x1="80" y1="180" x2="280" y2="180" stroke="#c084fc" strokeWidth="4" />

                <path
                  d="M280 110 L280 250 L430 180 Z"
                  fill="rgba(59,130,246,0.12)"
                  stroke="#60a5fa"
                  strokeWidth="3"
                />

                {inverted && (
                  <circle
                    cx="442"
                    cy="180"
                    r="10"
                    fill="#0b1220"
                    stroke="#f8fafc"
                    strokeWidth="3"
                  />
                )}

                <line
                  x1={inverted ? "452" : "430"}
                  y1="180"
                  x2="650"
                  y2="180"
                  stroke="#fbbf24"
                  strokeWidth="4"
                />

                <text x="25" y="185" fill="#d8b4fe" fontSize="22" fontWeight="bold">
                  A = {analysis.A}
                </text>
              </>
            ) : (
              <>
                <line x1="80" y1="120" x2="250" y2="120" stroke="#c084fc" strokeWidth="4" />
                <line x1="80" y1="240" x2="250" y2="240" stroke="#c084fc" strokeWidth="4" />

                {xorGate && (
                  <path
                    d="M235 80 Q200 180 235 280"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="3"
                  />
                )}

                {curvedGate ? (
                  <>
                    <path
                      d="M250 80 Q340 80 430 180 Q340 280 250 280 Q285 180 250 80"
                      fill="rgba(59,130,246,0.12)"
                      stroke="#60a5fa"
                      strokeWidth="3"
                    />
                    <path
                      d="M250 80 Q290 180 250 280"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="3"
                    />
                  </>
                ) : (
                  <path
                    d="M250 80 L330 80 Q455 180 330 280 L250 280 Z"
                    fill="rgba(59,130,246,0.12)"
                    stroke="#60a5fa"
                    strokeWidth="3"
                  />
                )}

                {inverted && (
                  <circle
                    cx="446"
                    cy="180"
                    r="10"
                    fill="#0b1220"
                    stroke="#f8fafc"
                    strokeWidth="3"
                  />
                )}

                <line
                  x1={inverted ? "456" : "440"}
                  y1="180"
                  x2="650"
                  y2="180"
                  stroke="#fbbf24"
                  strokeWidth="4"
                />

                <text x="25" y="125" fill="#d8b4fe" fontSize="22" fontWeight="bold">
                  A = {analysis.A}
                </text>
                <text x="25" y="245" fill="#d8b4fe" fontSize="22" fontWeight="bold">
                  B = {analysis.B}
                </text>
              </>
            )}

            <text
              x="675"
              y="185"
              fill="#fcd34d"
              fontSize="22"
              fontWeight="bold"
            >
              Y = {analysis.selected.output}
            </text>

            <text
              x="350"
              y="322"
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="22"
              fontWeight="bold"
            >
              {selectedGate}
            </text>

            <text
              x="350"
              y="185"
              textAnchor="middle"
              fill="#e5e7eb"
              fontSize="22"
              fontWeight="bold"
            >
              {analysis.selected.expression}
            </text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Circuit Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For the current input{singleInput ? "" : "s"}{" "}
          <strong>A = {analysis.A}</strong>
          {!singleInput ? ` and B = ${analysis.B}` : ""}, the <strong>{selectedGate}</strong> gate produces{" "}
          <strong>{analysis.selected.output}</strong>.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          Gates like <strong>NOT</strong>, <strong>NAND</strong>, <strong>NOR</strong>, and <strong>XNOR</strong> include
          inversion at the output, represented by the small bubble in the symbol.
        </p>
      </div>
    </section>
  );
}