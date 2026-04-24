import React from "react";
import { Table2 } from "lucide-react";

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
    { A: 1, B: 1 },
  ];

  const rows = analysis.isSingleInput ? singleInputRows : doubleInputRows;

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
              Verify how the selected gate behaves for every possible input combination.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row corresponds to the current input combination used in the simulation.
      </div>

      <div className="card">
        <h3 style={{ color: "#f8fafc" }}>{selectedGate} Truth Table</h3>
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
        <h3 style={{ color: "#f8fafc" }}>Comparison Across All Gates</h3>
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
                          fontWeight: selectedGate === gate ? "bold" : "normal",
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
    </section>
  );
}