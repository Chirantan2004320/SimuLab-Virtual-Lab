import React from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Database,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Wallet,
  Landmark
} from "lucide-react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function AccountCard({ account, isSelected, side }) {
  const initials = account.holder?.slice(0, 1)?.toUpperCase() || "?";

  return (
    <div
      style={{
        width: 290,
        borderRadius: 24,
        padding: 22,
        background: isSelected
          ? "linear-gradient(135deg, rgba(250,204,21,0.16), rgba(15,23,42,0.96))"
          : "linear-gradient(135deg, rgba(30,41,59,0.94), rgba(15,23,42,0.98))",
        border: isSelected
          ? "1px solid rgba(250,204,21,0.45)"
          : "1px solid rgba(56,189,248,0.28)",
        boxShadow: isSelected
          ? "0 0 30px rgba(250,204,21,0.16)"
          : "0 10px 30px rgba(2,8,23,0.35)",
        transition: "all 0.35s ease",
        flexShrink: 0
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isSelected
              ? "linear-gradient(135deg, #facc15, #f59e0b)"
              : "linear-gradient(135deg, #38bdf8, #818cf8)",
            color: "#08111f",
            fontSize: "1.1rem",
            fontWeight: 900
          }}
        >
          {initials}
        </div>

        <div>
          <div style={{ color: "#94a3b8", fontSize: "0.78rem", fontWeight: 800 }}>
            {side === "left" ? "SENDER" : "RECEIVER"}
          </div>
          <div style={{ color: "#f8fafc", fontSize: "1.22rem", fontWeight: 900 }}>
            {account.holder}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#cbd5e1", marginBottom: 10 }}>
        <Landmark size={16} />
        <span>{account.account_id}</span>
      </div>

      <div style={{ color: "#ffffff", fontSize: "2rem", fontWeight: 900 }}>
        ₹{account.balance}
      </div>

      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, color: "#cbd5e1", fontWeight: 800 }}>
        <Wallet size={14} />
        {side === "left" ? "Debit Source" : "Credit Destination"}
      </div>
    </div>
  );
}

