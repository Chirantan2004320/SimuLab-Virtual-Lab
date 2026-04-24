import React, { useEffect } from "react";
import {
  PlayCircle,
  ToggleLeft,
  Activity,
  Zap,
  Cpu,
  CheckCircle2
} from "lucide-react";
import {
  Breadboard,
  Switch,
  Wire,
  LED,
  LogicChip
} from "../../../../components/hardware/CircuitEngine";

function bitColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

function typeLabel(type) {
  return (
    {
      sr: "SR Latch",
      d: "D Flip-Flop",
      jk: "JK Flip-Flop",
      t: "T Flip-Flop"
    }[type] || "Flip-Flop"
  );
}

export default function DSDFlipFlopsSimulation({
  selectedType,
  setSelectedType,
  s,
  setS,
  r,
  setR,
  d,
  setD,
  j,
  setJ,
  k,
  setK,
  t,
  setT,
  clk,
  setClk,
  q,
  analysis,
  applyClockedUpdate,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [selectedType, s, r, d, j, k, t, clk, q, setExperimentRun]);

  const renderControls = () => {
    if (selectedType === "sr") {
      return (
        <>
          <button className="sim-btn sim-btn-primary" onClick={() => setS((prev) => (prev ? 0 : 1))}>
            S = {s}
          </button>
          <button className="sim-btn sim-btn-muted" onClick={() => setR((prev) => (prev ? 0 : 1))}>
            R = {r}
          </button>
        </>
      );
    }

    if (selectedType === "d") {
      return (
        <>
          <button className="sim-btn sim-btn-primary" onClick={() => setD((prev) => (prev ? 0 : 1))}>
            D = {d}
          </button>
          <button className="sim-btn sim-btn-muted" onClick={() => setClk((prev) => (prev ? 0 : 1))}>
            CLK = {clk}
          </button>
        </>
      );
    }

    if (selectedType === "jk") {
      return (
        <>
          <button className="sim-btn sim-btn-primary" onClick={() => setJ((prev) => (prev ? 0 : 1))}>
            J = {j}
          </button>
          <button className="sim-btn sim-btn-muted" onClick={() => setK((prev) => (prev ? 0 : 1))}>
            K = {k}
          </button>
          <button className="sim-btn sim-btn-muted" onClick={() => setClk((prev) => (prev ? 0 : 1))}>
            CLK = {clk}
          </button>
        </>
      );
    }

    return (
      <>
        <button className="sim-btn sim-btn-primary" onClick={() => setT((prev) => (prev ? 0 : 1))}>
          T = {t}
        </button>
        <button className="sim-btn sim-btn-muted" onClick={() => setClk((prev) => (prev ? 0 : 1))}>
          CLK = {clk}
        </button>
      </>
    );
  };

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
              Change inputs, observe the predicted next state, and apply the update to store the new output.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current Q</span>
          <span className="sorting-stat-value" style={{ color: bitColor(q) }}>
            {q}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Next Q</span>
          <span className="sorting-stat-value" style={{ color: bitColor(analysis.nextQ) }}>
            {analysis.nextQ}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Q̅</span>
          <span className="sorting-stat-value" style={{ color: bitColor(analysis.qBar) }}>
            {analysis.qBar}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">State</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {analysis.stateName}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.note}</div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Type Selection</h4>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="sorting-select"
            style={{ marginTop: 10 }}
          >
            <option value="sr">SR Latch</option>
            <option value="d">D Flip-Flop</option>
            <option value="jk">JK Flip-Flop</option>
            <option value="t">T Flip-Flop</option>
          </select>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ToggleLeft size={18} />
            <h4>Input Controls</h4>
          </div>

          <div className="sorting-btn-group" style={{ marginTop: 12 }}>
            {renderControls()}
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Transition</h4>
          </div>
          <p>
            Present state <strong>Q = {q}</strong> will move to <strong>Next Q = {analysis.nextQ}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Apply State</h4>
          </div>
          <button className="sim-btn sim-btn-primary" onClick={applyClockedUpdate} style={{ marginTop: 10 }}>
            Store Next State
          </button>
        </div>
      </div>

      <div className="hardware-board-shell">
        <div className="hardware-board-header">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Hardware State View</h3>

          <div className="hardware-board-badge">
            <Zap size={16} />
            Live Sequential Flow
          </div>
        </div>

        <Breadboard height="540px">
          {selectedType === "sr" && (
            <>
              <Switch label="S" state={s === 1} onChange={(v) => setS(v ? 1 : 0)} x={70} y={90} />
              <Switch label="R" state={r === 1} onChange={(v) => setR(v ? 1 : 0)} x={70} y={250} />

              <LogicChip
                label="SR"
                labelSecondary="Latch"
                x={360}
                y={130}
                width={120}
                height={150}
                state={analysis.nextQ === 1}
                inputCount={2}
                outputCount={2}
              />

              <Wire startX={108} startY={154} endX={360} endY={152} state={s === 1} />
              <Wire startX={108} startY={314} endX={360} endY={258} state={r === 1} />
            </>
          )}

          {selectedType === "d" && (
            <>
              <Switch label="D" state={d === 1} onChange={(v) => setD(v ? 1 : 0)} x={70} y={110} />
              <Switch label="CLK" state={clk === 1} onChange={(v) => setClk(v ? 1 : 0)} x={70} y={300} />

              <LogicChip
                label="D"
                labelSecondary="Flip-Flop"
                x={360}
                y={140}
                width={130}
                height={150}
                state={analysis.nextQ === 1}
                inputCount={2}
                outputCount={2}
              />

              <Wire startX={108} startY={174} endX={360} endY={162} state={d === 1} />
              <Wire startX={108} startY={364} endX={360} endY={268} state={clk === 1} />
            </>
          )}

          {selectedType === "jk" && (
            <>
              <Switch label="J" state={j === 1} onChange={(v) => setJ(v ? 1 : 0)} x={70} y={60} />
              <Switch label="K" state={k === 1} onChange={(v) => setK(v ? 1 : 0)} x={70} y={205} />
              <Switch label="CLK" state={clk === 1} onChange={(v) => setClk(v ? 1 : 0)} x={70} y={350} />

              <LogicChip
                label="JK"
                labelSecondary="Flip-Flop"
                x={360}
                y={105}
                width={140}
                height={200}
                state={analysis.nextQ === 1}
                inputCount={3}
                outputCount={2}
              />

              <Wire startX={108} startY={124} endX={360} endY={125} state={j === 1} />
              <Wire startX={108} startY={269} endX={360} endY={205} state={k === 1} />
              <Wire startX={108} startY={414} endX={360} endY={285} state={clk === 1} />
            </>
          )}

          {selectedType === "t" && (
            <>
              <Switch label="T" state={t === 1} onChange={(v) => setT(v ? 1 : 0)} x={70} y={110} />
              <Switch label="CLK" state={clk === 1} onChange={(v) => setClk(v ? 1 : 0)} x={70} y={300} />

              <LogicChip
                label="T"
                labelSecondary="Flip-Flop"
                x={360}
                y={140}
                width={130}
                height={150}
                state={analysis.nextQ === 1}
                inputCount={2}
                outputCount={2}
              />

              <Wire startX={108} startY={174} endX={360} endY={162} state={t === 1} />
              <Wire startX={108} startY={364} endX={360} endY={268} state={clk === 1} />
            </>
          )}

          <Wire startX={480} startY={185} endX={650} endY={185} state={analysis.nextQ === 1} strokeWidth={5} />
          <Wire startX={480} startY={245} endX={650} endY={245} state={analysis.qBar === 1} strokeWidth={5} />

          <LED label={`Q = ${analysis.nextQ}`} state={analysis.nextQ === 1} x={680} y={170} />
          <LED label={`Q̅ = ${analysis.qBar}`} state={analysis.qBar === 1} x={680} y={230} />

          <div
            style={{
              position: "absolute",
              left: 540,
              top: 108,
              padding: "10px 14px",
              borderRadius: 14,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.14)",
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: "0.95rem"
            }}
          >
            State: <span style={{ color: "#38bdf8" }}>{analysis.stateName}</span>
          </div>
        </Breadboard>
      </div>
    </section>
  );
}