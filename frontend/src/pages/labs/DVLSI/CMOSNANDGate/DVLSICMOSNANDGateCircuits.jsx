import React from "react";
import {
  CircuitBoard,
  Cpu,
  Activity,
  Zap,
  Lightbulb
} from "lucide-react";

export default function DVLSICMOSNANDGateCircuits({
  A,
  B,
  analysis
}) {
  const isPMOSAOn =
    analysis.pmosA === "ON";

  const isPMOSBOn =
    analysis.pmosB === "ON";

  const isNMOSAOn =
    analysis.nmosA === "ON";

  const isNMOSBOn =
    analysis.nmosB === "ON";

  return (
    <section className="comparison-shell">
      <div
        className="sorting-sim-title-wrap"
        style={{ marginBottom: 18 }}
      >
        <div className="sorting-sim-icon">
          <CircuitBoard size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            CMOS NAND Circuit View
          </h2>

          <p className="sorting-sim-subtitle">
            Visualize pull-up and
            pull-down operation in CMOS
            NAND gate.
          </p>
        </div>
      </div>

      <div
        className="sorting-info-box"
        style={{ marginBottom: 16 }}
      >
        {analysis.conductingPath}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 2.2fr) minmax(300px, 0.85fr)",
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
            <svg
              width="100%"
              height="650"
              viewBox="0 0 900 650"
            >
              {/* VDD */}
              <text
                x="450"
                y="45"
                textAnchor="middle"
                fill="#60a5fa"
                fontSize="22"
                fontWeight="900"
              >
                VDD
              </text>

              <line
                x1="450"
                y1="60"
                x2="450"
                y2="120"
                stroke="#60a5fa"
                strokeWidth="5"
              />

              {/* PMOS A */}
              <rect
                x="280"
                y="120"
                width="120"
                height="80"
                rx="12"
                fill={
                  isPMOSAOn
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(239,68,68,0.12)"
                }
                stroke={
                  isPMOSAOn
                    ? "#22c55e"
                    : "#ef4444"
                }
                strokeWidth="3"
              />

              <text
                x="340"
                y="155"
                textAnchor="middle"
                fill="#fff"
                fontSize="18"
                fontWeight="900"
              >
                pMOS A
              </text>

              <text
                x="340"
                y="182"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="14"
              >
                {analysis.pmosA}
              </text>

              {/* PMOS B */}
              <rect
                x="500"
                y="120"
                width="120"
                height="80"
                rx="12"
                fill={
                  isPMOSBOn
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(239,68,68,0.12)"
                }
                stroke={
                  isPMOSBOn
                    ? "#22c55e"
                    : "#ef4444"
                }
                strokeWidth="3"
              />

              <text
                x="560"
                y="155"
                textAnchor="middle"
                fill="#fff"
                fontSize="18"
                fontWeight="900"
              >
                pMOS B
              </text>

              <text
                x="560"
                y="182"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="14"
              >
                {analysis.pmosB}
              </text>

              {/* Output */}
              <line
                x1="340"
                y1="200"
                x2="560"
                y2="200"
                stroke="#fbbf24"
                strokeWidth="5"
              />

              <line
                x1="450"
                y1="200"
                x2="450"
                y2="280"
                stroke="#fbbf24"
                strokeWidth="5"
              />

              <circle
                cx="450"
                cy="200"
                r="10"
                fill="#fbbf24"
              />

              <text
                x="610"
                y="205"
                fill="#fbbf24"
                fontSize="20"
                fontWeight="900"
              >
                Y = {analysis.output}
              </text>

              {/* NMOS A */}
              <rect
                x="390"
                y="280"
                width="120"
                height="80"
                rx="12"
                fill={
                  isNMOSAOn
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(239,68,68,0.12)"
                }
                stroke={
                  isNMOSAOn
                    ? "#22c55e"
                    : "#ef4444"
                }
                strokeWidth="3"
              />

              <text
                x="450"
                y="315"
                textAnchor="middle"
                fill="#fff"
                fontSize="18"
                fontWeight="900"
              >
                nMOS A
              </text>

              <text
                x="450"
                y="342"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="14"
              >
                {analysis.nmosA}
              </text>

              {/* NMOS B */}
              <rect
                x="390"
                y="390"
                width="120"
                height="80"
                rx="12"
                fill={
                  isNMOSBOn
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(239,68,68,0.12)"
                }
                stroke={
                  isNMOSBOn
                    ? "#22c55e"
                    : "#ef4444"
                }
                strokeWidth="3"
              />

              <text
                x="450"
                y="425"
                textAnchor="middle"
                fill="#fff"
                fontSize="18"
                fontWeight="900"
              >
                nMOS B
              </text>

              <text
                x="450"
                y="452"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="14"
              >
                {analysis.nmosB}
              </text>

              {/* Series line */}
              <line
                x1="450"
                y1="360"
                x2="450"
                y2="390"
                stroke="#fbbf24"
                strokeWidth="5"
              />

              <line
                x1="450"
                y1="470"
                x2="450"
                y2="560"
                stroke="#ef4444"
                strokeWidth="5"
              />

              <text
                x="450"
                y="600"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="22"
                fontWeight="900"
              >
                GND
              </text>

              {/* Inputs */}
              <text
                x="120"
                y="160"
                fill="#c084fc"
                fontSize="20"
                fontWeight="900"
              >
                A = {A}
              </text>

              <line
                x1="150"
                y1="160"
                x2="280"
                y2="160"
                stroke="#c084fc"
                strokeWidth="4"
              />

              <line
                x1="150"
                y1="320"
                x2="390"
                y2="320"
                stroke="#c084fc"
                strokeWidth="4"
              />

              <text
                x="720"
                y="160"
                fill="#f9a8d4"
                fontSize="20"
                fontWeight="900"
              >
                B = {B}
              </text>

              <line
                x1="690"
                y1="160"
                x2="620"
                y2="160"
                stroke="#f9a8d4"
                strokeWidth="4"
              />

              <line
                x1="690"
                y1="430"
                x2="510"
                y2="430"
                stroke="#f9a8d4"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          <Panel
            title="Operating Conditions"
            icon={<Cpu size={18} />}
          >
            <InfoLine
              label="Input A"
              value={A}
            />

            <InfoLine
              label="Input B"
              value={B}
            />

            <InfoLine
              label="Output Y"
              value={analysis.output}
              color="#fbbf24"
            />

            <InfoLine
              label="Region"
              value={analysis.regionLabel}
            />

            <InfoLine
              label="Current Path"
              value={analysis.conductingPath}
            />
          </Panel>

          <Panel
            title="State Indicator"
            icon={<Activity size={18} />}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
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

          <Panel
            title="Truth Table"
            icon={<Zap size={18} />}
          >
            <table className="dbms-table">
              <thead>
                <tr>
                  <th>A</th>
                  <th>B</th>
                  <th>Y</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>0</td>
                  <td>0</td>
                  <td>1</td>
                </tr>

                <tr>
                  <td>0</td>
                  <td>1</td>
                  <td>1</td>
                </tr>

                <tr>
                  <td>1</td>
                  <td>0</td>
                  <td>1</td>
                </tr>

                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </Panel>

          <Panel
            title="Circuit Interpretation"
            icon={<Lightbulb size={18} />}
          >
            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.7
              }}
            >
              {analysis.note}
            </p>
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({
  title,
  icon,
  children
}) {
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

function InfoLine({
  label,
  value,
  color = "#e5e7eb"
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "1fr auto",
        gap: 12,
        padding: "8px 0",
        borderBottom:
          "1px solid rgba(148,163,184,0.12)"
      }}
    >
      <span
        style={{
          color: "#cbd5e1",
          fontWeight: 700
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color,
          textAlign: "right"
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function StateBox({
  title,
  state,
  active
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: "14px 12px",
        textAlign: "center",
        background: active
          ? "rgba(34,197,94,0.13)"
          : "rgba(239,68,68,0.12)",
        border: `1px solid ${
          active
            ? "#22c55e"
            : "#ef4444"
        }88`
      }}
    >
      <div
        style={{
          color: active
            ? "#22c55e"
            : "#ef4444",
          fontWeight: 900,
          fontSize: 16
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: active
            ? "#22c55e"
            : "#ef4444",
          fontWeight: 900,
          fontSize: 24,
          marginTop: 8
        }}
      >
        {state}
      </div>
    </div>
  );
}