import React, { useEffect } from "react";

export default function DVLSITransmissionGateSimulation({
  inputSignal,
  setInputSignal,
  control,
  setControl,
  mode,
  setMode,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [inputSignal, control, mode, setExperimentRun]);

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
          <label style={{ display: "block", marginBottom: "8px" }}>Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="transmission-gate">Transmission Gate</option>
            <option value="single-nmos">Single Pass nMOS</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Input Signal</label>
          <select
            value={inputSignal}
            onChange={(e) => setInputSignal(Number(e.target.value))}
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
          <label style={{ display: "block", marginBottom: "8px" }}>Control</label>
          <select
            value={control}
            onChange={(e) => setControl(Number(e.target.value))}
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
          <strong>Mode</strong>
          <div>{mode === "transmission-gate" ? "Transmission Gate" : "Single Pass nMOS"}</div>
        </div>

        <div className="stat-card">
          <strong>Input</strong>
          <div>{inputSignal}</div>
        </div>

        <div className="stat-card">
          <strong>Control</strong>
          <div>{control}</div>
        </div>

        <div className="stat-card">
          <strong>Output</strong>
          <div>{analysis.output}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Switch Behavior Summary</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <tbody>
            <tr>
              <td>Logic Case</td>
              <td>{analysis.logicCase}</td>
            </tr>
            <tr>
              <td>nMOS State</td>
              <td>{analysis.nmosState}</td>
            </tr>
            <tr>
              <td>pMOS State</td>
              <td>{analysis.pmosState}</td>
            </tr>
            <tr>
              <td>Control̅</td>
              <td>{analysis.controlBar}</td>
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