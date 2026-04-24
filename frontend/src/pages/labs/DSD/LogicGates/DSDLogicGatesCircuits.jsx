import React from "react";
import { CircuitBoard, Info, Sparkles, Sigma, Cpu } from "lucide-react";

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

function getGateFamily(gate) {
  if (["BUFFER", "NOT"].includes(gate)) return "Single Input Gate";
  if (["AND", "OR", "NAND", "NOR"].includes(gate)) return "Basic Combinational Gate";
  return "Exclusive Logic Gate";
}

function getDesignNote(gate) {
  if (gate === "BUFFER") {
    return "BUFFER directly transfers the input signal to the output without changing its state.";
  }
  if (gate === "NOT") {
    return "NOT is an inverter. It flips the binary signal from 0 to 1 or from 1 to 0.";
  }
  if (["NAND", "NOR", "XNOR"].includes(gate)) {
    return `${gate} includes inversion at the output, shown using the small bubble in the symbol.`;
  }
  if (gate === "XOR") {
    return "XOR is HIGH only when the two inputs are different, which makes it important in adders.";
  }
  return `${gate} combines the input signals directly according to its Boolean rule.`;
}

function signalColor(v) {
  return v === 1 ? "#38bdf8" : "#64748b";
}

function signalGlow(v) {
  return v === 1 ? "0 0 18px rgba(56,189,248,0.45)" : "none";
}

