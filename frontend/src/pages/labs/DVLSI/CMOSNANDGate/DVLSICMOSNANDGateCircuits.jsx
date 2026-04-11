import React from "react";

function transistorStyle(state) {
  const active = state === "ON";

  return {
    border: active ? "2px solid #22c55e" : "2px solid #ef4444",
    background: active ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.12)",
    color: "#e5e7eb",
    borderRadius: "12px",
    padding: "12px 14px",
    minWidth: "120px",
    textAlign: "center",
    boxShadow: active
      ? "0 0 14px rgba(34,197,94,0.25)"
      : "0 0 10px rgba(239,68,68,0.12)"
  };
}

export default function DVLSICMOSNANDCircuits({ A, B, analysis }) {
  return (
    <section className="card experiment">
      <h2>Circuits</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        In a CMOS NAND gate, the pMOS transistors form a <strong>parallel pull-up network</strong>
        and the nMOS transistors form a <strong>series pull-down network</strong>.
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
          <strong>A</strong>
          <div>{A}</div>
        </div>
        <div className="stat-card">
          <strong>B</strong>
          <div>{B}</div>
        </div>
        <div className="stat-card">
          <strong>Output Y</strong>
          <div>{analysis.output}</div>
        </div>
        <div className="stat-card">
          <strong>Current Path</strong>
          <div>{analysis.currentPath}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "#0f172a", padding: "20px" }}>
        <h3 style={{ marginBottom: "1rem" }}>CMOS NAND Visual</h3>

        <div
          style={{
            position: "relative",
            height: "520px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(180deg, #111827, #0b1220)",
            overflow: "hidden"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 760 520" preserveAspectRatio="xMidYMid meet">
            {/* Rails */}
            <line x1="280" y1="30" x2="480" y2="30" stroke="#60a5fa" strokeWidth="4" />
            <line x1="280" y1="490" x2="480" y2="490" stroke="#f87171" strokeWidth="4" />

            {/* Output node */}
            <line x1="380" y1="220" x2="560" y2="220" stroke="#fbbf24" strokeWidth="4" />
            <circle cx="380" cy="220" r="6" fill="#fbbf24" />

            {/* Pull-up parallel PMOS */}
            <rect
              x="250"
              y="80"
              width="80"
              height="70"
              rx="10"
              fill={analysis.pmosA === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
              stroke={analysis.pmosA === "ON" ? "#22c55e" : "#ef4444"}
              strokeWidth="3"
            />
            <text x="290" y="110" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">pMOS A</text>
            <text x="290" y="132" textAnchor="middle" fill="#cbd5e1" fontSize="13">{analysis.pmosA}</text>

            <rect
              x="430"
              y="80"
              width="80"
              height="70"
              rx="10"
              fill={analysis.pmosB === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
              stroke={analysis.pmosB === "ON" ? "#22c55e" : "#ef4444"}
              strokeWidth="3"
            />
            <text x="470" y="110" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">pMOS B</text>
            <text x="470" y="132" textAnchor="middle" fill="#cbd5e1" fontSize="13">{analysis.pmosB}</text>

            {/* Pull-down series NMOS */}
            <rect
              x="340"
              y="270"
              width="80"
              height="70"
              rx="10"
              fill={analysis.nmosA === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
              stroke={analysis.nmosA === "ON" ? "#22c55e" : "#ef4444"}
              strokeWidth="3"
            />
            <text x="380" y="300" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">nMOS A</text>
            <text x="380" y="322" textAnchor="middle" fill="#cbd5e1" fontSize="13">{analysis.nmosA}</text>

            <rect
              x="340"
              y="350"
              width="80"
              height="70"
              rx="10"
              fill={analysis.nmosB === "ON" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
              stroke={analysis.nmosB === "ON" ? "#22c55e" : "#ef4444"}
              strokeWidth="3"
            />
            <text x="380" y="380" textAnchor="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold">nMOS B</text>
            <text x="380" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="13">{analysis.nmosB}</text>

            {/* Wiring */}
            <line x1="290" y1="30" x2="290" y2="80" stroke="#60a5fa" strokeWidth="4" />
            <line x1="470" y1="30" x2="470" y2="80" stroke="#60a5fa" strokeWidth="4" />

            <line x1="290" y1="150" x2="290" y2="220" stroke="#fbbf24" strokeWidth="4" />
            <line x1="470" y1="150" x2="470" y2="220" stroke="#fbbf24" strokeWidth="4" />
            <line x1="290" y1="220" x2="470" y2="220" stroke="#fbbf24" strokeWidth="4" />

            <line x1="380" y1="220" x2="380" y2="270" stroke="#fbbf24" strokeWidth="4" />
            <line x1="380" y1="340" x2="380" y2="350" stroke="#fbbf24" strokeWidth="4" />
            <line x1="380" y1="420" x2="380" y2="490" stroke="#f87171" strokeWidth="4" />

            {/* Gate lines */}
            <line x1="100" y1="115" x2="250" y2="115" stroke="#c084fc" strokeWidth="4" />
            <line x1="100" y1="305" x2="340" y2="305" stroke="#c084fc" strokeWidth="4" />

            <line x1="660" y1="115" x2="510" y2="115" stroke="#f9a8d4" strokeWidth="4" />
            <line x1="660" y1="385" x2="420" y2="385" stroke="#f9a8d4" strokeWidth="4" />

            {/* Labels */}
            <text x="500" y="35" fill="#93c5fd" fontSize="18" fontWeight="bold">VDD</text>
            <text x="570" y="225" fill="#fcd34d" fontSize="18" fontWeight="bold">Y = {analysis.output}</text>
            <text x="55" y="120" fill="#d8b4fe" fontSize="18" fontWeight="bold">A = {A}</text>
            <text x="670" y="120" fill="#fbcfe8" fontSize="18" fontWeight="bold">B = {B}</text>
            <text x="500" y="495" fill="#fca5a5" fontSize="18" fontWeight="bold">GND</text>
          </svg>
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px"
        }}
      >
        <div style={transistorStyle(analysis.pmosA)}>
          <strong>pMOS A</strong>
          <div style={{ marginTop: "8px" }}>{analysis.pmosA}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            ON when A = 0
          </div>
        </div>

        <div style={transistorStyle(analysis.pmosB)}>
          <strong>pMOS B</strong>
          <div style={{ marginTop: "8px" }}>{analysis.pmosB}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            ON when B = 0
          </div>
        </div>

        <div style={transistorStyle(analysis.nmosA)}>
          <strong>nMOS A</strong>
          <div style={{ marginTop: "8px" }}>{analysis.nmosA}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            ON when A = 1
          </div>
        </div>

        <div style={transistorStyle(analysis.nmosB)}>
          <strong>nMOS B</strong>
          <div style={{ marginTop: "8px" }}>{analysis.nmosB}</div>
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#cbd5e1" }}>
            ON when B = 1
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Truth Table</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>A</th>
              <th>B</th>
              <th>Y = NAND(A,B)</th>
            </tr>
          </thead>
          <tbody>
            <tr className={A === 0 && B === 0 ? "highlight-row" : ""}>
              <td>0</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr className={A === 0 && B === 1 ? "highlight-row" : ""}>
              <td>0</td>
              <td>1</td>
              <td>1</td>
            </tr>
            <tr className={A === 1 && B === 0 ? "highlight-row" : ""}>
              <td>1</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr className={A === 1 && B === 1 ? "highlight-row" : ""}>
              <td>1</td>
              <td>1</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        The CMOS NAND gate outputs LOW only when both inputs are HIGH. Any LOW input turns ON at least one pMOS transistor and breaks the nMOS series path.
      </div>
    </section>
  );
}