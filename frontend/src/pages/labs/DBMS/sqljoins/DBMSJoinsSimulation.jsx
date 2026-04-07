import React from "react";
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
      <section className="card experiment">
        <h2>
          Simulation{" "}
          <span style={{ color: "#38bdf8" }}>
            ({joinType.toUpperCase()} JOIN)
          </span>
        </h2>

        <div className="buttons" style={{ marginBottom: 14 }}>
          <button className="btn primary" onClick={runSimulation} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Join"}
          </button>

          <button className="btn info" onClick={loadSample} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>

        <div className="info-box">
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
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          <InfoStatCard label="Students Rows" value={studentsTable.length} />
          <InfoStatCard label="Departments Rows" value={departmentsTable.length} />
          <InfoStatCard label="Joined Rows" value={joinedRows.length} />
        </div>

        {generatedSQL && (
          <div
            style={{
              marginTop: 16,
              padding: "14px 16px",
              borderRadius: 10,
              background: "rgba(15,23,42,0.45)",
              border: "1px solid rgba(56,189,248,0.25)",
              color: "#e5e7eb",
              fontFamily: "monospace",
              lineHeight: 1.7,
              overflowX: "auto"
            }}
          >
            <strong style={{ color: "#38bdf8" }}>Generated SQL:</strong>
            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{generatedSQL}</div>
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

      <SimpleTable
        title="Join Result"
        rows={joinedRows}
      />

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}