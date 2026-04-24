import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap } from "lucide-react";

function lineColor(isSelected, value) {
  if (!isSelected) return "#dbe4f0";
  return value === 1 ? "#4ade80" : "#38bdf8";
}

function outColor(value) {
  return value === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDMultiplexerCircuits({ analysis }) {
  const { S1, S0, selectedIndex, output, inputs, expression } = analysis;

  const rows = [
    { label: "I0", value: inputs[0], y: 95, selected: selectedIndex === 0 },
    { label: "I1", value: inputs[1], y: 165, selected: selectedIndex === 1 },
    { label: "I2", value: inputs[2], y: 235, selected: selectedIndex === 2 },
    { label: "I3", value: inputs[3], y: 305, selected: selectedIndex === 3 }
  ];

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
              Clean symbolic view of the 4-to-1 multiplexer showing the selected signal path and output behavior.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">S1</span>
          <span className="sorting-stat-value">{S1}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">S0</span>
          <span className="sorting-stat-value">{S0}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Input</span>
          <span className="sorting-stat-value">I{selectedIndex}</span>
        </div>

        <div className="sorting-stat-box">
          <span
            className="sorting-stat-label"
            style={{ color: outColor(output) }}
          >
            Output
          </span>
          <span
            className="sorting-stat-value"
            style={{ color: outColor(output) }}
          >
            {output}
          </span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>4-to-1 Multiplexer Circuit</h3>

          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Live Circuit View
          </div>
        </div>

        <div className="dsd-circuit-canvas">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1100 430"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="muxGlowGreen">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="muxGlowBlue">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* MUX body */}
            <rect
              x="455"
              y="55"
              width="230"
              height="250"
              rx="16"
              fill="rgba(18,41,86,0.35)"
              stroke="#60a5fa"
              strokeWidth="3"
            />

            <text
              x="570"
              y="170"
              textAnchor="middle"
              fill="#60a5fa"
              fontSize="34"
              fontWeight="800"
            >
              4 : 1 MUX
            </text>

            {/* Input labels and boxes */}
            {rows.map((row) => {
              const selectedColor = lineColor(row.selected, row.value);
              const filterId =
                row.selected && row.value === 1
                  ? "url(#muxGlowGreen)"
                  : row.selected
                  ? "url(#muxGlowBlue)"
                  : undefined;

              const pinY =
                row.label === "I0"
                  ? 95
                  : row.label === "I1"
                  ? 155
                  : row.label === "I2"
                  ? 215
                  : 275;

              return (
                <g key={row.label}>
                  <text
                    x="90"
                    y={row.y + 8}
                    fill={row.selected ? selectedColor : "#e5e7eb"}
                    fontSize="24"
                    fontWeight="700"
                  >
                    {row.label} = {row.value}
                  </text>

                  <rect
                    x="165"
                    y={row.y - 16}
                    width="30"
                    height="30"
                    rx="8"
                    fill={row.value === 1 ? "#22c55e" : "#ef4444"}
                    stroke={row.selected ? selectedColor : "rgba(255,255,255,0.14)"}
                    strokeWidth="3"
                    filter={filterId}
                  />

                  <path
                    d={`M 195 ${row.y - 1} L 350 ${row.y - 1} L 350 ${pinY} L 455 ${pinY}`}
                    fill="none"
                    stroke={selectedColor}
                    strokeWidth={row.selected ? "5" : "4"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={filterId}
                  />

                  <circle cx="455" cy={pinY} r="5.5" fill={selectedColor} />
                </g>
              );
            })}

            {/* Internal labels */}
            <text x="475" y="102" fill="#dbe4f0" fontSize="17" fontWeight="700">I0</text>
            <text x="475" y="162" fill="#dbe4f0" fontSize="17" fontWeight="700">I1</text>
            <text x="475" y="222" fill="#dbe4f0" fontSize="17" fontWeight="700">I2</text>
            <text x="475" y="282" fill="#dbe4f0" fontSize="17" fontWeight="700">I3</text>

            {/* Output */}
            <path
              d="M 685 180 L 860 180"
              fill="none"
              stroke={outColor(output)}
              strokeWidth="5"
              strokeLinecap="round"
              filter={output === 1 ? "url(#muxGlowGreen)" : undefined}
            />
            <circle
              cx="865"
              cy="180"
              r="15"
              fill={outColor(output)}
              filter={output === 1 ? "url(#muxGlowGreen)" : undefined}
            />
            <text
              x="905"
              y="187"
              fill={outColor(output)}
              fontSize="28"
              fontWeight="800"
            >
              Y = {output}
            </text>

            {/* Select lines */}
            <path
              d="M 515 358 L 515 305"
              fill="none"
              stroke="#f472b6"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 605 358 L 605 305"
              fill="none"
              stroke="#f472b6"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <rect
              x="500"
              y="358"
              width="30"
              height="30"
              rx="8"
              fill="#f472b6"
              opacity={S1 ? 1 : 0.78}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
            />
            <rect
              x="590"
              y="358"
              width="30"
              height="30"
              rx="8"
              fill="#f472b6"
              opacity={S0 ? 1 : 0.78}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
            />

            <text x="500" y="285" fill="#f9a8d4" fontSize="18" fontWeight="800">S1</text>
            <text x="590" y="285" fill="#f9a8d4" fontSize="18" fontWeight="800">S0</text>

            <text x="490" y="415" fill="#f9a8d4" fontSize="18" fontWeight="800">
              S1 = {S1}
            </text>
            <text x="580" y="415" fill="#f9a8d4" fontSize="18" fontWeight="800">
              S0 = {S0}
            </text>

            {/* Expression box */}
            <rect
              x="760"
              y="245"
              width="270"
              height="90"
              rx="14"
              fill="rgba(15,23,42,0.40)"
              stroke="rgba(96,165,250,0.25)"
              strokeDasharray="6 6"
            />
            <text
              x="895"
              y="277"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="18"
              fontWeight="700"
            >
              Boolean Expression
            </text>
            <text
              x="895"
              y="308"
              textAnchor="middle"
              fill="#e5e7eb"
              fontSize="14"
              fontWeight="700"
            >
              {expression}
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
              With select lines{" "}
              <strong style={{ color: "#22c55e" }}>
                S1S0 = {S1}{S0}
              </strong>
              , the multiplexer activates the path from{" "}
              <strong style={{ color: "#38bdf8" }}>I{selectedIndex}</strong> to the output.
            </p>
            <p style={{ marginTop: 10 }}>
              Therefore,{" "}
              <strong style={{ color: outColor(output) }}>
                Y = I{selectedIndex} = {output}
              </strong>
              .
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Observation</h4>
            </div>
            <p>
              The output{" "}
              <strong style={{ color: outColor(output) }}>Y</strong> matches the selected input{" "}
              <strong style={{ color: "#38bdf8" }}>I{selectedIndex}</strong>.
            </p>
            <p style={{ marginTop: 10 }}>
              Multiplexers act as data selectors in digital systems.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CircuitBoard size={18} />
              <h4>Routing Rule</h4>
            </div>
            <p>
              00 selects I0, 01 selects I1, 10 selects I2, and 11 selects I3.
              Only the active path is emphasized in the symbolic circuit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}