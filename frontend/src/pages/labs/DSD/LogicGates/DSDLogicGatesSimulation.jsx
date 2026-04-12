import React, { useEffect } from "react";

function outputColor(value) {
  return value === 1 ? "#22c55e" : "#ef4444";
}

export default function DSDLogicGatesSimulation({
  a,
  setA,
  b,
  setB,
  selectedGate,
  setSelectedGate,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [a, b, selectedGate, setExperimentRun]);

  const gateList = ["BUFFER", "NOT", "AND", "OR", "NAND", "NOR", "XOR", "XNOR"];

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Toggle the required inputs and select a gate to observe how the logic output changes.
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

        {!analysis.isSingleInput && (
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
        )}

        <div className="stat-card">
          <strong>Selected Gate</strong>
          <div style={{ marginTop: "10px" }}>{selectedGate}</div>
        </div>

        <div className="stat-card">
          <strong>Output</strong>
          <div
            style={{
              marginTop: "10px",
              fontSize: "1.4rem",
              fontWeight: "bold",
              color: outputColor(analysis.selected.output)
            }}
          >
            {analysis.selected.output}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Select Gate</h3>

        <div
          style={{
            marginTop: "0.75rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px"
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
                  borderRadius: "12px",
                  border: isActive ? "2px solid #38bdf8" : "1px solid rgba(148,163,184,0.25)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(59,130,246,0.14))"
                    : "rgba(15,23,42,0.55)",
                  color: "#e5e7eb",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div>{gate}</div>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "1.1rem",
                    color: outputColor(analysis.gates[gate].output)
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
        <h3>Current Gate Analysis</h3>

        <div
          style={{
            marginTop: "0.75rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px"
          }}
        >
          <div className="stat-card">
            <strong>Gate</strong>
            <div>{selectedGate}</div>
          </div>

          <div className="stat-card">
            <strong>Expression</strong>
            <div>{analysis.selected.expression}</div>
          </div>

          <div className="stat-card">
            <strong>Inputs</strong>
            <div>
              A = {analysis.A}
              {!analysis.isSingleInput ? `, B = ${analysis.B}` : ""}
            </div>
          </div>

          <div className="stat-card">
            <strong>Output Y</strong>
            <div style={{ color: outputColor(analysis.selected.output), fontWeight: "bold" }}>
              {analysis.selected.output}
            </div>
          </div>
        </div>

        <div className="info-box" style={{ marginTop: "1rem" }}>
          {analysis.selected.note}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>All Gate Outputs for Current Inputs</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>Gate</th>
              <th>Expression</th>
              <th>Inputs Used</th>
              <th>Output</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}