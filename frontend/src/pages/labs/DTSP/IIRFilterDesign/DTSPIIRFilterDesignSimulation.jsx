import React from "react";
import {
  Activity,
  Play,
  Gauge,
  Waves,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";

export default function DTSPIIRFilterDesignSimulation({
  filterType,
  setFilterType,
  order,
  setOrder,
  cutoff,
  setCutoff,
  runDesign,
  frequencyResponse,
  poles,
  observation,
  stabilityText,
  formatNumber
}) {
  const filterLabel = filterType === "lowpass" ? "Low Pass" : "High Pass";

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
              Configure a Butterworth-style IIR filter and observe response,
              poles, and stability.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Butterworth Filter</h4>
          </div>
          <p>
            A Butterworth filter gives a smooth passband and becomes sharper as
            order increases.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ShieldCheck size={18} />
            <h4>Stability Rule</h4>
          </div>
          <p>
            In digital IIR filters, poles should lie inside the unit circle for
            stable behavior.
          </p>
        </div>
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
          <label className="sorting-label">
            Filter Order: <strong>{order}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="sorting-range"
          />
        </div>

        <div className="sorting-input-group">
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

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={runDesign}>
            <Play size={16} />
            Design Filter
          </button>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Filter Type</span>
          <span className="sorting-stat-value">{filterLabel}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Order</span>
          <span className="sorting-stat-value">{order}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Cutoff</span>
          <span className="sorting-stat-value">{cutoff}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Poles</span>
          <span className="sorting-stat-value">{poles.length || "-"}</span>
        </div>
      </div>

      {frequencyResponse.length > 0 && (
        <>
          <div className="sorting-info-box" style={{ marginTop: 18 }}>
            <SlidersHorizontal size={16} style={{ marginRight: 10 }} />
            {observation}
          </div>

          <div className="sorting-info-box" style={{ marginTop: 18 }}>
            <ShieldCheck size={16} style={{ marginRight: 10 }} />
            {stabilityText}
          </div>

          <div className="overview-card" style={{ marginTop: 18 }}>
            <div className="overview-card-head">
              <Waves size={18} />
              <h4>Sample Magnitude Response Values</h4>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="dbms-table">
                <thead>
                  <tr>
                    <th>Frequency</th>
                    <th>Magnitude</th>
                  </tr>
                </thead>
                <tbody>
                  {frequencyResponse
                    .filter((_, index) => index % 20 === 0)
                    .map((point) => (
                      <tr key={point.index}>
                        <td>{formatNumber(point.frequency, 2)}</td>
                        <td>{formatNumber(point.magnitude, 4)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}