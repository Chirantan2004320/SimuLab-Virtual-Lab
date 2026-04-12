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

export default function DSDCounterTruthTable({ count, analysis }) {
  const rows = [
    { dec: 0, q1: 0, q0: 0, next: "01" },
    { dec: 1, q1: 0, q0: 1, next: "10" },
    { dec: 2, q1: 1, q0: 0, next: "11" },
    { dec: 3, q1: 1, q0: 1, next: "00" }
  ];

  return (
    <section className="card experiment">
      <h2>Truth Table</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The highlighted row corresponds to the current counter state.
      </div>

      <div className="card">
        <h3>2-bit Counter State Table</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>Decimal State</th>
              <th>Q1</th>
              <th>Q0</th>
              <th>Binary</th>
              <th>Next State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const highlight = row.dec === count;
              return (
                <tr key={i} className={highlight ? "highlight-row" : ""}>
                  <td>{row.dec}</td>
                  <td>{bitCell(row.q1, highlight && row.q1 === 1, "#38bdf8")}</td>
                  <td>{bitCell(row.q0, highlight && row.q0 === 1, "#22c55e")}</td>
                  <td><strong>{`${row.q1}${row.q0}`}</strong></td>
                  <td><strong>{row.next}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Current Observation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The counter is currently at state <strong>{analysis.binary}</strong>.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          After the next clock pulse, it will move to <strong>{analysis.nextBinary}</strong>.
        </p>
      </div>
    </section>
  );
}