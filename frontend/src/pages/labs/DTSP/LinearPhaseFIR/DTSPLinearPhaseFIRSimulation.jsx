import React from "react";
import { Activity, Play, Layers, Gauge, Sparkles, ShieldCheck } from "lucide-react";

export default function DTSPLinearPhaseFIRSimulation({
  impulseText,
  setImpulseText,
  impulseResponse,
  symmetryType,
  frequencyData,
  error,
  handleAnalyze,
  formatNumber
}) {
  const isLinearPhase = symmetryType && symmetryType !== "Not Linear Phase";

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
              Detect FIR symmetry, classify the filter type, and compute frequency response.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Layers size={18} />
            <h4>Impulse Response</h4>
          </div>
          <p>
            Symmetric or antisymmetric h[n] is required for linear phase FIR behavior.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ShieldCheck size={18} />
            <h4>FIR Stability</h4>
          </div>
          <p>
            FIR filters are inherently stable because their impulse response is finite.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        Try a symmetric example like 0.2, 0.3, 0.5, 0.3, 0.2 or an antisymmetric one like 1, 2, 0, -2, -1.
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Impulse Response h[n]</label>
          <input
            value={impulseText}
            onChange={(e) => setImpulseText(e.target.value)}
            placeholder="e.g. 0.2, 0.3, 0.5, 0.3, 0.2"
            className="sorting-input"
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={handleAnalyze}>
            <Play size={16} />
            Analyze FIR
          </button>
        </div>
      </div>

      {error && <div className="queue-warning-box">{error}</div>}

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Filter Length</span>
          <span className="sorting-stat-value">{impulseResponse.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Detected Type</span>
          <span className="sorting-stat-value" style={{ fontSize: "0.95rem" }}>
            {symmetryType || "-"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Linear Phase?</span>
          <span className="sorting-stat-value">{isLinearPhase ? "Yes" : "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Response Samples</span>
          <span className="sorting-stat-value">{frequencyData.magnitude.length || "-"}</span>
        </div>
      </div>

      {impulseResponse.length > 0 && (
        <>
          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <Layers size={18} />
              <h4>Impulse Response h[n]</h4>
            </div>

            <div className="workspace" style={{ marginBottom: 0 }}>
              {impulseResponse.map((value, index) => (
                <div key={index} className="cell" style={{ minWidth: 72 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>h[{index}]</div>
                    <div>{formatNumber(value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <Gauge size={18} />
              <h4>Linear Phase Result</h4>
            </div>

            <div className="sorting-info-box" style={{ marginBottom: 0 }}>
              {symmetryType === "Not Linear Phase"
                ? "The impulse response is neither symmetric nor antisymmetric, so the filter is not linear phase."
                : `The impulse response pattern matches ${symmetryType}, so the FIR filter shows linear phase behavior.`}
            </div>
          </div>

          {frequencyData.magnitude.length > 0 && (
            <div className="overview-card">
              <div className="overview-card-head">
                <Activity size={18} />
                <h4>Frequency Response Summary</h4>
              </div>
              <p>
                Magnitude and phase response have been computed over sampled frequencies between
                0 and π. Use the graph section to inspect the response visually.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}