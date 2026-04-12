import React from "react";

function getHalfAdder(A, B) {
  return {
    sum: A ^ B,
    carry: A & B
  };
}

function getFullAdder(A, B, Cin) {
  return {
    sum: A ^ B ^ Cin,
    carry: (A & B) | (B & Cin) | (A & Cin)
  };
}

export default function DSDAddersTruthTable({ selectedAdder, analysis }) {
  const halfRows = [
    { A: 0, B: 0 },
    { A: 0, B: 1 },
    { A: 1, B: 0 },
    { A: 1, B: 1 }
  ];

  const fullRows = [
    { A: 0, B: 0, Cin: 0 },
    { A: 0, B: 0, Cin: 1 },
    { A: 0, B: 1, Cin: 0 },
    { A: 0, B: 1, Cin: 1 },
    { A: 1, B: 0, Cin: 0 },
    { A: 1, B: 0, Cin: 1 },
    { A: 1, B: 1, Cin: 0 },
    { A: 1, B: 1, Cin: 1 }
  ];

  const rows = selectedAdder === "half" ? halfRows : fullRows;

  return (
    <section className="card experiment">
      <h2>Truth Table</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The truth table below shows all possible input combinations for the selected adder circuit.
      </div>

      <div className="card">
        <h3>{analysis.selected.title} Truth Table</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>A</th>
              <th>B</th>
              {selectedAdder === "full" && <th>Cin</th>}
              <th>Sum</th>
              <th>Carry</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const result =
                selectedAdder === "half"
                  ? getHalfAdder(row.A, row.B)
                  : getFullAdder(row.A, row.B, row.Cin);

              const highlight =
                selectedAdder === "half"
                  ? row.A === analysis.A && row.B === analysis.B
                  : row.A === analysis.A && row.B === analysis.B && row.Cin === analysis.Cin;

              return (
                <tr key={index} className={highlight ? "highlight-row" : ""}>
                  <td>{row.A}</td>
                  <td>{row.B}</td>
                  {selectedAdder === "full" && <td>{row.Cin}</td>}
                  <td style={{ color: result.sum === 1 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
                    {result.sum}
                  </td>
                  <td style={{ color: result.carry === 1 ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
                    {result.carry}
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
          The highlighted row corresponds to the current input combination:
          <strong> A = {analysis.A}</strong>, <strong>B = {analysis.B}</strong>
          {selectedAdder === "full" && (
            <>
              , <strong>Cin = {analysis.Cin}</strong>
            </>
          )}.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For the selected adder, the outputs are <strong>Sum = {analysis.selected.sum}</strong> and{" "}
          <strong>Carry = {analysis.selected.carry}</strong>.
        </p>
      </div>
    </section>
  );
}