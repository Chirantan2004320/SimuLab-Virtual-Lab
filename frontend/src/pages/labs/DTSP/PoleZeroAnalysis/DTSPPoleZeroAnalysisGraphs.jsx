import React from "react";

function magnitude(z) {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

function formatComplex(z, digits = 2) {
  const re = Math.abs(z.re) < 1e-10 ? 0 : z.re;
  const im = Math.abs(z.im) < 1e-10 ? 0 : z.im;

  const reStr = re.toFixed(digits);
  const imStr = Math.abs(im).toFixed(digits);

  if (im === 0) return `${reStr}`;
  return `${reStr} ${im >= 0 ? "+" : "-"} j${imStr}`;
}

function getStabilityText(poles) {
  if (!poles.length) return "No poles available for stability analysis.";

  const mags = poles.map(magnitude);

  if (mags.every((m) => m < 1)) {
    return "Stable: all poles lie inside the unit circle.";
  }

  if (mags.some((m) => m > 1)) {
    return "Unstable: at least one pole lies outside the unit circle.";
  }

  return "Marginally stable: one or more poles lie on the unit circle.";
}

export default function DTSPPoleZeroAnalysisGraphs({ zeros, poles }) {
  const width = 700;
  const height = 420;
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = 110; // 1 unit in z-plane = 110 px

  const axisTicks = [-2, -1, 0, 1, 2];
  const stabilityText = getStabilityText(poles);

  return (
    <section className="card experiment">
      <h2>Z-Plane Visualization</h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "420px",
          background: "#020617",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(56,189,248,0.25)"
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "420px", display: "block" }}
        >
          {/* Background */}
          <rect x="0" y="0" width={width} height={height} fill="#020617" />

          {/* Grid */}
          {axisTicks.map((tick) => (
            <React.Fragment key={`grid-${tick}`}>
              <line
                x1={centerX + tick * scale}
                y1="0"
                x2={centerX + tick * scale}
                y2={height}
                stroke="rgba(148,163,184,0.15)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1={centerY - tick * scale}
                x2={width}
                y2={centerY - tick * scale}
                stroke="rgba(148,163,184,0.15)"
                strokeWidth="1"
              />
            </React.Fragment>
          ))}

          {/* Real axis */}
          <line
            x1="0"
            y1={centerY}
            x2={width}
            y2={centerY}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Imag axis */}
          <line
            x1={centerX}
            y1="0"
            x2={centerX}
            y2={height}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Unit Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={scale}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />

          {/* Tick labels */}
          {axisTicks.map((tick) => (
            <React.Fragment key={`label-${tick}`}>
              <text
                x={centerX + tick * scale}
                y={centerY + 18}
                textAnchor="middle"
                fontSize="12"
                fill="#94a3b8"
              >
                {tick}
              </text>

              {tick !== 0 && (
                <text
                  x={centerX + 8}
                  y={centerY - tick * scale + 4}
                  fontSize="12"
                  fill="#94a3b8"
                >
                  {tick}
                </text>
              )}
            </React.Fragment>
          ))}

          {/* Origin */}
          <circle cx={centerX} cy={centerY} r="3.5" fill="#f8fafc" />

          {/* Zeros */}
          {zeros.map((z, i) => {
            const x = centerX + z.re * scale;
            const y = centerY - z.im * scale;

            return (
              <g key={`zero-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                />
                <text
                  x={x + 12}
                  y={y - 10}
                  fontSize="12"
                  fill="#22c55e"
                >
                  Z{i + 1}
                </text>
              </g>
            );
          })}

          {/* Poles */}
          {poles.map((p, i) => {
            const x = centerX + p.re * scale;
            const y = centerY - p.im * scale;

            return (
              <g key={`pole-${i}`}>
                <line
                  x1={x - 7}
                  y1={y - 7}
                  x2={x + 7}
                  y2={y + 7}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />
                <line
                  x1={x - 7}
                  y1={y + 7}
                  x2={x + 7}
                  y2={y - 7}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />
                <text
                  x={x + 12}
                  y={y - 10}
                  fontSize="12"
                  fill="#ef4444"
                >
                  P{i + 1}
                </text>
              </g>
            );
          })}

          {/* Axis names */}
          <text x={width - 70} y={centerY - 8} fontSize="14" fill="#e2e8f0">
            Real Axis
          </text>
          <text x={centerX + 10} y="20" fontSize="14" fill="#e2e8f0">
            Imag Axis
          </text>
        </svg>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="stat-card">
          <strong>Number of Zeros</strong>
          <div>{zeros.length}</div>
        </div>

        <div className="stat-card">
          <strong>Number of Poles</strong>
          <div>{poles.length}</div>
        </div>

        <div className="stat-card">
          <strong>Stability</strong>
          <div>{stabilityText}</div>
        </div>
      </div>

      {zeros.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Zero Details</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              marginTop: "1rem"
            }}
          >
            {zeros.map((z, i) => (
              <div key={i} className="stat-card">
                <strong>Z{i + 1}</strong>
                <div>{formatComplex(z)}</div>
                <div style={{ marginTop: "6px", fontSize: "13px", color: "#cbd5e1" }}>
                  |z| = {magnitude(z).toFixed(3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {poles.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Pole Details</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              marginTop: "1rem"
            }}
          >
            {poles.map((p, i) => (
              <div key={i} className="stat-card">
                <strong>P{i + 1}</strong>
                <div>{formatComplex(p)}</div>
                <div style={{ marginTop: "6px", fontSize: "13px", color: "#cbd5e1" }}>
                  |p| = {magnitude(p).toFixed(3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-box" style={{ marginTop: "1rem" }}>
        ○ = Zero | × = Pole | Circle = Unit Circle.  
        Poles inside the unit circle indicate stability for causal discrete-time systems.
      </div>
    </section>
  );
}