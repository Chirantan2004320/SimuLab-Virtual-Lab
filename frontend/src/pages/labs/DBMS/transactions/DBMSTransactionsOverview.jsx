import React from "react";

function AccountsTable({ rows }) {
  if (!rows || rows.length === 0) return null;

  const columns = Object.keys(rows[0]);

  return (
    <section className="card">
      <h2>Initial Accounts Table</h2>

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

export default function DBMSTransactionsOverview({ transactionType, initialAccounts }) {
  const isCommit = transactionType === "commit";
  const isRollback = transactionType === "rollback";
  const isAtomicity = transactionType === "atomicity";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize how database transactions work using{" "}
          {isCommit ? "COMMIT" : isRollback ? "ROLLBACK" : "Atomicity"} in a bank transfer example.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isCommit && (
          <>
            <p>
              COMMIT permanently saves all changes made during a transaction.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Used after all transaction steps succeed</li>
              <li>Makes changes permanent</li>
              <li>Supports the Durability property of ACID</li>
            </ul>
          </>
        )}

        {isRollback && (
          <>
            <p>
              ROLLBACK cancels all uncommitted changes if an error occurs during a transaction.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Used when something goes wrong</li>
              <li>Returns database to previous consistent state</li>
              <li>Prevents partial updates</li>
            </ul>
          </>
        )}

        {isAtomicity && (
          <>
            <p>
              Atomicity means a transaction is treated as one indivisible unit.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Either all steps happen or none happen</li>
              <li>No partial update should remain</li>
              <li>Common example: bank transfer</li>
            </ul>
          </>
        )}

        <p>
          <strong>Example used:</strong> Transfer money from account A101 to account B205.
        </p>
      </section>

      <section className="card">
        <h2>ACID Properties</h2>
        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li><strong>Atomicity:</strong> all steps succeed or all fail</li>
          <li><strong>Consistency:</strong> database remains valid before and after transaction</li>
          <li><strong>Isolation:</strong> concurrent transactions should not interfere incorrectly</li>
          <li><strong>Durability:</strong> committed changes stay saved permanently</li>
        </ul>
      </section>

      <AccountsTable rows={initialAccounts} />
    </div>
  );
}