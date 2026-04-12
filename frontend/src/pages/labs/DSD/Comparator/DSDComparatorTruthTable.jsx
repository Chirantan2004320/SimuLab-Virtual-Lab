import React from "react";

function bitCell(value, active = false, color = "#22c55e") {
  return (
    <span
      style={{
        fontWeight: "bold",
        color: value === 1 ? color : "#9ca3af",
        background: active ? "rgba(56,189,248,0.12)" : "transparent",
        padding: "2px 8px",
        borderRadius: "999px"
      }}
    >
      {value}
    </span>
  );
}

export default function DSDComparatorTruthTable({ a, b, analysis }) {
  const rows = [
    { A: 0, B: 0, GT: 0, EQ: 1, LT: 0, relation: "A = B" },
    { A: 0, B: 1, GT: 0, EQ: 0, LT: 1, relation: "A < B" },
    { A: 1, B: 0, GT: 1, EQ: 0, LT: 0, relation: "A > B" },
    { A: 1, B: 1, GT: 0, EQ: 1, LT: 0, relation: "A = B" }
  ];

  return (
    <section className="card experiment">
      <h2>Truth Table</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The highlighted row corresponds to the current input combination.
      </div>

      <div className="card">
        <h3>1-bit Comparator Truth Table</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>A</th>
              <th>B</th>
              <th>A &gt; B</th>
              <th>A = B</th>
              <th>A &lt; B</th>
              <th>Relation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const highlight = row.A === a && row.B === b;
              return (
                <tr key={i} className={highlight ? "highlight-row" : ""}>
                  <td>{row.A}</td>
                  <td>{row.B}</td>
                  <td>{bitCell(row.GT, highlight && row.GT === 1, "#22c55e")}</td>
                  <td>{bitCell(row.EQ, highlight && row.EQ === 1, "#38bdf8")}</td>
                  <td>{bitCell(row.LT, highlight && row.LT === 1, "#f59e0b")}</td>
                  <td><strong>{row.relation}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Current Observation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For inputs <strong>A = {a}</strong> and <strong>B = {b}</strong>, the comparator output is <strong>{analysis.relation}</strong>.
        </p>
      </div>
    </section>
  );
}