import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap } from "lucide-react";

function signalColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

function titleMap(type) {
  return {
    sr: "SR Latch",
    d: "D Flip-Flop",
    jk: "JK Flip-Flop",
    t: "T Flip-Flop"
  }[type];
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
  const qBar = analysis.qBar;

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
              Clean symbolic representation of the selected flip-flop showing active inputs and resulting outputs.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Type</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {titleMap(selectedType)}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current Q</span>
          <span className="sorting-stat-value" style={{ color: signalColor(q) }}>
            {q}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Next Q</span>
          <span className="sorting-stat-value" style={{ color: signalColor(analysis.nextQ) }}>
            {analysis.nextQ}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">State</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.stateName}
          </span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>{titleMap(selectedType)} Circuit View</h3>

          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Symbolic Sequential View
          </div>
        </div>

        <div className="dsd-circuit-canvas">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1100 430"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect
              x="430"
              y="70"
              width="220"
              height="250"
              rx="20"
              fill="rgba(18,41,86,0.35)"
              stroke="#60a5fa"
              strokeWidth="3"
            />

            <text
              x="540"
              y="175"
              textAnchor="middle"
              fill="#60a5fa"
              fontSize="34"
              fontWeight="800"
            >
              {selectedType === "sr" ? "SR" : selectedType === "d" ? "D" : selectedType === "jk" ? "JK" : "T"}
            </text>

            <text
              x="540"
              y="215"
              textAnchor="middle"
              fill="#dbe4f0"
              fontSize="20"
              fontWeight="700"
            >
              {selectedType === "sr" ? "Latch" : "Flip-Flop"}
            </text>

            {selectedType !== "sr" && (
              <path
                d="M430 250 L452 238 L452 262 Z"
                fill="#f9a8d4"
                stroke="#f472b6"
                strokeWidth="2"
              />
            )}

            {selectedType === "sr" && (
              <>
                <text x="105" y="128" fill={signalColor(s)} fontSize="24" fontWeight="800">S = {s}</text>
                <text x="105" y="282" fill={signalColor(r)} fontSize="24" fontWeight="800">R = {r}</text>

                <path d="M 180 120 L 430 120" fill="none" stroke={signalColor(s)} strokeWidth="5" />
                <path d="M 180 275 L 430 275" fill="none" stroke={signalColor(r)} strokeWidth="5" />
              </>
            )}

            {selectedType === "d" && (
              <>
                <text x="105" y="128" fill={signalColor(d)} fontSize="24" fontWeight="800">D = {d}</text>
                <text x="75" y="282" fill={signalColor(clk)} fontSize="24" fontWeight="800">CLK = {clk}</text>

                <path d="M 180 120 L 430 120" fill="none" stroke={signalColor(d)} strokeWidth="5" />
                <path d="M 180 275 L 430 275" fill="none" stroke={signalColor(clk)} strokeWidth="5" />
              </>
            )}

            {selectedType === "jk" && (
              <>
                <text x="105" y="112" fill={signalColor(j)} fontSize="24" fontWeight="800">J = {j}</text>
                <text x="105" y="212" fill={signalColor(k)} fontSize="24" fontWeight="800">K = {k}</text>
                <text x="75" y="312" fill={signalColor(clk)} fontSize="24" fontWeight="800">CLK = {clk}</text>

                <path d="M 180 105 L 430 105" fill="none" stroke={signalColor(j)} strokeWidth="5" />
                <path d="M 180 205 L 430 205" fill="none" stroke={signalColor(k)} strokeWidth="5" />
                <path d="M 180 305 L 430 305" fill="none" stroke={signalColor(clk)} strokeWidth="5" />
              </>
            )}

            {selectedType === "t" && (
              <>
                <text x="105" y="128" fill={signalColor(t)} fontSize="24" fontWeight="800">T = {t}</text>
                <text x="75" y="282" fill={signalColor(clk)} fontSize="24" fontWeight="800">CLK = {clk}</text>

                <path d="M 180 120 L 430 120" fill="none" stroke={signalColor(t)} strokeWidth="5" />
                <path d="M 180 275 L 430 275" fill="none" stroke={signalColor(clk)} strokeWidth="5" />
              </>
            )}

            <path d="M 650 145 L 850 145" fill="none" stroke={signalColor(analysis.nextQ)} strokeWidth="6" />
            <path d="M 650 245 L 850 245" fill="none" stroke={signalColor(qBar)} strokeWidth="6" />

            <text x="875" y="153" fill={signalColor(analysis.nextQ)} fontSize="26" fontWeight="800">
              Q = {analysis.nextQ}
            </text>

            <text x="875" y="253" fill={signalColor(qBar)} fontSize="26" fontWeight="800">
              Q̅ = {qBar}
            </text>

            <path
              d="M 850 245 Q 935 245 935 345 Q 935 385 650 385"
              fill="none"
              stroke="rgba(34,197,94,0.25)"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            <text x="735" y="406" fill="#86efac" fontSize="16" fontWeight="800">
              Feedback / Stored State Path
            </text>

            <circle
              cx="620"
              cy="100"
              r="12"
              fill={analysis.nextQ === 1 ? "#22c55e" : "#ef4444"}
              stroke="#f8fafc"
              strokeWidth="2"
            />
            <text x="642" y="106" fill="#e5e7eb" fontSize="16" fontWeight="800">
              Stable State
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
              The selected element is <strong>{titleMap(selectedType)}</strong>. The highlighted input lines show the current active input values.
            </p>
            <p style={{ marginTop: 10 }}>
              Based on these signals, the next stored state becomes <strong>Q = {analysis.nextQ}</strong>.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Output Observation</h4>
            </div>
            <p>
              The main output becomes <strong>Q = {analysis.nextQ}</strong> and the complementary output becomes <strong>Q̅ = {qBar}</strong>.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CircuitBoard size={18} />
              <h4>Sequential Nature</h4>
            </div>
            <p>
              The feedback path represents memory behavior. This is what makes flip-flops different from ordinary combinational gates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}