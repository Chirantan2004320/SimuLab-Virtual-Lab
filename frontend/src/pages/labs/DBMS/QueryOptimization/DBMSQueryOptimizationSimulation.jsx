import React from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Database,
  Sparkles,
  TableProperties,
  GitMerge,
  Filter,
} from "lucide-react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function DataTableCard({
  title,
  subtitle,
  rows,
  highlightedRows = [],
  rowKeyField,
  emptyText = "No data available yet.",
}) {
  const hasRows = rows && rows.length > 0;
  const columns = hasRows ? Object.keys(rows[0]) : [];

  return (
    <section className="sorting-sim-card" style={{ marginTop: 22 }}>
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 16 }}>
        <div className="sorting-sim-icon">
          <TableProperties size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title" style={{ fontSize: "1.2rem" }}>
            {title}
          </h2>
          {subtitle ? <p className="sorting-sim-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      {!hasRows ? (
        <div className="sorting-empty-state">{emptyText}</div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 18,
            border: "1px solid rgba(148,163,184,0.14)",
            background: "rgba(2,8,23,0.42)",
          }}
        >
          <table className="dbms-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column.replace(/_/g, " ").toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const rowKey = rowKeyField ? row[rowKeyField] : rowIndex;
                const isHighlighted = highlightedRows.includes(rowKey);

                return (
                  <tr
                    key={rowKey ?? rowIndex}
                    style={
                      isHighlighted
                        ? {
                            background: "rgba(56,189,248,0.10)",
                            boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.22)",
                          }
                        : {}
                    }
                  >
                    {columns.map((column) => (
                      <td key={column}>{row[column]}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

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
  isRunning,
}) {
  const modeLabel =
    mode === "selection"
      ? "Selection Pushdown"
      : mode === "projection"
      ? "Projection Pushdown"
      : "Join Order Optimization";

  const focusLabel =
    mode === "selection"
      ? "Filter Early"
      : mode === "projection"
      ? "Reduce Columns"
      : "Join Smaller Inputs";

  const focusIcon =
    mode === "selection" ? (
      <Filter size={18} />
    ) : mode === "projection" ? (
      <TableProperties size={18} />
    ) : (
      <GitMerge size={18} />
    );

  const summaryText =
    mode === "selection"
      ? "Selection pushdown reduces cost by applying row filters as early as possible so later operations process fewer tuples."
      : mode === "projection"
      ? "Projection pushdown reduces cost by keeping only the needed columns early, which decreases data movement and intermediate width."
      : "Join optimization reduces cost by joining smaller filtered inputs first, which keeps intermediate results compact.";

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
                Visualize how query plans become cheaper step by step.
              </p>
            </div>
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
          <button
            className="sim-btn sim-btn-primary"
            onClick={runSimulation}
            disabled={isRunning}
          >
            <Play size={16} />
            {isRunning ? "Running..." : "Run Demo"}
          </button>

          <button
            className="sim-btn sim-btn-muted"
            onClick={loadSample}
            disabled={isRunning}
          >
            <Database size={16} />
            Load Sample
          </button>

          <button
            className="sim-btn sim-btn-danger"
            onClick={reset}
            disabled={isRunning}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="sorting-info-box">
          {message || "Run the optimization simulation to begin."}
        </div>

        {currentStage && (
          <div
            style={{
              marginTop: 14,
              color: "#facc15",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Current Stage: {currentStage}
          </div>
        )}

        <div
          className="sorting-stats-grid"
          style={{
            marginTop: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <InfoStatCard label="Input Rows" value={inputRowsCount} />
          <InfoStatCard label="Output Rows" value={outputRowsCount} />
          <InfoStatCard label="Optimization" value={modeLabel} />
          <InfoStatCard label="Focus" value={focusLabel} />
        </div>

        <ObservationBox text={summaryText} />
        <ObservationBox text={planText} />
      </section>

      <section className="sorting-sim-card" style={{ marginTop: 22 }}>
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 16 }}>
          <div className="sorting-sim-icon">{focusIcon}</div>
          <div>
            <h2 className="sorting-sim-title">
              {mode === "selection"
                ? "Selection Explorer"
                : mode === "projection"
                ? "Projection Explorer"
                : "Join Explorer"}
            </h2>
            <p className="sorting-sim-subtitle">
              {mode === "selection"
                ? "Observe which student rows survive the early filter."
                : mode === "projection"
                ? "Observe how the same rows become narrower after removing unnecessary columns."
                : "Observe how filtering before joining reduces join input and result size."}
            </p>
          </div>
        </div>

        <div className="comparison-grid-upgraded" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="comparison-card">
            <div className="comparison-card-head">
              <h3>Plan Intent</h3>
              <span className="comparison-chip">Optimization Goal</span>
            </div>
            <div className="comparison-mini-stats">
              {mode === "selection" && (
                <>
                  <span>Apply WHERE as early as possible.</span>
                  <span>Reduce row count before later processing.</span>
                  <span>Smaller intermediate result means lower cost.</span>
                </>
              )}
              {mode === "projection" && (
                <>
                  <span>Select only required columns.</span>
                  <span>Avoid carrying unused fields forward.</span>
                  <span>Narrower tuples reduce processing overhead.</span>
                </>
              )}
              {mode === "join" && (
                <>
                  <span>Filter first, then join.</span>
                  <span>Use smaller inputs for join processing.</span>
                  <span>Reduce intermediate join result size.</span>
                </>
              )}
            </div>
          </div>

          <div className="comparison-card">
            <div className="comparison-card-head">
              <h3>What to Watch</h3>
              <span className="comparison-chip">Visual Cue</span>
            </div>
            <div className="comparison-mini-stats">
              <span>Blue highlight marks rows currently emphasized by optimization.</span>
              <span>Input rows show the source relation before optimization.</span>
              <span>Result rows show the cheaper output after transformation.</span>
            </div>
          </div>
        </div>
      </section>

      <DataTableCard
        title="Students Table"
        subtitle="Observe the base relation used in the optimization plan."
        rows={studentsTable}
        highlightedRows={highlightedRows}
        rowKeyField="student_id"
      />

      {mode === "join" && (
        <DataTableCard
          title="Enrollments Table"
          subtitle="Join mode uses this second relation after filtering students."
          rows={enrollmentsTable}
          rowKeyField="student_id"
        />
      )}

      <DataTableCard
        title={
          mode === "selection"
            ? "Filtered Result"
            : mode === "projection"
            ? "Projected Result"
            : "Optimized Join Result"
        }
        subtitle="This is the output after the optimization step is applied."
        rows={resultRows}
        emptyText="No optimized output yet. Run the simulation."
      />

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}