import React from "react";

function signalColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

function labelStyle(v) {
  return {
    fill: signalColor(v),
    fontSize: "21",
    fontWeight: "bold"
  };
}

function lineStyle(v, width = 4) {
  return {
    stroke: signalColor(v),
    strokeWidth: width
  };
}

export default function DSDFlipFlopsCircuits({
  selectedType,
  q,
  analysis,
  s,
  r,
  d,
  j,
  k,
  t,
  clk
}) {
  const titleMap = {
    sr: "SR Latch",
    d: "D Flip-Flop",
    jk: "JK Flip-Flop",
    t: "T Flip-Flop"
  };

  const qBar = analysis.nextQ === 1 ? 0 : 1;

  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This section shows a symbolic circuit-level view of the selected sequential element and highlights the current signal values.
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
          <strong>Type</strong>
          <div>{titleMap[selectedType]}</div>
        </div>

        <div className="stat-card">
          <strong>Current Q</strong>
          <div style={{ color: signalColor(q), fontWeight: "bold", fontSize: "1.2rem" }}>
            {q}
          </div>
        </div>

        <div className="stat-card">
          <strong>Next Q</strong>
          <div
            style={{
              color: signalColor(analysis.nextQ),
              fontWeight: "bold",
              fontSize: "1.2rem"
            }}
          >
            {analysis.nextQ}
          </div>
        </div>

        <div className="stat-card">
          <strong>State</strong>
          <div>{analysis.stateName}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>{titleMap[selectedType]} Circuit View</h3>

        <div
          style={{
            position: "relative",
            height: "420px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #09101d, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 820 420" preserveAspectRatio="xMidYMid meet">
            {/* Main block */}
            <rect
              x="300"
              y="75"
              width="220"
              height="250"
              rx="22"
              fill="rgba(59,130,246,0.12)"
              stroke="#60a5fa"
              strokeWidth="3"
            />

            {/* decorative inner area */}
            <rect
              x="325"
              y="105"
              width="170"
              height="190"
              rx="16"
              fill="rgba(15,23,42,0.6)"
              stroke="rgba(96,165,250,0.25)"
              strokeWidth="2"
            />

            {/* CLK triangle for clocked FFs */}
            {selectedType !== "sr" && (
              <path
                d="M300 250 L322 238 L322 262 Z"
                fill="#f9a8d4"
                stroke="#f472b6"
                strokeWidth="2"
              />
            )}

            {/* INPUTS */}
            {selectedType === "sr" && (
              <>
                <line x1="90" y1="145" x2="300" y2="145" {...lineStyle(s)} />
                <line x1="90" y1="255" x2="300" y2="255" {...lineStyle(r)} />

                <text x="28" y="150" style={labelStyle(s)}>S = {s}</text>
                <text x="28" y="260" style={labelStyle(r)}>R = {r}</text>

                <text x="410" y="215" textAnchor="middle" fill="#e5e7eb" fontSize="30" fontWeight="bold">
                  SR
                </text>

                <text x="410" y="250" textAnchor="middle" fill="#93c5fd" fontSize="18" fontWeight="bold">
                  Latch
                </text>
              </>
            )}

            {selectedType === "d" && (
              <>
                <line x1="90" y1="145" x2="300" y2="145" {...lineStyle(d)} />
                <line x1="90" y1="250" x2="300" y2="250" {...lineStyle(clk)} />

                <text x="28" y="150" style={labelStyle(d)}>D = {d}</text>
                <text x="12" y="255" style={labelStyle(clk)}>CLK = {clk}</text>

                <text x="410" y="205" textAnchor="middle" fill="#e5e7eb" fontSize="30" fontWeight="bold">
                  D
                </text>

                <text x="410" y="240" textAnchor="middle" fill="#93c5fd" fontSize="18" fontWeight="bold">
                  Flip-Flop
                </text>
              </>
            )}

            {selectedType === "jk" && (
              <>
                <line x1="90" y1="125" x2="300" y2="125" {...lineStyle(j)} />
                <line x1="90" y1="205" x2="300" y2="205" {...lineStyle(k)} />
                <line x1="90" y1="285" x2="300" y2="285" {...lineStyle(clk)} />

                <text x="28" y="130" style={labelStyle(j)}>J = {j}</text>
                <text x="28" y="210" style={labelStyle(k)}>K = {k}</text>
                <text x="12" y="290" style={labelStyle(clk)}>CLK = {clk}</text>

                <text x="410" y="205" textAnchor="middle" fill="#e5e7eb" fontSize="30" fontWeight="bold">
                  JK
                </text>

                <text x="410" y="240" textAnchor="middle" fill="#93c5fd" fontSize="18" fontWeight="bold">
                  Flip-Flop
                </text>
              </>
            )}

            {selectedType === "t" && (
              <>
                <line x1="90" y1="145" x2="300" y2="145" {...lineStyle(t)} />
                <line x1="90" y1="250" x2="300" y2="250" {...lineStyle(clk)} />

                <text x="28" y="150" style={labelStyle(t)}>T = {t}</text>
                <text x="12" y="255" style={labelStyle(clk)}>CLK = {clk}</text>

                <text x="410" y="205" textAnchor="middle" fill="#e5e7eb" fontSize="30" fontWeight="bold">
                  T
                </text>

                <text x="410" y="240" textAnchor="middle" fill="#93c5fd" fontSize="18" fontWeight="bold">
                  Flip-Flop
                </text>
              </>
            )}

            {/* OUTPUTS */}
            <line x1="520" y1="155" x2="700" y2="155" {...lineStyle(analysis.nextQ, 5)} />
            <line x1="520" y1="255" x2="700" y2="255" {...lineStyle(qBar, 5)} />

            <text x="715" y="160" style={labelStyle(analysis.nextQ)}>
              Q = {analysis.nextQ}
            </text>

            <text x="715" y="260" style={labelStyle(qBar)}>
              Q̅ = {qBar}
            </text>

            {/* feedback hint */}
            <path
              d="M700 255 Q760 255 760 330 Q760 380 520 380"
              fill="none"
              stroke="rgba(34,197,94,0.25)"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            <text x="610" y="402" fill="#86efac" fontSize="16" fontWeight="bold">
              Feedback / Stored State Path
            </text>

            {/* internal state indicator */}
            <circle
              cx="470"
              cy="115"
              r="12"
              fill={analysis.nextQ === 1 ? "#22c55e" : "#ef4444"}
              stroke="#f8fafc"
              strokeWidth="2"
            />
            <text x="490" y="120" fill="#e5e7eb" fontSize="16" fontWeight="bold">
              Stable State
            </text>
          </svg>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="card">
          <h3>State Meaning</h3>
          <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
            <strong>{analysis.stateName}</strong> means the selected element is currently performing that operation for the given input combination.
          </p>
        </div>

        <div className="card">
          <h3>Output Observation</h3>
          <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
            The stored state after update is <strong>Q = {analysis.nextQ}</strong> and the complementary output is <strong>Q̅ = {qBar}</strong>.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Circuit Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The selected element is <strong>{titleMap[selectedType]}</strong>. The colored input lines show the current input values, and the output lines show the resulting stored state.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          Based on the present inputs, the next state becomes <strong>{analysis.nextQ}</strong>.
        </p>
      </div>
    </section>
  );
}