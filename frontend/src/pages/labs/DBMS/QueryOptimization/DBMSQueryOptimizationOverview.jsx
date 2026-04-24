import React from "react";
import {
  BookOpen,
  CheckCircle2,
  Database,
  Filter,
  Layers3,
  Target,
  ArrowLeftRight,
} from "lucide-react";

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

export default function DBMSQueryOptimizationOverview({
  mode,
  studentsTable,
  enrollmentsTable,
}) {
  const isSelection = mode === "selection";
  const isProjection = mode === "projection";
  const isJoin = mode === "join";

  const theoryText = isSelection
    ? "Selection pushdown applies filter conditions as early as possible so that fewer rows move into later operators."
    : isProjection
    ? "Projection pushdown keeps only the required columns early in the plan, reducing data movement and unnecessary processing."
    : "Join optimization improves performance by choosing a better join sequence and by reducing join input size before combining tables.";

  const flowSteps = isSelection
    ? [
        "Start with the full input table.",
        "Apply WHERE conditions as early as possible.",
        "Reduce the number of rows before later operations.",
        "Pass smaller intermediate results forward.",
      ]
    : isProjection
    ? [
        "Start with the original table structure.",
        "Identify only the needed columns.",
        "Project those columns early in the plan.",
        "Reduce data carried into later stages.",
      ]
    : [
        "Identify the tables involved in the join.",
        "Filter rows before joining whenever possible.",
        "Choose a join order with smaller intermediate results.",
        "Produce the final output with lower execution cost.",
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
            Build a strong understanding of query optimization before moving to
            execution flow.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Query Optimization Visualizer</h3>
          <span className="overview-badge">Execution Cost Focus</span>
        </div>

        <p className="overview-hero-text">
          Query optimization improves how a database executes SQL by reducing
          <strong> unnecessary rows</strong>, <strong>extra columns</strong>,
          and <strong>expensive intermediate results</strong>. This lab helps you
          understand how small plan changes can make query execution much faster.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand and visualize{" "}
            {isSelection
              ? "selection pushdown"
              : isProjection
              ? "projection pushdown"
              : "join order optimization"}{" "}
            in query optimization.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>{theoryText}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            {isJoin ? <ArrowLeftRight size={18} /> : <Filter size={18} />}
            <h4>Why It Matters</h4>
          </div>
          <p>
            Better optimization reduces execution time, memory usage, and the
            size of intermediate results. It helps the DBMS choose a smarter plan
            rather than doing unnecessary work.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>What You Learn</h4>
          </div>
          <p>
            This lab helps you understand how filtering early, selecting fewer
            columns, and choosing better join inputs can improve query
            performance.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Layers3 size={18} />
          <h4>Optimization Flow</h4>
        </div>

        <ol className="overview-steps-list">
          {flowSteps.map((step, index) => (
            <li key={index}>
              <span className="overview-step-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <SimpleTable title="Students Table" rows={studentsTable} />
      {isJoin && <SimpleTable title="Enrollments Table" rows={enrollmentsTable} />}
    </section>
  );
}