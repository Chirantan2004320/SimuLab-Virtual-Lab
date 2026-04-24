import React from "react";
import { Table2, CheckCircle2 } from "lucide-react";

export default function DSDMultiplexerTruthTable({ analysis }) {
  const rows = [
    { S1: 0, S0: 0, selected: "I0" },
    { S1: 0, S0: 1, selected: "I1" },
    { S1: 1, S0: 0, selected: "I2" },
    { S1: 1, S0: 1, selected: "I3" },
  ];

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Table2 size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Truth Table</h2>
            <p className="sorting-sim-subtitle">
              Verify how the select lines decide which input is connected to the output.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row matches the current select-line combination.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ color: "#f8fafc", marginBottom: "1rem" }}>4-to-1 Multiplexer Selection Table</h3>

        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>S1</th>
              <th>S0</th>
              <th>Selected Input</th>
              <th>Output Y</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const highlight = row.S1 === analysis.S1 && row.S0 === analysis.S0;
              const output =
                row.selected === "I0"
                  ? analysis.I0
                  : row.selected === "I1"
                  ? analysis.I1
                  : row.selected === "I2"
                  ? analysis.I2
                  : analysis.I3;

              return (
                <tr key={index} className={highlight ? "highlight-row" : ""}>
                  <td>{row.S1}</td>
                  <td>{row.S0}</td>
                  <td>{row.selected}</td>
                  <td
                    style={{
                      color: output === 1 ? "#22c55e" : "#ef4444",
                      fontWeight: "bold",
                    }}
                  >
                    {output}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="overview-grid" style={{ marginTop: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Current Input Observation</h4>
          </div>
          <p>
            For the current select code <strong>{analysis.selectCode}</strong>, the multiplexer selects{" "}
            <strong>{analysis.selectedInputLabel}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Table2 size={18} />
            <h4>Output Result</h4>
          </div>
          <p>
            Since <strong>{analysis.selectedInputLabel} = {analysis.output}</strong>, the output becomes{" "}
            <strong>Y = {analysis.output}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}