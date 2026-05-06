import React, { useEffect } from "react";
import {
  Activity,
  Gauge,
  Zap,
  Timer,
  SlidersHorizontal,
  Sparkles,
  Cpu
} from "lucide-react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DVLSICMOSInverterSimulationSimulation({
  vin,
  setVin,
  vdd,
  setVdd,
  switchPoint,
  setSwitchPoint,
  tpd,
  setTpd,
  loadCap,
  setLoadCap,
  analysis,
  formatNumber,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [vin, vdd, switchPoint, tpd, loadCap, setExperimentRun]);

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
              Adjust inverter parameters and observe output logic, transistor states, delay, and power trend.
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
            <strong>{analysis.logicRegion}</strong> — {analysis.regionLabel}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Conduction Path</h4>
          </div>
          <p>{analysis.conductingPath}</p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        {analysis.note}
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <SlidersHorizontal size={18} />
          <h4>Input Parameters</h4>
        </div>

        <div className="er-config-grid">
          <SliderControl
            label={`Vin: ${formatNumber(vin)} V`}
            min="0"
            max={Math.max(vdd, 0.5)}
            step="0.1"
            value={vin}
            onChange={(value) => setVin(clamp(value, 0, 10))}
          />

          <SliderControl
            label={`VDD: ${formatNumber(vdd)} V`}
            min="0.5"
            max="10"
            step="0.1"
            value={vdd}
            onChange={(value) => setVdd(clamp(value, 0.5, 10))}
          />

          <SliderControl
            label={`Switching Point VM: ${formatNumber(switchPoint)} V`}
            min="0"
            max={Math.max(vdd, 0.5)}
            step="0.1"
            value={switchPoint}
            onChange={(value) => setSwitchPoint(clamp(value, 0, 10))}
          />

          <SliderControl
            label={`Propagation Delay: ${formatNumber(tpd)} ns`}
            min="0.1"
            max="20"
            step="0.1"
            value={tpd}
            onChange={(value) => setTpd(clamp(value, 0.1, 20))}
          />

          <SliderControl
            label={`Load Capacitance: ${formatNumber(loadCap)} fF`}
            min="0.1"
            max="100"
            step="0.1"
            value={loadCap}
            onChange={(value) => setLoadCap(clamp(value, 0.1, 100))}
          />
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Output Voltage</span>
          <span className="sorting-stat-value">{formatNumber(analysis.vout)} V</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">pMOS State</span>
          <span className="sorting-stat-value">{analysis.pmosState}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">nMOS State</span>
          <span className="sorting-stat-value">{analysis.nmosState}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Dynamic Power</span>
          <span className="sorting-stat-value">{formatNumber(analysis.dynamicPower)}</span>
        </div>
      </div>

      <div className="overview-grid" style={{ marginTop: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Timer size={18} />
            <h4>Delay Analysis</h4>
          </div>
          <p>
            Propagation Delay: <strong>{formatNumber(analysis.delay)} ns</strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Noise Margin Estimate</h4>
          </div>
          <p>
            NML ≈ <strong>{formatNumber(analysis.noiseMarginLow)} V</strong> · NMH ≈{" "}
            <strong>{formatNumber(analysis.noiseMarginHigh)} V</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

function SliderControl({ label, min, max, step, value, onChange }) {
  return (
    <div>
      <label className="sorting-label">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="sorting-range"
      />
    </div>
  );
}