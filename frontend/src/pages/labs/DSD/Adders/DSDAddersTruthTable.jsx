import React from "react";
import { Table2, Binary, CheckCircle2 } from "lucide-react";

function getHalfAdder(A, B) {
  return {
    sum: A ^ B,
    carry: A & B,
  };
}

function getFullAdder(A, B, Cin) {
  return {
    sum: A ^ B ^ Cin,
    carry: (A & B) | (B & Cin) | (A & Cin),
  };
}

export default function DSDAddersTruthTable({ selectedAdder, analysis }) {
  const halfRows = [
    { A: 0, B: 0 },
    { A: 0, B: 1 },
    { A: 1, B: 0 },
    { A: 1, B: 1 },
  ];

  const fullRows = [
    { A: 0, B: 0, Cin: 0 },
    { A: 0, B: 0, Cin: 1 },
    { A: 0, B: 1, Cin: 0 },
    { A: 0, B: 1, Cin: 1 },
    { A: 1, B: 0, Cin: 0 },
    { A: 1, B: 0, Cin: 1 },
    { A: 1, B: 1, Cin: 0 },
    { A: 1, B: 1, Cin: 1 },
  ];

  const rows = selectedAdder === "half" ? halfRows : fullRows;

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
              Inspect all possible input combinations for the selected adder circuit.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row matches the current live input combination in the experiment.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#f8fafc" }}>
          {analysis.selected.title} Truth Table
        </h3>

        <table className="dbms-table" style={{ width: "100%" }}>
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
                  : row.A === analysis.A &&
                    row.B === analysis.B &&
                    row.Cin === analysis.Cin;

              return (
                <tr key={index} className={highlight ? "highlight-row" : ""}>
                  <td>{row.A}</td>
                  <td>{row.B}</td>
                  {selectedAdder === "full" && <td>{row.Cin}</td>}
                  <td
                    style={{
                      color: result.sum === 1 ? "#22c55e" : "#ef4444",
                      fontWeight: "bold",
                    }}
                  >
                    {result.sum}
                  </td>
                  <td
                    style={{
                      color: result.carry === 1 ? "#22c55e" : "#ef4444",
                      fontWeight: "bold",
                    }}
                  >
                    {result.carry}
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
            <Binary size={18} />
            <h4>Current Inputs</h4>
          </div>
          <p>
            A = <strong>{analysis.A}</strong>, B = <strong>{analysis.B}</strong>
            {!analysis.isHalfAdder && (
              <>
                , Cin = <strong>{analysis.Cin}</strong>
              </>
            )}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Current Outputs</h4>
          </div>
          <p>
            Sum = <strong>{analysis.selected.sum}</strong>
            <br />
            Carry = <strong>{analysis.selected.carry}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}