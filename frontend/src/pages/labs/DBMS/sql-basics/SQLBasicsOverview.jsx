import React from "react";

export default function DBMSSQLBasicsOverview({ sampleTable }) {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize how SQL transforms tabular data using
          SELECT, WHERE, ORDER BY, and LIMIT clauses.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          SQL is used to retrieve and manipulate data stored in relational databases.
          In this experiment, you will observe how a query is applied step by step
          on a table.
        </p>

        <p>
          <strong>Key points:</strong>
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li><strong>SELECT</strong> chooses which columns should appear in the result</li>
          <li><strong>WHERE</strong> filters rows based on a condition</li>
          <li><strong>ORDER BY</strong> sorts rows in ascending or descending order</li>
          <li><strong>LIMIT</strong> restricts the number of rows returned</li>
        </ul>

        <p>
          <strong>Use case:</strong> Useful for learning how SQL queries operate on real table data.
        </p>
      </section>

      <section className="card">
        <h2>Sample Table</h2>

        <div style={{ overflowX: "auto" }}>
          <table className="comparison-table">
            <thead>
              <tr>
                {Object.keys(sampleTable[0]).map((key) => (
                  <th key={key}>{key.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleTable.map((row) => (
                <tr key={row.id}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}