function TransferAnimation({ transactionType, currentStage, transferAmount, isRunning }) {
  const amount = Number(transferAmount) || 0;

  const isRollbackMove =
    transactionType === "rollback" &&
    (currentStage === "Rollback" || currentStage === "Rollback Complete");

  const isForwardMove =
    currentStage === "Debit Step" ||
    currentStage === "Credit Step" ||
    currentStage === "Atomicity Check" ||
    currentStage === "Commit";

  const showMovingToken = isRunning && (isForwardMove || isRollbackMove);

  const showFinalStatus =
    !isRunning &&
    (currentStage === "Complete" ||
      currentStage === "Commit" ||
      currentStage === "Rollback Complete");

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minWidth: 280,
        maxWidth: 440,
        height: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <style>
        {`
          @keyframes txnForwardOnce {
            0% { left: 5%; transform: translateY(-50%) scale(0.9); opacity: 0.35; }
            20% { opacity: 1; }
            50% { left: 43%; transform: translateY(-72%) scale(1.12); }
            100% { left: 78%; transform: translateY(-50%) scale(1); opacity: 1; }
          }

          @keyframes txnRollbackOnce {
            0% { left: 78%; transform: translateY(-50%) scale(0.9); opacity: 0.35; }
            20% { opacity: 1; }
            50% { left: 43%; transform: translateY(-72%) scale(1.12); }
            100% { left: 5%; transform: translateY(-50%) scale(1); opacity: 1; }
          }

          @keyframes railGlow {
            0% { opacity: 0.45; }
            50% { opacity: 1; }
            100% { opacity: 0.45; }
          }

          @keyframes statusPop {
            0% { transform: translateX(-50%) scale(0.88); opacity: 0; }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          position: "absolute",
          left: "0%",
          right: "0%",
          top: "50%",
          transform: "translateY(-50%)",
          height: 9,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, rgba(56,189,248,0.08), rgba(56,189,248,0.35), rgba(56,189,248,0.08))",
          border: "1px solid rgba(56,189,248,0.16)",
          animation: isRunning ? "railGlow 1.1s ease-in-out infinite" : "none"
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "calc(50% - 30px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: 60,
          height: 60,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(15,23,42,0.98)",
          border: "1px solid rgba(56,189,248,0.28)",
          color: "#38bdf8",
          boxShadow: "0 0 26px rgba(56,189,248,0.18)",
          zIndex: 2
        }}
      >
        <ArrowRightLeft size={25} />
      </div>

      {showMovingToken && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: isRollbackMove ? "78%" : "5%",
            transform: "translateY(-50%)",
            padding: "12px 20px",
            borderRadius: 999,
            fontWeight: 900,
            fontSize: "1rem",
            color: "#06111f",
            background: isRollbackMove
              ? "linear-gradient(135deg, #fb7185, #ef4444)"
              : "linear-gradient(135deg, #34d399, #10b981)",
            boxShadow: isRollbackMove
              ? "0 0 28px rgba(239,68,68,0.38)"
              : "0 0 28px rgba(16,185,129,0.36)",
            animation: isRollbackMove
              ? "txnRollbackOnce 1.15s ease-in-out infinite"
              : "txnForwardOnce 1.15s ease-in-out infinite",
            zIndex: 4,
            whiteSpace: "nowrap"
          }}
        >
          ₹{amount}
        </div>
      )}

      {showFinalStatus && (
        <div
          style={{
            position: "absolute",
            top: -6,
            left: "50%",
            transform: "translateX(-50%)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 16px",
            borderRadius: 999,
            background:
              transactionType === "rollback"
                ? "rgba(239,68,68,0.13)"
                : "rgba(34,197,94,0.13)",
            border:
              transactionType === "rollback"
                ? "1px solid rgba(239,68,68,0.3)"
                : "1px solid rgba(34,197,94,0.3)",
            color: transactionType === "rollback" ? "#fecaca" : "#bbf7d0",
            fontWeight: 900,
            animation: "statusPop 0.35s ease-out",
            zIndex: 5
          }}
        >
          {transactionType === "rollback" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          {transactionType === "rollback" ? "Rollback Complete" : "Transaction Saved"}
        </div>
      )}
    </div>
  );
}

function Timeline({ transactionType, currentStage }) {
  const steps =
    transactionType === "rollback"
      ? ["Start", "Debit", "Error", "Rollback", "Restore"]
      : transactionType === "atomicity"
      ? ["Start", "Debit", "Credit", "Atomicity", "Commit"]
      : ["Start", "Debit", "Credit", "Commit", "Saved"];

  const stageMap = {
    "Transaction Start": 0,
    "Debit Step": 1,
    "Credit Step": 2,
    "Error Occurred": 2,
    Rollback: 3,
    "Rollback Complete": 4,
    "Atomicity Check": 3,
    Commit: transactionType === "atomicity" ? 4 : 3,
    Complete: 4
  };

  const activeIndex = stageMap[currentStage] ?? 0;

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ color: "#f8fafc", marginBottom: 12 }}>Transaction Timeline</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        {steps.map((step, index) => (
          <div
            key={step}
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              background: index <= activeIndex ? "rgba(56,189,248,0.16)" : "rgba(15,23,42,0.7)",
              border: index <= activeIndex ? "1px solid rgba(56,189,248,0.35)" : "1px solid rgba(148,163,184,0.12)",
              color: index <= activeIndex ? "#7dd3fc" : "#94a3b8",
              fontWeight: 900
            }}
          >
            {index + 1}. {step}
          </div>
        ))}
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

  const amountDifference = totalAfter - totalBefore;

  return (
    <>
      <section className="sorting-sim-card">
        <div className="sorting-sim-header">
          <div className="sorting-sim-title-wrap">
            <div className="sorting-sim-icon">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="sorting-sim-title">Simulation</h2>
              <p className="sorting-sim-subtitle">
                Watch how money moves between two users during a database transaction.
              </p>
            </div>
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
          <button className="sim-btn sim-btn-primary" onClick={runSimulation} disabled={isRunning}>
            <Play size={16} />
            {isRunning ? "Running..." : "Run Transaction"}
          </button>

          <button className="sim-btn sim-btn-muted" onClick={loadSample} disabled={isRunning}>
            <Database size={16} />
            Load Sample
          </button>

          <button className="sim-btn sim-btn-danger" onClick={reset} disabled={isRunning}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="sorting-info-box">{message || "Run the transaction simulation to begin."}</div>

        {currentStage && (
          <div style={{ marginTop: 14, color: "#facc15", fontWeight: 800, fontSize: "1rem" }}>
            Current Stage: {currentStage}
          </div>
        )}

        <div className="sorting-stats-grid" style={{ marginTop: 18 }}>
          <InfoStatCard label="Transaction State" value={transactionState} />
          <InfoStatCard label="Transfer Amount" value={`₹${transferAmount}`} />
          <InfoStatCard label="Total Before" value={`₹${totalBefore}`} />
          <InfoStatCard label="Total After" value={`₹${totalAfter}`} />
        </div>

        <ObservationBox text={observationText} />

        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 16,
            background: "rgba(15,23,42,0.5)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#cbd5e1",
            fontWeight: 700
          }}
        >
          Balance Difference:{" "}
          <span
            style={{
              color: amountDifference === 0 ? "#86efac" : "#facc15",
              fontWeight: 900
            }}
          >
            ₹{amountDifference}
          </span>
          <span style={{ color: "#94a3b8", marginLeft: 10 }}>
            {amountDifference === 0
              ? "Total money in the system remains consistent."
              : "Temporary imbalance while transaction is in progress."}
          </span>
        </div>

        <Timeline transactionType={transactionType} currentStage={currentStage || "Transaction Start"} />

        <div
          className="sorting-visualizer-wrap"
          style={{
            minHeight: 430,
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "34px 24px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1040,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
              flexWrap: "nowrap"
            }}
          >
            {accounts[0] && (
              <AccountCard
                account={accounts[0]}
                isSelected={selectedAccountId === accounts[0].account_id}
                side="left"
              />
            )}

            <TransferAnimation
              transactionType={transactionType}
              currentStage={currentStage}
              transferAmount={transferAmount}
              isRunning={isRunning}
            />

            {accounts[1] && (
              <AccountCard
                account={accounts[1]}
                isSelected={selectedAccountId === accounts[1].account_id}
                side="right"
              />
            )}
          </div>
        </div>
      </section>

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}