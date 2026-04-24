import React, { useEffect } from "react";
import {
  PlayCircle,
  ToggleLeft,
  Sigma,
  Activity,
  CheckCircle2,
  Cpu,
  Zap,
} from "lucide-react";
import { Breadboard, Switch, Wire, LED, LogicChip } from "../../../../components/hardware/CircuitEngine";

function outputColor(value) {
  return value === 1 ? "#22c55e" : "#ef4444";
}

function outputLabel(value) {
  return value === 1 ? "HIGH (1)" : "LOW (0)";
}

function gateSecondaryLabel(gate) {
  const labels = {
    BUFFER: "BUFFER IC",
    NOT: "7404 IC",
    AND: "7408 IC",
    OR: "7432 IC",
    NAND: "7400 IC",
    NOR: "7402 IC",
    XOR: "7486 IC",
    XNOR: "74266 IC",
  };
  return labels[gate] || "Logic IC";
}

export default function DSDLogicGatesSimulation({
  a,
  setA,
  b,
  setB,
  selectedGate,
  setSelectedGate,
  analysis,
  setExperimentRun,
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [a, b, selectedGate, setExperimentRun]);

  const gateList = ["BUFFER", "NOT", "AND", "OR", "NAND", "NOR", "XOR", "XNOR"];
  const output = analysis.selected.output;
  const isSingle = analysis.isSingleInput;

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
              Toggle inputs and observe how the selected logic gate responds instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Input A</span>
          <span className="sorting-stat-value">{analysis.A}</span>
        </div>

        {!isSingle ? (
          <div className="sorting-stat-box">
            <span className="sorting-stat-label">Input B</span>
            <span className="sorting-stat-value">{analysis.B}</span>
          </div>
        ) : (
          <div className="sorting-stat-box">
            <span className="sorting-stat-label">Input B</span>
            <span className="sorting-stat-value">Not Used</span>
          </div>
        )}

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Gate</span>
          <span className="sorting-stat-value">{selectedGate}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Output</span>
          <span
            className="sorting-stat-value"
            style={{ color: outputColor(output) }}
          >
            {output}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.selected.note}</div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <ToggleLeft size={18} />
            <h4>Toggle Inputs</h4>
          </div>

          <div className="sorting-btn-group" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="sim-btn sim-btn-primary"
              onClick={() => setA((prev) => !prev)}
            >
              A = {analysis.A}
            </button>

            {!isSingle && (
              <button
                type="button"
                className="sim-btn sim-btn-muted"
                onClick={() => setB((prev) => !prev)}
              >
                B = {analysis.B}
              </button>
            )}
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Sigma size={18} />
            <h4>Expression</h4>
          </div>
          <p style={{ fontWeight: 700, color: "#f8fafc" }}>{analysis.selected.expression}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Logic State</h4>
          </div>
          <p style={{ color: outputColor(output), fontWeight: 800 }}>
            {outputLabel(output)}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Gate Type</h4>
          </div>
          <p>{analysis.selected.category || "Combinational Logic Gate"}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Hardware Circuit View</h3>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(56,189,248,0.10)",
              border: "1px solid rgba(56,189,248,0.22)",
              color: "#38bdf8",
              fontWeight: 700,
            }}
          >
            <Zap size={16} />
            Live Signal Flow
          </div>
        </div>

        <Breadboard height="560px">
          {isSingle ? (
            <>
              <Switch label="INPUT A" state={a} onChange={setA} x={60} y={130} />

              <Wire startX={98} startY={194} endX={222} endY={194} state={a} />

              <LogicChip
                label={selectedGate}
                labelSecondary={gateSecondaryLabel(selectedGate)}
                x={230}
                y={153}
                state={output === 1}
                inputCount={1}
              />

              <Wire startX={330} startY={194} endX={500} endY={194} state={output === 1} />

              <LED label="OUTPUT Y" state={output === 1} x={530} y={178} />
            </>
          ) : (
            <>
              <Switch label="INPUT A" state={a} onChange={setA} x={60} y={105} />
              <Switch label="INPUT B" state={b} onChange={setB} x={60} y={265} />

              <Wire startX={98} startY={169} endX={222} endY={209} state={a} />
              <Wire startX={98} startY={329} endX={222} endY={243} state={b} />

              <LogicChip
                label={selectedGate}
                labelSecondary={gateSecondaryLabel(selectedGate)}
                x={230}
                y={187}
                state={output === 1}
                inputCount={2}
              />

              <Wire startX={330} startY={228} endX={500} endY={228} state={output === 1} />

              <LED label="OUTPUT Y" state={output === 1} x={530} y={213} />
            </>
          )}
        </Breadboard>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#f8fafc" }}>Select Gate</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {gateList.map((gate) => {
            const isActive = selectedGate === gate;
            return (
              <button
                key={gate}
                type="button"
                onClick={() => setSelectedGate(gate)}
                style={{
                  padding: "14px 12px",
                  borderRadius: "14px",
                  border: isActive
                    ? "2px solid #38bdf8"
                    : "1px solid rgba(148,163,184,0.20)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(59,130,246,0.12))"
                    : "rgba(15,23,42,0.55)",
                  color: "#e5e7eb",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div>{gate}</div>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "1.05rem",
                    color: outputColor(analysis.gates[gate].output),
                  }}
                >
                  {analysis.gates[gate].output}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#f8fafc" }}>
          All Gate Outputs for Current Inputs
        </h3>

        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Gate</th>
              <th>Expression</th>
              <th>Inputs Used</th>
              <th>Output</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(analysis.gates).map(([name, gate]) => (
              <tr key={name} className={selectedGate === name ? "highlight-row" : ""}>
                <td>{name}</td>
                <td>{gate.expression}</td>
                <td>{gate.inputsRequired === 1 ? "A" : "A, B"}</td>
                <td style={{ color: outputColor(gate.output), fontWeight: "bold" }}>
                  {gate.output}
                </td>
                <td>
                  <span
                    style={{
                      color: outputColor(gate.output),
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <CheckCircle2 size={15} />
                    {outputLabel(gate.output)}
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