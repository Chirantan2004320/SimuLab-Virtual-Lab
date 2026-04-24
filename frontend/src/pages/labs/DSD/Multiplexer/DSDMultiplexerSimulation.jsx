import React, { useEffect } from "react";
import {
  PlayCircle,
  ToggleLeft,
  Activity,
  CheckCircle2,
  Route,
  Zap,
  Binary
} from "lucide-react";
import {
  Breadboard,
  Switch,
  Wire,
  LED,
  LogicChip
} from "../../../../components/hardware/CircuitEngine";

function outputColor(value) {
  return value === 1 ? "#22c55e" : "#ef4444";
}

function outputLabel(value) {
  return value === 1 ? "HIGH (1)" : "LOW (0)";
}

export default function DSDMultiplexerSimulation({
  i0,
  setI0,
  i1,
  setI1,
  i2,
  setI2,
  i3,
  setI3,
  s0,
  setS0,
  s1,
  setS1,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [i0, i1, i2, i3, s0, s1, setExperimentRun]);

  const selectedStates = [
    analysis.selectedIndex === 0 && analysis.I0 === 1,
    analysis.selectedIndex === 1 && analysis.I1 === 1,
    analysis.selectedIndex === 2 && analysis.I2 === 1,
    analysis.selectedIndex === 3 && analysis.I3 === 1
  ];

  const chipX = 430;
  const chipY = 110;
  const chipWidth = 150;
  const chipHeight = 250;

  const inputPins = [
    { y: chipY + 28 },
    { y: chipY + 98 },
    { y: chipY + 168 },
    { y: chipY + 238 }
  ];

  const selectPins = [
    { x: chipX + 48, y: chipY + chipHeight + 8, label: "S1" },
    { x: chipX + 102, y: chipY + chipHeight + 8, label: "S0" }
  ];

  const outputPin = {
    x: chipX + chipWidth,
    y: chipY + chipHeight / 2
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
              Toggle the data inputs and select lines to observe clean hardware-style routing through the 4-to-1 multiplexer.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">S1</span>
          <span className="sorting-stat-value">{analysis.S1}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">S0</span>
          <span className="sorting-stat-value">{analysis.S0}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Input</span>
          <span className="sorting-stat-value">I{analysis.selectedIndex}</span>
        </div>

        <div className="sorting-stat-box">
          <span
            className="sorting-stat-label"
            style={{ color: outputColor(analysis.output) }}
          >
            Output (Y)
          </span>
          <span
            className="sorting-stat-value"
            style={{ color: outputColor(analysis.output) }}
          >
            {analysis.output}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.note}</div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Data Inputs</h4>
          </div>

          <div className="sorting-btn-group" style={{ marginTop: 12 }}>
            <button className="sim-btn sim-btn-primary" onClick={() => setI0((p) => !p)}>
              I0 = {analysis.I0}
            </button>
            <button className="sim-btn sim-btn-muted" onClick={() => setI1((p) => !p)}>
              I1 = {analysis.I1}
            </button>
            <button className="sim-btn sim-btn-muted" onClick={() => setI2((p) => !p)}>
              I2 = {analysis.I2}
            </button>
            <button className="sim-btn sim-btn-muted" onClick={() => setI3((p) => !p)}>
              I3 = {analysis.I3}
            </button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ToggleLeft size={18} />
            <h4>Select Lines</h4>
          </div>

          <div className="sorting-btn-group" style={{ marginTop: 12 }}>
            <button className="sim-btn sim-btn-primary" onClick={() => setS1((p) => !p)}>
              S1 = {analysis.S1}
            </button>
            <button className="sim-btn sim-btn-muted" onClick={() => setS0((p) => !p)}>
              S0 = {analysis.S0}
            </button>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Route size={18} />
            <h4>Selection Code</h4>
          </div>
          <p style={{ fontWeight: 800, color: "#f8fafc" }}>
            {analysis.S1}
            {analysis.S0} → I{analysis.selectedIndex}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Output State</h4>
          </div>
          <p style={{ color: outputColor(analysis.output), fontWeight: 800 }}>
            {outputLabel(analysis.output)}
          </p>
        </div>
      </div>

      <div className="hardware-board-shell" style={{ marginTop: 0 }}>
        <div className="hardware-board-header">
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Hardware Circuit View</h3>

          <div className="hardware-board-badge">
            <Zap size={16} />
            Live MUX Flow
          </div>
        </div>

        <Breadboard height="680px">
          {/* INPUT SWITCHES - MORE SPACING */}
          <Switch label="I0" state={i0} onChange={setI0} x={70} y={40} />
          <Switch label="I1" state={i1} onChange={setI1} x={70} y={165} />
          <Switch label="I2" state={i2} onChange={setI2} x={70} y={290} />
          <Switch label="I3" state={i3} onChange={setI3} x={70} y={415} />

          {/* SELECT SWITCHES */}
          <Switch label="S1" state={s1} onChange={setS1} x={110} y={565} />
          <Switch label="S0" state={s0} onChange={setS0} x={225} y={565} />

          {/* CHIP */}
          <LogicChip
            label="MUX"
            labelSecondary="74153 / 4:1"
            x={chipX}
            y={chipY}
            width={chipWidth}
            height={chipHeight}
            state={analysis.output === 1}
            inputCount={4}
            outputCount={1}
          />

          {/* INPUT WIRES - PASSIVE */}
          <Wire startX={108} startY={104} endX={chipX} endY={inputPins[0].y} state={false} />
          <Wire startX={108} startY={229} endX={chipX} endY={inputPins[1].y} state={false} />
          <Wire startX={108} startY={354} endX={chipX} endY={inputPins[2].y} state={false} />
          <Wire startX={108} startY={479} endX={chipX} endY={inputPins[3].y} state={false} />

          {/* INPUT WIRES - ACTIVE OVERLAY */}
          <Wire startX={108} startY={104} endX={chipX} endY={inputPins[0].y} state={selectedStates[0]} />
          <Wire startX={108} startY={229} endX={chipX} endY={inputPins[1].y} state={selectedStates[1]} />
          <Wire startX={108} startY={354} endX={chipX} endY={inputPins[2].y} state={selectedStates[2]} />
          <Wire startX={108} startY={479} endX={chipX} endY={inputPins[3].y} state={selectedStates[3]} />

          {/* SELECT WIRES - PASSIVE */}
          <Wire
            startX={148}
            startY={629}
            endX={selectPins[0].x}
            endY={selectPins[0].y}
            state={false}
            elbow="horizontal"
          />
          <Wire
            startX={263}
            startY={629}
            endX={selectPins[1].x}
            endY={selectPins[1].y}
            state={false}
            elbow="horizontal"
          />

          {/* SELECT WIRES - ACTIVE */}
          <Wire
            startX={148}
            startY={629}
            endX={selectPins[0].x}
            endY={selectPins[0].y}
            state={analysis.S1 === 1}
            elbow="horizontal"
          />
          <Wire
            startX={263}
            startY={629}
            endX={selectPins[1].x}
            endY={selectPins[1].y}
            state={analysis.S0 === 1}
            elbow="horizontal"
          />

          {/* SELECT PIN DOTS */}
          <div
            style={{
              position: "absolute",
              left: selectPins[0].x - 6,
              top: selectPins[0].y - 6,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#f472b6",
              boxShadow: "0 0 8px rgba(244,114,182,0.55)",
              zIndex: 6
            }}
          />
          <div
            style={{
              position: "absolute",
              left: selectPins[1].x - 6,
              top: selectPins[1].y - 6,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#f472b6",
              boxShadow: "0 0 8px rgba(244,114,182,0.55)",
              zIndex: 6
            }}
          />

          {/* SELECT LABELS ON CHIP */}
          <div
            style={{
              position: "absolute",
              left: selectPins[0].x - 12,
              top: selectPins[0].y - 34,
              color: "#f9a8d4",
              fontWeight: 800,
              fontSize: "0.88rem",
              zIndex: 6
            }}
          >
            S1
          </div>
          <div
            style={{
              position: "absolute",
              left: selectPins[1].x - 12,
              top: selectPins[1].y - 34,
              color: "#f9a8d4",
              fontWeight: 800,
              fontSize: "0.88rem",
              zIndex: 6
            }}
          >
            S0
          </div>

          {/* OUTPUT WIRES */}
          <Wire
            startX={outputPin.x}
            startY={outputPin.y}
            endX={715}
            endY={outputPin.y}
            state={false}
            elbow="horizontal"
            strokeWidth={5}
          />
          <Wire
            startX={outputPin.x}
            startY={outputPin.y}
            endX={715}
            endY={outputPin.y}
            state={analysis.output === 1}
            elbow="horizontal"
            strokeWidth={5}
          />

          <LED
            label={`Y = ${analysis.output}`}
            state={analysis.output === 1}
            x={745}
            y={outputPin.y - 16}
          />

          {/* INFO BADGES */}
          <div
            style={{
              position: "absolute",
              left: 635,
              top: 195,
              padding: "10px 14px",
              borderRadius: 14,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.14)",
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: "0.95rem"
            }}
          >
            Selected: <span style={{ color: "#38bdf8" }}>I{analysis.selectedIndex}</span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 330,
              top: 575,
              padding: "10px 14px",
              borderRadius: 14,
              background: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.14)",
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: "0.95rem"
            }}
          >
            S1S0 ={" "}
            <span style={{ color: "#f472b6" }}>
              {analysis.S1}
              {analysis.S0}
            </span>
          </div>
        </Breadboard>
      </div>

      <div className="sorting-sim-card" style={{ marginTop: "1rem", padding: 18 }}>
        <h3 style={{ marginBottom: "1rem", color: "#f8fafc" }}>Input Summary</h3>

        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Input</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {analysis.inputs.map((value, idx) => (
              <tr key={idx}>
                <td>I{idx}</td>
                <td style={{ color: outputColor(value), fontWeight: "bold" }}>{value}</td>
                <td>
                  <span
                    style={{
                      color: analysis.selectedIndex === idx ? "#38bdf8" : "#94a3b8",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <CheckCircle2 size={15} />
                    {analysis.selectedIndex === idx ? "Selected" : "Not Selected"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}