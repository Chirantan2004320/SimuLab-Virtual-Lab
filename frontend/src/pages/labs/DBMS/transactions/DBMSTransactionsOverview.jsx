import React from "react";
import { Target, BookOpen, Clock3, Database, CheckCircle2 } from "lucide-react";

function AccountsTable({ rows }) {
  if (!rows || rows.length === 0) return null;

  const columns = Object.keys(rows[0]);

  return (
    <div className="overview-card">
      <div className="overview-card-head">
        <Database size={18} />
        <h4>Initial Accounts Table</h4>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="dbms-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DBMSTransactionsOverview({ transactionType, initialAccounts }) {
  const isCommit = transactionType === "commit";
  const isRollback = transactionType === "rollback";
  const isAtomicity = transactionType === "atomicity";

  const steps = isCommit
    ? [
        "Begin the transaction.",
        "Debit money from the sender account.",
        "Credit money to the receiver account.",
        "Verify all steps succeeded.",
        "Execute COMMIT to permanently save the changes."
      ]
    : isRollback
    ? [
        "Begin the transaction.",
        "Perform the first update.",
        "An error occurs before the second update completes.",
        "Execute ROLLBACK to undo all uncommitted changes.",
        "Restore the database to the previous consistent state."
      ]
    : [
        "Begin the transaction.",
        "Perform all required transaction steps.",
        "Ensure every step succeeds together.",
        "If one step fails, undo the whole transaction.",
        "This all-or-nothing behavior demonstrates Atomicity."
      ];

  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Learn how {isCommit ? "COMMIT" : isRollback ? "ROLLBACK" : "Atomicity"} works in a bank transfer example.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{isCommit ? "COMMIT" : isRollback ? "ROLLBACK" : "Atomicity"} Visualizer</h3>
          <span className="overview-badge">ACID Concept</span>
        </div>

        <p className="overview-hero-text">
          This experiment uses a simple bank transfer example to show how transactions behave.
          You will observe how database changes are either permanently saved, undone, or treated as one indivisible unit.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand and visualize how database transactions work using{" "}
            {isCommit ? "COMMIT" : isRollback ? "ROLLBACK" : "Atomicity"} in a bank transfer example.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            {isCommit && "COMMIT permanently saves all changes made during a successful transaction."}
            {isRollback && "ROLLBACK cancels all uncommitted changes if an error occurs during a transaction."}
            {isAtomicity && "Atomicity means a transaction is treated as one indivisible unit: either all steps succeed or all fail."}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>ACID Focus</h4>
          </div>
          <p>
            {isCommit && "COMMIT is strongly connected to Durability, because saved changes remain permanently stored."}
            {isRollback && "ROLLBACK helps preserve Consistency by restoring the last valid database state."}
            {isAtomicity && "Atomicity ensures that no partial transaction result remains in the database."}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Example Used</h4>
          </div>
          <p>
            Transfer money from account <strong>A101</strong> to account <strong>B205</strong>.
            This makes it easy to see debit, credit, commit, rollback, and total balance behavior.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Database size={18} />
          <h4>Execution Steps</h4>
        </div>

        <ol className="overview-steps-list">
          {steps.map((step, index) => (
            <li key={index}>
              <span className="overview-step-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Database size={18} />
          <h4>ACID Properties</h4>
        </div>
        <p>
          <strong>Atomicity:</strong> all steps succeed or all fail.
          <br />
          <strong>Consistency:</strong> the database remains valid before and after the transaction.
          <br />
          <strong>Isolation:</strong> concurrent transactions should not interfere incorrectly.
          <br />
          <strong>Durability:</strong> committed changes remain permanently saved.
        </p>
      </div>

      <AccountsTable rows={initialAccounts} />
    </section>
  );
}