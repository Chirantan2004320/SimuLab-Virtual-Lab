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

export default function DBMSQueryOptimizationOverview({
  mode,
  studentsTable,
  enrollmentsTable
}) {
  const isSelection = mode === "selection";
  const isProjection = mode === "projection";
  const isJoin = mode === "join";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize{" "}
          {isSelection
            ? "selection pushdown"
            : isProjection
            ? "projection pushdown"
            : "join order optimization"}{" "}
          in query optimization.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isSelection && (
          <>
            <p>
              Selection pushdown means applying filter conditions as early as possible.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Early filtering reduces rows for later operations</li>
              <li>Smaller intermediate results improve performance</li>
              <li>Common with WHERE conditions</li>
            </ul>
          </>
        )}

        {isProjection && (
          <>
            <p>
              Projection pushdown means keeping only required columns as early as possible.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Reduces amount of data carried through the plan</li>
              <li>Avoids unnecessary column processing</li>
              <li>Useful instead of SELECT *</li>
            </ul>
          </>
        )}

        {isJoin && (
          <>
            <p>
              Join order optimization tries to reduce the cost of joins by choosing a better sequence of operations.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Filter before join when possible</li>
              <li>Use smaller inputs for join operations</li>
              <li>Reduce intermediate row count</li>
            </ul>
          </>
        )}
      </section>

      <SimpleTable title="Students Table" rows={studentsTable} />
      {isJoin && <SimpleTable title="Enrollments Table" rows={enrollmentsTable} />}
    </div>
  );
}