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
        position: "relative",
        overflow: "hidden",
        flexShrink: 0
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: isSelected
            ? "rgba(250,204,21,0.08)"
            : "rgba(56,189,248,0.07)",
          filter: "blur(10px)"
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
          position: "relative",
          zIndex: 1
        }}
      >
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
            fontWeight: 900,
            boxShadow: isSelected
              ? "0 0 20px rgba(250,204,21,0.28)"
              : "0 0 20px rgba(56,189,248,0.22)"
          }}
        >
          {initials}
        </div>

        <div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 4
            }}
          >
            {side === "left" ? "Sender" : "Receiver"}
          </div>

          <div
            style={{
              color: "#f8fafc",
              fontSize: "1.22rem",
              fontWeight: 800
            }}
          >
            {account.holder}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#cbd5e1",
          fontSize: "0.9rem",
          marginBottom: 10,
          position: "relative",
          zIndex: 1
        }}
      >
        <Landmark size={16} />
        <span>{account.account_id}</span>
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: "2rem",
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 14,
          position: "relative",
          zIndex: 1
        }}
      >
        ₹{account.balance}
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#cbd5e1",
          fontSize: "0.82rem",
          fontWeight: 700,
          position: "relative",
          zIndex: 1
        }}
      >
        <Wallet size={14} />
        {side === "left" ? "Debit Source" : "Credit Destination"}
      </div>
    </div>
  );
}

function TransferAnimation({
  transactionType,
  currentStage,
  transferAmount,
  isRunning
}) {
  const amount = Number(transferAmount) || 0;

  const isForwardMove =
    currentStage === "Debit Step" ||
    currentStage === "Credit Step" ||
    currentStage === "Atomicity Check" ||
    currentStage === "Commit";

  const isRollbackMove =
    transactionType === "rollback" &&
    (currentStage === "Rollback" || currentStage === "Rollback Complete");

  const showToken =
    isRunning ||
    currentStage === "Commit" ||
    currentStage === "Rollback" ||
    currentStage === "Rollback Complete";

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minWidth: 220,
        maxWidth: 360,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <style>
        {`
          @keyframes txnForward {
            0% { left: 8%; transform: translateY(-50%) scale(1); opacity: 0.95; }
            50% { transform: translateY(-50%) scale(1.08); opacity: 1; }
            100% { left: 72%; transform: translateY(-50%) scale(1); opacity: 0.95; }
          }

          @keyframes txnBackward {
            0% { left: 72%; transform: translateY(-50%) scale(1); opacity: 0.95; }
            50% { transform: translateY(-50%) scale(1.08); opacity: 1; }
            100% { left: 8%; transform: translateY(-50%) scale(1); opacity: 0.95; }
          }

          @keyframes pulseRail {
            0% { opacity: 0.55; box-shadow: 0 0 0 rgba(56,189,248,0); }
            100% { opacity: 1; box-shadow: 0 0 18px rgba(56,189,248,0.12); }
          }

          @keyframes glowSuccess {
            0% { box-shadow: 0 0 0 rgba(34,197,94,0); }
            100% { box-shadow: 0 0 24px rgba(34,197,94,0.3); }
          }

          @keyframes glowFail {
            0% { box-shadow: 0 0 0 rgba(239,68,68,0); }
            100% { box-shadow: 0 0 24px rgba(239,68,68,0.3); }
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
          height: 10,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, rgba(56,189,248,0.08), rgba(129,140,248,0.2), rgba(56,189,248,0.08))",
          border: "1px solid rgba(56,189,248,0.12)",
          animation: "pulseRail 1.2s ease-in-out infinite alternate"
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "calc(50% - 28px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(15,23,42,0.95)",
          border: "1px solid rgba(56,189,248,0.2)",
          color: "#38bdf8",
          boxShadow: "0 0 20px rgba(56,189,248,0.1)",
          zIndex: 2
        }}
      >
        <ArrowRightLeft size={22} />
      </div>

      {showToken && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: isRollbackMove ? "72%" : "8%",
            transform: "translateY(-50%)",
            padding: "12px 18px",
            borderRadius: 999,
            fontWeight: 900,
            fontSize: "1rem",
            color: "#08111f",
            background: isRollbackMove
              ? "linear-gradient(135deg, #f87171, #ef4444)"
              : "linear-gradient(135deg, #34d399, #10b981)",
            boxShadow: isRollbackMove
              ? "0 0 20px rgba(239,68,68,0.32)"
              : "0 0 20px rgba(16,185,129,0.28)",
            animation: isRollbackMove
              ? "txnBackward 1.25s ease-in-out infinite alternate"
              : isForwardMove
              ? "txnForward 1.25s ease-in-out infinite alternate"
              : "none",
            zIndex: 3,
            whiteSpace: "nowrap"
          }}
        >
          ₹{amount}
        </div>
      )}

      {currentStage === "Commit" && transactionType !== "rollback" && (
        <div
          style={{
            position: "absolute",
            top: -6,
            left: "50%",
            transform: "translateX(-50%)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 14,
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.26)",
            color: "#bbf7d0",
            fontWeight: 800,
            animation: "glowSuccess 0.9s ease-in-out infinite alternate",
            zIndex: 4
          }}
        >
          <CheckCircle2 size={18} />
          Commit Saved
        </div>
      )}

      {transactionType === "rollback" &&
        (currentStage === "Rollback" || currentStage === "Rollback Complete") && (
          <div
            style={{
              position: "absolute",
              top: -6,
              left: "50%",
              transform: "translateX(-50%)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 14,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.26)",
              color: "#fecaca",
              fontWeight: 800,
              animation: "glowFail 0.9s ease-in-out infinite alternate",
              zIndex: 4
            }}
          >
            <XCircle size={18} />
            Rollback Applied
          </div>
        )}
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

        <div className="sorting-info-box">
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
          className="sorting-stats-grid"
          style={{
            marginTop: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
          }}
        >
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
            fontWeight: 600
          }}
        >
          Balance Difference:{" "}
          <span
            style={{
              color:
                amountDifference === 0
                  ? "#86efac"
                  : transactionType === "rollback"
                  ? "#fca5a5"
                  : "#facc15",
              fontWeight: 800
            }}
          >
            ₹{amountDifference}
          </span>
          <span style={{ color: "#94a3b8", marginLeft: 10 }}>
            {amountDifference === 0
              ? "Total money in the system remains consistent."
              : "Transaction is still in progress or temporarily unbalanced."}
          </span>
        </div>

        <div
          className="sorting-visualizer-wrap"
          style={{
            minHeight: 420,
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
              maxWidth: 980,
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