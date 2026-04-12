import React from "react";

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
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This diagram shows the input transition, gate block, and delayed output response.
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
          <strong>Gate</strong>
          <div>{selectedGate}</div>
        </div>
        <div className="stat-card">
          <strong>Delay</strong>
          <div>{delayNs} ns</div>
        </div>
        <div className="stat-card">
          <strong>Time</strong>
          <div>{timeNs} ns</div>
        </div>
        <div className="stat-card">
          <strong>Output Change At</strong>
          <div>{analysis.outputChangesAt} ns</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Delay Path View</h3>

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
          <svg width="100%" height="100%" viewBox="0 0 820 360" preserveAspectRatio="xMidYMid meet">
            <line x1="70" y1="180" x2="280" y2="180" stroke={signalColor(inputBit)} strokeWidth="5" />
            <text x="20" y="185" fill={signalColor(inputBit)} fontSize="22" fontWeight="bold">
              IN = {inputBit}
            </text>

            <rect
              x="280"
              y="110"
              width="180"
              height="140"
              rx="20"
              fill="rgba(59,130,246,0.12)"
              stroke="#60a5fa"
              strokeWidth="3"
            />
            <text x="370" y="175" textAnchor="middle" fill="#e5e7eb" fontSize="30" fontWeight="bold">
              {gateLabel}
            </text>
            <text x="370" y="210" textAnchor="middle" fill="#93c5fd" fontSize="18" fontWeight="bold">
              Delay = {delayNs} ns
            </text>

            <line x1="460" y1="180" x2="710" y2="180" stroke={signalColor(analysis.observedOutput)} strokeWidth="5" />
            <text x="720" y="185" fill={signalColor(analysis.observedOutput)} fontSize="22" fontWeight="bold">
              OUT = {analysis.observedOutput}
            </text>

            <path
              d="M90 300 L90 270 L180 270 L180 235"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
            />
            <path
              d="M560 300 L560 270 L650 270 L650 235"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeDasharray={timeNs < delayNs ? "8 6" : "0"}
            />

            <text x="55" y="322" fill="#fcd34d" fontSize="16" fontWeight="bold">
              Input changed at 0 ns
            </text>
            <text x="515" y="322" fill="#86efac" fontSize="16" fontWeight="bold">
              Output responds at {delayNs} ns
            </text>
          </svg>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Circuit Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The input changes immediately, but the gate output responds only after the propagation delay.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          At the current time of <strong>{timeNs} ns</strong>, the observed output is <strong>{analysis.observedOutput}</strong>.
        </p>
      </div>
    </section>
  );
}