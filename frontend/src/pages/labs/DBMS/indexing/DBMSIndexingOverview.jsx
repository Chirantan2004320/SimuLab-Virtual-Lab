import React from "react";
import { Target, BookOpen, Clock3, Database, CheckCircle2 } from "lucide-react";

function SimpleTable({ title, rows }) {
  if (!rows || rows.length === 0) return null;

  const columns = Object.keys(rows[0]);

  return (
    <div className="overview-card">
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
              <tr key={rowIndex}>
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

function IndexTable({ indexMap }) {
  const rows = Object.keys(indexMap).map((key) => ({
    indexed_roll_no: Number(key),
    row_position: indexMap[key] + 1
  }));

  return <SimpleTable title="Index Structure (roll_no → row position)" rows={rows} />;
}

export default function DBMSIndexingOverview({ searchMode, studentRecords, indexMap }) {
  const isLinear = searchMode === "linear";

  const steps = isLinear
    ? [
        "Start from the first row in the table.",
        "Compare the target roll number with each row one by one.",
        "Continue scanning until a match is found or all rows are checked.",
        "This approach may take many comparisons for large tables."
      ]
    : [
        "Use the index structure built on roll_no.",
        "Look up the target value in the index.",
        "Jump directly to the row position stored in the index.",
        "This reduces the number of comparisons significantly."
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
            Understand the difference between searching with and without an index.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{isLinear ? "Search Without Index" : "Search With Index"}</h3>
          <span className="overview-badge">DBMS Performance</span>
        </div>

        <p className="overview-hero-text">
          {isLinear
            ? "Without an index, a DBMS may inspect rows one by one until it finds the required record. This is simple but slower for large tables."
            : "With an index, the DBMS can use a lookup structure to reach the required row much faster, avoiding a full scan of the table."}
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To visualize how indexing improves search performance in a database table.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Search Style</h4>
          </div>
          <p>{isLinear ? "Sequential row-by-row scan" : "Direct indexed lookup and jump"}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Database size={18} />
            <h4>Time Complexity</h4>
          </div>
          <p>{isLinear ? "Usually O(n)" : "Much faster lookup, often near O(1) or O(log n)"}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Why It Matters</h4>
          </div>
          <p>
            Indexes help databases respond faster to search queries, especially when tables contain many records.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <BookOpen size={18} />
          <h4>How It Works</h4>
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

      <SimpleTable title="Student Records Table" rows={studentRecords} />
      {!isLinear && <IndexTable indexMap={indexMap} />}
    </section>
  );
}