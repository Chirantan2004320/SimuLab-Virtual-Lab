import React from "react";

function signalColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDDecoderEncoderCircuits({
  mode,
  a,
  b,
  inputs,
  analysis
}) {
  const binary =
    analysis.index >= 0
      ? analysis.index.toString(2).padStart(2, "0")
      : "--";

  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        {mode === "decoder"
          ? "2-to-4 Decoder Circuit Visualization"
          : "4-to-2 Encoder Circuit Visualization"}
      </div>

      <div
        className="card"
        style={{
          marginTop: "1rem",
          background: "#0f172a",
          padding: "20px"
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>
          {mode === "decoder" ? "Decoder Flow" : "Encoder Flow"}
        </h3>

        <div
          style={{
            position: "relative",
            height: "360px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #09101d, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 820 360">
            {mode === "encoder" && (
              <>
                {inputs.map((v, i) => (
                  <g key={i}>
                    <line
                      x1="80"
                      y1={60 + i * 60}
                      x2="300"
                      y2="180"
                      style={{
                        stroke: signalColor(v),
                        strokeWidth: 4,
                        strokeDasharray: v ? "10 10" : "0",
                        animation: v ? "flow 1s linear infinite" : "none"
                      }}
                    />
                    <text
                      x="20"
                      y={65 + i * 60}
                      fill={signalColor(v)}
                      fontSize="20"
                      fontWeight="bold"
                    >
                      I{i} = {v}
                    </text>
                  </g>
                ))}

                <rect
                  x="300"
                  y="100"
                  width="180"
                  height="160"
                  rx="18"
                  fill="rgba(59,130,246,0.14)"
                  stroke="#60a5fa"
                  strokeWidth="3"
                />

                <text
                  x="390"
                  y="160"
                  textAnchor="middle"
                  fill="#e5e7eb"
                  fontSize="26"
                  fontWeight="bold"
                >
                  ENCODER
                </text>

                <line
                  x1="480"
                  y1="140"
                  x2="700"
                  y2="140"
                  style={{
                    stroke: "#22c55e",
                    strokeWidth: 5,
                    strokeDasharray: "10 10",
                    animation: "flow 1s linear infinite"
                  }}
                />
                <line
                  x1="480"
                  y1="220"
                  x2="700"
                  y2="220"
                  style={{
                    stroke: "#22c55e",
                    strokeWidth: 5,
                    strokeDasharray: "10 10",
                    animation: "flow 1s linear infinite"
                  }}
                />

                <text
                  x="720"
                  y="145"
                  className="glow-green"
                  fill="#22c55e"
                  fontSize="20"
                  fontWeight="bold"
                >
                  Y1 = {binary[0]}
                </text>

                <text
                  x="720"
                  y="225"
                  className="glow-green"
                  fill="#22c55e"
                  fontSize="20"
                  fontWeight="bold"
                >
                  Y0 = {binary[1]}
                </text>

                {analysis.index >= 0 && (
                  <text
                    x="390"
                    y="300"
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    Active Input → I{analysis.index}
                  </text>
                )}
              </>
            )}

            {mode === "decoder" && (
              <>
                <line
                  x1="80"
                  y1="130"
                  x2="300"
                  y2="130"
                  style={{
                    stroke: signalColor(a),
                    strokeWidth: 4,
                    strokeDasharray: a ? "10 10" : "0",
                    animation: a ? "flow 1s linear infinite" : "none"
                  }}
                />
                <line
                  x1="80"
                  y1="220"
                  x2="300"
                  y2="220"
                  style={{
                    stroke: signalColor(b),
                    strokeWidth: 4,
                    strokeDasharray: b ? "10 10" : "0",
                    animation: b ? "flow 1s linear infinite" : "none"
                  }}
                />

                <text x="20" y="135" fill={signalColor(a)} fontSize="20" fontWeight="bold">
                  A = {a}
                </text>
                <text x="20" y="225" fill={signalColor(b)} fontSize="20" fontWeight="bold">
                  B = {b}
                </text>

                <rect
                  x="300"
                  y="80"
                  width="180"
                  height="200"
                  rx="18"
                  fill="rgba(59,130,246,0.14)"
                  stroke="#60a5fa"
                  strokeWidth="3"
                />

                <text
                  x="390"
                  y="170"
                  textAnchor="middle"
                  fill="#e5e7eb"
                  fontSize="26"
                  fontWeight="bold"
                >
                  DECODER
                </text>

                {[0, 1, 2, 3].map((i) => {
                  const active = analysis.index === i;
                  return (
                    <g key={i}>
                      <line
                        x1="480"
                        y1={80 + i * 50}
                        x2="700"
                        y2={80 + i * 50}
                        style={{
                          stroke: active ? "#22c55e" : "#374151",
                          strokeWidth: 5,
                          strokeDasharray: active ? "10 10" : "0",
                          animation: active ? "flow 1s linear infinite" : "none"
                        }}
                      />
                      <text
                        x="720"
                        y={85 + i * 50}
                        fill={active ? "#22c55e" : "#9ca3af"}
                        fontSize="18"
                        fontWeight={active ? "bold" : "normal"}
                      >
                        Y{i}
                      </text>
                    </g>
                  );
                })}

                <text
                  x="390"
                  y="310"
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="18"
                  fontWeight="bold"
                >
                  Active Output → Y{analysis.index}
                </text>
              </>
            )}
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          {mode === "encoder"
            ? `The encoder converts active input I${analysis.index} into binary output ${binary}.`
            : `The decoder activates output Y${analysis.index} based on inputs A=${a}, B=${b}.`}
        </p>
      </div>
    </section>
  );
}