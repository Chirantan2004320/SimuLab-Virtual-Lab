import React from "react";

function SimpleTable({ title, rows }) {
  if (!rows || rows.length === 0) return null;

  const columns = Object.keys(rows[0]);

  return (
    <section className="card">
      <h2>{title}</h2>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#ffffff"
          }}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  style={{
                    border: "1px solid var(--border)",
                    padding: "10px",
                    background: "var(--bg-panel-soft)",
                    textAlign: "left"
                  }}
                >
                  {column.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={column}
                    style={{
                      border: "1px solid var(--border)",
                      padding: "10px"
                    }}
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DBMSNormalizationOverview({ normalForm, unfTable }) {
  const is1NF = normalForm === "1nf";
  const is2NF = normalForm === "2nf";
  const is3NF = normalForm === "3nf";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize how database tables are transformed into{" "}
          {is1NF ? "First Normal Form (1NF)" : is2NF ? "Second Normal Form (2NF)" : "Third Normal Form (3NF)"} by removing redundancy and improving dependency structure.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {is1NF && (
          <>
            <p>
              First Normal Form ensures that every column contains atomic values and there are no repeating groups.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Each cell should contain only one value</li>
              <li>No comma-separated repeating values in one column</li>
              <li>Each row-column intersection must hold a single atomic value</li>
            </ul>
          </>
        )}

        {is2NF && (
          <>
            <p>
              Second Normal Form removes partial dependency. It applies only after the table is already in 1NF.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Table must already be in 1NF</li>
              <li>No non-key attribute should depend on only part of a composite key</li>
              <li>Split tables where partial dependency exists</li>
            </ul>
          </>
        )}

        {is3NF && (
          <>
            <p>
              Third Normal Form removes transitive dependency. It applies only after the table is already in 2NF.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Table must already be in 2NF</li>
              <li>Non-key attributes should depend only on the primary key</li>
              <li>No non-key attribute should depend on another non-key attribute</li>
            </ul>
          </>
        )}
      </section>

      <SimpleTable title="Initial Unnormalized Table" rows={unfTable} />
    </div>
  );
}