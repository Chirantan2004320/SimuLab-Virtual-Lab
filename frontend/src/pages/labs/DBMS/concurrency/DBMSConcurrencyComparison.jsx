import React from "react";
import { GitCompareArrows, ShieldCheck, AlertTriangle, LockKeyhole } from "lucide-react";

const comparisonContent = {
  "lost-update": {
    title: "Lost Update",
    subtitle:
      "Understand how two concurrent transactions can overwrite each other's work when they read the same old value.",
    badge: "Concurrency Anomaly",
    accent: "#f59e0b",
    summary:
      "This problem appears when both transactions work on stale data. One update succeeds, but the second update writes using an outdated value and removes the first transaction's effect.",
    cards: [
      {
        label: "Problem",
        value: "One transaction overwrites another committed update",
        icon: <AlertTriangle size={18} />
      },
      {
        label: "Cause",
        value: "Both transactions read the same old value before updating",
        icon: <GitCompareArrows size={18} />
      },
      {
        label: "Result",
        value: "Final value becomes incorrect because one update is lost",
        icon: <AlertTriangle size={18} />
      },
      {
        label: "Prevention",
        value: "Use locking, isolation levels, timestamps, or version control",
        icon: <ShieldCheck size={18} />
      }
    ],
    leftPanel: {
      title: "Without Control",
      points: [
        "T1 reads old value",
        "T2 reads same old value",
        "T1 updates and commits",
        "T2 overwrites T1 with stale data"
      ]
    },
    rightPanel: {
      title: "With Proper Control",
      points: [
        "T1 gets protected access",
        "T2 waits or re-reads latest value",
        "Only valid update is applied",
        "No committed work is lost"
      ]
    }
  },

  "dirty-read": {
    title: "Dirty Read",
    subtitle:
      "See why reading data before another transaction commits can produce invalid results.",
    badge: "Isolation Issue",
    accent: "#ef4444",
    summary:
      "A dirty read happens when one transaction reads another transaction's temporary update before that update is committed. If the first transaction rolls back, the second transaction has used invalid data.",
    cards: [
      {
        label: "Problem",
        value: "A transaction reads uncommitted data from another transaction",
        icon: <AlertTriangle size={18} />
      },
      {
        label: "Cause",
        value: "Isolation is too weak, so temporary writes become visible",
        icon: <GitCompareArrows size={18} />
      },
      {
        label: "Result",
        value: "The reader may use a value that later disappears after rollback",
        icon: <AlertTriangle size={18} />
      },
      {
        label: "Prevention",
        value: "Use read-committed or stronger isolation with proper locking",
        icon: <ShieldCheck size={18} />
      }
    ],
    leftPanel: {
      title: "Unsafe Flow",
      points: [
        "T1 writes temporary value",
        "T2 reads that uncommitted value",
        "T1 rolls back",
        "T2 has already used invalid data"
      ]
    },
    rightPanel: {
      title: "Safe Flow",
      points: [
        "T1 writes but keeps it hidden",
        "T2 waits for commit",
        "Only committed value becomes visible",
        "Rollback never leaks invalid data"
      ]
    }
  },

  locking: {
    title: "Locking Control",
    subtitle:
      "Understand how locks help transactions safely access shared data one at a time.",
    badge: "Prevention Technique",
    accent: "#22c55e",
    summary:
      "Locking avoids unsafe simultaneous access by ensuring that while one transaction is updating shared data, another transaction must wait. This helps prevent anomalies like lost updates and dirty reads.",
    cards: [
      {
        label: "Purpose",
        value: "Control safe access to shared data during concurrent execution",
        icon: <LockKeyhole size={18} />
      },
      {
        label: "Cause of Waiting",
        value: "One transaction already holds the required lock",
        icon: <GitCompareArrows size={18} />
      },
      {
        label: "Result",
        value: "Transactions execute in a safe order instead of conflicting",
        icon: <ShieldCheck size={18} />
      },
      {
        label: "Benefit",
        value: "Prevents concurrency anomalies and keeps data consistent",
        icon: <ShieldCheck size={18} />
      }
    ],
    leftPanel: {
      title: "Without Locking",
      points: [
        "Both transactions access same row together",
        "Conflicts may happen",
        "Updates may overwrite each other",
        "Inconsistent data may appear"
      ]
    },
    rightPanel: {
      title: "With Locking",
      points: [
        "T1 locks the row",
        "T2 waits until lock is released",
        "T1 commits safely",
        "T2 continues using latest valid value"
      ]
    }
  }
};

