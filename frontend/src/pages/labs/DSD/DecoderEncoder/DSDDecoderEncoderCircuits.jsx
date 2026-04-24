import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap } from "lucide-react";

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
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <CircuitBoard size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Circuits</h2>
            <p className="sorting-sim-subtitle">
              Clean symbolic circuit view showing input mapping, logic block, and final output.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Mode</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {mode === "decoder" ? "Decoder" : "Encoder"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Line</span>
          <span className="sorting-stat-value">
            {mode === "decoder"
              ? `Y${analysis.index}`
              : analysis.index === -1
              ? "--"
              : `I${analysis.index}`}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Binary</span>
          <span className="sorting-stat-value">
            {mode === "decoder" ? `${a}${b}` : binary}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">State</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            Active Route
          </span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>
            {mode === "decoder" ? "2-to-4 Decoder Circuit" : "4-to-2 Encoder Circuit"}
          </h3>

          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Symbolic Circuit View
          </div>
        </div>

        <div className="dsd-circuit-canvas" style={{ height: 480 }}>
          <svg width="100%" height="100%" viewBox="0 0 1120 480" preserveAspectRatio="xMidYMid meet">
            {mode === "decoder" && (
              <>
                <text x="90" y="160" fill={signalColor(a)} fontSize="28" fontWeight="800">
                  A = {a}
                </text>
                <text x="90" y="275" fill={signalColor(b)} fontSize="28" fontWeight="800">
                  B = {b}
                </text>

                <path d="M 190 150 L 440 150" fill="none" stroke={signalColor(a)} strokeWidth="5" strokeLinecap="round" />
                <path d="M 190 265 L 440 265" fill="none" stroke={signalColor(b)} strokeWidth="5" strokeLinecap="round" />

                <rect
                  x="440"
                  y="95"
                  width="240"
                  height="245"
                  rx="24"
                  fill="rgba(59,130,246,0.12)"
                  stroke="#60a5fa"
                  strokeWidth="3"
                />

                <text x="560" y="205" textAnchor="middle" fill="#e5e7eb" fontSize="36" fontWeight="800">
                  DECODER
                </text>
                <text x="560" y="245" textAnchor="middle" fill="#93c5fd" fontSize="20" fontWeight="700">
                  2 → 4
                </text>

                {[0, 1, 2, 3].map((i) => {
                  const active = analysis.index === i;
                  const y = 125 + i * 70;
                  return (
                    <g key={i}>
                      <path
                        d={`M 680 ${y} L 920 ${y}`}
                        fill="none"
                        stroke={active ? "#22c55e" : "#475569"}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={active ? "12 9" : "0"}
                      />
                      <circle cx="948" cy={y} r="15" fill={active ? "#22c55e" : "#1f2937"} />
                      <text
                        x="985"
                        y={y + 8}
                        fill={active ? "#22c55e" : "#94a3b8"}
                        fontSize="25"
                        fontWeight="800"
                      >
                        Y{i} = {active ? 1 : 0}
                      </text>
                    </g>
                  );
                })}

                <rect
                  x="445"
                  y="375"
                  width="245"
                  height="48"
                  rx="16"
                  fill="rgba(15,23,42,0.75)"
                  stroke="rgba(250,204,21,0.28)"
                />
                <text x="568" y="407" textAnchor="middle" fill="#fbbf24" fontSize="20" fontWeight="800">
                  AB = {a}{b} → Y{analysis.index}
                </text>
              </>
            )}

            {mode === "encoder" && (
              <>
                {inputs.map((v, i) => {
                  const y = 105 + i * 75;
                  const active = v === 1;

                  return (
                    <g key={i}>
                      <text x="90" y={y + 8} fill={signalColor(v)} fontSize="28" fontWeight="800">
                        I{i} = {v}
                      </text>
                      <path
                        d={`M 200 ${y} L 440 ${y}`}
                        fill="none"
                        stroke={active ? "#22c55e" : "#ef4444"}
                        strokeWidth={active ? "6" : "5"}
                        strokeLinecap="round"
                        strokeDasharray={active ? "12 9" : "0"}
                      />
                    </g>
                  );
                })}

                <rect
                  x="440"
                  y="130"
                  width="240"
                  height="215"
                  rx="24"
                  fill="rgba(59,130,246,0.12)"
                  stroke="#60a5fa"
                  strokeWidth="3"
                />

                <text x="560" y="222" textAnchor="middle" fill="#e5e7eb" fontSize="36" fontWeight="800">
                  ENCODER
                </text>
                <text x="560" y="262" textAnchor="middle" fill="#93c5fd" fontSize="20" fontWeight="700">
                  4 → 2
                </text>

                <path
                  d="M 680 185 L 920 185"
                  fill="none"
                  stroke={binary[0] === "1" ? "#22c55e" : "#475569"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={binary[0] === "1" ? "12 9" : "0"}
                />
                <path
                  d="M 680 285 L 920 285"
                  fill="none"
                  stroke={binary[1] === "1" ? "#22c55e" : "#475569"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={binary[1] === "1" ? "12 9" : "0"}
                />

                <circle cx="948" cy="185" r="15" fill={binary[0] === "1" ? "#22c55e" : "#1f2937"} />
                <circle cx="948" cy="285" r="15" fill={binary[1] === "1" ? "#22c55e" : "#1f2937"} />

                <text x="985" y="193" fill={binary[0] === "1" ? "#22c55e" : "#94a3b8"} fontSize="25" fontWeight="800">
                  Y1 = {binary[0]}
                </text>
                <text x="985" y="293" fill={binary[1] === "1" ? "#22c55e" : "#94a3b8"} fontSize="25" fontWeight="800">
                  Y0 = {binary[1]}
                </text>

                <rect
                  x="440"
                  y="390"
                  width="245"
                  height="48"
                  rx="16"
                  fill="rgba(15,23,42,0.75)"
                  stroke="rgba(250,204,21,0.28)"
                />
                <text x="562" y="422" textAnchor="middle" fill="#fbbf24" fontSize="20" fontWeight="800">
                  {analysis.index === -1 ? "No active input" : `I${analysis.index} → ${binary}`}
                </text>
              </>
            )}
          </svg>
        </div>

        <div className="dsd-circuit-note-grid">
          <div className="overview-card">
            <div className="overview-card-head">
              <Info size={18} />
              <h4>Circuit Interpretation</h4>
            </div>
            <p>
              {mode === "decoder"
                ? `The binary input ${a}${b} is decoded into one active output line Y${analysis.index}.`
                : analysis.index === -1
                ? "A standard encoder expects one valid active input line."
                : `The active input line I${analysis.index} is converted into binary output ${binary}.`}
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