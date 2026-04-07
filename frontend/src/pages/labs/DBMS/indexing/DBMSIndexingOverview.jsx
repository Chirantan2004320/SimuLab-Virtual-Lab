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

function IndexTable({ indexMap }) {
  const rows = Object.keys(indexMap).map((key) => ({
    indexed_roll_no: Number(key),
    row_position: indexMap[key] + 1
  }));

  return <SimpleTable title="Index Structure (roll_no → row position)" rows={rows} />;
}

export default function DBMSIndexingOverview({ searchMode, studentRecords, indexMap }) {
  const isLinear = searchMode === "linear";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize the difference between searching a table{" "}
          {isLinear ? "without using an index" : "using an index"}.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isLinear ? (
          <>
            <p>
              Without an index, the DBMS may scan rows one by one until it finds the required record.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Often called a linear scan or full table scan</li>
              <li>May inspect many rows before finding a match</li>
              <li>Becomes slower as table size grows</li>
            </ul>
          </>
        ) : (
          <>
            <p>
              An index is a lookup structure that helps the DBMS find rows faster without scanning the entire table.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Stores searchable key values with row references</li>
              <li>Reduces the number of comparisons needed</li>
              <li>Improves query performance for search operations</li>
            </ul>
          </>
        )}
      </section>

      <SimpleTable title="Student Records Table" rows={studentRecords} />
      {!isLinear && <IndexTable indexMap={indexMap} />}
    </div>
  );
}