import React, {
  useEffect
} from "react";

import {
  Activity,
  Cpu,
  Zap,
  Sparkles,
  SlidersHorizontal,
  Database,
  Workflow
} from "lucide-react";

export default function DVLSISRAMCellSimulation({
  storedBit,
  setStoredBit,
  bitline,
  setBitline,
  bitlineBar,
  setBitlineBar,
  wordline,
  setWordline,
  operation,
  setOperation,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [
    storedBit,
    bitline,
    bitlineBar,
    wordline,
    operation,
    setExperimentRun
  ]);

  const handleWritePair = (
    value
  ) => {
    const v = Number(value);

    setBitline(v);

    setBitlineBar(
      v === 1 ? 0 : 1
    );
  };

  const applyWriteToStorage =
    () => {
      if (
        operation ===
          "write" &&
        wordline === 1
      ) {
        setStoredBit(
          bitline
        );
      }
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
              Observe SRAM
              storage, read,
              write, and hold
              operations using
              cross-coupled
              inverter logic.
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
              Current Mode
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
              Access State
            </h4>
          </div>

          <p>
            WL{" "}
            {wordline === 1
              ? "enables access transistors"
              : "isolates the SRAM cell"}
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
            SRAM Parameters
          </h4>
        </div>

        <div className="er-config-grid">
          <div>
            <label className="sorting-label">
              Operation
            </label>

            <select
              value={
                operation
              }
              onChange={(e) =>
                setOperation(
                  e.target
                    .value
                )
              }
              className="sorting-select"
            >
              <option value="hold">
                Hold
              </option>

              <option value="read">
                Read
              </option>

              <option value="write">
                Write
              </option>
            </select>
          </div>

          <div>
            <label className="sorting-label">
              Stored Bit
            </label>

            <select
              value={
                storedBit
              }
              onChange={(e) =>
                setStoredBit(
                  Number(
                    e.target
                      .value
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
              Wordline
            </label>

            <select
              value={
                wordline
              }
              onChange={(e) =>
                setWordline(
                  Number(
                    e.target
                      .value
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
              Write Data
            </label>

            <select
              value={bitline}
              onChange={(e) =>
                handleWritePair(
                  e.target
                    .value
                )
              }
              className="sorting-select"
            >
              <option value={0}>
                Write 0
              </option>

              <option value={1}>
                Write 1
              </option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 18
        }}
      >
        <button
          className="sim-btn sim-btn-primary"
          onClick={
            applyWriteToStorage
          }
        >
          Apply Write
        </button>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Q
          </span>

          <span className="sorting-stat-value">
            {analysis.q}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            Q̅
          </span>

          <span className="sorting-stat-value">
            {analysis.qBar}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            BL
          </span>

          <span className="sorting-stat-value">
            {bitline}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">
            BL̅
          </span>

          <span className="sorting-stat-value">
            {bitlineBar}
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
            <Database size={18} />

            <h4>
              Readable Value
            </h4>
          </div>

          <p>
            {
              analysis.readableValue
            }
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />

            <h4>
              Access
              Transistors
            </h4>
          </div>

          <p>
            Left:{" "}
            {
              analysis.accessLeft
            }{" "}
            | Right:{" "}
            {
              analysis.accessRight
            }
          </p>
        </div>
      </div>
    </section>
  );
}