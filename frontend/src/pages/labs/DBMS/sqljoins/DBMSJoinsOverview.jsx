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

export default function DBMSJoinsOverview({
  joinType,
  studentsTable,
  departmentsTable
}) {
  const isInner = joinType === "inner";
  const isLeft = joinType === "left";
  const isRight = joinType === "right";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize how {isInner ? "INNER JOIN" : isLeft ? "LEFT JOIN" : "RIGHT JOIN"} combines rows from two related tables using a matching column.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isInner && (
          <>
            <p>
              INNER JOIN returns only those rows where the join condition matches in both tables.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Keeps only matching rows</li>
              <li>Unmatched rows are excluded</li>
              <li>Useful when only common records are needed</li>
            </ul>
          </>
        )}

        {isLeft && (
          <>
            <p>
              LEFT JOIN returns all rows from the left table and matching rows from the right table.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Keeps all rows from the left table</li>
              <li>Non-matching right-side values become NULL</li>
              <li>Useful when left table data must not be lost</li>
            </ul>
          </>
        )}

        {isRight && (
          <>
            <p>
              RIGHT JOIN returns all rows from the right table and matching rows from the left table.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Keeps all rows from the right table</li>
              <li>Non-matching left-side values become NULL</li>
              <li>Useful when right table data must not be lost</li>
            </ul>
          </>
        )}

        <p>
          <strong>Join Condition Used:</strong> students.department_id = departments.department_id
        </p>
      </section>

      <SimpleTable title="Students Table" rows={studentsTable} />
      <SimpleTable title="Departments Table" rows={departmentsTable} />
    </div>
  );
}