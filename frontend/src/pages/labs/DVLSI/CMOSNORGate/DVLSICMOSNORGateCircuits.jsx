import React from "react";
import {
  CircuitBoard,
  Cpu,
  Activity,
  Zap,
  Lightbulb
} from "lucide-react";

export default function DVLSICMOSNORCircuits({ A, B, analysis }) {
  const isPMOSAOn = analysis.pmosA === "ON";
  const isPMOSBOn = analysis.pmosB === "ON";
  const isNMOSAOn = analysis.nmosA === "ON";
  const isNMOSBOn = analysis.nmosB === "ON";

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <CircuitBoard size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">CMOS Circuit View</h2>
          <p className="sorting-sim-subtitle">
            Visualize pull-up and pull-down network behavior in a CMOS NOR gate.
          </p>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginBottom: 16 }}>
        {analysis.currentPath}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2.25fr) minmax(300px, 0.85fr)",
          gap: 20
        }}
      >
        <div
          className="overview-card"
          style={{
            padding: 0,
            overflow: "hidden",
            minHeight: 700
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 700,
              background:
                "radial-gradient(circle at 25% 18%, rgba(56,189,248,0.10), transparent 35%), radial-gradient(circle at 82% 78%, rgba(139,92,246,0.12), transparent 38%), linear-gradient(135deg, #020617, #08111f)"
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(rgba(148,163,184,0.18) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                opacity: 0.22
              }}
            />

            <svg
              width="100%"
              height="700"
              viewBox="0 0 940 700"
              preserveAspectRatio="xMidYMid meet"
              style={{ position: "relative", zIndex: 1 }}
            >
              <defs>
                <filter id="glowGreen">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="7"
                    floodColor="#22c55e"
                    floodOpacity="0.45"
                  />
                </filter>

                <filter id="glowRed">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="7"
                    floodColor="#ef4444"
                    floodOpacity="0.35"
                  />
                </filter>
              </defs>

              {/* VDD */}
              <circle cx="470" cy="70" r="10" fill="#60a5fa" />
              <line
                x1="470"
                y1="70"
                x2="470"
                y2="125"
                stroke="#60a5fa"
                strokeWidth="5"
              />
              <text
                x="470"
                y="45"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="20"
                fontWeight="900"
              >
                VDD
              </text>

              {/* PMOS A */}
              <rect
                x="410"
                y="125"
                width="120"
                height="90"
                rx="14"
                fill={isPMOSAOn ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.12)"}
                stroke={isPMOSAOn ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                filter={isPMOSAOn ? "url(#glowGreen)" : "url(#glowRed)"}
              />
              <text
                x="470"
                y="165"
                textAnchor="middle"
                fill={isPMOSAOn ? "#22c55e" : "#ef4444"}
                fontSize="20"
                fontWeight="900"
              >
                pMOS A
              </text>
              <text
                x="470"
                y="193"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="15"
                fontWeight="800"
              >
                {analysis.pmosA}
              </text>

              {/* PMOS B */}
              <rect
                x="410"
                y="235"
                width="120"
                height="90"
                rx="14"
                fill={isPMOSBOn ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.12)"}
                stroke={isPMOSBOn ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                filter={isPMOSBOn ? "url(#glowGreen)" : "url(#glowRed)"}
              />
              <text
                x="470"
                y="275"
                textAnchor="middle"
                fill={isPMOSBOn ? "#22c55e" : "#ef4444"}
                fontSize="20"
                fontWeight="900"
              >
                pMOS B
              </text>
              <text
                x="470"
                y="303"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="15"
                fontWeight="800"
              >
                {analysis.pmosB}
              </text>

              {/* Output node */}
              <line
                x1="470"
                y1="325"
                x2="470"
                y2="390"
                stroke="#fbbf24"
                strokeWidth="5"
              />
              <circle cx="470" cy="390" r="11" fill="#fbbf24" />
              <line
                x1="470"
                y1="390"
                x2="655"
                y2="390"
                stroke="#fbbf24"
                strokeWidth="5"
              />
              <circle cx="655" cy="390" r="9" fill="#fbbf24" />

              <text
                x="680"
                y="394"
                fill="#fbbf24"
                fontSize="20"
                fontWeight="900"
              >
                Y = {analysis.output}
              </text>

              {/* NMOS A */}
              <rect
                x="265"
                y="450"
                width="120"
                height="90"
                rx="14"
                fill={isNMOSAOn ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.12)"}
                stroke={isNMOSAOn ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                filter={isNMOSAOn ? "url(#glowGreen)" : "url(#glowRed)"}
              />
              <text
                x="325"
                y="490"
                textAnchor="middle"
                fill={isNMOSAOn ? "#22c55e" : "#ef4444"}
                fontSize="20"
                fontWeight="900"
              >
                nMOS A
              </text>
              <text
                x="325"
                y="518"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="15"
                fontWeight="800"
              >
                {analysis.nmosA}
              </text>

              {/* NMOS B */}
              <rect
                x="555"
                y="450"
                width="120"
                height="90"
                rx="14"
                fill={isNMOSBOn ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.12)"}
                stroke={isNMOSBOn ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                filter={isNMOSBOn ? "url(#glowGreen)" : "url(#glowRed)"}
              />
              <text
                x="615"
                y="490"
                textAnchor="middle"
                fill={isNMOSBOn ? "#22c55e" : "#ef4444"}
                fontSize="20"
                fontWeight="900"
              >
                nMOS B
              </text>
              <text
                x="615"
                y="518"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="15"
                fontWeight="800"
              >
                {analysis.nmosB}
              </text>

              {/* Wiring */}
              <line
                x1="470"
                y1="125"
                x2="470"
                y2="235"
                stroke="#60a5fa"
                strokeWidth="5"
              />

              <line
                x1="470"
                y1="390"
                x2="325"
                y2="450"
                stroke="#fbbf24"
                strokeWidth="5"
              />
              <line
                x1="470"
                y1="390"
                x2="615"
                y2="450"
                stroke="#fbbf24"
                strokeWidth="5"
              />

              <line
                x1="325"
                y1="540"
                x2="325"
                y2="615"
                stroke="#ef4444"
                strokeWidth="5"
              />
              <line
                x1="615"
                y1="540"
                x2="615"
                y2="615"
                stroke="#ef4444"
                strokeWidth="5"
              />
              <line
                x1="325"
                y1="615"
                x2="615"
                y2="615"
                stroke="#ef4444"
                strokeWidth="5"
              />

              {/* GND */}
              <circle cx="470" cy="615" r="8" fill="#ef4444" />
              <line
                x1="440"
                y1="645"
                x2="500"
                y2="645"
                stroke="#ef4444"
                strokeWidth="4"
              />
              <line
                x1="448"
                y1="658"
                x2="492"
                y2="658"
                stroke="#ef4444"
                strokeWidth="4"
              />
              <line
                x1="458"
                y1="671"
                x2="482"
                y2="671"
                stroke="#ef4444"
                strokeWidth="4"
              />
              <text
                x="470"
                y="695"
                textAnchor="middle"
                fill="#f87171"
                fontSize="18"
                fontWeight="900"
              >
                GND
              </text>

              {/* Input A */}
              <line
                x1="90"
                y1="170"
                x2="410"
                y2="170"
                stroke="#a855f7"
                strokeWidth="4"
              />
              <line
                x1="90"
                y1="495"
                x2="265"
                y2="495"
                stroke="#a855f7"
                strokeWidth="4"
              />
              <text
                x="40"
                y="176"
                fill="#d8b4fe"
                fontSize="18"
                fontWeight="900"
              >
                A = {A}
              </text>

              {/* Input B */}
              <line
                x1="850"
                y1="280"
                x2="530"
                y2="280"
                stroke="#f472b6"
                strokeWidth="4"
              />
              <line
                x1="850"
                y1="495"
                x2="675"
                y2="495"
                stroke="#f472b6"
                strokeWidth="4"
              />
              <text
                x="860"
                y="286"
                fill="#f9a8d4"
                fontSize="18"
                fontWeight="900"
              >
                B = {B}
              </text>

              {/* Legend */}
              <foreignObject x="25" y="555" width="230" height="110">
                <div
                  style={{
                    height: "100%",
                    boxSizing: "border-box",
                    padding: "14px",
                    borderRadius: 14,
                    background: "rgba(15,23,42,0.78)",
                    border: "1px solid rgba(148,163,184,0.22)"
                  }}
                >
                  <div style={{ color: "#f8fafc", fontWeight: 900, marginBottom: 10 }}>
                    Logic Legend
                  </div>
                  <LegendRow color="#60a5fa" label="Power Rail" />
                  <LegendRow color="#fbbf24" label="Output Path" />
                  <LegendRow color="#22c55e" label="Transistor ON" />
                  <LegendRow color="#ef4444" label="Transistor OFF" />
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title="Operating Conditions" icon={<Cpu size={18} />}>
            <InfoLine label="Input A" value={A} color="#c084fc" />
            <InfoLine label="Input B" value={B} color="#f472b6" />
            <InfoLine label="Output" value={analysis.output} color="#fbbf24" />
            <InfoLine label="Logic Case" value={analysis.logicCase} />
            <InfoLine label="Current Path" value={analysis.currentPath} />
          </Panel>

          <Panel title="Transistor States" icon={<Activity size={18} />}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12
              }}
            >
              <StateBox
                title="pMOS A"
                state={analysis.pmosA}
                active={isPMOSAOn}
              />
              <StateBox
                title="pMOS B"
                state={analysis.pmosB}
                active={isPMOSBOn}
              />
              <StateBox
                title="nMOS A"
                state={analysis.nmosA}
                active={isNMOSAOn}
              />
              <StateBox
                title="nMOS B"
                state={analysis.nmosB}
                active={isNMOSBOn}
              />
            </div>
          </Panel>

          <Panel title="Truth Table" icon={<Zap size={18} />}>
            <div style={{ overflowX: "auto" }}>
              <table className="dbms-table">
                <thead>
                  <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>Y</th>
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
                    <td>0</td>
                  </tr>
                  <tr className={A === 1 && B === 0 ? "highlight-row" : ""}>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr className={A === 1 && B === 1 ? "highlight-row" : ""}>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Circuit Interpretation" icon={<Lightbulb size={18} />}>
            <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.7 }}>
              {analysis.note}
            </p>
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div
      className="overview-card"
      style={{
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.88))"
      }}
    >
      <div className="overview-card-head">
        {icon}
        <h4>{title}</h4>
      </div>
      {children}
    </div>
  );
}

function InfoLine({ label, value, color = "#e5e7eb" }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 12,
        padding: "8px 0",
        borderBottom: "1px solid rgba(148,163,184,0.12)"
      }}
    >
      <span style={{ color: "#cbd5e1", fontWeight: 700 }}>{label}</span>
      <strong style={{ color, textAlign: "right" }}>{value}</strong>
    </div>
  );
}

function StateBox({ title, state, active }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: "14px 12px",
        textAlign: "center",
        background: active ? "rgba(34,197,94,0.13)" : "rgba(239,68,68,0.12)",
        border: `1px solid ${active ? "#22c55e" : "#ef4444"}88`
      }}
    >
      <div
        style={{
          color: active ? "#22c55e" : "#ef4444",
          fontWeight: 900,
          fontSize: 15
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: active ? "#22c55e" : "#ef4444",
          fontWeight: 900,
          fontSize: 22,
          marginTop: 6
        }}
      >
        {state}
      </div>
    </div>
  );
}

function LegendRow({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span
        style={{
          width: 26,
          height: 3,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 10px ${color}66`
        }}
      />
      <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 700 }}>{label}</span>
    </div>
  );
}