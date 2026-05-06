import React from "react";
import { Activity, Play, Layers, Sparkles, Gauge } from "lucide-react";

export default function DTSPDFTPropertiesSimulation({
  inputText,
  setInputText,
  property,
  setProperty,
  propertyOptions,
  sequence,
  originalDFT,
  transformedSequence,
  transformedDFT,
  error,
  handleRunDemo,
  renderPropertyNote,
  formatNumber,
  getMagnitude,
  getPhase
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
              Run DFT property demonstrations and compare sequence and spectrum changes.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Selected Property</h4>
          </div>
          <p>{renderPropertyNote()}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Layers size={18} />
            <h4>Comparison</h4>
          </div>
          <p>
            The experiment compares the original sequence spectrum with the transformed
            sequence spectrum.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        Try changing the property to see whether magnitude, phase, or spectral energy changes.
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Input Sequence</label>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 1, 2, 3, 4"
            className="sorting-input"
          />
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">DFT Property</label>
          <select
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="sorting-select"
          >
            {propertyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={handleRunDemo}>
            <Play size={16} />
            Run Demo
          </button>
        </div>
      </div>

      {error && <div className="queue-warning-box">{error}</div>}

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Sequence Length</span>
          <span className="sorting-stat-value">{sequence.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Original DFT Bins</span>
          <span className="sorting-stat-value">{originalDFT.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Transformed Bins</span>
          <span className="sorting-stat-value">{transformedDFT.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Property</span>
          <span className="sorting-stat-value">
            {property === "linearity"
              ? "Linearity"
              : property === "timeShift"
              ? "Time Shift"
              : "Freq Shift"}
          </span>
        </div>
      </div>

      {sequence.length > 0 && (
        <>
          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <Layers size={18} />
              <h4>Sequences</h4>
            </div>

            <div className="sorting-info-box">
              <strong style={{ marginRight: 8 }}>Original x[n]:</strong>
              {sequence.map((v, i) => (i === 0 ? v : `, ${v}`))}
            </div>

            {transformedSequence.length > 0 && (
              <div className="sorting-info-box" style={{ marginBottom: 0 }}>
                <strong style={{ marginRight: 8 }}>Transformed y[n]:</strong>
                {transformedSequence.map((v, i) =>
                  i === 0 ? formatNumber(v, 3) : `, ${formatNumber(v, 3)}`
                )}
              </div>
            )}
          </div>

          {originalDFT.length > 0 && transformedDFT.length > 0 && (
            <div className="overview-card">
              <div className="overview-card-head">
                <Gauge size={18} />
                <h4>DFT Comparison</h4>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="dbms-table">
                  <thead>
                    <tr>
                      <th>k</th>
                      <th>|X[k]|</th>
                      <th>∠X[k]</th>
                      <th>|Y[k]|</th>
                      <th>∠Y[k]</th>
                    </tr>
                  </thead>
                  <tbody>
                    {originalDFT.map((Xk, k) => {
                      const Yk = transformedDFT[k] || { re: 0, im: 0 };

                      return (
                        <tr key={k}>
                          <td>{k}</td>
                          <td>{formatNumber(getMagnitude(Xk))}</td>
                          <td>{formatNumber(getPhase(Xk))}</td>
                          <td>{formatNumber(getMagnitude(Yk))}</td>
                          <td>{formatNumber(getPhase(Yk))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}