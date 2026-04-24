import React from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Database,
  Shield,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function TransactionCard({ title, state, readValue, isActive, accent }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 260,
        borderRadius: 22,
        padding: 20,
        background: isActive
          ? "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(15,23,42,0.92))"
          : "linear-gradient(135deg, rgba(30,41,59,0.88), rgba(15,23,42,0.96))",
        border: isActive
          ? "1px solid rgba(250,204,21,0.42)"
          : `1px solid ${accent}`,
        boxShadow: isActive
          ? "0 0 24px rgba(250,204,21,0.22)"
          : "0 10px 30px rgba(0,0,0,0.18)",
        transform: isActive ? "scale(1.03)" : "scale(1)",
        transition: "all 0.35s ease"
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#cbd5e1",
          fontSize: "0.8rem",
          fontWeight: 800,
          marginBottom: 14
        }}
      >
        <Shield size={14} />
        {title}
      </div>

      <div style={{ color: "#f8fafc", fontSize: "1.05rem", fontWeight: 800, marginBottom: 10 }}>
        State: {state}
      </div>

      <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
        <div>
          <strong>Read Value:</strong> {readValue !== null ? readValue : "-"}
        </div>
      </div>
    </div>
  );
}

function SharedRowPanel({ row, lockHolder }) {
  const isLocked = lockHolder !== "None";

  return (
    <div
      style={{
        marginTop: 22,
        borderRadius: 22,
        padding: 20,
        background: "rgba(8, 20, 45, 0.78)",
        border: "1px solid rgba(255,255,255,0.06)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 16
        }}
      >
        <div style={{ color: "#f8fafc", fontWeight: 800, fontSize: "1.05rem" }}>
          Shared Data Row
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 999,
            background: isLocked ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
            border: isLocked
              ? "1px solid rgba(239,68,68,0.28)"
              : "1px solid rgba(34,197,94,0.28)",
            color: isLocked ? "#fecaca" : "#bbf7d0",
            fontWeight: 800,
            animation: isLocked ? "pulse 1s infinite" : "none"
          }}
        >
          {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
          {isLocked ? `Locked by ${lockHolder}` : "No Active Lock"}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14
        }}
      >
        {Object.keys(row).map((key) => (
          <div
            key={key}
            style={{
              padding: "16px",
              borderRadius: 16,
              background: "rgba(15,23,42,0.58)",
              border: "1px solid rgba(56,189,248,0.18)"
            }}
          >
            <div style={{ color: "#38bdf8", fontWeight: 800, marginBottom: 8 }}>
              {key.toUpperCase()}
            </div>
            <div style={{ color: "#f8fafc", fontSize: "1.05rem", fontWeight: 700 }}>
              {row[key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DBMSConcurrencySimulation({
  demoType,
  sharedRow,
  runSimulation,
  reset,
  loadSample,
  message,
  transaction1State,
  transaction2State,
  transaction1Read,
  transaction2Read,
  lockHolder,
  currentStage,
  selectedTransaction,
  anomalyText,
  stepHistory,
  isRunning
}) {
  const observationText =
    demoType === "lost-update"
      ? "Lost Update happens when two transactions read the same old value and one later overwrites the other's committed update."
      : demoType === "dirty-read"
      ? "Dirty Read happens when one transaction reads data written by another transaction before that data is committed."
      : "Locking prevents unsafe concurrent access by forcing one transaction to wait while another safely completes.";

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.06); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      <section className="sorting-sim-card">
        <div className="sorting-sim-header">
          <div className="sorting-sim-title-wrap">
            <div className="sorting-sim-icon">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="sorting-sim-title">Simulation</h2>
              <p className="sorting-sim-subtitle">
                Watch how T1 and T2 interact with the same shared row.
              </p>
            </div>
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
          <button className="sim-btn sim-btn-primary" onClick={runSimulation} disabled={isRunning}>
            <Play size={16} />
            {isRunning ? "Running..." : "Run Demo"}
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
          {message || "Run the concurrency simulation to begin."}
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
          <InfoStatCard label="Shared Value" value={sharedRow.value} />
          <InfoStatCard label="Lock Holder" value={lockHolder} />
          <InfoStatCard label="T1 State" value={transaction1State} />
          <InfoStatCard label="T2 State" value={transaction2State} />
        </div>

        <ObservationBox text={observationText} />

        {anomalyText && (
          <div
            style={{
              marginTop: 16,
              padding: "14px 16px",
              borderRadius: 14,
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.24)",
              color: "#fecaca",
              fontWeight: 700
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <AlertTriangle size={16} />
              <span>Anomaly / Control Insight</span>
            </div>
            <div style={{ fontWeight: 600 }}>{anomalyText}</div>
          </div>
        )}

        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 18,
            flexWrap: "wrap"
          }}
        >
          <TransactionCard
            title="Transaction T1"
            state={transaction1State}
            readValue={transaction1Read}
            isActive={selectedTransaction === "T1"}
            accent="rgba(56,189,248,0.25)"
          />

          <TransactionCard
            title="Transaction T2"
            state={transaction2State}
            readValue={transaction2Read}
            isActive={selectedTransaction === "T2"}
            accent="rgba(129,140,248,0.25)"
          />
        </div>

        <SharedRowPanel row={sharedRow} lockHolder={lockHolder} />
      </section>

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}