import React from "react";
import {
  CircuitBoard,
  Cpu,
  Activity,
  Zap,
  Lightbulb
} from "lucide-react";

export default function DVLSICMOSInverterSimulationCircuits({
  vin,
  vdd,
  analysis,
  formatNumber
}) {
  const isPMOSOn =
    analysis.pmosState === "ON" || analysis.pmosState === "PARTIALLY ON";
  const isNMOSOn =
    analysis.nmosState === "ON" || analysis.nmosState === "PARTIALLY ON";

  const inputLogic = vin < vdd / 2 ? "0 (LOW)" : "1 (HIGH)";
  const outputLogic = analysis.vout > vdd / 2 ? "1 (HIGH)" : "0 (LOW)";

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <CircuitBoard size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">CMOS Circuit View</h2>
          <p className="sorting-sim-subtitle">
            Visualize pull-up and pull-down network behavior in a CMOS inverter.
          </p>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginBottom: 16 }}>
        {analysis.conductingPath}
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
            minHeight: 650
          }}
        >
          <div
            style={{
              position: "relative",
              minHeight: 650,
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
              height="650"
              viewBox="0 0 900 650"
              preserveAspectRatio="xMidYMid meet"
              style={{ position: "relative", zIndex: 1 }}
            >
              <defs>
                <filter id="pmosGlow">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="7"
                    floodColor={isPMOSOn ? "#22c55e" : "#ef4444"}
                    floodOpacity="0.42"
                  />
                </filter>

                <filter id="nmosGlow">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="7"
                    floodColor={isNMOSOn ? "#22c55e" : "#ef4444"}
                    floodOpacity="0.42"
                  />
                </filter>

                <filter id="nodeGlow">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="6"
                    floodColor="#fbbf24"
                    floodOpacity="0.55"
                  />
                </filter>
              </defs>

              {/* Input source */}
              <rect
                x="70"
                y="250"
                width="135"
                height="92"
                rx="16"
                fill="rgba(88,28,135,0.30)"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
              <path
                d="M95 296 H112 V274 H132 V318 H152 V296 H177"
                fill="none"
                stroke="#c084fc"
                strokeWidth="4"
              />
              <text
                x="137"
                y="286"
                textAnchor="middle"
                fill="#f3e8ff"
                fontSize="16"
                fontWeight="900"
              >
                Vin
              </text>
              <text
                x="137"
                y="325"
                textAnchor="middle"
                fill="#d8b4fe"
                fontSize="16"
                fontWeight="900"
              >
                {formatNumber(vin)}V
              </text>

              {/* Input wire to gates */}
              <circle cx="210" cy="296" r="9" fill="#a855f7" />
              <line
                x1="205"
                y1="296"
                x2="285"
                y2="296"
                stroke="#a855f7"
                strokeWidth="4"
              />
              <path
                d="M285 296 L285 205 L375 205"
                fill="none"
                stroke="#a855f7"
                strokeWidth="4"
              />
              <path
                d="M285 296 L285 400 L375 400"
                fill="none"
                stroke="#a855f7"
                strokeWidth="4"
              />

              {/* Gate bubbles */}
              <circle
                cx="380"
                cy="205"
                r="10"
                fill="#020617"
                stroke="#c084fc"
                strokeWidth="4"
              />
              <circle
                cx="380"
                cy="400"
                r="10"
                fill="#020617"
                stroke="#c084fc"
                strokeWidth="4"
              />

              {/* VDD rail */}
              <circle cx="452" cy="80" r="10" fill="#60a5fa" />
              <line
                x1="452"
                y1="80"
                x2="452"
                y2="145"
                stroke="#60a5fa"
                strokeWidth="5"
              />
              <text
                x="452"
                y="55"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="18"
                fontWeight="900"
              >
                VDD ({formatNumber(vdd)}V)
              </text>

              {/* PMOS device */}
              <rect
                x="395"
                y="145"
                width="115"
                height="100"
                rx="13"
                fill={isPMOSOn ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
                stroke={isPMOSOn ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                filter="url(#pmosGlow)"
              />

              {/* PMOS symbol inside */}
              <line x1="422" y1="166" x2="422" y2="224" stroke="#22c55e" strokeWidth="4" />
              <line x1="438" y1="164" x2="438" y2="226" stroke="#22c55e" strokeWidth="4" />
              <path
                d="M438 176 H452 V145"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
              />
              <path
                d="M438 214 H452 V245"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
              />

              <text
                x="525"
                y="170"
                fill={isPMOSOn ? "#22c55e" : "#ef4444"}
                fontSize="19"
                fontWeight="900"
              >
                pMOS
              </text>
              <text
                x="525"
                y="198"
                fill={isPMOSOn ? "#86efac" : "#fca5a5"}
                fontSize="15"
                fontWeight="900"
              >
                (PULL-UP)
              </text>
              <text
                x="525"
                y="226"
                fill={isPMOSOn ? "#22c55e" : "#ef4444"}
                fontSize="19"
                fontWeight="900"
              >
                {analysis.pmosState}
              </text>

              {/* Output node */}
              <line
                x1="452"
                y1="245"
                x2="452"
                y2="330"
                stroke="#fbbf24"
                strokeWidth="5"
              />
              <circle
                cx="452"
                cy="330"
                r="11"
                fill="#fbbf24"
                filter="url(#nodeGlow)"
              />
              <line
                x1="452"
                y1="330"
                x2="615"
                y2="330"
                stroke="#fbbf24"
                strokeWidth="5"
              />
              <circle cx="615" cy="330" r="10" fill="#fbbf24" />
              <text
                x="635"
                y="334"
                fill="#fbbf24"
                fontSize="20"
                fontWeight="900"
              >
                OUTPUT
              </text>
              <text
                x="635"
                y="365"
                fill="#fbbf24"
                fontSize="18"
                fontWeight="900"
              >
                Vout = {formatNumber(analysis.vout)}V
              </text>

              {/* NMOS device */}
              <rect
                x="395"
                y="385"
                width="115"
                height="100"
                rx="13"
                fill={isNMOSOn ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.12)"}
                stroke={isNMOSOn ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                filter="url(#nmosGlow)"
              />

              {/* NMOS symbol inside */}
              <line
                x1="422"
                y1="405"
                x2="422"
                y2="463"
                stroke={isNMOSOn ? "#22c55e" : "#ef4444"}
                strokeWidth="4"
              />
              <line
                x1="438"
                y1="403"
                x2="438"
                y2="465"
                stroke={isNMOSOn ? "#22c55e" : "#ef4444"}
                strokeWidth="4"
              />
              <path
                d="M438 416 H452 V385"
                fill="none"
                stroke={isNMOSOn ? "#22c55e" : "#ef4444"}
                strokeWidth="4"
              />
              <path
                d="M438 454 H452 V485"
                fill="none"
                stroke={isNMOSOn ? "#22c55e" : "#ef4444"}
                strokeWidth="4"
              />

              <text
                x="525"
                y="414"
                fill={isNMOSOn ? "#22c55e" : "#ef4444"}
                fontSize="19"
                fontWeight="900"
              >
                nMOS
              </text>
              <text
                x="525"
                y="442"
                fill={isNMOSOn ? "#86efac" : "#fca5a5"}
                fontSize="15"
                fontWeight="900"
              >
                (PULL-DOWN)
              </text>
              <text
                x="525"
                y="470"
                fill={isNMOSOn ? "#22c55e" : "#ef4444"}
                fontSize="19"
                fontWeight="900"
              >
                {analysis.nmosState}
              </text>

              {/* Output to NMOS and GND */}
              <line
                x1="452"
                y1="330"
                x2="452"
                y2="385"
                stroke="#fbbf24"
                strokeWidth="5"
              />
              <line
                x1="452"
                y1="485"
                x2="452"
                y2="555"
                stroke="#ef4444"
                strokeWidth="5"
              />
              <circle cx="452" cy="555" r="9" fill="#ef4444" />

              {/* Ground symbol */}
              <line x1="428" y1="585" x2="476" y2="585" stroke="#ef4444" strokeWidth="4" />
              <line x1="435" y1="598" x2="469" y2="598" stroke="#ef4444" strokeWidth="4" />
              <line x1="443" y1="611" x2="461" y2="611" stroke="#ef4444" strokeWidth="4" />
              <text
                x="452"
                y="638"
                textAnchor="middle"
                fill="#f87171"
                fontSize="18"
                fontWeight="900"
              >
                GND (0V)
              </text>

              {/* Load capacitor */}
              <rect
                x="740"
                y="350"
                width="95"
                height="125"
                rx="13"
                fill="rgba(15,23,42,0.48)"
                stroke="rgba(148,163,184,0.42)"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
              <line x1="615" y1="330" x2="788" y2="330" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 8" />
              <line x1="788" y1="350" x2="788" y2="475" stroke="#94a3b8" strokeWidth="3" />
              <line x1="768" y1="402" x2="808" y2="402" stroke="#93c5fd" strokeWidth="4" />
              <line x1="768" y1="424" x2="808" y2="424" stroke="#93c5fd" strokeWidth="4" />
              <circle cx="788" cy="488" r="7" fill="#94a3b8" />
              <text x="818" y="414" fill="#cbd5e1" fontSize="18" fontWeight="900">
                CL
              </text>
              <text x="818" y="440" fill="#93c5fd" fontSize="15" fontWeight="800">
                10 fF
              </text>

              {/* Legend */}
              <foreignObject x="35" y="440" width="190" height="175">
                <div
                  style={{
                    height: "100%",
                    boxSizing: "border-box",
                    padding: "16px",
                    borderRadius: 14,
                    background: "rgba(15,23,42,0.76)",
                    border: "1px solid rgba(148,163,184,0.25)"
                  }}
                >
                  <div style={{ color: "#f8fafc", fontWeight: 900, marginBottom: 12 }}>
                    Legend
                  </div>
                  <LegendRow color="#60a5fa" label="Power (VDD)" />
                  <LegendRow color="#22c55e" label="Pull-Up (pMOS)" />
                  <LegendRow color="#ef4444" label="Pull-Down (nMOS)" />
                  <LegendRow color="#a855f7" label="Input (Vin)" />
                  <LegendRow color="#fbbf24" label="Output (Vout)" />
                  <LegendRow color="#94a3b8" label="Load Capacitance" />
                </div>
              </foreignObject>

              {/* Tip */}
              <rect
                x="30"
                y="610"
                width="600"
                height="34"
                rx="12"
                fill="rgba(15,23,42,0.76)"
                stroke="rgba(56,189,248,0.22)"
              />
              <text x="55" y="632" fill="#cbd5e1" fontSize="14" fontWeight="700">
                Tip: Vin drives both transistor gates. One pulls HIGH while the other pulls LOW.
              </text>
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title="Operating Conditions" icon={<Cpu size={18} />}>
            <InfoLine label="Vin" value={`${formatNumber(vin)} V`} color="#c084fc" />
            <InfoLine label="VDD" value={`${formatNumber(vdd)} V`} color="#38bdf8" />
            <InfoLine label="Vout" value={`${formatNumber(analysis.vout)} V`} color="#fbbf24" />
            <InfoLine label="Region" value={analysis.regionLabel} />
            <InfoLine
              label="nMOS State"
              value={analysis.nmosState}
              color={isNMOSOn ? "#22c55e" : "#ef4444"}
            />
            <InfoLine
              label="pMOS State"
              value={analysis.pmosState}
              color={isPMOSOn ? "#22c55e" : "#ef4444"}
            />
            <InfoLine label="Current Path" value={analysis.conductingPath} />
          </Panel>

          <Panel title="State Indicator" icon={<Activity size={18} />}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12
              }}
            >
              <StateBox
                title="pMOS"
                state={analysis.pmosState}
                active={isPMOSOn}
                text="Conducts when Vin is LOW"
              />
              <StateBox
                title="nMOS"
                state={analysis.nmosState}
                active={isNMOSOn}
                text="Conducts when Vin is HIGH"
              />
            </div>
          </Panel>

          <Panel title="Digital Logic View" icon={<Zap size={18} />}>
            <div style={{ overflowX: "auto" }}>
              <table className="dbms-table">
                <thead>
                  <tr>
                    <th>Vin</th>
                    <th>Vout</th>
                    <th>Relation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: "#c084fc" }}>{inputLogic}</td>
                    <td style={{ color: "#22c55e" }}>{outputLogic}</td>
                    <td>NOT Gate</td>
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

function StateBox({ title, state, active, text }) {
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
          fontSize: 16
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: active ? "#22c55e" : "#ef4444",
          fontWeight: 900,
          fontSize: 25,
          marginTop: 6
        }}
      >
        {state}
      </div>
      <div style={{ color: "#cbd5e1", fontSize: 13, marginTop: 8 }}>{text}</div>
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