import React, { useMemo } from "react";
import {
  PlayCircle,
  TimerReset,
  Activity,
  Zap,
  ToggleLeft,
  CheckCircle2
} from "lucide-react";
import {
  Breadboard,
  Wire,
  LogicChip,
  LED
} from "../../../../components/hardware/CircuitEngine";

function bitColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDPropagationDelaySimulation({
  selectedGate,
  setSelectedGate,
  inputBit,
  delayNs,
  setDelayNs,
  timeNs,
  analysis,
  transitionCount,
  handleToggleInput,
  handleAdvanceTime,
  handleResetTime
}) {
  const stageCount = 5;

  const activeStage = useMemo(() => {
    const progress = Math.min(timeNs, delayNs);
    const ratio = delayNs === 0 ? 1 : progress / delayNs;
    return Math.min(stageCount, Math.floor(ratio * stageCount));
  }, [timeNs, delayNs]);

  const stageStates = [
    activeStage >= 1,
    activeStage >= 2,
    activeStage >= 3,
    activeStage >= 4,
    activeStage >= 5
  ];

  const chipStates = [
    activeStage === 1,
    activeStage === 2,
    activeStage === 3,
    activeStage === 4,
    activeStage === 5
  ];

  const timelinePercent = Math.min((timeNs / Math.max(delayNs, 1)) * 100, 100);

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <PlayCircle size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Launch an input transition and watch the signal propagate through a chain of logic stages before it reaches the output.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Gate</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {selectedGate}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Delay</span>
          <span className="sorting-stat-value">{delayNs} ns</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current Time</span>
          <span className="sorting-stat-value">{timeNs} ns</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Transitions</span>
          <span className="sorting-stat-value">{transitionCount}</span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.note}</div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <ToggleLeft size={18} />
            <h4>Gate Controls</h4>
          </div>

          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="sorting-select"
            style={{ marginTop: 10 }}
          >
            <option value="NOT">NOT Gate</option>
            <option value="BUFFER">BUFFER Gate</option>
          </select>

          <div style={{ marginTop: 14 }}>
            <label className="sorting-label">Propagation Delay</label>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={delayNs}
              onChange={(e) => setDelayNs(Number(e.target.value))}
              className="sorting-range"
            />
            <div style={{ marginTop: 8, color: "#cbd5e1", fontWeight: 700 }}>{delayNs} ns</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Signal State</h4>
          </div>
          <p><strong>Input:</strong> <span style={{ color: bitColor(inputBit) }}>{inputBit}</span></p>
          <p><strong>Initial Output:</strong> <span style={{ color: bitColor(analysis.initialOutput) }}>{analysis.initialOutput}</span></p>
          <p><strong>Observed Output:</strong> <span style={{ color: bitColor(analysis.observedOutput) }}>{analysis.observedOutput}</span></p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <TimerReset size={18} />
            <h4>Time Controls</h4>
          </div>

          <div className="sorting-btn-group" style={{ marginTop: 10 }}>
            <button className="sim-btn sim-btn-primary" onClick={handleToggleInput}>
              Toggle Input
            </button>
            <button className="sim-btn sim-btn-muted" onClick={handleAdvanceTime}>
              Advance +1 ns
            </button>
            <button className="sim-btn sim-btn-muted" onClick={handleResetTime}>
              Reset Time
            </button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Status</h4>
          </div>
          <p>
            Present state: <strong>{analysis.state}</strong>
          </p>
          <p>
            Output changes at: <strong>{analysis.outputChangesAt} ns</strong>
          </p>
        </div>
      </div>

      <div className="hardware-board-shell">
        <div className="hardware-board-header">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Pulse Propagation View</h3>

          <div className="hardware-board-badge">
            <Zap size={16} />
            Live Delay Flow
          </div>
        </div>

        <Breadboard height="340px">
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 122,
              zIndex: 10
            }}
          >
            <button
              onClick={handleToggleInput}
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #3b82f6, #1d4ed8)",
                border: "4px solid #1e3a8a",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontWeight: "800",
                fontSize: "0.68rem",
                boxShadow: "0 10px 20px rgba(0,0,0,0.45)"
              }}
            >
              TOGGLE
            </button>
          </div>

          <div
            style={{
              position: "absolute",
              left: 25,
              top: 205,
              color: "#cbd5e1",
              fontSize: "0.82rem",
              fontWeight: 700
            }}
          >
            IN = <span style={{ color: bitColor(inputBit) }}>{inputBit}</span>
          </div>

          <Wire startX={95} startY={157} endX={165} endY={157} state={stageStates[0]} />
          <LogicChip label={selectedGate === "NOT" ? "NOT" : "BUF"} x={165} y={117} state={chipStates[0]} />

          <Wire startX={245} startY={157} endX={315} endY={157} state={stageStates[1]} />
          <LogicChip label={selectedGate === "NOT" ? "NOT" : "BUF"} x={315} y={117} state={chipStates[1]} />

          <Wire startX={395} startY={157} endX={465} endY={157} state={stageStates[2]} />
          <LogicChip label={selectedGate === "NOT" ? "NOT" : "BUF"} x={465} y={117} state={chipStates[2]} />

          <Wire startX={545} startY={157} endX={615} endY={157} state={stageStates[3]} />
          <LogicChip label={selectedGate === "NOT" ? "NOT" : "BUF"} x={615} y={117} state={chipStates[3]} />

          <Wire startX={695} startY={157} endX={765} endY={157} state={stageStates[4]} />
          <LogicChip label={selectedGate === "NOT" ? "NOT" : "BUF"} x={765} y={117} state={chipStates[4]} />

          <Wire startX={845} startY={157} endX={915} endY={157} state={timeNs >= delayNs} />
          <LED label={`OUT = ${analysis.observedOutput}`} state={analysis.observedOutput === 1} x={935} y={142} />

          <div
            style={{
              position: "absolute",
              left: 320,
              right: 80,
              bottom: 28,
              zIndex: 20
            }}
          >
            <div
              style={{
                height: 12,
                width: "100%",
                borderRadius: 999,
                background: "rgba(148,163,184,0.16)",
                overflow: "hidden",
                marginBottom: 12
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${timelinePercent}%`,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #38bdf8, #22c55e)",
                  transition: "width 0.25s ease"
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#cbd5e1",
                fontSize: "0.82rem",
                fontWeight: 700
              }}
            >
              <span>0 ns</span>
              <span>Delay threshold: {delayNs} ns</span>
              <span>Current: {timeNs} ns</span>
            </div>
          </div>
        </Breadboard>
      </div>
    </section>
  );
}