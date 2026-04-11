import React from "react";

function transistorStyle(state, type) {
  const active =
    state === "ON" || state === "PARTIALLY ON";

  return {
    border: active ? "2px solid #22c55e" : "2px solid #ef4444",
    background: active
      ? type === "pmos"
        ? "rgba(34,197,94,0.15)"
        : "rgba(34,197,94,0.18)"
      : "rgba(239,68,68,0.12)",
    color: "#e5e7eb",
    borderRadius: "12px",
    padding: "14px 16px",
    minWidth: "120px",
    textAlign: "center",
    boxShadow: active
      ? "0 0 16px rgba(34,197,94,0.25)"
      : "0 0 10px rgba(239,68,68,0.15)"
  };
}

export default function DVLSICMOSInverterSimulationCircuits({
  vin,
  vdd,
  analysis,
  formatNumber
}) {
  const inputLogic = vin < vdd / 2 ? "0" : "1";
  const outputLogic = analysis.vout > vdd / 2 ? "1" : "0";

  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This view shows transistor-level behavior of the CMOS inverter. The active transistor is highlighted in green, while the inactive one is shown in red.
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
          <strong>Input Logic</strong>
          <div>{inputLogic}</div>
        </div>
        <div className="stat-card">
          <strong>Output Logic</strong>
          <div>{outputLogic}</div>
        </div>
        <div className="stat-card">
          <strong>Region</strong>
          <div>{analysis.regionLabel}</div>
        </div>
        <div className="stat-card">
          <strong>Current Path</strong>
          <div>{analysis.conductingPath}</div>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginTop: "1rem",
          padding: "20px",
          background: "#0f172a"
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>CMOS Inverter Visual</h3>

        <div
          style={{
            position: "relative",
            height: "420px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid meet">
            {/* Rails */}
            <line x1="350" y1="30" x2="350" y2="70" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="350" y1="350" x2="350" y2="390" stroke="#cbd5e1" strokeWidth="4" />
            <line x1="250" y1="30" x2="450" y2="30" stroke="#60a5fa" strokeWidth="4" />
            <line x1="250" y1="390" x2="450" y2="390" stroke="#f87171" strokeWidth="4" />

            {/* Output vertical */}
            <line x1="350" y1="170" x2="520" y2="170" stroke="#fbbf24" strokeWidth="4" />
            <circle cx="350" cy="170" r="6" fill="#fbbf24" />

            {/* Input line */}
            <line x1="110" y1="210" x2="280" y2="210" stroke="#c084fc" strokeWidth="4" />
            <line x1="280" y1="120" x2="280" y2="300" stroke="#c084fc" strokeWidth="4" />

            {/* PMOS body */}
            <rect
              x="310"
              y="70"
              width="80"
              height="90"
              rx="10"
              fill={analysis.pmosState === "ON" || analysis.pmosState === "PARTIALLY ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
              stroke={analysis.pmosState === "ON" || analysis.pmosState === "PARTIALLY ON" ? "#22c55e" : "#ef4444"}
              strokeWidth="3"
            />
            <text x="350" y="105" textAnchor="middle" fill="#e5e7eb" fontSize="20" fontWeight="bold">pMOS</text>
            <text x="350" y="132" textAnchor="middle" fill="#cbd5e1" fontSize="14">{analysis.pmosState}</text>

            {/* nMOS body */}
            <rect
              x="310"
              y="220"
              width="80"
              height="90"
              rx="10"
              fill={analysis.nmosState === "ON" || analysis.nmosState === "PARTIALLY ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
              stroke={analysis.nmosState === "ON" || analysis.nmosState === "PARTIALLY ON" ? "#22c55e" : "#ef4444"}
              strokeWidth="3"
            />
            <text x="350" y="255" textAnchor="middle" fill="#e5e7eb" fontSize="20" fontWeight="bold">nMOS</text>
            <text x="350" y="282" textAnchor="middle" fill="#cbd5e1" fontSize="14">{analysis.nmosState}</text>

            {/* Connections */}
            <line x1="350" y1="30" x2="350" y2="70" stroke="#60a5fa" strokeWidth="4" />
            <line x1="350" y1="160" x2="350" y2="220" stroke="#fbbf24" strokeWidth="4" />
            <line x1="350" y1="310" x2="350" y2="390" stroke="#f87171" strokeWidth="4" />

            {/* Labels */}
            <text x="470" y="35" fill="#93c5fd" fontSize="18" fontWeight="bold">VDD = {formatNumber(vdd)} V</text>
            <text x="530" y="175" fill="#fcd34d" fontSize="18" fontWeight="bold">Vout = {formatNumber(analysis.vout)} V</text>
            <text x="50" y="216" fill="#d8b4fe" fontSize="18" fontWeight="bold">
              Vin = {formatNumber(vin)} V
            </text>
            <text x="470" y="395" fill="#fca5a5" fontSize="18" fontWeight="bold">GND</text>

            {/* Gate taps */}
            <line x1="280" y1="120" x2="310" y2="120" stroke="#c084fc" strokeWidth="4" />
            <line x1="280" y1="270" x2="310" y2="270" stroke="#c084fc" strokeWidth="4" />
          </svg>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "14px"
        }}
      >
        <div style={transistorStyle(analysis.pmosState, "pmos")}>
          <strong>pMOS</strong>
          <div style={{ marginTop: "8px" }}>{analysis.pmosState}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            Conducts when input is LOW
          </div>
        </div>

        <div style={transistorStyle(analysis.nmosState, "nmos")}>
          <strong>nMOS</strong>
          <div style={{ marginTop: "8px" }}>{analysis.nmosState}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            Conducts when input is HIGH
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Digital Logic Interpretation</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>Vin</th>
              <th>Vout</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className={inputLogic === "0" ? "highlight-row" : ""}>
              <td>0</td>
              <td>1</td>
              <td>pMOS ON, nMOS OFF</td>
            </tr>
            <tr className={inputLogic === "1" ? "highlight-row" : ""}>
              <td>1</td>
              <td>0</td>
              <td>nMOS ON, pMOS OFF</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        In a CMOS inverter, the input drives both transistors. One transistor pulls the output up toward VDD, while the other pulls it down toward ground. The output is therefore the logical complement of the input.
      </div>
    </section>
  );
}