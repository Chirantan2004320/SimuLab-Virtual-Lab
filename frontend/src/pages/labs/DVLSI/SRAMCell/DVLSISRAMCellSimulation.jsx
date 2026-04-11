import React, { useEffect } from "react";

export default function DVLSISRAMCellSimulation({
  storedBit,
  setStoredBit,
  bitline,
  setBitline,
  bitlineBar,
  setBitlineBar,
  wordline,
  setWordline,
  operation,
  setOperation,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [storedBit, bitline, bitlineBar, wordline, operation, setExperimentRun]);

  const handleWritePair = (value) => {
    const v = Number(value);
    setBitline(v);
    setBitlineBar(v === 1 ? 0 : 1);
  };

  const applyWriteToStorage = () => {
    if (operation === "write" && wordline === 1) {
      setStoredBit(bitline);
    }
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
          <label style={{ display: "block", marginBottom: "8px" }}>Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value="hold">Hold</option>
            <option value="read">Read</option>
            <option value="write">Write</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Stored Bit</label>
          <select
            value={storedBit}
            onChange={(e) => setStoredBit(Number(e.target.value))}
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
          <label style={{ display: "block", marginBottom: "8px" }}>Wordline</label>
          <select
            value={wordline}
            onChange={(e) => setWordline(Number(e.target.value))}
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
          <label style={{ display: "block", marginBottom: "8px" }}>Write Data</label>
          <select
            value={bitline}
            onChange={(e) => handleWritePair(e.target.value)}
            style={{
              color: "#000",
              padding: "10px 12px",
              borderRadius: "8px",
              width: "100%"
            }}
          >
            <option value={0}>Write 0</option>
            <option value={1}>Write 1</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button className="btn primary" onClick={applyWriteToStorage}>
          Apply Write
        </button>
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
          <strong>Q</strong>
          <div>{analysis.q}</div>
        </div>

        <div className="stat-card">
          <strong>Q̅</strong>
          <div>{analysis.qBar}</div>
        </div>

        <div className="stat-card">
          <strong>BL</strong>
          <div>{bitline}</div>
        </div>

        <div className="stat-card">
          <strong>BL̅</strong>
          <div>{bitlineBar}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Operation Summary</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <tbody>
            <tr>
              <td>Current Mode</td>
              <td>{analysis.logicCase}</td>
            </tr>
            <tr>
              <td>Access Left</td>
              <td>{analysis.accessLeft}</td>
            </tr>
            <tr>
              <td>Access Right</td>
              <td>{analysis.accessRight}</td>
            </tr>
            <tr>
              <td>Readable Value</td>
              <td>{analysis.readableValue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}