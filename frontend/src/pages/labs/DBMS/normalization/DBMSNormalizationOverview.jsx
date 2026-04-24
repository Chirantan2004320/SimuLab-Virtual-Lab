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

export default function DBMSNormalizationOverview({ normalForm, unfTable }) {
  const is1NF = normalForm === "1nf";
  const is2NF = normalForm === "2nf";
  const is3NF = normalForm === "3nf";

  const steps = is1NF
    ? [
        "Start with an unnormalized table that contains repeating groups.",
        "Identify cells containing multiple values.",
        "Split repeating values into separate rows.",
        "Ensure each field stores only one atomic value.",
        "The table is now in First Normal Form."
      ]
    : is2NF
    ? [
        "Begin with a table already in 1NF.",
        "Identify the composite key.",
        "Find non-key attributes that depend on only part of the composite key.",
        "Move partially dependent attributes into separate tables.",
        "The design is now in Second Normal Form."
      ]
    : [
        "Begin with a design already in 2NF.",
        "Check whether any non-key attribute depends on another non-key attribute.",
        "Identify transitive dependencies.",
        "Move transitively dependent attributes into a separate table.",
        "The design is now in Third Normal Form."
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
            Learn how tables are transformed into {normalForm.toUpperCase()} by removing redundancy and dependency problems.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{normalForm.toUpperCase()} Visualizer</h3>
          <span className="overview-badge">DBMS Foundation</span>
        </div>

        <p className="overview-hero-text">
          Normalization is the process of organizing data to reduce redundancy and improve dependency structure.
          In this experiment, you will see how a table is transformed into{" "}
          <strong>{normalForm.toUpperCase()}</strong> through systematic decomposition.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand and visualize how database tables are transformed into{" "}
            {is1NF ? "First Normal Form (1NF)" : is2NF ? "Second Normal Form (2NF)" : "Third Normal Form (3NF)"}{" "}
            by removing redundancy and improving dependency structure.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            {is1NF &&
              "First Normal Form ensures that every column contains atomic values and there are no repeating groups."}
            {is2NF &&
              "Second Normal Form removes partial dependency. It applies after the table is already in 1NF."}
            {is3NF &&
              "Third Normal Form removes transitive dependency. It applies after the table is already in 2NF."}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Key Focus</h4>
          </div>
          <p>
            {is1NF && "Atomic values, single-valued cells, and removal of repeating groups."}
            {is2NF && "Composite keys and removal of attributes that depend on only part of the key."}
            {is3NF && "Removal of transitive dependency so non-key attributes depend only on the primary key."}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Why This Matters</h4>
          </div>
          <p>
            Normalization helps reduce data duplication, update anomalies, and inconsistencies.
            It is a core skill in relational database design and schema creation.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Database size={18} />
          <h4>Execution Steps</h4>
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

      <SimpleTable title="Initial Unnormalized Table" rows={unfTable} />
    </section>
  );
}