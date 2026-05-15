import React, { useEffect } from "react";
import {
  Activity,
  Zap,
  Cpu,
  Gauge,
  Timer,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DVLSICMOSNANDGateSimulation({
  A,
  setA,
  B,
  setB,
  vdd,
  setVdd,
  tpd,
  setTpd,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [A, B, vdd, tpd, setExperimentRun]);

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>

          <div>
            <h2 className="sorting-sim-title">
              Simulation
            </h2>

            <p className="sorting-sim-subtitle">
              Adjust NAND inputs and observe
              CMOS pull-up and pull-down
              behavior.
            </p>
          </div>
        </div>
      </div>

      <div
        className="overview-grid"
        style={{ marginBottom: 18 }}
      >
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Operating Region</h4>
          </div>

          <p>
            <strong>
              {analysis.logicRegion}
            </strong>{" "}
            — {analysis.regionLabel}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Current Path</h4>
          </div>

          <p>{analysis.conductingPath}</p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles
          size={16}
          style={{ marginRight: 10 }}
        />

        {analysis.note}
      </div>

      <div
        className="overview-card"
        style={{ marginBottom: 18 }}
      >
        <div className="overview-card-head">
          <SlidersHorizontal size={18} />
          <h4>Input Parameters</h4>
        </div>

        <div className="er-config-grid">
          <LogicControl
            label={`Input A: ${A}`}
            value={A}
            onChange={(value) =>
              setA(clamp(value, 0, 1))
            }
          />

          <LogicControl
            label={`Input B: ${B}`}
            value={B}
            onChange={(value) =>
              setB(clamp(value, 0, 1))
            }
          />

          <SliderControl
            label={`VDD: ${vdd.toFixed(2)} V`}
            min="1"
            max="10"
            step="0.1"
            value={vdd}
            onChange={(value) =>
              setVdd(clamp(value, 1, 10))
            }
          />

          <SliderControl
            label={`Propagation Delay: ${tpd.toFixed(
              2
            )} ns`}
            min="0.1"
            max="20"
            step="0.1"
            value={tpd}
            onChange={(value) =>
              setTpd(clamp(value, 0.1, 20))
            }
          />
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Output Logic
          </span>

          <span className="sorting-stat-value">
            {analysis.output}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            pMOS A
          </span>

          <span className="sorting-stat-value">
            {analysis.pmosA}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            pMOS B
          </span>

          <span className="sorting-stat-value">
            {analysis.pmosB}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Dynamic Power
          </span>

          <span className="sorting-stat-value">
            {analysis.dynamicPower.toFixed(3)}
          </span>
        </div>
      </div>

      <div
        className="overview-grid"
        style={{ marginTop: 18 }}
      >
        <div className="overview-card">
          <div className="overview-card-head">
            <Timer size={18} />
            <h4>Delay Insight</h4>
          </div>

          <p>
            Estimated propagation delay:{" "}
            <strong>
              {tpd.toFixed(2)} ns
            </strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Universal Logic</h4>
          </div>

          <p>
            NAND gates can implement all
            digital logic functions.
          </p>
        </div>
      </div>
    </section>
  );
}

function SliderControl({
  label,
  min,
  max,
  step,
  value,
  onChange
}) {
  return (
    <div>
      <label className="sorting-label">
        {label}
      </label>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="sorting-range"
      />
    </div>
  );
}

function LogicControl({
  label,
  value,
  onChange
}) {
  return (
    <div>
      <label className="sorting-label">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="sorting-select"
      >
        <option value={0}>0</option>
        <option value={1}>1</option>
      </select>
    </div>
  );
}