import React from "react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

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

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation{" "}
          <span style={{ color: "#38bdf8" }}>
            ({normalForm.toUpperCase()})
          </span>
        </h2>

        <div className="buttons" style={{ marginBottom: 14 }}>
          <button className="btn primary" onClick={runSimulation} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Simulation"}
          </button>

          <button className="btn info" onClick={loadSample} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>

        <div className="info-box">
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
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          <InfoStatCard label="Normal Form" value={normalForm.toUpperCase()} />
          <InfoStatCard label="Tables Visible" value={tableCount} />
          <InfoStatCard label="Total Rows Shown" value={totalRowsShown} />
        </div>

        <ObservationBox text={observationText} />
        <ObservationBox text={dependencyText} />
      </section>

      {displayTables.length === 0 ? (
        <section className="card">
          <p style={{ color: "#9ca3af" }}>Normalized tables will appear here.</p>
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
        <section className="card">
          <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Highlighted Dependency Columns</h3>
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
                  borderRadius: 8,
                  background: "rgba(250,204,21,0.18)",
                  border: "1px solid rgba(250,204,21,0.35)",
                  color: "#fef08a",
                  fontWeight: 600
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