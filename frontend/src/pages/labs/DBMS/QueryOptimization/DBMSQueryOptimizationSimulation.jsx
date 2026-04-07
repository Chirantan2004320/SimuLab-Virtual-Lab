import React from "react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

export default function DBMSQueryOptimizationSimulation({
  mode,
  studentsTable,
  enrollmentsTable,
  runSimulation,
  reset,
  loadSample,
  message,
  currentStage,
  inputRowsCount,
  outputRowsCount,
  highlightedRows,
  resultRows,
  planText,
  stepHistory,
  isRunning
}) {
  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation{" "}
          <span style={{ color: "#38bdf8" }}>
            ({mode.toUpperCase()})
          </span>
        </h2>

        <div className="buttons" style={{ marginBottom: 14 }}>
          <button className="btn primary" onClick={runSimulation} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Demo"}
          </button>

          <button className="btn info" onClick={loadSample} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>

        <div className="info-box">
          {message || "Run the optimization simulation to begin."}
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

        {/* Stats */}
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          <InfoStatCard label="Input Rows" value={inputRowsCount} />
          <InfoStatCard label="Output Rows" value={outputRowsCount} />
        </div>

        {/* Observation */}
        <ObservationBox text={planText} />
      </section>

      {/* Students Table */}
      <SimpleTable
        title="Students Table"
        rows={studentsTable}
        highlightRows={highlightedRows}
        rowKeyField="student_id"
      />

      {/* Enrollment Table (only for join mode) */}
      {mode === "join" && (
        <SimpleTable
          title="Enrollments Table"
          rows={enrollmentsTable}
          highlightRows={[]}
          rowKeyField="student_id"
        />
      )}

      {/* Result Table */}
      <SimpleTable
        title="Optimized Result"
        rows={resultRows}
      />

      {/* Step History */}
      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}