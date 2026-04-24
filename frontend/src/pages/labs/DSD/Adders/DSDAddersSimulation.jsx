import React, { useEffect } from "react";
import {
  PlayCircle,
  ToggleLeft,
  Sigma,
  Activity,
  CheckCircle2,
  Cpu,
  Zap,
  Binary,
  Plus,
} from "lucide-react";
import {
  Breadboard,
  Switch,
  Wire,
  LED,
  LogicChip,
} from "../../../../components/hardware/CircuitEngine";

function outputColor(value) {
  return value === 1 ? "#22c55e" : "#ef4444";
}

function outputLabel(value) {
  return value === 1 ? "HIGH (1)" : "LOW (0)";
}

function adderChipLabel(type) {
  return type === "half" ? "XOR + AND" : "2 XOR + 2 AND + OR";
}

export default function DSDAddersSimulation({
  selectedAdder,
  setSelectedAdder,
  a,
  setA,
  b,
  setB,
  cin,
  setCin,
  analysis,
  setExperimentRun,
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [selectedAdder, a, b, cin, setExperimentRun]);

  const isHalf = analysis.isHalfAdder;
  const sum = analysis.selected.sum;
  const carry = analysis.selected.carry;

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
              Toggle binary inputs and watch the selected adder generate Sum and Carry in real time.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Circuit</span>
          <span className="sorting-stat-value">{analysis.selected.title}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Input A</span>
          <span className="sorting-stat-value">{analysis.A}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Input B</span>
          <span className="sorting-stat-value">{analysis.B}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Carry In (Cin)</span>
          <span className="sorting-stat-value">{isHalf ? "Not Used" : analysis.Cin}</span>
        </div>
      </div>

      <div className="sorting-info-box">{analysis.selected.note}</div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Select Adder</h4>
          </div>

          <div className="sorting-btn-group" style={{ marginTop: 12 }}>
            <button
              type="button"
              className={selectedAdder === "half" ? "sim-btn sim-btn-primary" : "sim-btn sim-btn-muted"}
              onClick={() => setSelectedAdder("half")}
            >
              Half Adder
            </button>

            <button
              type="button"
              className={selectedAdder === "full" ? "sim-btn sim-btn-primary" : "sim-btn sim-btn-muted"}
              onClick={() => setSelectedAdder("full")}
            >
              Full Adder
            </button>
          </div>
        </div>

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

            <button
              type="button"
              className="sim-btn sim-btn-muted"
              onClick={() => setB((prev) => !prev)}
            >
              B = {analysis.B}
            </button>

            {!isHalf && (
              <button
                type="button"
                className="sim-btn sim-btn-muted"
                onClick={() => setCin((prev) => !prev)}
              >
                Cin = {analysis.Cin}
              </button>
            )}
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Sigma size={18} />
            <h4>Sum Expression</h4>
          </div>
          <p style={{ fontWeight: 700, color: "#f8fafc" }}>
            {analysis.selected.expressionSum}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Plus size={18} />
            <h4>Carry Expression</h4>
          </div>
          <p style={{ fontWeight: 700, color: "#f8fafc" }}>
            {analysis.selected.expressionCarry}
          </p>
        </div>
      </div>

      <div className="sorting-stats-grid" style={{ marginTop: 10 }}>
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Sum Output</span>
          <span className="sorting-stat-value" style={{ color: outputColor(sum) }}>
            {sum}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Carry Output</span>
          <span className="sorting-stat-value" style={{ color: outputColor(carry) }}>
            {carry}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Sum State</span>
          <span style={{ color: outputColor(sum), fontWeight: 800 }}>
            {outputLabel(sum)}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Carry State</span>
          <span style={{ color: outputColor(carry), fontWeight: 800 }}>
            {outputLabel(carry)}
          </span>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
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
            Live Adder Flow
          </div>
        </div>

        <Breadboard height={isHalf ? "560px" : "640px"}>
          {isHalf ? (
            <>
              <Switch label="INPUT A" state={a} onChange={setA} x={90} y={135} />
              <Switch label="INPUT B" state={b} onChange={setB} x={90} y={315} />

              <Wire startX={128} startY={199} endX={260} endY={232} state={a} />
              <Wire startX={128} startY={379} endX={260} endY={268} state={b} />

              <LogicChip
                label="HALF"
                labelSecondary={adderChipLabel("half")}
                x={270}
                y={210}
                state={sum === 1 || carry === 1}
                inputCount={2}
              />

          <Wire startX={370} startY={238} endX={560} endY={238} state={sum === 1} />
          <Wire startX={370} startY={270} endX={560} endY={270} state={carry === 1} />

          <LED label="SUM" state={sum === 1} x={595} y={220} />
          <LED label="CARRY" state={carry === 1} x={595} y={278} />
            </>
          ) : (
            <>
              <Switch label="INPUT A" state={a} onChange={setA} x={90} y={85} />
              <Switch label="INPUT B" state={b} onChange={setB} x={90} y={245} />
              <Switch label="CARRY IN" state={cin} onChange={setCin} x={90} y={405} />

              <Wire startX={128} startY={149} endX={260} endY={208} state={a} />
              <Wire startX={128} startY={309} endX={260} endY={240} state={b} />
              <Wire startX={128} startY={469} endX={260} endY={272} state={cin} />

              <LogicChip
                label="FULL"
                labelSecondary={adderChipLabel("full")}
                x={270}
                y={185}
                state={sum === 1 || carry === 1}
                inputCount={3}
            />

              <Wire startX={370} startY={222} endX={560} endY={222} state={sum === 1} />
              <Wire startX={370} startY={256} endX={560} endY={256} state={carry === 1} />

              <LED label="SUM" state={sum === 1} x={595} y={202} />
              <LED label="CARRY" state={carry === 1} x={595} y={262} />   
            </>
          )}
        </Breadboard>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#f8fafc" }}>Output Expressions</h3>

        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Output</th>
              <th>Expression</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sum</td>
              <td>{analysis.selected.expressionSum}</td>
              <td style={{ color: outputColor(sum), fontWeight: "bold" }}>{sum}</td>
              <td>
                <span
                  style={{
                    color: outputColor(sum),
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={15} />
                  {outputLabel(sum)}
                </span>
              </td>
            </tr>
            <tr>
              <td>Carry</td>
              <td>{analysis.selected.expressionCarry}</td>
              <td style={{ color: outputColor(carry), fontWeight: "bold" }}>{carry}</td>
              <td>
                <span
                  style={{
                    color: outputColor(carry),
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={15} />
                  {outputLabel(carry)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#f8fafc" }}>Live Interpretation</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          <div className="overview-card">
            <div className="overview-card-head">
              <Activity size={18} />
              <h4>Current Inputs</h4>
            </div>
            <p>
              A = <strong>{analysis.A}</strong>, B = <strong>{analysis.B}</strong>
              {!isHalf && (
                <>
                  , Cin = <strong>{analysis.Cin}</strong>
                </>
              )}
            </p>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Cpu size={18} />
              <h4>Output Summary</h4>
            </div>
            <p>
              Sum = <strong style={{ color: outputColor(sum) }}>{sum}</strong>, Carry ={" "}
              <strong style={{ color: outputColor(carry) }}>{carry}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}