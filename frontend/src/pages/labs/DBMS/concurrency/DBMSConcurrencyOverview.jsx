import React from "react";
import { BookOpen, Target, ShieldCheck, AlertTriangle, Database } from "lucide-react";

function SharedRowPreview({ row }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="dbms-table">
        <thead>
          <tr>
            {Object.keys(row).map((column) => (
              <th key={column}>{column.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(row).map((column) => (
              <td key={column}>{row[column]}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function DBMSConcurrencyOverview({ demoType, initialRow }) {
  const isLostUpdate = demoType === "lost-update";
  const isDirtyRead = demoType === "dirty-read";
  const isLocking = demoType === "locking";

  const steps = isLostUpdate
    ? [
        "T1 reads the original value.",
        "T2 also reads the same original value.",
        "T1 updates and commits.",
        "T2 writes using stale data and overwrites T1's work."
      ]
    : isDirtyRead
    ? [
        "T1 updates but does not commit.",
        "T2 reads the temporary value.",
        "T1 rolls back.",
        "T2 has used invalid uncommitted data."
      ]
    : [
        "T1 acquires a lock on shared data.",
        "T2 tries to access the same row and waits.",
        "T1 finishes and releases the lock.",
        "T2 proceeds safely with the latest value."
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
            Learn how concurrent transactions interact with the same shared data.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>
            {isLostUpdate
              ? "Lost Update Visualizer"
              : isDirtyRead
              ? "Dirty Read Visualizer"
              : "Locking Visualizer"}
          </h3>
          <span className="overview-badge">DBMS Concurrency</span>
        </div>

        <p className="overview-hero-text">
          Concurrency control is one of the most important topics in DBMS because many users and transactions may try to access the same data at the same time.
          This experiment helps you see how anomalies occur and how DBMS techniques prevent them.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand concurrency anomalies and safe concurrent access using two transactions and one shared data row.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            Concurrency control ensures that multiple transactions running at the same time do not leave the database in an inconsistent state.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <AlertTriangle size={18} />
            <h4>Current Demo</h4>
          </div>
          <p>
            {isLostUpdate &&
              "Lost Update happens when one transaction overwrites another committed update using an old value."}
            {isDirtyRead &&
              "Dirty Read happens when one transaction reads data that another transaction has not committed yet."}
            {isLocking &&
              "Locking safely controls access so only one transaction can modify shared data at a time."}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ShieldCheck size={18} />
            <h4>Why It Matters</h4>
          </div>
          <p>
            Banking, ticket booking, shopping carts, inventory systems, and financial apps all depend on proper concurrency control.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Database size={18} />
          <h4>Flow of the Demo</h4>
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
          <h4>Shared Data Row</h4>
        </div>
        <SharedRowPreview row={initialRow} />
      </div>
    </section>
  );
}