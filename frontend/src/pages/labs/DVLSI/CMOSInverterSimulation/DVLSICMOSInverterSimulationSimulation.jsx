import React, { useEffect } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DVLSICMOSInverterSimulationSimulation({
  vin,
  setVin,
  vdd,
  setVdd,
  switchPoint,
  setSwitchPoint,
  tpd,
  setTpd,
  loadCap,
  setLoadCap,
  analysis,
  formatNumber,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [vin, vdd, switchPoint, tpd, loadCap, setExperimentRun]);

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
            Vin (V): <strong>{formatNumber(vin)}</strong>
          </label>
          <input
            type="range"
            min="0"
            max={Math.max(vdd, 0.5)}
            step="0.1"
            value={vin}
            onChange={(e) => setVin(clamp(parseFloat(e.target.value || 0), 0, 10))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            VDD (V): <strong>{formatNumber(vdd)}</strong>
          </label>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.1"
            value={vdd}
            onChange={(e) => setVdd(clamp(parseFloat(e.target.value || 0), 0.5, 10))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Switching Point VM (V): <strong>{formatNumber(switchPoint)}</strong>
          </label>
          <input
            type="range"
            min="0"
            max={Math.max(vdd, 0.5)}
            step="0.1"
            value={switchPoint}
            onChange={(e) =>
              setSwitchPoint(clamp(parseFloat(e.target.value || 0), 0, 10))
            }
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Propagation Delay (ns): <strong>{formatNumber(tpd)}</strong>
          </label>
          <input
            type="range"
            min="0.1"
            max="20"
            step="0.1"
            value={tpd}
            onChange={(e) => setTpd(clamp(parseFloat(e.target.value || 0), 0.1, 20))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Load Capacitance (fF): <strong>{formatNumber(loadCap)}</strong>
          </label>
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={loadCap}
            onChange={(e) =>
              setLoadCap(clamp(parseFloat(e.target.value || 0), 0.1, 100))
            }
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
          <strong>Output Voltage</strong>
          <div>{formatNumber(analysis.vout)} V</div>
        </div>

        <div className="stat-card">
          <strong>Operating Region</strong>
          <div>{analysis.logicRegion}</div>
        </div>

        <div className="stat-card">
          <strong>nMOS State</strong>
          <div>{analysis.nmosState}</div>
        </div>

        <div className="stat-card">
          <strong>pMOS State</strong>
          <div>{analysis.pmosState}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>CMOS Inverter Output Analysis</h3>
        <table
          className="dbms-table"
          style={{ width: "100%", marginTop: "0.75rem" }}
        >
          <tbody>
            <tr>
              <td>Input Voltage Vin</td>
              <td>{formatNumber(vin)} V</td>
            </tr>
            <tr>
              <td>Output Voltage Vout</td>
              <td>{formatNumber(analysis.vout)} V</td>
            </tr>
            <tr>
              <td>Propagation Delay</td>
              <td>{formatNumber(analysis.delay)} ns</td>
            </tr>
            <tr>
              <td>Dynamic Power Trend</td>
              <td>{formatNumber(analysis.dynamicPower)} arb. units</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Noise Margin Interpretation</h3>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Noise Margin Low (approx): </strong>
          <span className="lab-output-value">{formatNumber(analysis.noiseMarginLow)} V</span>
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Noise Margin High (approx): </strong>
          <span className="lab-output-value">{formatNumber(analysis.noiseMarginHigh)} V</span>
        </p>
        <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
          These are simplified educational estimates based on the switching point and supply voltage.
        </p>
      </div>
    </section>
  );
}