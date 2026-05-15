import React from "react";

import {
  CircuitBoard,
  Cpu,
  Activity,
  Waves
} from "lucide-react";

export default function DVLSIRingOscillatorCircuits({
  stages,
  enabled,
  analysis
}) {
  const inverterPositions = [];

  const centerX = 380;
  const centerY = 220;
  const radius = 135;

  for (
    let i = 0;
    i < stages;
    i++
  ) {
    const angle =
      (2 * Math.PI * i) /
        stages -
      Math.PI / 2;

    inverterPositions.push({
      x:
        centerX +
        radius *
          Math.cos(angle),

      y:
        centerY +
        radius *
          Math.sin(angle)
    });
  }

  return (
    <section className="sorting-simulation-shell">
      <div className="sorting-sim-title-wrap">
        <div className="sorting-sim-icon">
          <CircuitBoard
            size={18}
          />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Ring Oscillator
            Circuit
          </h2>

          <p className="sorting-sim-subtitle">
            Visualize the inverter
            feedback loop and study
            how odd-stage feedback
            creates continuous
            oscillation.
          </p>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-card">
          <div className="sorting-stat-icon blue">
            <Cpu size={18} />
          </div>

          <div>
            <div className="sorting-stat-label">
              Stages
            </div>

            <div className="sorting-stat-value">
              {stages}
            </div>
          </div>
        </div>

        <div className="sorting-stat-card">
          <div className="sorting-stat-icon orange">
            <Activity
              size={18}
            />
          </div>

          <div>
            <div className="sorting-stat-label">
              Enabled
            </div>

            <div className="sorting-stat-value">
              {enabled
                ? "YES"
                : "NO"}
            </div>
          </div>
        </div>

        <div className="sorting-stat-card">
          <div className="sorting-stat-icon green">
            <Waves size={18} />
          </div>

          <div>
            <div className="sorting-stat-label">
              Oscillation
            </div>

            <div className="sorting-stat-value">
              {analysis.oscillates
                ? "ACTIVE"
                : "STOPPED"}
            </div>
          </div>
        </div>
      </div>

      <div className="sorting-visual-card">
        <div className="sorting-visual-header">
          <h3>
            Inverter Feedback Loop
          </h3>
        </div>

        <div className="sorting-canvas-wrap">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 760 460"
            preserveAspectRatio="xMidYMid meet"
          >
            {inverterPositions.map(
              (
                pos,
                index
              ) => {
                const next =
                  inverterPositions[
                    (index + 1) %
                      inverterPositions.length
                  ];

                return (
                  <line
                    key={`line-${index}`}
                    x1={pos.x}
                    y1={pos.y}
                    x2={next.x}
                    y2={next.y}
                    stroke={
                      analysis.oscillates
                        ? "#22c55e"
                        : "#64748b"
                    }
                    strokeWidth="4"
                    opacity="0.85"
                  />
                );
              }
            )}

            {inverterPositions.map(
              (
                pos,
                index
              ) => (
                <g
                  key={`inv-${index}`}
                >
                  <rect
                    x={
                      pos.x - 40
                    }
                    y={
                      pos.y - 26
                    }
                    width="80"
                    height="52"
                    rx="12"
                    fill={
                      analysis.oscillates
                        ? "rgba(34,197,94,0.18)"
                        : "rgba(148,163,184,0.14)"
                    }
                    stroke={
                      analysis.oscillates
                        ? "#22c55e"
                        : "#94a3b8"
                    }
                    strokeWidth="2.5"
                  />

                  <text
                    x={pos.x}
                    y={
                      pos.y + 6
                    }
                    textAnchor="middle"
                    fill="#e5e7eb"
                    fontSize="15"
                    fontWeight="700"
                  >
                    INV
                    {index + 1}
                  </text>
                </g>
              )
            )}

            <circle
              cx="380"
              cy="220"
              r="58"
              fill="rgba(15,23,42,0.8)"
              stroke="#334155"
              strokeWidth="2"
            />

            <text
              x="380"
              y="210"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="18"
              fontWeight="800"
            >
              {analysis.oscillates
                ? "OSCILLATING"
                : "STABLE"}
            </text>

            <text
              x="380"
              y="236"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="13"
            >
              {analysis.logicCase}
            </text>
          </svg>
        </div>
      </div>

      <div className="sorting-info-panel">
        <h3>
          Circuit Insight
        </h3>

        <p>
          The inverter chain forms
          a closed feedback loop.
          An odd number of
          inversions prevents the
          loop from reaching a
          stable logic state,
          causing the signal to
          continuously toggle
          because of propagation
          delay.
        </p>
      </div>

      <div className="sorting-conclusion-box">
        <strong>
          Key Insight:
        </strong>{" "}
        Even-stage feedback loops
        settle to a fixed state,
        while odd-stage loops
        oscillate due to inversion
        mismatch and delay.
      </div>
    </section>
  );
}