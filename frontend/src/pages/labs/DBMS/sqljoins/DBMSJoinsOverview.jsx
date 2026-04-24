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

export default function DBMSJoinsOverview({
  joinType,
  studentsTable,
  departmentsTable
}) {
  const isInner = joinType === "inner";
  const isLeft = joinType === "left";
  const isRight = joinType === "right";

  const steps = isInner
    ? [
        "Scan rows from the students table.",
        "Find rows in the departments table with matching department_id.",
        "Keep only those rows where a match exists in both tables.",
        "Combine matching values into one result row.",
        "Exclude unmatched rows from the final result."
      ]
    : isLeft
    ? [
        "Scan rows from the students table first.",
        "Find matching rows in the departments table.",
        "Keep all rows from the students table.",
        "Where no department match exists, fill right-side columns with NULL.",
        "Return the combined result."
      ]
    : [
        "Scan rows from the departments table first.",
        "Find matching rows in the students table.",
        "Keep all rows from the departments table.",
        "Where no student match exists, fill left-side columns with NULL.",
        "Return the combined result."
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
            Learn how {joinType.toUpperCase()} JOIN combines rows from related tables.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{joinType.toUpperCase()} JOIN Visualizer</h3>
          <span className="overview-badge">DBMS Foundation</span>
        </div>

        <p className="overview-hero-text">
          SQL joins combine rows from two related tables using a matching condition.
          In this experiment, you will visualize how <strong>{joinType.toUpperCase()} JOIN</strong>
          works step by step using the condition{" "}
          <strong>students.department_id = departments.department_id</strong>.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand and visualize how {joinType.toUpperCase()} JOIN combines
            rows from two related tables using a matching column.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            {isInner &&
              "INNER JOIN returns only rows that have matching values in both tables."}
            {isLeft &&
              "LEFT JOIN returns all rows from the left table and matching rows from the right table. Unmatched right-side values become NULL."}
            {isRight &&
              "RIGHT JOIN returns all rows from the right table and matching rows from the left table. Unmatched left-side values become NULL."}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Join Condition</h4>
          </div>
          <p>
            The join is performed using the condition:
            <br />
            <strong>students.department_id = departments.department_id</strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Why This Matters</h4>
          </div>
          <p>
            Joins are essential in relational databases because real-world data is
            usually split into multiple related tables. Understanding joins is necessary
            before learning advanced queries, aggregation, and normalization.
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

      <SimpleTable title="Students Table" rows={studentsTable} />
      <SimpleTable title="Departments Table" rows={departmentsTable} />
    </section>
  );
}