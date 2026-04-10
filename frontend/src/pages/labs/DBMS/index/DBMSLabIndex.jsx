import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../../../styles/Lab.css";
import PaymentDialog from "../../../../components/PaymentDialog";

export default function DBMSLabIndex() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const experiments = [
    {
      _id: "sql-basics",
      name: "SQL Basics Simulator",
      path: "/labs/dbms/sql-basics",
      desc: "Learn SELECT, WHERE, ORDER BY and LIMIT through interactive query simulation",
      icon: "🗄️",
      color: "#38bdf8",
      isPremium: false,
      price: 0,
      defaultDurationDays: 30
    },
    {
      _id: "joins",
      name: "SQL Joins Visualizer",
      path: "/labs/dbms/joins",
      desc: "Understand INNER JOIN and OUTER JOIN with visual table matching",
      icon: "🔗",
      color: "#10b981",
      isPremium: false,
      price: 0,
      defaultDurationDays: 30
    },
    {
      _id: "normalization",
      name: "Normalization Lab",
      path: "/labs/dbms/normalization",
      desc: "Convert tables from 1NF to 3NF step by step",
      icon: "🧩",
      color: "#f59e0b",
      isPremium: true,
      price: 49,
      defaultDurationDays: 30
    },
    {
      _id: "transactions",
      name: "Transactions Lab",
      path: "/labs/dbms/transactions",
      desc: "Visualize commit, rollback, and ACID properties",
      icon: "💳",
      color: "#a78bfa",
      isPremium: true,
      price: 59,
      defaultDurationDays: 30
    },
    {
      _id: "indexing",
      name: "Indexing Lab",
      path: "/labs/dbms/indexing",
      desc: "Compare search without index and with index using visual lookup simulation",
      icon: "📇",
      color: "#06b6d4",
      isPremium: true,
      price: 39,
      defaultDurationDays: 30
    },
    {
      _id: "concurrency",
      name: "Concurrency Control Lab",
      path: "/labs/dbms/concurrency",
      desc: "Visualize Lost Update, Dirty Read, and Locking with concurrent transactions",
      icon: "🔒",
      color: "#ef4444",
      isPremium: true,
      price: 69,
      defaultDurationDays: 30
    },
    {
      _id: "er-modeling",
      name: "ER Modelling Lab",
      path: "/labs/dbms/er-modeling",
      desc: "Visualize entities, attributes, relationships, and ER to relational mapping",
      icon: "🧭",
      color: "#14b8a6",
      isPremium: true,
      price: 45,
      defaultDurationDays: 30
    },
    {
      _id: "query-optimization",
      name: "Query Optimization Lab",
      path: "/labs/dbms/query-optimization",
      desc: "Visualize selection pushdown, projection pushdown, and join order optimization",
      icon: "⚡",
      color: "#f97316",
      isPremium: true,
      price: 79,
      defaultDurationDays: 30
    }
  ];

  const handleBuyPremium = (exp) => {
    setSelectedExp(exp);
    setShowPaymentDialog(true);
    setMessage("");
  };

  const handlePaymentSuccess = () => {
    setMessage(`Access granted for ${selectedExp?.name || "premium experiment"}.`);
  };

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">📘 DBMS Lab</h1>
        <p className="lab-desc">
          Choose an experiment to begin. Each experiment contains an interactive visual demo and a short quiz.
        </p>

        {message && (
          <div
            style={{
              marginTop: "14px",
              padding: "12px 14px",
              background: "rgba(34,197,94,0.12)",
              borderLeft: "4px solid #22c55e",
              borderRadius: "8px",
              color: "#dcfce7",
              fontWeight: 600
            }}
          >
            {message}
          </div>
        )}
      </div>

      <section className="lab-list">
        {experiments.map((exp, i) => (
          <div
            key={i}
            className="card experiment-card"
            style={{ borderLeftColor: exp.color }}
          >
            <div className="experiment-header">
              <span className="experiment-icon">{exp.icon}</span>

              <div style={{ flex: 1 }}>
                <h3 className="experiment-name">{exp.name}</h3>

                <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                  {exp.isPremium ? (
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#fbbf24",
                        background: "rgba(251,191,36,0.12)",
                        border: "1px solid rgba(251,191,36,0.25)",
                        padding: "4px 8px",
                        borderRadius: "999px"
                      }}
                    >
                      Premium
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#22c55e",
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        padding: "4px 8px",
                        borderRadius: "999px"
                      }}
                    >
                      Free
                    </span>
                  )}

                  {exp.isPremium && (
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#e5e7eb",
                        background: "rgba(148,163,184,0.12)",
                        border: "1px solid rgba(148,163,184,0.2)",
                        padding: "4px 8px",
                        borderRadius: "999px"
                      }}
                    >
                      ₹{exp.price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="experiment-info">{exp.desc}</p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "auto" }}>
              <Link to={exp.path} className="experiment-btn">
                Start Experiment <span>→</span>
              </Link>

              {exp.isPremium && (
                <button
                  type="button"
                  onClick={() => handleBuyPremium(exp)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.9rem 1.6rem",
                    background: "transparent",
                    color: "#fbbf24",
                    border: "1px solid rgba(251,191,36,0.4)",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(251,191,36,0.08)"
                  }}
                >
                  Buy Premium
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {showPaymentDialog && selectedExp && (
        <PaymentDialog
          selectedExp={selectedExp}
          user={user}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPaymentDialog(false);
            setSelectedExp(null);
          }}
          isLoading={isLoading}
          setLoading={setLoading}
          setMessage={setMessage}
        />
      )}
    </div>
  );
}