import React from "react";

export default function DSDMultiplexerTruthTable({ analysis }) {
  const rows = [
    { S1: 0, S0: 0, selected: "I0" },
    { S1: 0, S0: 1, selected: "I1" },
    { S1: 1, S0: 0, selected: "I2" },
    { S1: 1, S0: 1, selected: "I3" }
  ];

  return (
    <section className="card experiment">
      <h2>Truth Table</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The truth table below shows how the select lines determine which input is connected to the output.
      </div>

      <div className="card">
        <h3>4-to-1 Multiplexer Selection Table</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
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
                  <td style={{ color: output === 1 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
                    {output}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Current Input Observation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For the current select-line combination <strong>S1S0 = {analysis.S1}{analysis.S0}</strong>,
          the multiplexer selects <strong>I{analysis.selectedIndex}</strong>.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          Since <strong>I{analysis.selectedIndex} = {analysis.output}</strong>, the output is
          <strong> {analysis.output}</strong>.
        </p>
      </div>
    </section>
  );
}