import React, {
  useEffect
} from "react";

import {
  Activity,
  Cpu,
  Zap,
  Sparkles,
  SlidersHorizontal
} from "lucide-react";

export default function DVLSITransmissionGateSimulation({
  inputSignal,
  setInputSignal,
  control,
  setControl,
  mode,
  setMode,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [
    inputSignal,
    control,
    mode,
    setExperimentRun
  ]);

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
              Observe transmission
              gate conduction,
              complementary control
              operation, and pass
              transistor switching
              behavior.
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
            <h4>Logic Case</h4>
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
            <h4>Current Path</h4>
          </div>

          <p>
            {
              analysis.currentPath
            }
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
            Input Parameters
          </h4>
        </div>

        <div className="er-config-grid">
          <div>
            <label className="sorting-label">
              Mode
            </label>

            <select
              value={mode}
              onChange={(e) =>
                setMode(
                  e.target.value
                )
              }
              className="sorting-select"
            >
              <option value="transmission-gate">
                Transmission Gate
              </option>

              <option value="single-nmos">
                Single Pass nMOS
              </option>
            </select>
          </div>

          <div>
            <label className="sorting-label">
              Input Signal
            </label>

            <select
              value={inputSignal}
              onChange={(e) =>
                setInputSignal(
                  Number(
                    e.target.value
                  )
                )
              }
              className="sorting-select"
            >
              <option value={0}>
                0
              </option>

              <option value={1}>
                1
              </option>
            </select>
          </div>

          <div>
            <label className="sorting-label">
              Control Signal
            </label>

            <select
              value={control}
              onChange={(e) =>
                setControl(
                  Number(
                    e.target.value
                  )
                )
              }
              className="sorting-select"
            >
              <option value={0}>
                0
              </option>

              <option value={1}>
                1
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Input
          </span>

          <span className="sorting-stat-value">
            {inputSignal}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Control
          </span>

          <span className="sorting-stat-value">
            {control}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Output
          </span>

          <span className="sorting-stat-value">
            {analysis.output}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Control̅
          </span>

          <span className="sorting-stat-value">
            {
              analysis.controlBar
            }
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
            <Cpu size={18} />
            <h4>nMOS State</h4>
          </div>

          <p>
            <strong>
              {
                analysis.nmosState
              }
            </strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>pMOS State</h4>
          </div>

          <p>
            <strong>
              {
                analysis.pmosState
              }
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}