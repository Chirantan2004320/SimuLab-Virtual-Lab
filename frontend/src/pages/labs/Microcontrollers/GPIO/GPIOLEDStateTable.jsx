import React from "react";

export default function GPIOLEDTruthTable({ ledState }) {
  const rows = [
    { gpio: 0, led: 0 },
    { gpio: 1, led: 1 }
  ];

  return (
    <section className="card experiment">
      <h2>Truth Table</h2>

      <table className="dbms-table">
        <thead>
          <tr>
            <th>GPIO</th>
            <th>LED</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => {
            const active = r.gpio === ledState;
            return (
              <tr key={i} className={active ? "highlight-row" : ""}>
                <td>{r.gpio}</td>
                <td>{r.led}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}