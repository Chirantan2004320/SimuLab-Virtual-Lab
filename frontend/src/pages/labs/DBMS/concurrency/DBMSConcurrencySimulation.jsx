import React from "react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function TransactionCard({ title, state, readValue, isActive }) {
  let border = "2px solid #38bdf8";
  let background =
    "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))";
  let boxShadow = "0 4px 12px rgba(56,189,248,0.15)";

  if (isActive) {
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
      <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ color: "#e5e7eb", marginBottom: 8 }}>
        <strong>State:</strong> {state}
      </div>
      <div style={{ color: "#e5e7eb" }}>
        <strong>Read Value:</strong> {readValue !== null ? readValue : "-"}
      </div>
    </div>
  );
}

function SharedRowCard({ row, lockHolder }) {
  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Shared Row</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14
        }}
      >
        {Object.keys(row).map((key) => (
          <div
            key={key}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              background: "rgba(15,23,42,0.45)",
              border: "1px solid rgba(56,189,248,0.25)",
              color: "#e5e7eb"
            }}
          >
            <strong style={{ color: "#38bdf8" }}>{key.toUpperCase()}</strong>
            <div style={{ marginTop: 8 }}>{row[key]}</div>
          </div>
        ))}

        <div
          style={{
            padding: "14px 16px",
            borderRadius: 10,
            background: "rgba(15,23,42,0.45)",
            border: "1px solid rgba(56,189,248,0.25)",
            color: "#e5e7eb"
          }}
        >
          <strong style={{ color: "#38bdf8" }}>LOCK HOLDER</strong>
          <div style={{ marginTop: 8 }}>{lockHolder}</div>
        </div>
      </div>
    </section>
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
      ? "Lost Update happens when two transactions read the same old value and one later overwrites the other transaction's committed update."
      : demoType === "dirty-read"
      ? "Dirty Read happens when one transaction reads data written by another transaction before that data is committed."
      : "Locking prevents unsafe concurrent access by forcing one transaction to wait while another safely finishes with the shared data.";

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation{" "}
          <span style={{ color: "#38bdf8" }}>
            ({demoType.toUpperCase()})
          </span>
        </h2>

        <div className="buttons" style={{ marginBottom: 14 }}>
          <button className="btn primary" onClick={runSimulation} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Demo"}
          </button>

          <button className="btn info" onClick={loadSample} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>

        <div className="info-box">
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
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          <InfoStatCard label="Shared Value" value={sharedRow.value} />
          <InfoStatCard label="Lock Holder" value={lockHolder} />
          <InfoStatCard label="T1 State" value={transaction1State} />
          <InfoStatCard label="T2 State" value={transaction2State} />
        </div>

        <ObservationBox text={observationText} />
        <ObservationBox text={anomalyText} />
      </section>

      <div
        style={{
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 20
        }}
      >
        <TransactionCard
          title="Transaction T1"
          state={transaction1State}
          readValue={transaction1Read}
          isActive={selectedTransaction === "T1"}
        />

        <TransactionCard
          title="Transaction T2"
          state={transaction2State}
          readValue={transaction2Read}
          isActive={selectedTransaction === "T2"}
        />
      </div>

      <SharedRowCard row={sharedRow} lockHolder={lockHolder} />

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}