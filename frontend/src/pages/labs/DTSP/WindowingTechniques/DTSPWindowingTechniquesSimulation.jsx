import React from "react";
import {
  Activity,
  Play,
  SlidersHorizontal,
  Waves,
  BarChart3,
  Sparkles
} from "lucide-react";

export default function DTSPWindowingTechniquesSimulation({
  windowType,
  setWindowType,
  windowOptions,
  length,
  setLength,
  generateWindowExperiment,
  windowData,
  spectrumData,
  observation,
  selectedWindowLabel,
  formatNumber
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
              Generate different window functions and observe their sample values and spectral behavior.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />
            <h4>Time Domain Window</h4>
          </div>
          <p>
            The window shape controls how sharply or smoothly the sequence is truncated.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BarChart3 size={18} />
            <h4>Frequency Domain Effect</h4>
          </div>
          <p>
            Each window creates a different balance between main-lobe width and side-lobe levels.
          </p>
        </div>
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Window Type</label>
          <select
            value={windowType}
            onChange={(e) => setWindowType(e.target.value)}
            className="sorting-select"
          >
            {windowOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">
            Window Length: <strong>{length}</strong>
          </label>
          <input
            type="range"
            min="5"
            max="81"
            step="2"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="sorting-range"
          />
        </div>

        <div className="sorting-btn-group">
          <button
            className="sim-btn sim-btn-primary"
            onClick={generateWindowExperiment}
          >
            <Play size={16} />
            Generate Window
          </button>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Window</span>
          <span className="sorting-stat-value">{selectedWindowLabel}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Length</span>
          <span className="sorting-stat-value">{length}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Window Samples</span>
          <span className="sorting-stat-value">{windowData.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Spectrum Samples</span>
          <span className="sorting-stat-value">{spectrumData.length || "-"}</span>
        </div>
      </div>

      {observation && (
        <div className="sorting-info-box" style={{ marginTop: 18 }}>
          <Sparkles size={16} style={{ marginRight: 10 }} />
          {observation}
        </div>
      )}

      {windowData.length > 0 && (
        <div className="overview-card" style={{ marginTop: 18 }}>
          <div className="overview-card-head">
            <SlidersHorizontal size={18} />
            <h4>Sample Window Values</h4>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="dbms-table">
              <thead>
                <tr>
                  <th>n</th>
                  <th>w[n]</th>
                </tr>
              </thead>
              <tbody>
                {windowData
                  .filter((_, index) => {
                    if (windowData.length <= 15) return true;
                    return (
                      index === 0 ||
                      index === windowData.length - 1 ||
                      index % Math.ceil(windowData.length / 10) === 0
                    );
                  })
                  .map((point) => (
                    <tr key={point.n}>
                      <td>{point.n}</td>
                      <td>{formatNumber(point.value, 4)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}