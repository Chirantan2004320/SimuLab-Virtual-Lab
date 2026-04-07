import React from "react";

function SimpleTable({ row }) {
  return (
    <section className="card">
      <h2>Shared Data Row</h2>

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
              {Object.keys(row).map((column) => (
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
            <tr>
              {Object.keys(row).map((column) => (
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
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DBMSConcurrencyOverview({ demoType, initialRow }) {
  const isLostUpdate = demoType === "lost-update";
  const isDirtyRead = demoType === "dirty-read";
  const isLocking = demoType === "locking";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize concurrency problems like{" "}
          {isLostUpdate ? "Lost Update" : isDirtyRead ? "Dirty Read" : "Locking Control"}
          {" "}when multiple transactions access the same data.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isLostUpdate && (
          <>
            <p>
              Lost Update happens when two transactions read the same old value and one later overwrites the other's committed update.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Both transactions read the same initial data</li>
              <li>One update can overwrite another</li>
              <li>Causes inconsistency if not controlled</li>
            </ul>
          </>
        )}

        {isDirtyRead && (
          <>
            <p>
              Dirty Read happens when one transaction reads data written by another transaction before it is committed.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Uncommitted data may later be rolled back</li>
              <li>The reading transaction may use invalid temporary data</li>
              <li>Proper isolation prevents this anomaly</li>
            </ul>
          </>
        )}

        {isLocking && (
          <>
            <p>
              Locking is a concurrency control technique where one transaction holds a lock on shared data and others must wait.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Only one transaction safely updates shared data at a time</li>
              <li>Waiting prevents unsafe simultaneous updates</li>
              <li>Helps avoid anomalies like Lost Update and Dirty Read</li>
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <h2>Transactions Used</h2>
        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li><strong>T1:</strong> first transaction</li>
          <li><strong>T2:</strong> second concurrent transaction</li>
          <li><strong>Shared Row:</strong> common balance/value accessed by both</li>
        </ul>
      </section>

      <SimpleTable row={initialRow} />
    </div>
  );
}