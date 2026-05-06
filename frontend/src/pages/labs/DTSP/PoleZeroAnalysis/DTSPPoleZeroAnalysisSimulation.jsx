import React from "react";
import { Activity, Play, CircleDot, X, ShieldCheck, Sparkles } from "lucide-react";

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

function RootCard({ type, item, index }) {
  const isPole = type === "Pole";

  return (
    <div className="sorting-stat-box">
      <span className="sorting-stat-label">
        {type} {index + 1}
      </span>
      <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
        {formatComplex(item)}
      </span>
      <span className="sorting-stat-label">
        |{isPole ? "p" : "z"}| = {magnitude(item).toFixed(3)}
      </span>
    </div>
  );
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
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Compute zeros, poles, magnitudes, and stability interpretation.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <CircleDot size={18} />
            <h4>Zeros</h4>
          </div>
          <p>Zeros come from the numerator polynomial N(z).</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <X size={18} />
            <h4>Poles</h4>
          </div>
          <p>Poles come from the denominator polynomial D(z) and determine stability.</p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        Enter coefficients in descending powers of z, then inspect pole magnitudes relative to the unit circle.
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Numerator Coefficients N(z)</label>
          <input
            value={numText}
            onChange={(e) => setNumText(e.target.value)}
            placeholder="e.g. 1, 0, -0.5"
            className="sorting-input"
          />
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">Denominator Coefficients D(z)</label>
          <input
            value={denText}
            onChange={(e) => setDenText(e.target.value)}
            placeholder="e.g. 1, -0.8"
            className="sorting-input"
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={handleAnalyze}>
            <Play size={16} />
            Analyze
          </button>
        </div>
      </div>

      {error && <div className="queue-warning-box">{error}</div>}

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Zeros</span>
          <span className="sorting-stat-value">{zeros.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Poles</span>
          <span className="sorting-stat-value">{poles.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Unit Circle Rule</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            |p| &lt; 1
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Status</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {stabilityText ? "Checked" : "Pending"}
          </span>
        </div>
      </div>

      {(zeros.length > 0 || poles.length > 0 || stabilityText) && (
        <>
          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <CircleDot size={18} />
              <h4>Zeros</h4>
            </div>

            {zeros.length > 0 ? (
              <div className="sorting-stats-grid" style={{ marginBottom: 0 }}>
                {zeros.map((z, i) => (
                  <RootCard key={i} type="Zero" item={z} index={i} />
                ))}
              </div>
            ) : (
              <p>No zeros computed for the entered numerator.</p>
            )}
          </div>

          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <X size={18} />
              <h4>Poles</h4>
            </div>

            {poles.length > 0 ? (
              <div className="sorting-stats-grid" style={{ marginBottom: 0 }}>
                {poles.map((p, i) => (
                  <RootCard key={i} type="Pole" item={p} index={i} />
                ))}
              </div>
            ) : (
              <p>No poles computed for the entered denominator.</p>
            )}
          </div>

          {stabilityText && (
            <div className="overview-card">
              <div className="overview-card-head">
                <ShieldCheck size={18} />
                <h4>Stability Interpretation</h4>
              </div>

              <div className="sorting-info-box" style={{ marginBottom: 0 }}>
                {stabilityText}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}