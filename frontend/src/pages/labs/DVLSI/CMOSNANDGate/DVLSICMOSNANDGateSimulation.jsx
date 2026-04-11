import React, { useEffect } from "react";

export default function DVLSICMOSNANDSimulation({
  A,
  setA,
  B,
  setB,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [A, B, setExperimentRun]);

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "1rem"
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Input A</label>
          <select
            value={A}
            onChange={(e) => setA(Number(e.target.value))}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Input B</label>
          <select
            value={B}
            onChange={(e) => setB(Number(e.target.value))}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
          </select>
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
          <strong>Input A</strong>
          <div>{A}</div>
        </div>

        <div className="stat-card">
          <strong>Input B</strong>
          <div>{B}</div>
        </div>

        <div className="stat-card">
          <strong>Output Y</strong>
          <div>{analysis.output}</div>
        </div>

        <div className="stat-card">
          <strong>Logic Case</strong>
          <div>{analysis.logicCase}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Transistor State Summary</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <tbody>
            <tr>
              <td>pMOS A</td>
              <td>{analysis.pmosA}</td>
            </tr>
            <tr>
              <td>pMOS B</td>
              <td>{analysis.pmosB}</td>
            </tr>
            <tr>
              <td>nMOS A</td>
              <td>{analysis.nmosA}</td>
            </tr>
            <tr>
              <td>nMOS B</td>
              <td>{analysis.nmosB}</td>
            </tr>
            <tr>
              <td>Current Path</td>
              <td>{analysis.currentPath}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}