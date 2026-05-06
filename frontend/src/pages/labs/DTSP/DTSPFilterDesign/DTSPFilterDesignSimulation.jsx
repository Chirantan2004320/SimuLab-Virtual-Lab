import React from "react";
import { Activity, Play, SlidersHorizontal, Layers, Sparkles, Gauge } from "lucide-react";

export default function DTSPFilterDesignSimulation({
  filterType,
  setFilterType,
  cutoff,
  setCutoff,
  length,
  setLength,
  windowType,
  setWindowType,
  generateFilter,
  impulse,
  formatNumber
}) {
  const insight =
    filterType === "lowpass"
      ? "Low-pass filters allow low-frequency components to pass and attenuate high-frequency components."
      : "High-pass filters allow high-frequency components to pass and attenuate low-frequency components.";

  const filterLabel = filterType === "lowpass" ? "Low Pass" : "High Pass";
  const windowLabel =
    windowType === "rect"
      ? "Rectangular"
      : windowType === "hamming"
      ? "Hamming"
      : "Hanning";

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
              Generate FIR coefficients and observe how design parameters affect response.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <SlidersHorizontal size={18} />
            <h4>Design Parameters</h4>
          </div>
          <p>
            Filter type, cutoff frequency, length, and window together define the FIR response.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Window Effect</h4>
          </div>
          <p>
            Smoother windows reduce ripple but can widen the transition region.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        {insight}
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Filter Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="sorting-select"
          >
            <option value="lowpass">Low Pass</option>
            <option value="highpass">High Pass</option>
          </select>
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">Window Type</label>
          <select
            value={windowType}
            onChange={(e) => setWindowType(e.target.value)}
            className="sorting-select"
          >
            <option value="rect">Rectangular</option>
            <option value="hamming">Hamming</option>
            <option value="hanning">Hanning</option>
          </select>
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={generateFilter}>
            <Play size={16} />
            Generate Filter
          </button>
        </div>
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <SlidersHorizontal size={18} />
          <h4>Cutoff Frequency</h4>
        </div>

        <label className="sorting-label">
          Normalized Cutoff: <strong>{cutoff}</strong>
        </label>
        <input
          type="range"
          min="0.1"
          max="0.9"
          step="0.05"
          value={cutoff}
          onChange={(e) => setCutoff(Number(e.target.value))}
          className="sorting-range"
        />
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <Layers size={18} />
          <h4>Filter Length</h4>
        </div>

        <label className="sorting-label">
          FIR Length: <strong>{length}</strong>
        </label>
        <input
          type="range"
          min="5"
          max="51"
          step="2"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="sorting-range"
        />
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Filter Type</span>
          <span className="sorting-stat-value">{filterLabel}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Window</span>
          <span className="sorting-stat-value">{windowLabel}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Cutoff</span>
          <span className="sorting-stat-value">{cutoff}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Length</span>
          <span className="sorting-stat-value">{length}</span>
        </div>
      </div>

      {impulse.length > 0 && (
        <div className="overview-card">
          <div className="overview-card-head">
            <Layers size={18} />
            <h4>Generated Coefficients</h4>
          </div>

          <p>
            {impulse.map((v, i) =>
              i === 0 ? formatNumber(v, 4) : `, ${formatNumber(v, 4)}`
            )}
          </p>
        </div>
      )}
    </section>
  );
}