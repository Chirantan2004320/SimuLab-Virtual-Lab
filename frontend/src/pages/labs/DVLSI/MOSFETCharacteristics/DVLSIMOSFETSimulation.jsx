import React, { useEffect } from "react";

export default function DVLSIMOSFETSimulation({
  deviceType,
  setDeviceType,
  vgs,
  setVgs,
  vds,
  setVds,
  vt,
  setVt,
  k,
  setK,
  lambda,
  setLambda,
  analysis,
  formatNumber,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [deviceType, vgs, vds, vt, k, lambda, setExperimentRun]);

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
          <label style={{ display: "block", marginBottom: "8px" }}>Device Type</label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="nmos">nMOS</option>
            <option value="pmos">pMOS</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            VGS: <strong>{formatNumber(vgs)} V</strong>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={vgs}
            onChange={(e) => setVgs(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            VDS: <strong>{formatNumber(vds)} V</strong>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={vds}
            onChange={(e) => setVds(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Threshold Voltage VT: <strong>{formatNumber(vt)} V</strong>
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={vt}
            onChange={(e) => setVt(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Device Constant k: <strong>{formatNumber(k)}</strong>
          </label>
          <input
            type="range"
            min="0.2"
            max="5"
            step="0.1"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Channel-Length Modulation λ: <strong>{formatNumber(lambda, 3)}</strong>
          </label>
          <input
            type="range"
            min="0"
            max="0.1"
            step="0.005"
            value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
            style={{ width: "100%" }}
          />
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
          <strong>Region</strong>
          <div>{analysis.region}</div>
        </div>

        <div className="stat-card">
          <strong>Drain Current Id</strong>
          <div>{formatNumber(analysis.id, 4)} A</div>
        </div>

        <div className="stat-card">
          <strong>Overdrive VOV</strong>
          <div>{formatNumber(Math.max(0, analysis.overdrive))} V</div>
        </div>

        <div className="stat-card">
          <strong>Conduction State</strong>
          <div>{analysis.conductionState}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Small-Signal / Device Insight</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <tbody>
            <tr>
              <td>Channel State</td>
              <td>{analysis.channelState}</td>
            </tr>
            <tr>
              <td>Transconductance gm</td>
              <td>{formatNumber(analysis.gm, 4)} S</td>
            </tr>
            <tr>
              <td>Output Resistance ro</td>
              <td>
                {Number.isFinite(analysis.ro) ? `${formatNumber(analysis.ro, 3)} Ω` : "∞"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}