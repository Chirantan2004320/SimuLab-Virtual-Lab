import React from "react";

export default function SimpleTable({ title, rows }) {
  return (
    <div className="dbms-table-shell">
      <h3 className="dbms-table-title">{title}</h3>

      {rows.length === 0 ? (
        <div className="dbms-empty">No data yet. Run the simulation.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="dbms-table">
            <thead>
              <tr>
                <th>TABLE NAME</th>
                <th>COLUMNS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.table_name}</td>
                  <td>{row.columns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}