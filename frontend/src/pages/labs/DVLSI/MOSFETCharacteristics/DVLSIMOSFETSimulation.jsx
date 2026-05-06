import React, { useEffect } from "react";
import { Activity, SlidersHorizontal, Zap, Cpu, Sparkles } from "lucide-react";

export default function DVLSIMOSFETSimulation({
  deviceType,
  setDeviceType,
  vgs,
  setVgs,
  vds,
  setVds,
  vt,
  setVt,
  k,
  setK,
  lambda,
  setLambda,
  analysis,
  formatNumber,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [deviceType, vgs, vds, vt, k, lambda, setExperimentRun]);

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
              Adjust MOSFET voltages and parameters to observe current, region, and channel state.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Operating Region</h4>
          </div>
          <p>
            Current region: <strong>{analysis.region}</strong>. Channel state:{" "}
            <strong>{analysis.channelState}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Drain Current</h4>
          </div>
          <p>
            ID = <strong>{formatNumber(analysis.id, 4)} A</strong>, controlled mainly by VGS and region.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        {analysis.note}
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Device Type</label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="sorting-select"
          >
            <option value="nmos">nMOS</option>
            <option value="pmos">pMOS</option>
          </select>
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">VGS: {formatNumber(vgs)} V</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={vgs}
            onChange={(e) => setVgs(Number(e.target.value))}
            className="sorting-range"
          />
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">VDS: {formatNumber(vds)} V</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={vds}
            onChange={(e) => setVds(Number(e.target.value))}
            className="sorting-range"
          />
        </div>
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <SlidersHorizontal size={18} />
          <h4>Device Parameters</h4>
        </div>

        <div className="er-config-grid">
          <div>
            <label className="sorting-label">Threshold Voltage VT: {formatNumber(vt)} V</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={vt}
              onChange={(e) => setVt(Number(e.target.value))}
              className="sorting-range"
            />
          </div>

          <div>
            <label className="sorting-label">Device Constant k: {formatNumber(k)}</label>
            <input
              type="range"
              min="0.2"
              max="5"
              step="0.1"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="sorting-range"
            />
          </div>

          <div>
            <label className="sorting-label">
              Channel-Length Modulation λ: {formatNumber(lambda, 3)}
            </label>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.005"
              value={lambda}
              onChange={(e) => setLambda(Number(e.target.value))}
              className="sorting-range"
            />
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Region</span>
          <span className="sorting-stat-value">{analysis.region}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Drain Current ID</span>
          <span className="sorting-stat-value">{formatNumber(analysis.id, 4)} A</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Overdrive VOV</span>
          <span className="sorting-stat-value">{formatNumber(Math.max(0, analysis.overdrive))} V</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Conduction</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.conductionState}
          </span>
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Cpu size={18} />
          <h4>Small-Signal / Device Insight</h4>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="dbms-table">
            <tbody>
              <tr>
                <td>Channel State</td>
                <td>{analysis.channelState}</td>
              </tr>
              <tr>
                <td>Transconductance gm</td>
                <td>{formatNumber(analysis.gm, 4)} S</td>
              </tr>
              <tr>
                <td>Output Resistance ro</td>
                <td>
                  {Number.isFinite(analysis.ro) ? `${formatNumber(analysis.ro, 3)} Ω` : "∞"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}