import React from "react";
import { Table2, CheckCircle2 } from "lucide-react";

const rows = [
  { digit: 0, pattern: "1111110" },
  { digit: 1, pattern: "0110000" },
  { digit: 2, pattern: "1101101" },
  { digit: 3, pattern: "1111001" },
  { digit: 4, pattern: "0110011" },
  { digit: 5, pattern: "1011011" },
  { digit: 6, pattern: "1011111" },
  { digit: 7, pattern: "1110000" },
  { digit: 8, pattern: "1111111" },
  { digit: 9, pattern: "1111011" }
];

export default function SevenSegmentStateTable({ analysis }) {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Table2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">State Table</h2>
          <p className="sorting-sim-subtitle">
            Segment patterns for digits 0 to 9.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        Pattern order is <strong>abcdefg</strong>. A value of 1 means the segment is ON.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Digit</th>
              <th>a</th>
              <th>b</th>
              <th>c</th>
              <th>d</th>
              <th>e</th>
              <th>f</th>
              <th>g</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const highlight = row.digit === analysis.digit;
              return (
                <tr key={row.digit} className={highlight ? "highlight-row" : ""}>
                  <td><strong>{row.digit}</strong></td>
                  {row.pattern.split("").map((bit, i) => (
                    <td key={i} style={{ color: bit === "1" ? "#22c55e" : "#94a3b8", fontWeight: "bold" }}>
                      {bit}
                    </td>
                  ))}
                  <td><strong>{row.pattern}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="overview-card" style={{ marginTop: 18 }}>
        <div className="overview-card-head">
          <CheckCircle2 size={18} />
          <h4>Current Observation</h4>
        </div>
        <p>{analysis.note}</p>
      </div>
    </section>
  );
}