export default function DSDLogicGatesCircuits({ selectedGate, analysis }) {
  const inverted = isInvertedGate(selectedGate);
  const singleInput = isSingleInputGate(selectedGate);
  const curvedGate = extraLeftCurveGate(selectedGate);
  const xorGate = extraXorCurve(selectedGate);

  const outColor = analysis.selected.output === 1 ? "#22c55e" : "#ef4444";

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
              Study the symbolic circuit representation of the selected logic gate.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Gate</span>
          <span className="sorting-stat-value">{selectedGate}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Input A</span>
          <span className="sorting-stat-value">{analysis.A}</span>
        </div>

        {!singleInput ? (
          <div className="sorting-stat-box">
            <span className="sorting-stat-label">Input B</span>
            <span className="sorting-stat-value">{analysis.B}</span>
          </div>
        ) : (
          <div className="sorting-stat-box">
            <span className="sorting-stat-label">Input B</span>
            <span className="sorting-stat-value">Not Used</span>
          </div>
        )}

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Output Y</span>
          <span className="sorting-stat-value" style={{ color: outColor }}>
            {analysis.selected.output}
          </span>
        </div>
      </div>

      <div className="card dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Symbolic Gate Diagram</h3>

          <div className="dsd-circuit-badge">
            <Sparkles size={16} />
            Blueprint View
          </div>
        </div>

        <div className="dsd-circuit-canvas">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 430"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="blueGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect
              x="10"
              y="10"
              width="980"
              height="410"
              rx="24"
              fill="url(#bgGrad)"
              opacity="0"
            />

            {/* Input labels */}
            {singleInput ? (
              <>
                <text x="115" y="210" fill="#d8b4fe" fontSize="28" fontWeight="800">
                  A = {analysis.A}
                </text>
              </>
            ) : (
              <>
                <text x="95" y="145" fill="#d8b4fe" fontSize="28" fontWeight="800">
                  A = {analysis.A}
                </text>
                <text x="95" y="295" fill="#d8b4fe" fontSize="28" fontWeight="800">
                  B = {analysis.B}
                </text>
              </>
            )}

            {/* Input wires */}
            {singleInput ? (
              <line
                x1="220"
                y1="200"
                x2="390"
                y2="200"
                stroke={signalColor(analysis.A)}
                strokeWidth="6"
                strokeLinecap="round"
                filter={analysis.A === 1 ? "url(#blueGlow)" : undefined}
              />
            ) : (
              <>
                <line
                  x1="210"
                  y1="130"
                  x2="390"
                  y2="130"
                  stroke={signalColor(analysis.A)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.A === 1 ? "url(#blueGlow)" : undefined}
                />
                <line
                  x1="210"
                  y1="280"
                  x2="390"
                  y2="280"
                  stroke={signalColor(analysis.B)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter={analysis.B === 1 ? "url(#blueGlow)" : undefined}
                />
              </>
            )}

            {/* XOR extra curve */}
            {!singleInput && xorGate && (
              <path
                d="M372 80 Q335 205 372 330"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="4"
                opacity="0.9"
              />
            )}

            {/* Gate body */}
            {singleInput ? (
              <>
                <path
                  d="M390 120 L390 280 L560 200 Z"
                  fill="rgba(59,130,246,0.10)"
                  stroke="#60a5fa"
                  strokeWidth="5"
                />
              </>
            ) : curvedGate ? (
              <>
                <path
                  d="M390 80 Q500 80 610 205 Q500 330 390 330 Q435 205 390 80"
                  fill="rgba(59,130,246,0.10)"
                  stroke="#60a5fa"
                  strokeWidth="5"
                />
                <path
                  d="M390 80 Q440 205 390 330"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="5"
                />
              </>
            ) : (
              <path
                d="M390 80 L500 80 Q660 205 500 330 L390 330 Z"
                fill="rgba(59,130,246,0.10)"
                stroke="#60a5fa"
                strokeWidth="5"
              />
            )}

            {/* Inversion bubble */}
            {inverted && (
              <circle
                cx={singleInput ? "575" : "620"}
                cy="205"
                r="12"
                fill="#0b1220"
                stroke="#f8fafc"
                strokeWidth="4"
              />
            )}

            {/* Output wire */}
            <line
              x1={singleInput ? (inverted ? 587 : 560) : inverted ? 632 : 610}
              y1="205"
              x2="835"
              y2="205"
              stroke={analysis.selected.output === 1 ? "#facc15" : "#64748b"}
              strokeWidth="6"
              strokeLinecap="round"
              filter={analysis.selected.output === 1 ? "url(#blueGlow)" : undefined}
            />

            {/* Gate expression */}
            <text
              x="500"
              y="215"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="30"
              fontWeight="800"
            >
              {analysis.selected.expression}
            </text>

            {/* Gate name */}
            <text
              x="500"
              y="385"
              textAnchor="middle"
              fill="#7dd3fc"
              fontSize="30"
              fontWeight="800"
            >
              {selectedGate}
            </text>

            {/* Output */}
            <text
              x="865"
              y="215"
              fill={outColor}
              fontSize="30"
              fontWeight="800"
            >
              Y = {analysis.selected.output}
            </text>

            {/* Decorative input/output nodes */}
            {singleInput ? (
              <circle
                cx="220"
                cy="200"
                r="8"
                fill={signalColor(analysis.A)}
                style={{ filter: signalGlow(analysis.A) }}
              />
            ) : (
              <>
                <circle
                  cx="210"
                  cy="130"
                  r="8"
                  fill={signalColor(analysis.A)}
                  style={{ filter: signalGlow(analysis.A) }}
                />
                <circle
                  cx="210"
                  cy="280"
                  r="8"
                  fill={signalColor(analysis.B)}
                  style={{ filter: signalGlow(analysis.B) }}
                />
              </>
            )}

            <circle
              cx="835"
              cy="205"
              r="8"
              fill={analysis.selected.output === 1 ? "#facc15" : "#64748b"}
              style={{
                filter:
                  analysis.selected.output === 1
                    ? "drop-shadow(0 0 10px rgba(250,204,21,0.65))"
                    : "none"
              }}
            />
          </svg>
        </div>
      </div>

      <div className="dsd-circuit-note-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Info size={18} />
            <h4>Circuit Interpretation</h4>
          </div>
          <p>
            For the current input{singleInput ? "" : "s"} <strong>A = {analysis.A}</strong>
            {!singleInput ? ` and B = ${analysis.B}` : ""}, the <strong>{selectedGate}</strong>{" "}
            gate produces <strong>{analysis.selected.output}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Gate Family</h4>
          </div>
          <p>{getGateFamily(selectedGate)}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Sigma size={18} />
            <h4>Design Note</h4>
          </div>
          <p>{getDesignNote(selectedGate)}</p>
        </div>
      </div>
    </section>
  );
}