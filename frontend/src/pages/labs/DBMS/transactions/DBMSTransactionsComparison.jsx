import React from "react";
import { GitCompare, AlertTriangle, CheckCircle2, ArrowRightLeft, Database, ShieldCheck } from "lucide-react";

function AccountsTable({ title, rows }) {
  if (!rows || rows.length === 0) return null;
  const columns = Object.keys(rows[0]);

  return (
    <div className="overview-card" style={{ margin: 0 }}>
      <div className="overview-card-head">
        <Database size={18} />
        <h4>{title}</h4>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="dbms-table">
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column.toUpperCase()}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => <td key={column}>{row[column]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getComparisonContent(transactionType, initialAccounts) {
  const amount = 1000;
  const beforeRows = initialAccounts.map((acc) => ({ ...acc }));

  if (transactionType === "rollback") {
    return {
      title: "ROLLBACK Comparison",
      explanation: "ROLLBACK removes all uncommitted changes and restores the previous consistent state.",
      concept: "Rollback protects consistency by preventing partial updates.",
      beforeRows,
      intermediateRows: [
        { account_id: "A101", holder: "Aarav", balance: 4000 },
        { account_id: "B205", holder: "Diya", balance: 3000 }
      ],
      afterRows: beforeRows,
      flowCards: ["Begin transaction", "Debit sender", "Error occurs", "Rollback", "Balances restored"]
    };
  }

  return {
    title: transactionType === "commit" ? "COMMIT Comparison" : "Atomicity Comparison",
    explanation:
      transactionType === "commit"
        ? "COMMIT finalizes a successful transaction and saves the updated balances permanently."
        : "Atomicity means both debit and credit happen together, or neither remains applied.",
    concept:
      transactionType === "commit"
        ? "COMMIT demonstrates durability."
        : "Atomicity ensures all-or-nothing execution.",
    beforeRows,
    afterRows: [
      { account_id: "A101", holder: "Aarav", balance: initialAccounts[0].balance - amount },
      { account_id: "B205", holder: "Diya", balance: initialAccounts[1].balance + amount }
    ],
    flowCards:
      transactionType === "commit"
        ? ["Begin transaction", "Debit sender", "Credit receiver", "Commit", "Changes saved"]
        : ["Begin transaction", "Debit sender", "Credit receiver", "Verify atomicity", "Commit"]
  };
}

export default function DBMSTransactionsComparison({ transactionType, initialAccounts }) {
  const content = getComparisonContent(transactionType, initialAccounts);

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <GitCompare size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Comparison</h2>
          <p className="sorting-sim-subtitle">
            Compare transaction states before, during, and after {transactionType.toUpperCase()}.
          </p>
        </div>
      </div>

      <div className="overview-hero-card" style={{ marginBottom: 18 }}>
        <div className="overview-hero-header">
          <h3>{content.title}</h3>
          <span className="overview-badge">Transaction Analysis</span>
        </div>
        <p className="overview-hero-text">{content.explanation}</p>
      </div>

      <div className="overview-card" style={{ marginBottom: 20 }}>
        <div className="overview-card-head">
          <ShieldCheck size={18} />
          <h4>Concept Focus</h4>
        </div>
        <p>{content.concept}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 20 }}>
        <div style={{ background: "rgba(8,20,45,0.78)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 18 }}>
          <div className="sorting-sim-title-wrap" style={{ marginBottom: 12 }}>
            <div className="sorting-sim-icon" style={{ color: "#fca5a5", background: "rgba(239,68,68,0.12)" }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#f8fafc" }}>Before Transaction</h3>
              <p className="sorting-sim-subtitle">Original consistent database state.</p>
            </div>
          </div>
          <AccountsTable title="Accounts Before" rows={content.beforeRows} />
        </div>

        {content.intermediateRows && (
          <div style={{ background: "rgba(8,20,45,0.78)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 18 }}>
            <div className="sorting-sim-title-wrap" style={{ marginBottom: 12 }}>
              <div className="sorting-sim-icon" style={{ color: "#facc15", background: "rgba(250,204,21,0.12)" }}>
                <ArrowRightLeft size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: "#f8fafc" }}>Intermediate Failed State</h3>
                <p className="sorting-sim-subtitle">Debit happened, but credit failed.</p>
              </div>
            </div>
            <AccountsTable title="Partial Update" rows={content.intermediateRows} />
          </div>
        )}

        <div style={{ background: "rgba(8,20,45,0.78)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 18 }}>
          <div className="sorting-sim-title-wrap" style={{ marginBottom: 12 }}>
            <div className="sorting-sim-icon" style={{ color: "#86efac", background: "rgba(34,197,94,0.12)" }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#f8fafc" }}>After Transaction</h3>
              <p className="sorting-sim-subtitle">Final database state after transaction control.</p>
            </div>
          </div>
          <AccountsTable title="Accounts After" rows={content.afterRows} />
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <ArrowRightLeft size={18} />
          <h4>Transaction Flow</h4>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 14 }}>
          {content.flowCards.map((step, index) => (
            <div key={index} style={{ background: "rgba(15,23,42,0.72)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 14 }}>
              <div style={{ color: "#38bdf8", fontWeight: 900, marginBottom: 8 }}>
                Step {index + 1}
              </div>
              <div style={{ color: "#e2e8f0", fontWeight: 700 }}>{step}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}