import React, { useEffect } from "react";

export default function DVLSIRingOscillatorSimulation({
  stages,
  setStages,
  tpd,
  setTpd,
  vdd,
  setVdd,
  enabled,
  setEnabled,
  analysis,
  formatNumber,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [stages, tpd, vdd, enabled, setExperimentRun]);

  const makeOdd = (value) => {
    const v = Number(value);
    return v % 2 === 0 ? v + 1 : v;
  };

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
          <label style={{ display: "block", marginBottom: "8px" }}>
            Number of Stages: <strong>{stages}</strong>
          </label>
          <input
            type="range"
            min="3"
            max="9"
            step="1"
            value={stages}
            onChange={(e) => setStages(makeOdd(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Propagation Delay tp: <strong>{formatNumber(tpd)} ns</strong>
          </label>
          <input
            type="range"
            min="0.2"
            max="5"
            step="0.1"
            value={tpd}
            onChange={(e) => setTpd(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            VDD: <strong>{formatNumber(vdd)} V</strong>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={vdd}
            onChange={(e) => setVdd(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Enable</label>
          <select
            value={enabled ? "1" : "0"}
            onChange={(e) => setEnabled(e.target.value === "1")}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="1">Enabled</option>
            <option value="0">Disabled</option>
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
          <strong>Oscillation</strong>
          <div>{analysis.oscillates ? "YES" : "NO"}</div>
        </div>

        <div className="stat-card">
          <strong>Period</strong>
          <div>{analysis.oscillates ? `${formatNumber(analysis.period)} ns` : "—"}</div>
        </div>

        <div className="stat-card">
          <strong>Frequency</strong>
          <div>{analysis.oscillates ? `${formatNumber(analysis.frequency, 4)} GHz*` : "—"}</div>
        </div>

        <div className="stat-card">
          <strong>Status</strong>
          <div>{analysis.logicCase}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Interpretation</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <tbody>
            <tr>
              <td>Stage Count</td>
              <td>{stages}</td>
            </tr>
            <tr>
              <td>Odd Number of Stages</td>
              <td>{analysis.oddStages ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>Enable State</td>
              <td>{enabled ? "Enabled" : "Disabled"}</td>
            </tr>
            <tr>
              <td>Approximate Formula</td>
              <td>T ≈ 2 × N × tp</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: "0.75rem", color: "#9ca3af", fontSize: "0.9rem" }}>
        *Frequency unit here is educational and based on the chosen delay unit in ns.
      </p>
    </section>
  );
}