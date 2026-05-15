import React from "react";

import {
  CircuitBoard,
  Cpu,
  Activity,
  Zap,
  Lightbulb
} from "lucide-react";

export default function DVLSITransmissionGateCircuits({
  inputSignal,
  control,
  mode,
  analysis
}) {
  const isTG =
    mode ===
    "transmission-gate";

  const isNMOSOn =
    analysis.nmosState ===
    "ON";

  const isPMOSOn =
    analysis.pmosState ===
    "ON";

  return (
    <section className="comparison-shell">
      <div
        className="sorting-sim-title-wrap"
        style={{
          marginBottom: 18
        }}
      >
        <div className="sorting-sim-icon">
          <CircuitBoard
            size={18}
          />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Circuit View
          </h2>

          <p className="sorting-sim-subtitle">
            Visualize transmission
            gate conduction and
            single pass transistor
            switching paths.
          </p>
        </div>
      </div>

      <div
        className="sorting-info-box"
        style={{
          marginBottom: 16
        }}
      >
        {analysis.currentPath}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 2.2fr) minmax(300px, 0.9fr)",
          gap: 20
        }}
      >
        <div
          className="overview-card"
          style={{
            padding: 0,
            overflow:
              "hidden",
            minHeight: 620
          }}
        >
          <div
            style={{
              position:
                "relative",
              minHeight: 620,
              background:
                "radial-gradient(circle at 25% 18%, rgba(56,189,248,0.10), transparent 35%), radial-gradient(circle at 82% 78%, rgba(139,92,246,0.12), transparent 38%), linear-gradient(135deg, #020617, #08111f)"
            }}
          >
            <svg
              width="100%"
              height="620"
              viewBox="0 0 900 620"
              preserveAspectRatio="xMidYMid meet"
            >
              <line
                x1="120"
                y1="310"
                x2="760"
                y2="310"
                stroke="#fbbf24"
                strokeWidth="5"
              />

              <circle
                cx="180"
                cy="310"
                r="10"
                fill="#fbbf24"
              />

              <circle
                cx="700"
                cy="310"
                r="10"
                fill="#fbbf24"
              />

              <text
                x="70"
                y="316"
                fill="#fcd34d"
                fontSize="20"
                fontWeight="900"
              >
                IN ={" "}
                {inputSignal}
              </text>

              <text
                x="730"
                y="316"
                fill="#fcd34d"
                fontSize="20"
                fontWeight="900"
              >
                OUT ={" "}
                {
                  analysis.output
                }
              </text>

              {isTG ? (
                <>
                  <rect
                    x="360"
                    y="180"
                    width="120"
                    height="80"
                    rx="14"
                    fill={
                      isNMOSOn
                        ? "rgba(34,197,94,0.18)"
                        : "rgba(239,68,68,0.12)"
                    }
                    stroke={
                      isNMOSOn
                        ? "#22c55e"
                        : "#ef4444"
                    }
                    strokeWidth="3"
                  />

                  <text
                    x="420"
                    y="225"
                    textAnchor="middle"
                    fill="#e5e7eb"
                    fontSize="22"
                    fontWeight="900"
                  >
                    nMOS
                  </text>

                  <rect
                    x="360"
                    y="360"
                    width="120"
                    height="80"
                    rx="14"
                    fill={
                      isPMOSOn
                        ? "rgba(34,197,94,0.18)"
                        : "rgba(239,68,68,0.12)"
                    }
                    stroke={
                      isPMOSOn
                        ? "#22c55e"
                        : "#ef4444"
                    }
                    strokeWidth="3"
                  />

                  <text
                    x="420"
                    y="405"
                    textAnchor="middle"
                    fill="#e5e7eb"
                    fontSize="22"
                    fontWeight="900"
                  >
                    pMOS
                  </text>

                  <line
                    x1="290"
                    y1="310"
                    x2="360"
                    y2="220"
                    stroke="#fbbf24"
                    strokeWidth="5"
                  />

                  <line
                    x1="480"
                    y1="220"
                    x2="550"
                    y2="310"
                    stroke="#fbbf24"
                    strokeWidth="5"
                  />

                  <line
                    x1="290"
                    y1="310"
                    x2="360"
                    y2="400"
                    stroke="#fbbf24"
                    strokeWidth="5"
                  />

                  <line
                    x1="480"
                    y1="400"
                    x2="550"
                    y2="310"
                    stroke="#fbbf24"
                    strokeWidth="5"
                  />

                  <text
                    x="120"
                    y="130"
                    fill="#d8b4fe"
                    fontSize="20"
                    fontWeight="900"
                  >
                    C ={" "}
                    {control}
                  </text>

                  <line
                    x1="180"
                    y1="125"
                    x2="360"
                    y2="125"
                    stroke="#c084fc"
                    strokeWidth="5"
                  />

                  <line
                    x1="360"
                    y1="125"
                    x2="360"
                    y2="180"
                    stroke="#c084fc"
                    strokeWidth="5"
                  />

                  <text
                    x="650"
                    y="520"
                    fill="#f9a8d4"
                    fontSize="20"
                    fontWeight="900"
                  >
                    C̅ ={" "}
                    {
                      analysis.controlBar
                    }
                  </text>

                  <line
                    x1="600"
                    y1="510"
                    x2="480"
                    y2="510"
                    stroke="#f9a8d4"
                    strokeWidth="5"
                  />

                  <line
                    x1="480"
                    y1="440"
                    x2="480"
                    y2="510"
                    stroke="#f9a8d4"
                    strokeWidth="5"
                  />
                </>
              ) : (
                <>
                  <rect
                    x="370"
                    y="270"
                    width="120"
                    height="80"
                    rx="14"
                    fill={
                      isNMOSOn
                        ? "rgba(34,197,94,0.18)"
                        : "rgba(239,68,68,0.12)"
                    }
                    stroke={
                      isNMOSOn
                        ? "#22c55e"
                        : "#ef4444"
                    }
                    strokeWidth="3"
                  />

                  <text
                    x="430"
                    y="316"
                    textAnchor="middle"
                    fill="#e5e7eb"
                    fontSize="22"
                    fontWeight="900"
                  >
                    nMOS
                  </text>

                  <text
                    x="120"
                    y="150"
                    fill="#d8b4fe"
                    fontSize="20"
                    fontWeight="900"
                  >
                    C ={" "}
                    {control}
                  </text>

                  <line
                    x1="180"
                    y1="145"
                    x2="370"
                    y2="145"
                    stroke="#c084fc"
                    strokeWidth="5"
                  />

                  <line
                    x1="370"
                    y1="145"
                    x2="370"
                    y2="270"
                    stroke="#c084fc"
                    strokeWidth="5"
                  />
                </>
              )}
            </svg>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: 16
          }}
        >
          <Panel
            title="Operating Conditions"
            icon={
              <Cpu size={18} />
            }
          >
            <InfoLine
              label="Mode"
              value={
                isTG
                  ? "Transmission Gate"
                  : "Single nMOS"
              }
            />

            <InfoLine
              label="Input"
              value={
                inputSignal
              }
              color="#fbbf24"
            />

            <InfoLine
              label="Control"
              value={control}
              color="#c084fc"
            />

            <InfoLine
              label="Output"
              value={
                analysis.output
              }
              color="#22c55e"
            />

            <InfoLine
              label="Logic Case"
              value={
                analysis.logicCase
              }
            />
          </Panel>

          <Panel
            title="Transistor States"
            icon={
              <Activity
                size={18}
              />
            }
          >
            <StateBox
              title="nMOS"
              state={
                analysis.nmosState
              }
              active={
                isNMOSOn
              }
              text="Conducts when control = 1"
            />

            {isTG && (
              <div
                style={{
                  marginTop: 14
                }}
              >
                <StateBox
                  title="pMOS"
                  state={
                    analysis.pmosState
                  }
                  active={
                    isPMOSOn
                  }
                  text="Conducts when complementary control = 0"
                />
              </div>
            )}
          </Panel>

          <Panel
            title="Circuit Interpretation"
            icon={
              <Lightbulb
                size={18}
              />
            }
          >
            <p
              style={{
                margin: 0,
                color:
                  "#cbd5e1",
                lineHeight: 1.7
              }}
            >
              {analysis.note}
            </p>
          </Panel>

          <Panel
            title="Key Insight"
            icon={
              <Zap size={18} />
            }
          >
            <p
              style={{
                margin: 0,
                color:
                  "#cbd5e1",
                lineHeight: 1.7
              }}
            >
              {isTG
                ? "Transmission gates pass both logic levels efficiently because both transistor types conduct together."
                : "A single nMOS pass transistor passes logic LOW strongly but suffers threshold loss while passing logic HIGH."}
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
  active,
  text
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding:
          "14px 12px",
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
          fontSize: 25,
          marginTop: 6
        }}
      >
        {state}
      </div>

      <div
        style={{
          color: "#cbd5e1",
          fontSize: 13,
          marginTop: 8
        }}
      >
        {text}
      </div>
    </div>
  );
}