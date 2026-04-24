import React from "react";
import { Activity, Play, RotateCcw, Database, GitCompare, AlertTriangle, CheckCircle2 } from "lucide-react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

const UNF_TABLE = [
  {
    student_id: "S1",
    student_name: "Aarav",
    course_ids: "C101, C102",
    course_names: "DBMS, OS",
    instructor_names: "Dr. Sharma, Dr. Mehta",
    department_name: "CSE",
    department_office: "Block A"
  },
  {
    student_id: "S2",
    student_name: "Diya",
    course_ids: "C103",
    course_names: "CN",
    instructor_names: "Dr. Iyer",
    department_name: "ECE",
    department_office: "Block B"
  }
];

const FIRST_NF_TABLE = [
  {
    student_id: "S1",
    student_name: "Aarav",
    course_id: "C101",
    course_name: "DBMS",
    instructor_name: "Dr. Sharma",
    department_name: "CSE",
    department_office: "Block A"
  },
  {
    student_id: "S1",
    student_name: "Aarav",
    course_id: "C102",
    course_name: "OS",
    instructor_name: "Dr. Mehta",
    department_name: "CSE",
    department_office: "Block A"
  },
  {
    student_id: "S2",
    student_name: "Diya",
    course_id: "C103",
    course_name: "CN",
    instructor_name: "Dr. Iyer",
    department_name: "ECE",
    department_office: "Block B"
  }
];

const SECOND_NF_REFERENCE = [
  {
    title: "StudentCourse Table",
    rows: [
      { student_id: "S1", course_id: "C101" },
      { student_id: "S1", course_id: "C102" },
      { student_id: "S2", course_id: "C103" }
    ]
  },
  {
    title: "Course Table",
    rows: [
      { course_id: "C101", course_name: "DBMS", instructor_name: "Dr. Sharma" },
      { course_id: "C102", course_name: "OS", instructor_name: "Dr. Mehta" },
      { course_id: "C103", course_name: "CN", instructor_name: "Dr. Iyer" }
    ]
  },
  {
    title: "Student Table",
    rows: [
      {
        student_id: "S1",
        student_name: "Aarav",
        department_name: "CSE",
        department_office: "Block A"
      },
      {
        student_id: "S2",
        student_name: "Diya",
        department_name: "ECE",
        department_office: "Block B"
      }
    ]
  }
];

function getProblemCardData(normalForm) {
  if (normalForm === "1nf") {
    return {
      title: "What is wrong in the original design?",
      problem:
        "Some columns store multiple values in a single cell, such as course_ids, course_names, and instructor_names. This violates atomicity.",
      dependency:
        "A single field should store only one value. Repeating groups must be removed.",
      anomaly:
        "Searching, updating, or deleting one course becomes harder because multiple values are packed inside one row.",
      improvement:
        "After 1NF, each course is stored in a separate row, so every field contains one atomic value only."
    };
  }

  if (normalForm === "2nf") {
    return {
      title: "What is wrong in the 1NF design?",
      problem:
        "Some non-key attributes depend only on part of the composite key instead of the whole key.",
      dependency:
        "Partial dependency: course_id → course_name, instructor_name while the composite key is (student_id, course_id).",
      anomaly:
        "If course data changes, it may need to be updated in multiple rows. This causes redundancy and update anomalies.",
      improvement:
        "After 2NF, attributes depending only on course_id are moved into a separate Course table."
    };
  }

  return {
    title: "What is wrong in the 2NF design?",
    problem:
      "Some non-key attributes depend on another non-key attribute instead of depending directly on the primary key.",
    dependency:
      "Transitive dependency: department_name → department_office, instead of student_id → department_office directly.",
    anomaly:
      "If a department office changes, it must be updated in multiple student rows, which creates inconsistency risk.",
    improvement:
      "After 3NF, department details are moved to a separate Department table so non-key attributes depend only on the key."
  };
}

function getComparisonBeforeTables(normalForm) {
  if (normalForm === "1nf") {
    return [
      {
        title: "Before Normalization (UNF)",
        rows: UNF_TABLE
      }
    ];
  }

  if (normalForm === "2nf") {
    return [
      {
        title: "Before 2NF (1NF Table)",
        rows: FIRST_NF_TABLE
      }
    ];
  }

  return SECOND_NF_REFERENCE;
}

