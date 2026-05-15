import React, {
  useEffect
} from "react";

import {
  Activity,
  Cpu,
  Zap,
  Sparkles,
  SlidersHorizontal,
  TimerReset,
  Waves
} from "lucide-react";

export default function DVLSIRingOscillatorSimulation({
  stages,
  setStages,
  tpd,
  setTpd,
  vdd,
  setVdd,
  enabled,
  setEnabled,
  analysis,
  formatNumber,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [
    stages,
    tpd,
    vdd,
    enabled,
    setExperimentRun
  ]);

  const makeOdd = (value) => {
    const v = Number(value);

    return v % 2 === 0
      ? v + 1
      : v;
  };

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
              Observe oscillation
              behavior in a closed
              inverter feedback loop
              with propagation delay.
            </p>
          </div>
        </div>
      </div>

      <div
        className="overview-grid"
        style={{
          marginBottom: 18
        }}
      >
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>
              Oscillation State
            </h4>
          </div>

          <p>
            <strong>
              {
                analysis.logicCase
              }
            </strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>
              Feedback Condition
            </h4>
          </div>

          <p>
            {analysis.oddStages
              ? "Odd inversion loop detected"
              : "Even inversion loop"}
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles
          size={16}
          style={{
            marginRight: 10
          }}
        />

        {analysis.note}
      </div>

      <div
        className="overview-card"
        style={{
          marginBottom: 18
        }}
      >
        <div className="overview-card-head">
          <SlidersHorizontal
            size={18}
          />

          <h4>
            Oscillator Parameters
          </h4>
        </div>

        <div className="er-config-grid">
          <div>
            <label className="sorting-label">
              Number of
              Stages:{" "}
              <strong>
                {stages}
              </strong>
            </label>

            <input
              type="range"
              min="3"
              max="9"
              step="1"
              value={stages}
              onChange={(e) =>
                setStages(
                  makeOdd(
                    e.target
                      .value
                  )
                )
              }
              style={{
                width: "100%"
              }}
            />
          </div>

          <div>
            <label className="sorting-label">
              Propagation Delay
              tp:{" "}
              <strong>
                {formatNumber(
                  tpd
                )}{" "}
                ns
              </strong>
            </label>

            <input
              type="range"
              min="0.2"
              max="5"
              step="0.1"
              value={tpd}
              onChange={(e) =>
                setTpd(
                  Number(
                    e.target
                      .value
                  )
                )
              }
              style={{
                width: "100%"
              }}
            />
          </div>

          <div>
            <label className="sorting-label">
              VDD:{" "}
              <strong>
                {formatNumber(
                  vdd
                )}{" "}
                V
              </strong>
            </label>

            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={vdd}
              onChange={(e) =>
                setVdd(
                  Number(
                    e.target
                      .value
                  )
                )
              }
              style={{
                width: "100%"
              }}
            />
          </div>

          <div>
            <label className="sorting-label">
              Enable Oscillator
            </label>

            <select
              value={
                enabled
                  ? "1"
                  : "0"
              }
              onChange={(e) =>
                setEnabled(
                  e.target
                    .value ===
                    "1"
                )
              }
              className="sorting-select"
            >
              <option value="1">
                Enabled
              </option>

              <option value="0">
                Disabled
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Oscillation
          </span>

          <span className="sorting-stat-value">
            {analysis.oscillates
              ? "YES"
              : "NO"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Period
          </span>

          <span className="sorting-stat-value">
            {analysis.oscillates
              ? `${formatNumber(
                  analysis.period
                )} ns`
              : "—"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Frequency
          </span>

          <span className="sorting-stat-value">
            {analysis.oscillates
              ? `${formatNumber(
                  analysis.frequency,
                  4
                )} GHz`
              : "—"}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Enabled
          </span>

          <span className="sorting-stat-value">
            {enabled
              ? "YES"
              : "NO"}
          </span>
        </div>
      </div>

      <div
        className="overview-grid"
        style={{
          marginTop: 18
        }}
      >
        <div className="overview-card">
          <div className="overview-card-head">
            <TimerReset
              size={18}
            />

            <h4>
              Timing Formula
            </h4>
          </div>

          <p>
            T ≈ 2 × N × tp
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />

            <h4>
              Frequency Formula
            </h4>
          </div>

          <p>
            f ≈ 1 / (2 × N
            × tp)
          </p>
        </div>
      </div>
    </section>
  );
}