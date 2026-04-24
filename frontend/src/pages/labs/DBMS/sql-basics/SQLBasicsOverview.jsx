import React from "react";
import { Target, BookOpen, Clock3, Database, CheckCircle2 } from "lucide-react";

export default function DBMSSQLBasicsOverview({ sampleTable }) {
  const steps = [
    "SELECT chooses which columns should appear in the result.",
    "WHERE filters rows based on a condition.",
    "ORDER BY sorts the filtered rows in ascending or descending order.",
    "LIMIT restricts the number of rows returned.",
    "The final projected table shows only the selected columns."
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
            Learn how SQL queries transform tabular data step by step.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>SQL Basics Visualizer</h3>
          <span className="overview-badge">DBMS Foundation</span>
        </div>

        <p className="overview-hero-text">
          Learn how a SQL query transforms tabular data step by step using
          <strong> SELECT</strong>, <strong>WHERE</strong>, <strong>ORDER BY</strong>, and
          <strong> LIMIT</strong>. This experiment is designed to help you see how
          rows and columns change at each stage of query execution.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand and visualize how SQL transforms tabular data using
            SELECT, WHERE, ORDER BY, and LIMIT clauses.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            SQL is used to retrieve and manipulate data stored in relational
            databases. In this experiment, you will observe how a query is
            applied step by step on a table, from row filtering to final column
            projection.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Query Pipeline</h4>
          </div>
          <p>
            A typical SQL flow is: filter rows with WHERE, sort them with
            ORDER BY, restrict the output using LIMIT, and finally display only
            the required columns using SELECT.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Why This Matters</h4>
          </div>
          <p>
            These are the most common SQL clauses used in real database systems.
            Understanding them clearly is essential before moving to joins,
            grouping, and advanced query optimization.
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

      <div className="overview-card">
        <div className="overview-card-head">
          <Database size={18} />
          <h4>Sample Table</h4>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="dbms-table">
            <thead>
              <tr>
                {Object.keys(sampleTable[0]).map((key) => (
                  <th key={key}>{key.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleTable.map((row) => (
                <tr key={row.id}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}