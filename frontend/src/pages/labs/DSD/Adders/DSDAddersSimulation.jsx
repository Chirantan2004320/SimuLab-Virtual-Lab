import React, { useEffect } from "react";

function outputColor(value) {
  return value === 1 ? "#22c55e" : "#ef4444";
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
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [selectedAdder, a, b, cin, setExperimentRun]);

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Toggle the binary inputs and observe how the selected adder produces Sum and Carry outputs.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "1rem"
        }}
      >
        <div className="stat-card">
          <strong>Select Adder</strong>
          <select
            value={selectedAdder}
            onChange={(e) => setSelectedAdder(e.target.value)}
            style={{
              marginTop: "10px",
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="half">Half Adder</option>
            <option value="full">Full Adder</option>
          </select>
        </div>

        <div className="stat-card">
          <strong>Input A</strong>
          <button
            type="button"
            className="btn primary"
            onClick={() => setA((prev) => !prev)}
            style={{ marginTop: "10px", width: "100%" }}
          >
            {analysis.A}
          </button>
        </div>

        <div className="stat-card">
          <strong>Input B</strong>
          <button
            type="button"
            className="btn primary"
            onClick={() => setB((prev) => !prev)}
            style={{ marginTop: "10px", width: "100%" }}
          >
            {analysis.B}
          </button>
        </div>

        {!analysis.isHalfAdder && (
          <div className="stat-card">
            <strong>Carry In (Cin)</strong>
            <button
              type="button"
              className="btn primary"
              onClick={() => setCin((prev) => !prev)}
              style={{ marginTop: "10px", width: "100%" }}
            >
              {analysis.Cin}
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="stat-card">
          <strong>Selected Circuit</strong>
          <div>{analysis.selected.title}</div>
        </div>

        <div className="stat-card">
          <strong>Sum</strong>
          <div style={{ color: outputColor(analysis.selected.sum), fontWeight: "bold", fontSize: "1.3rem" }}>
            {analysis.selected.sum}
          </div>
        </div>

        <div className="stat-card">
          <strong>Carry</strong>
          <div style={{ color: outputColor(analysis.selected.carry), fontWeight: "bold", fontSize: "1.3rem" }}>
            {analysis.selected.carry}
          </div>
        </div>

        <div className="stat-card">
          <strong>Inputs</strong>
          <div>
            A = {analysis.A}, B = {analysis.B}
            {!analysis.isHalfAdder ? `, Cin = ${analysis.Cin}` : ""}
          </div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.selected.note}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Output Expressions</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>Output</th>
              <th>Expression</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sum</td>
              <td>{analysis.selected.expressionSum}</td>
              <td style={{ color: outputColor(analysis.selected.sum), fontWeight: "bold" }}>
                {analysis.selected.sum}
              </td>
            </tr>
            <tr>
              <td>Carry</td>
              <td>{analysis.selected.expressionCarry}</td>
              <td style={{ color: outputColor(analysis.selected.carry), fontWeight: "bold" }}>
                {analysis.selected.carry}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}