function ComparisonPanel({ normalForm, displayTables }) {
  const beforeTables = getComparisonBeforeTables(normalForm);
  const hasAfterTables = displayTables.length > 0;

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <GitCompare size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Before vs After Comparison</h2>
          <p className="sorting-sim-subtitle">
            Compare the schema before normalization and after decomposition.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: hasAfterTables ? "1fr 1fr" : "1fr",
          gap: 18
        }}
      >
        <div
          style={{
            background: "rgba(8, 20, 45, 0.78)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 18
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              color: "#fca5a5",
              fontWeight: 800
            }}
          >
            <AlertTriangle size={18} />
            Before
          </div>

          {beforeTables.map((table, index) => (
            <SimpleTable
              key={`before-${table.title}-${index}`}
              title={table.title}
              rows={table.rows}
              highlightRows={[]}
            />
          ))}
        </div>

        {hasAfterTables && (
          <div
            style={{
              background: "rgba(8, 20, 45, 0.78)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 18
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
                color: "#86efac",
                fontWeight: 800
              }}
            >
              <CheckCircle2 size={18} />
              After
            </div>

            {displayTables.map((table, index) => (
              <SimpleTable
                key={`after-${table.title}-${index}`}
                title={table.title}
                rows={table.rows}
                highlightRows={[]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function DBMSNormalizationSimulation({
  normalForm,
  runSimulation,
  reset,
  loadSample,
  message,
  displayTables,
  stepHistory,
  currentStage,
  highlightedColumns,
  dependencyText,
  isRunning
}) {
  const observationText =
    normalForm === "1nf"
      ? "1NF removes repeating groups and ensures each field contains only one atomic value."
      : normalForm === "2nf"
      ? "2NF removes partial dependency so non-key attributes depend on the whole composite key."
      : "3NF removes transitive dependency so non-key attributes depend only on the primary key.";

  const tableCount = displayTables.length;
  const totalRowsShown = displayTables.reduce(
    (sum, table) => sum + (table.rows ? table.rows.length : 0),
    0
  );

  const problemData = getProblemCardData(normalForm);

  return (
    <>
      <section className="sorting-sim-card">
        <div className="sorting-sim-header">
          <div className="sorting-sim-title-wrap">
            <div className="sorting-sim-icon">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="sorting-sim-title">Simulation</h2>
              <p className="sorting-sim-subtitle">
                Visualize how the schema is transformed into {normalForm.toUpperCase()} step by step.
              </p>
            </div>
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
          <button className="sim-btn sim-btn-primary" onClick={runSimulation} disabled={isRunning}>
            <Play size={16} />
            {isRunning ? "Running..." : "Run Simulation"}
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
          {message || "Run the normalization simulation to begin."}
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
          <InfoStatCard label="Normal Form" value={normalForm.toUpperCase()} />
          <InfoStatCard label="Tables Visible" value={tableCount} />
          <InfoStatCard label="Total Rows Shown" value={totalRowsShown} />
          <InfoStatCard
            label="Dependency Focus"
            value={
              normalForm === "1nf"
                ? "Atomicity"
                : normalForm === "2nf"
                ? "Partial Dependency"
                : "Transitive Dependency"
            }
          />
        </div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16
          }}
        >
          <div className="overview-card" style={{ margin: 0 }}>
            <div className="overview-card-head">
              <AlertTriangle size={18} />
              <h4>{problemData.title}</h4>
            </div>
            <p>{problemData.problem}</p>
          </div>

          <div className="overview-card" style={{ margin: 0 }}>
            <div className="overview-card-head">
              <Database size={18} />
              <h4>Dependency Rule</h4>
            </div>
            <p>{problemData.dependency}</p>
          </div>

          <div className="overview-card" style={{ margin: 0 }}>
            <div className="overview-card-head">
              <AlertTriangle size={18} />
              <h4>Anomaly Risk</h4>
            </div>
            <p>{problemData.anomaly}</p>
          </div>

          <div className="overview-card" style={{ margin: 0 }}>
            <div className="overview-card-head">
              <CheckCircle2 size={18} />
              <h4>Why the Split Helps</h4>
            </div>
            <p>{problemData.improvement}</p>
          </div>
        </div>

        <ObservationBox text={observationText} />
        <ObservationBox text={dependencyText} />
      </section>

      <ComparisonPanel normalForm={normalForm} displayTables={displayTables} />

      {displayTables.length === 0 ? (
        <section className="sorting-sim-card">
          <div className="coding-empty-state">
            Normalized tables will appear here after you run the simulation.
          </div>
        </section>
      ) : (
        displayTables.map((table, index) => (
          <SimpleTable
            key={`${table.title}-${index}`}
            title={table.title}
            rows={table.rows}
            highlightRows={[]}
          />
        ))
      )}

      {highlightedColumns.length > 0 && (
        <section className="sorting-sim-card">
          <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
            <div className="sorting-sim-icon">
              <Database size={18} />
            </div>
            <div>
              <h2 className="sorting-sim-title">Highlighted Dependency Columns</h2>
              <p className="sorting-sim-subtitle">
                These columns are currently involved in the dependency issue being analyzed.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap"
            }}
          >
            {highlightedColumns.map((column) => (
              <div
                key={column}
                style={{
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: "rgba(250,204,21,0.18)",
                  border: "1px solid rgba(250,204,21,0.35)",
                  color: "#fef08a",
                  fontWeight: 700
                }}
              >
                {column}
              </div>
            ))}
          </div>
        </section>
      )}

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}