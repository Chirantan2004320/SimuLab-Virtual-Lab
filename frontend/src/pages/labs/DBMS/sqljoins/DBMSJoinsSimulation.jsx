import React from "react";
import { Activity, Play, RotateCcw, Database } from "lucide-react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

export default function DBMSJoinsSimulation({
  joinType,
  studentsTable,
  departmentsTable,
  runSimulation,
  reset,
  loadSample,
  message,
  selectedStudentId,
  selectedDepartmentId,
  matchedStudentIds,
  matchedDepartmentIds,
  joinedRows,
  stepHistory,
  generatedSQL,
  currentStage,
  isRunning
}) {
  const joinExplanation =
    joinType === "inner"
      ? "INNER JOIN keeps only matching rows from both tables."
      : joinType === "left"
      ? "LEFT JOIN keeps all rows from the left table and fills unmatched right-side values with NULL."
      : "RIGHT JOIN keeps all rows from the right table and fills unmatched left-side values with NULL.";

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
                Visualize {joinType.toUpperCase()} JOIN step by step across two related tables.
              </p>
            </div>
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
          <button className="sim-btn sim-btn-primary" onClick={runSimulation} disabled={isRunning}>
            <Play size={16} />
            {isRunning ? "Running..." : "Run Join"}
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
          {message || "Run the join simulation to begin."}
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
          <InfoStatCard label="Students Rows" value={studentsTable.length} />
          <InfoStatCard label="Departments Rows" value={departmentsTable.length} />
          <InfoStatCard label="Joined Rows" value={joinedRows.length} />
          <InfoStatCard label="Join Type" value={joinType.toUpperCase()} />
        </div>

        {generatedSQL && (
          <div
            style={{
              marginTop: 18,
              padding: "18px",
              borderRadius: 18,
              background: "rgba(2, 8, 23, 0.82)",
              border: "1px solid rgba(56,189,248,0.18)",
              overflowX: "auto"
            }}
          >
            <div
              style={{
                color: "#38bdf8",
                fontWeight: 800,
                marginBottom: 10,
                fontSize: "0.98rem"
              }}
            >
              SQL Editor Preview
            </div>

            <pre
              style={{
                margin: 0,
                color: "#e2e8f0",
                fontFamily: `"Fira Code", "Consolas", monospace`,
                fontSize: "0.95rem",
                lineHeight: 1.75,
                whiteSpace: "pre-wrap"
              }}
            >
{generatedSQL}
            </pre>
          </div>
        )}

        <ObservationBox text={joinExplanation} />
      </section>

      <SimpleTable
        title="Students Table"
        rows={studentsTable}
        highlightRows={[
          ...matchedStudentIds,
          ...(selectedStudentId !== null ? [selectedStudentId] : [])
        ]}
        rowKeyField="id"
      />

      <SimpleTable
        title="Departments Table"
        rows={departmentsTable}
        highlightRows={[
          ...matchedDepartmentIds,
          ...(selectedDepartmentId !== null ? [selectedDepartmentId] : [])
        ]}
        rowKeyField="department_id"
      />

      <SimpleTable title="Join Result" rows={joinedRows} />

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}