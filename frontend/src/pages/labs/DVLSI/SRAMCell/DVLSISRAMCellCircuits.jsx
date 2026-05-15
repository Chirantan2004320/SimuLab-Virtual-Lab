import React from "react";

import {
  Cpu,
  Activity,
  Database,
  Workflow,
  ShieldCheck
} from "lucide-react";

function transistorStyle(
  state
) {
  const active =
    state === "ON";

  return {
    border: active
      ? "2px solid #22c55e"
      : "2px solid #ef4444",

    background: active
      ? "rgba(34,197,94,0.16)"
      : "rgba(239,68,68,0.12)",

    color: "#e5e7eb",

    borderRadius: "16px",

    padding: "16px",

    minWidth: "120px",

    textAlign: "center",

    boxShadow: active
      ? "0 0 18px rgba(34,197,94,0.25)"
      : "0 0 10px rgba(239,68,68,0.12)"
  };
}

export default function DVLSISRAMCellCircuits({
  bitline,
  bitlineBar,
  wordline,
  operation,
  analysis
}) {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>

          <div>
            <h2 className="sorting-sim-title">
              Circuits
            </h2>

            <p className="sorting-sim-subtitle">
              Visualize the 6T
              SRAM cell
              structure,
              bitline access,
              and
              cross-coupled
              inverter storage
              loop.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        A standard SRAM cell
        uses two
        cross-coupled CMOS
        inverters and two
        access transistors
        controlled by the
        wordline.
      </div>

      <div
        className="overview-grid"
        style={{
          marginTop: 18,
          marginBottom: 18
        }}
      >
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>
              Operation
            </h4>
          </div>

          <p>
            {
              analysis.logicCase
            }
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Database
              size={18}
            />
            <h4>
              Stored Data
            </h4>
          </div>

          <p>
            Q ={" "}
            {analysis.q} |
            Q̅ ={" "}
            {
              analysis.qBar
            }
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Workflow
              size={18}
            />
            <h4>
              Wordline
            </h4>
          </div>

          <p>
            WL ={" "}
            {wordline}
          </p>
        </div>
      </div>

      <div className="coding-card-upgraded">
        <div className="coding-card-header">
          <div>
            <h3>
              6T SRAM Cell
              Visualization
            </h3>

            <p>
              Cross-coupled
              inverter loop
              with dual access
              transistors.
            </p>
          </div>
        </div>

        <div
          style={{
            position:
              "relative",
            height: "520px",
            borderRadius:
              "18px",
            border:
              "1px solid rgba(148,163,184,0.15)",
            background:
              "linear-gradient(180deg, #111827, #0b1220)",
            overflow:
              "hidden"
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 760 520"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Bitlines */}
            <line
              x1="170"
              y1="40"
              x2="170"
              y2="470"
              stroke="#38bdf8"
              strokeWidth="4"
            />

            <line
              x1="590"
              y1="40"
              x2="590"
              y2="470"
              stroke="#38bdf8"
              strokeWidth="4"
            />

            {/* Wordline */}
            <line
              x1="80"
              y1="260"
              x2="680"
              y2="260"
              stroke="#f59e0b"
              strokeWidth="4"
            />

            {/* Access transistors */}
            <rect
              x="230"
              y="228"
              width="70"
              height="64"
              rx="12"
              fill={
                analysis.accessLeft ===
                "ON"
                  ? "rgba(34,197,94,0.18)"
                  : "rgba(239,68,68,0.12)"
              }
              stroke={
                analysis.accessLeft ===
                "ON"
                  ? "#22c55e"
                  : "#ef4444"
              }
              strokeWidth="3"
            />

            <rect
              x="460"
              y="228"
              width="70"
              height="64"
              rx="12"
              fill={
                analysis.accessRight ===
                "ON"
                  ? "rgba(34,197,94,0.18)"
                  : "rgba(239,68,68,0.12)"
              }
              stroke={
                analysis.accessRight ===
                "ON"
                  ? "#22c55e"
                  : "#ef4444"
              }
              strokeWidth="3"
            />

            {/* Internal loop */}
            <line
              x1="340"
              y1="180"
              x2="430"
              y2="180"
              stroke="#c084fc"
              strokeWidth="4"
            />

            <line
              x1="430"
              y1="180"
              x2="430"
              y2="340"
              stroke="#c084fc"
              strokeWidth="4"
            />

            <line
              x1="430"
              y1="340"
              x2="340"
              y2="340"
              stroke="#c084fc"
              strokeWidth="4"
            />

            <line
              x1="340"
              y1="340"
              x2="340"
              y2="180"
              stroke="#c084fc"
              strokeWidth="4"
            />

            {/* Internal nodes */}
            <circle
              cx="340"
              cy="180"
              r="8"
              fill="#22c55e"
            />

            <circle
              cx="430"
              cy="340"
              r="8"
              fill="#ef4444"
            />

            {/* Connections */}
            <line
              x1="170"
              y1="260"
              x2="230"
              y2="260"
              stroke="#38bdf8"
              strokeWidth="4"
            />

            <line
              x1="300"
              y1="260"
              x2="340"
              y2="180"
              stroke="#fbbf24"
              strokeWidth="4"
            />

            <line
              x1="460"
              y1="260"
              x2="430"
              y2="340"
              stroke="#fbbf24"
              strokeWidth="4"
            />

            <line
              x1="530"
              y1="260"
              x2="590"
              y2="260"
              stroke="#38bdf8"
              strokeWidth="4"
            />

            {/* Labels */}
            <text
              x="130"
              y="30"
              fill="#7dd3fc"
              fontSize="18"
              fontWeight="bold"
            >
              BL ={" "}
              {bitline}
            </text>

            <text
              x="540"
              y="30"
              fill="#7dd3fc"
              fontSize="18"
              fontWeight="bold"
            >
              BL̅ ={" "}
              {
                bitlineBar
              }
            </text>

            <text
              x="25"
              y="265"
              fill="#fcd34d"
              fontSize="18"
              fontWeight="bold"
            >
              WL ={" "}
              {wordline}
            </text>

            <text
              x="305"
              y="160"
              fill="#86efac"
              fontSize="18"
              fontWeight="bold"
            >
              Q ={" "}
              {analysis.q}
            </text>

            <text
              x="405"
              y="370"
              fill="#fca5a5"
              fontSize="18"
              fontWeight="bold"
            >
              Q̅ ={" "}
              {
                analysis.qBar
              }
            </text>

            <text
              x="265"
              y="268"
              textAnchor="middle"
              fill="#e5e7eb"
              fontSize="14"
            >
              AX-L
            </text>

            <text
              x="495"
              y="268"
              textAnchor="middle"
              fill="#e5e7eb"
              fontSize="14"
            >
              AX-R
            </text>
          </svg>
        </div>
      </div>

      <div
        className="overview-grid"
        style={{
          marginTop: 18
        }}
      >
        <div
          style={transistorStyle(
            analysis.accessLeft
          )}
        >
          <strong>
            Access Left
          </strong>

          <div
            style={{
              marginTop: 8
            }}
          >
            {
              analysis.accessLeft
            }
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize:
                "13px",
              color:
                "#cbd5e1"
            }}
          >
            Controlled by
            WL
          </div>
        </div>

        <div
          style={transistorStyle(
            analysis.accessRight
          )}
        >
          <strong>
            Access Right
          </strong>

          <div
            style={{
              marginTop: 8
            }}
          >
            {
              analysis.accessRight
            }
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize:
                "13px",
              color:
                "#cbd5e1"
            }}
          >
            Controlled by
            WL
          </div>
        </div>
      </div>

      <div
        className="overview-card"
        style={{
          marginTop: 18
        }}
      >
        <div className="overview-card-head">
          <ShieldCheck
            size={18}
          />

          <h4>
            Circuit Insight
          </h4>
        </div>

        <p>
          The regenerative
          feedback loop formed
          by the two CMOS
          inverters preserves
          the stored bit,
          while the wordline
          selectively connects
          the cell to the
          external bitline
          pair.
        </p>
      </div>
    </section>
  );
}