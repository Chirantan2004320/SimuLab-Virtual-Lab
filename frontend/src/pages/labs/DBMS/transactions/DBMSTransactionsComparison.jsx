import React from "react";
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Database,
  ShieldCheck
} from "lucide-react";

function AccountsTable({ title, rows, highlightType }) {
  if (!rows || rows.length === 0) return null;

  const getRowStyle = (accountId) => {
    if (highlightType === "sender" && accountId === "A101") {
      return {
        background: "rgba(250,204,21,0.12)",
        borderLeft: "4px solid #facc15"
      };
    }

    if (highlightType === "receiver" && accountId === "B205") {
      return {
        background: "rgba(52,211,153,0.10)",
        borderLeft: "4px solid #34d399"
      };
    }

    if (highlightType === "rollback") {
      return {
        background: "rgba(239,68,68,0.08)"
      };
    }

    return {};
  };

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
            <tr>
              {columns.map((column) => (
                <th key={column}>{column.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={getRowStyle(row.account_id)}>
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

function getComparisonContent(transactionType, initialAccounts) {
  const amount = 1000;

  const beforeRows = initialAccounts.map((acc) => ({ ...acc }));

  if (transactionType === "commit") {
    const afterRows = [
      {
        account_id: "A101",
        holder: "Aarav",
        balance: initialAccounts[0].balance - amount
      },
      {
        account_id: "B205",
        holder: "Diya",
        balance: initialAccounts[1].balance + amount
      }
    ];

    return {
      title: "COMMIT Comparison",
      beforeTitle: "Before Transaction",
      beforeText:
        "Before the transaction starts, both account balances are in their original consistent state.",
      afterTitle: "After COMMIT",
      afterText:
        "After COMMIT, both debit and credit changes are permanently saved in the database.",
      explanation:
        "COMMIT finalizes the successful transaction. The sender loses money, the receiver gains the same amount, and the total system balance remains unchanged.",
      beforeRows,
      afterRows,
      beforeHighlight: null,
      afterHighlight: null,
      flowCards: [
        "Transaction begins",
        "Debit sender account",
        "Credit receiver account",
        "COMMIT saves the changes"
      ],
      concept:
        "COMMIT demonstrates Durability because once the transaction is saved, the new state persists."
    };
  }

  if (transactionType === "rollback") {
    const partialRows = [
      {
        account_id: "A101",
        holder: "Aarav",
        balance: initialAccounts[0].balance - amount
      },
      {
        account_id: "B205",
        holder: "Diya",
        balance: initialAccounts[1].balance
      }
    ];

    return {
      title: "ROLLBACK Comparison",
      beforeTitle: "Before Transaction",
      beforeText:
        "Before the transaction, both accounts are balanced correctly and the database is consistent.",
      afterTitle: "After ROLLBACK",
      afterText:
        "An error occurs after debit but before credit, so rollback restores the original balances.",
      explanation:
        "ROLLBACK removes all uncommitted changes. Even if one step happened temporarily, the database returns to its previous consistent state.",
      beforeRows,
      afterRows: initialAccounts.map((acc) => ({ ...acc })),
      intermediateRows: partialRows,
      beforeHighlight: null,
      afterHighlight: "rollback",
      flowCards: [
        "Transaction begins",
        "Debit sender account",
        "Error occurs before credit",
        "ROLLBACK undoes all changes"
      ],
      concept:
        "ROLLBACK preserves Consistency by ensuring no partial transaction result remains in the database."
    };
  }

  const afterRows = [
    {
      account_id: "A101",
      holder: "Aarav",
      balance: initialAccounts[0].balance - amount
    },
    {
      account_id: "B205",
      holder: "Diya",
      balance: initialAccounts[1].balance + amount
    }
  ];

  return {
    title: "Atomicity Comparison",
    beforeTitle: "Before Transaction",
    beforeText:
      "Before the transfer, both accounts are in a valid state and the database is consistent.",
    afterTitle: "After Atomic Transaction",
    afterText:
      "Both debit and credit happen together as one unit. If one failed, neither would remain applied.",
    explanation:
      "Atomicity means all-or-nothing. A bank transfer must never leave only one side updated, because that would create an invalid partial state.",
    beforeRows,
    afterRows,
    beforeHighlight: null,
    afterHighlight: null,
    flowCards: [
      "Transaction begins",
      "Debit sender account",
      "Credit receiver account",
      "Both succeed together or both fail"
    ],
    concept:
      "Atomicity ensures that the transaction is treated as one indivisible unit."
  };
}

export default function DBMSTransactionsComparison({
  transactionType,
  initialAccounts
}) {
  const content = getComparisonContent(transactionType, initialAccounts);

  const totalBefore = content.beforeRows.reduce((sum, row) => sum + row.balance, 0);
  const totalAfter = content.afterRows.reduce((sum, row) => sum + row.balance, 0);
  const totalIntermediate = content.intermediateRows
    ? content.intermediateRows.reduce((sum, row) => sum + row.balance, 0)
    : null;

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <GitCompare size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Comparison</h2>
          <p className="sorting-sim-subtitle">
            Compare transaction states before and after {transactionType.toUpperCase()}.
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 20
        }}
      >
        <div className="overview-card" style={{ margin: 0 }}>
          <div className="overview-card-head">
            <ShieldCheck size={18} />
            <h4>Concept Focus</h4>
          </div>
          <p>{content.concept}</p>
        </div>

        <div className="overview-card" style={{ margin: 0 }}>
          <div className="overview-card-head">
            <ArrowRightLeft size={18} />
            <h4>Total Balance Check</h4>
          </div>
          <p>
            Before: <strong>₹{totalBefore}</strong>
            <br />
            After: <strong>₹{totalAfter}</strong>
            {totalIntermediate !== null && (
              <>
                <br />
                Intermediate: <strong>₹{totalIntermediate}</strong>
              </>
            )}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: content.intermediateRows
            ? "repeat(auto-fit, minmax(300px, 1fr))"
            : "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 18,
          marginBottom: 20
        }}
      >
        <div
          style={{
            background: "rgba(8, 20, 45, 0.78)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 18
          }}
        >
          <div className="sorting-sim-title-wrap" style={{ marginBottom: 12 }}>
            <div
              className="sorting-sim-icon"
              style={{
                color: "#fca5a5",
                background: "rgba(239,68,68,0.12)",
                borderColor: "rgba(239,68,68,0.22)"
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.15rem" }}>
                {content.beforeTitle}
              </h3>
              <p className="sorting-sim-subtitle" style={{ marginTop: 4 }}>
                {content.beforeText}
              </p>
            </div>
          </div>

          <AccountsTable
            title="Accounts Before"
            rows={content.beforeRows}
            highlightType={content.beforeHighlight}
          />
        </div>

        {content.intermediateRows && (
          <div
            style={{
              background: "rgba(8, 20, 45, 0.78)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 18
            }}
          >
            <div className="sorting-sim-title-wrap" style={{ marginBottom: 12 }}>
              <div
                className="sorting-sim-icon"
                style={{
                  color: "#facc15",
                  background: "rgba(250,204,21,0.12)",
                  borderColor: "rgba(250,204,21,0.22)"
                }}
              >
                <ArrowRightLeft size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.15rem" }}>
                  Intermediate Failed State
                </h3>
                <p className="sorting-sim-subtitle" style={{ marginTop: 4 }}>
                  Debit happened, but credit did not. This is why rollback is needed.
                </p>
              </div>
            </div>

            <AccountsTable
              title="Partial Update"
              rows={content.intermediateRows}
              highlightType="sender"
            />
          </div>
        )}

        <div
          style={{
            background: "rgba(8, 20, 45, 0.78)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 18
          }}
        >
          <div className="sorting-sim-title-wrap" style={{ marginBottom: 12 }}>
            <div
              className="sorting-sim-icon"
              style={{
                color: "#86efac",
                background: "rgba(34,197,94,0.12)",
                borderColor: "rgba(34,197,94,0.22)"
              }}
            >
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.15rem" }}>
                {content.afterTitle}
              </h3>
              <p className="sorting-sim-subtitle" style={{ marginTop: 4 }}>
                {content.afterText}
              </p>
            </div>
          </div>

          <AccountsTable
            title="Accounts After"
            rows={content.afterRows}
            highlightType={content.afterHighlight}
          />
        </div>
      </div>

      <div className="overview-card" style={{ marginBottom: 20 }}>
        <div className="overview-card-head">
          <ArrowRightLeft size={18} />
          <h4>Transaction Flow</h4>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 14
          }}
        >
          {content.flowCards.map((step, index) => (
            <div
              key={index}
              style={{
                background: "rgba(15, 23, 42, 0.72)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: 14
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(56,189,248,0.12)",
                  border: "1px solid rgba(56,189,248,0.22)",
                  color: "#38bdf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  marginBottom: 10
                }}
              >
                {index + 1}
              </div>

              <div
                style={{
                  color: "#e2e8f0",
                  lineHeight: 1.6,
                  fontWeight: 600
                }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <ShieldCheck size={18} />
          <h4>What Students Should Observe</h4>
        </div>
        <p>
          In the <strong>Before</strong> state, the database is stable and consistent.
          In the <strong>After</strong> state, the result depends on the transaction type:
          <strong> COMMIT</strong> saves the change, <strong>ROLLBACK</strong> restores the old state,
          and <strong>Atomicity</strong> ensures that the transaction behaves as one all-or-nothing unit.
        </p>
      </div>
    </section>
  );
}