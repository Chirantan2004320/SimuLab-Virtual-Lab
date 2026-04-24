import React from "react";
import { CircuitBoard, Info, CheckCircle2, Zap } from "lucide-react";

function signalColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDPropagationDelayCircuits({
  selectedGate,
  inputBit,
  delayNs,
  timeNs,
  analysis
}) {
  const gateLabel = selectedGate === "NOT" ? "NOT" : "BUF";

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
              Symbolic timing path showing the delayed response of the output relative to the input transition.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Gate</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>{selectedGate}</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Delay</span>
          <span className="sorting-stat-value">{delayNs} ns</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Time</span>
          <span className="sorting-stat-value">{timeNs} ns</span>
        </div>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Output Change At</span>
          <span className="sorting-stat-value">{analysis.outputChangesAt} ns</span>
        </div>
      </div>

      <div className="dsd-circuit-panel">
        <div className="dsd-circuit-panel-head">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Delay Path View</h3>

          <div className="dsd-circuit-badge">
            <Zap size={16} />
            Symbolic Timing Circuit
          </div>
        </div>

        <div className="dsd-circuit-canvas">
          <svg width="100%" height="100%" viewBox="0 0 1100 430" preserveAspectRatio="xMidYMid meet">
            <text x="90" y="188" fill={signalColor(inputBit)} fontSize="28" fontWeight="800">
              IN = {inputBit}
            </text>
            <path d="M 180 180 L 420 180" fill="none" stroke={signalColor(inputBit)} strokeWidth="6" />

            <rect
              x="420"
              y="110"
              width="220"
              height="140"
              rx="22"
              fill="rgba(59,130,246,0.12)"
              stroke="#60a5fa"
              strokeWidth="3"
            />
            <text x="530" y="175" textAnchor="middle" fill="#e5e7eb" fontSize="34" fontWeight="800">
              {gateLabel}
            </text>
            <text x="530" y="210" textAnchor="middle" fill="#93c5fd" fontSize="18" fontWeight="700">
              Delay = {delayNs} ns
            </text>

            <path
              d="M 640 180 L 900 180"
              fill="none"
              stroke={signalColor(analysis.observedOutput)}
              strokeWidth="6"
              strokeDasharray={timeNs < delayNs ? "10 8" : "0"}
            />
            <text x="920" y="188" fill={signalColor(analysis.observedOutput)} fontSize="28" fontWeight="800">
              OUT = {analysis.observedOutput}
            </text>

            <path
              d="M 200 315 L 200 275 L 315 275 L 315 225"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
            />
            <text x="110" y="338" fill="#fcd34d" fontSize="16" fontWeight="800">
              Input changed at 0 ns
            </text>

            <path
              d="M 760 315 L 760 275 L 860 275 L 860 225"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeDasharray={timeNs < delayNs ? "8 6" : "0"}
            />
            <text x="665" y="338" fill="#86efac" fontSize="16" fontWeight="800">
              Output responds at {delayNs} ns
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
              The input changes immediately, but the gate needs <strong>{delayNs} ns</strong> before the output can reflect the new input.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Current Observation</h4>
            </div>
            <p>
              At the current time of <strong>{timeNs} ns</strong>, the observed output is <strong>{analysis.observedOutput}</strong>.
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <CircuitBoard size={18} />
              <h4>Meaning</h4>
            </div>
            <p>
              A dashed output path means the output is still in transition and has not yet fully responded to the new input.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}