function InfoCard({ item, accent }) {
  return (
    <div
      style={{
        background: "rgba(8, 20, 45, 0.82)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 18,
        padding: 18,
        minHeight: 138
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${accent}1f`,
          color: accent,
          border: `1px solid ${accent}44`,
          marginBottom: 14
        }}
      >
        {item.icon}
      </div>

      <div
        style={{
          color: "#f8fafc",
          fontWeight: 800,
          fontSize: "1rem",
          marginBottom: 8
        }}
      >
        {item.label}
      </div>

      <div
        style={{
          color: "#cbd5e1",
          lineHeight: 1.7,
          fontSize: "0.96rem"
        }}
      >
        {item.value}
      </div>
    </div>
  );
}

function FlowPanel({ title, points, accent, dark = false }) {
  return (
    <div
      style={{
        background: dark
          ? "linear-gradient(180deg, rgba(69, 10, 10, 0.28), rgba(30, 41, 59, 0.75))"
          : "linear-gradient(180deg, rgba(2, 44, 34, 0.32), rgba(30, 41, 59, 0.75))",
        border: `1px solid ${accent}2f`,
        borderRadius: 20,
        padding: 20,
        minHeight: 250
      }}
    >
      <div
        style={{
          color: "#f8fafc",
          fontWeight: 800,
          fontSize: "1.08rem",
          marginBottom: 14
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {points.map((point, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              background: "rgba(15, 23, 42, 0.62)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 14,
              padding: "12px 14px"
            }}
          >
            <div
              style={{
                minWidth: 28,
                height: 28,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${accent}20`,
                color: accent,
                fontWeight: 800,
                fontSize: "0.85rem",
                border: `1px solid ${accent}40`
              }}
            >
              {index + 1}
            </div>

            <div
              style={{
                color: "#dbe4f0",
                lineHeight: 1.6,
                fontSize: "0.95rem"
              }}
            >
              {point}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DBMSConcurrencyComparison({ demoType }) {
  const content = comparisonContent[demoType] || comparisonContent["lost-update"];
  const accent = content.accent;

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <GitCompareArrows size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Comparison</h2>
          <p className="sorting-sim-subtitle">
            Compare the cause, effect, and prevention of this concurrency concept.
          </p>
        </div>
      </div>

      <div
        className="comparison-card"
        style={{
          marginBottom: 18,
          background: "linear-gradient(180deg, rgba(8, 20, 45, 0.86), rgba(5, 15, 35, 0.96))",
          borderRadius: 22,
          padding: 22
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "flex-start",
            marginBottom: 14
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 10px 0",
                color: "#f8fafc",
                fontSize: "1.5rem",
                fontWeight: 800
              }}
            >
              {content.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.75,
                maxWidth: 880,
                fontSize: "0.98rem"
              }}
            >
              {content.subtitle}
            </p>
          </div>

          <div
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              background: `${accent}18`,
              border: `1px solid ${accent}3d`,
              color: accent,
              fontWeight: 800,
              fontSize: "0.84rem",
              whiteSpace: "nowrap"
            }}
          >
            {content.badge}
          </div>
        </div>

        <div
          style={{
            padding: "16px 18px",
            borderRadius: 16,
            background: "rgba(15, 23, 42, 0.62)",
            border: "1px solid rgba(255,255,255,0.05)",
            color: "#dbe4f0",
            lineHeight: 1.75,
            fontSize: "0.97rem"
          }}
        >
          {content.summary}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 18
        }}
      >
        {content.cards.map((item) => (
          <InfoCard key={item.label} item={item} accent={accent} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18
        }}
      >
        <FlowPanel
          title={content.leftPanel.title}
          points={content.leftPanel.points}
          accent={demoType === "locking" ? "#ef4444" : "#f59e0b"}
          dark
        />

        <FlowPanel
          title={content.rightPanel.title}
          points={content.rightPanel.points}
          accent={demoType === "dirty-read" ? "#22c55e" : accent}
        />
      </div>
    </section>
  );
}