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

export default function DBMSERModelingOverview({ mode, relationalTables }) {
  const isEntities = mode === "entities";
  const isRelationships = mode === "relationships";
  const isMapping = mode === "mapping";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize{" "}
          {isEntities
            ? "entities and attributes"
            : isRelationships
            ? "relationships and cardinalities"
            : "ER to relational mapping"}{" "}
          in database design.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isEntities && (
          <>
            <p>
              Entities represent real-world objects, and attributes describe their properties.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Entity examples: Student, Course, Instructor</li>
              <li>Attributes describe details like name, id, email</li>
              <li>Primary key uniquely identifies an entity instance</li>
            </ul>
          </>
        )}

        {isRelationships && (
          <>
            <p>
              Relationships describe how entities are connected to each other.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Student ENROLLS_IN Course</li>
              <li>Instructor TEACHES Course</li>
              <li>Relationships may be 1:1, 1:N, or M:N</li>
            </ul>
          </>
        )}

        {isMapping && (
          <>
            <p>
              ER to Relational Mapping converts an ER design into relational tables.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Each strong entity becomes a table</li>
              <li>Primary keys are preserved</li>
              <li>Many-to-many relationships become separate mapping tables</li>
            </ul>
          </>
        )}
      </section>

      {isMapping && <SimpleTable title="Relational Schema Result" rows={relationalTables} />}
    </div>
  );
}