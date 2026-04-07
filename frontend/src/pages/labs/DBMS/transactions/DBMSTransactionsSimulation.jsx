import React from "react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function AccountCard({ account, isSelected }) {
  let border = "2px solid #38bdf8";
  let background =
    "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))";
  let boxShadow = "0 4px 12px rgba(56,189,248,0.15)";

  if (isSelected) {
    border = "2px solid #facc15";
    background =
      "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(234,179,8,0.18))";
    boxShadow = "0 0 18px rgba(250,204,21,0.25)";
  }

  return (
    <div
      style={{
        minWidth: 220,
        padding: "18px 16px",
        borderRadius: 12,
        background,
        border,
        color: "#ffffff",
        boxShadow,
        transition: "all 0.25s ease"
      }}
    >
      <div style={{ fontSize: "0.95rem", color: "#cbd5e1", marginBottom: 6 }}>
        {account.account_id}
      </div>
      <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>
        {account.holder}
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>
        ₹{account.balance}
      </div>
    </div>
  );
}

export default function DBMSTransactionsSimulation({
  transactionType,
  accounts,
  runSimulation,
  reset,
  loadSample,
  message,
  selectedAccountId,
  stepHistory,
  currentStage,
  transactionState,
  totalBefore,
  totalAfter,
  transferAmount,
  isRunning
}) {
  const observationText =
    transactionType === "commit"
      ? "COMMIT permanently saves all successful transaction changes. Both debit and credit remain stored."
      : transactionType === "rollback"
      ? "ROLLBACK restores the previous consistent state when a transaction fails before completion."
      : "Atomicity ensures that either every step of the transfer succeeds together or none of them are applied.";

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation{" "}
          <span style={{ color: "#38bdf8" }}>
            ({transactionType.toUpperCase()})
          </span>
        </h2>

        <div className="buttons" style={{ marginBottom: 14 }}>
          <button className="btn primary" onClick={runSimulation} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Transaction"}
          </button>

          <button className="btn info" onClick={loadSample} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>

        <div className="info-box">
          {message || "Run the transaction simulation to begin."}
        </div>

        {currentStage && (
          <div
            style={{
              marginTop: 14,
              color: "#facc15",
              fontWeight: 700,
              fontSize: "1rem"
            }}
          >
            Current Stage: {currentStage}
          </div>
        )}

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          <InfoStatCard label="Transaction State" value={transactionState} />
          <InfoStatCard label="Transfer Amount" value={`₹${transferAmount}`} />
          <InfoStatCard label="Total Before" value={`₹${totalBefore}`} />
          <InfoStatCard label="Total After" value={`₹${totalAfter}`} />
        </div>

        <ObservationBox text={observationText} />

        <div className="workspace" style={{ flexWrap: "wrap", minHeight: 180, marginTop: 18 }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%"
            }}
          >
            {accounts.map((account) => (
              <AccountCard
                key={account.account_id}
                account={account}
                isSelected={selectedAccountId === account.account_id}
              />
            ))}
          </div>
        </div>
      </section>

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}