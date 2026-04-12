import React from "react";

function getOutput(gate, A, B) {
  if (gate === "BUFFER") return A;
  if (gate === "NOT") return 1 - A;
  if (gate === "AND") return A & B;
  if (gate === "OR") return A | B;
  if (gate === "NAND") return 1 - (A & B);
  if (gate === "NOR") return 1 - (A | B);
  if (gate === "XOR") return A ^ B;
  return 1 - (A ^ B);
}

const allGates = ["BUFFER", "NOT", "AND", "OR", "NAND", "NOR", "XOR", "XNOR"];

export default function DSDLogicGatesTruthTable({ selectedGate, analysis }) {
  const singleInputRows = [{ A: 0 }, { A: 1 }];
  const doubleInputRows = [
    { A: 0, B: 0 },
    { A: 0, B: 1 },
    { A: 1, B: 0 },
    { A: 1, B: 1 }
  ];

  const rows = analysis.isSingleInput ? singleInputRows : doubleInputRows;

  return (
    <section className="card experiment">
      <h2>Truth Table</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The table below shows how the selected logic gate responds to every possible input combination.
      </div>

      <div className="card">
        <h3>{selectedGate} Truth Table</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>A</th>
              {!analysis.isSingleInput && <th>B</th>}
              <th>Y</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const y = getOutput(selectedGate, row.A, row.B ?? 0);
              const highlight = analysis.isSingleInput
                ? row.A === analysis.A
                : row.A === analysis.A && row.B === analysis.B;

              return (
                <tr key={index} className={highlight ? "highlight-row" : ""}>
                  <td>{row.A}</td>
                  {!analysis.isSingleInput && <td>{row.B}</td>}
                  <td style={{ color: y === 1 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
                    {y}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Comparison Across All Gates</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>A</th>
              <th>B</th>
              {allGates.map((gate) => (
                <th key={gate}>{gate}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doubleInputRows.map((row, index) => {
              const highlight = row.A === analysis.A && row.B === analysis.B;
              return (
                <tr key={index} className={highlight ? "highlight-row" : ""}>
                  <td>{row.A}</td>
                  <td>{row.B}</td>
                  {allGates.map((gate) => {
                    const y = getOutput(gate, row.A, row.B);
                    return (
                      <td
                        key={gate}
                        style={{
                          color: y === 1 ? "#22c55e" : "#ef4444",
                          fontWeight: selectedGate === gate ? "bold" : "normal"
                        }}
                      >
                        {y}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Current Input Observation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The highlighted row corresponds to the current input combination.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For the selected gate <strong>{selectedGate}</strong>, the output is
          <strong> {analysis.selected.output}</strong>.
        </p>
      </div>
    </section>
  );
}