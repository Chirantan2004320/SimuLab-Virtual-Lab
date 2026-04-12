import React, { useEffect } from "react";

function outputColor(value) {
  return value === 1 ? "#22c55e" : "#ef4444";
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

  const inputButtons = [
    ["I0", analysis.I0, setI0],
    ["I1", analysis.I1, setI1],
    ["I2", analysis.I2, setI2],
    ["I3", analysis.I3, setI3]
  ];

  const selectButtons = [
    ["S0", analysis.S0, setS0],
    ["S1", analysis.S1, setS1]
  ];

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Toggle the input lines and select lines to see which input reaches the output.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Input Lines</h3>
        <div
          style={{
            marginTop: "0.75rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px"
          }}
        >
          {inputButtons.map(([label, value, setter]) => (
            <div key={label} className="stat-card">
              <strong>{label}</strong>
              <button
                type="button"
                className="btn primary"
                onClick={() => setter((prev) => !prev)}
                style={{ marginTop: "10px", width: "100%" }}
              >
                {value}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Select Lines</h3>
        <div
          style={{
            marginTop: "0.75rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px"
          }}
        >
          {selectButtons.map(([label, value, setter]) => (
            <div key={label} className="stat-card">
              <strong>{label}</strong>
              <button
                type="button"
                className="btn primary"
                onClick={() => setter((prev) => !prev)}
                style={{ marginTop: "10px", width: "100%" }}
              >
                {value}
              </button>
            </div>
          ))}
        </div>
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
          <strong>Select Code</strong>
          <div>{analysis.S1}{analysis.S0}</div>
        </div>

        <div className="stat-card">
          <strong>Selected Input</strong>
          <div>I{analysis.selectedIndex}</div>
        </div>

        <div className="stat-card">
          <strong>Output Y</strong>
          <div style={{ color: outputColor(analysis.output), fontWeight: "bold", fontSize: "1.3rem" }}>
            {analysis.output}
          </div>
        </div>

        <div className="stat-card">
          <strong>Expression</strong>
          <div style={{ fontSize: "0.9rem" }}>{analysis.expression}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Input Summary</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>Input</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {analysis.inputs.map((value, idx) => (
              <tr
                key={idx}
                className={analysis.selectedIndex === idx ? "highlight-row" : ""}
              >
                <td>I{idx}</td>
                <td style={{ color: outputColor(value), fontWeight: "bold" }}>
                  {value}
                </td>
                <td>{analysis.selectedIndex === idx ? "Selected" : "Not Selected"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}