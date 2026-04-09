import React from "react";

function formatComplex(z, digits = 3) {
  const re = Math.abs(z.re) < 1e-10 ? 0 : z.re;
  const im = Math.abs(z.im) < 1e-10 ? 0 : z.im;

  const reStr = re.toFixed(digits);
  const imStr = Math.abs(im).toFixed(digits);

  if (im === 0) return reStr;

  const sign = im >= 0 ? "+" : "-";
  return `${reStr} ${sign} j${imStr}`;
}

function magnitude(z) {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

export default function DTSPPoleZeroAnalysisSimulation({
  numText,
  setNumText,
  denText,
  setDenText,
  handleAnalyze,
  zeros,
  poles,
  stabilityText,
  error
}) {
  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="controls" style={{ flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <label>Numerator Coefficients N(z)</label>
          <input
            value={numText}
            onChange={(e) => setNumText(e.target.value)}
            placeholder="e.g. 1, 0, -0.5"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <label>Denominator Coefficients D(z)</label>
          <input
            value={denText}
            onChange={(e) => setDenText(e.target.value)}
            placeholder="e.g. 1, -0.8"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={handleAnalyze}>
            Analyze
          </button>
        </div>
      </div>

      {error && (
        <div className="info-box" style={{ marginTop: "1rem", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {(zeros.length > 0 || poles.length > 0 || stabilityText) && (
        <>
          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Zeros</h3>

            {zeros.length > 0 ? (
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
                    <strong>Zero z{i + 1}</strong>
                    <div>{formatComplex(z)}</div>
                    <div style={{ marginTop: "6px", fontSize: "13px", color: "#cbd5e1" }}>
                      |z| = {magnitude(z).toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
                No zeros computed for the entered numerator.
              </p>
            )}
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Poles</h3>

            {poles.length > 0 ? (
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
                    <strong>Pole p{i + 1}</strong>
                    <div>{formatComplex(p)}</div>
                    <div style={{ marginTop: "6px", fontSize: "13px", color: "#cbd5e1" }}>
                      |p| = {magnitude(p).toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
                No poles computed for the entered denominator.
              </p>
            )}
          </div>

          {stabilityText && (
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>Stability Interpretation</h3>
              <div className="info-box" style={{ marginTop: "1rem" }}>
                {stabilityText}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}