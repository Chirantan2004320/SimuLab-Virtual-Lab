import React from "react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function ColumnSelector({ allColumns, selectedColumns, setSelectedColumns, isRunning }) {
  const toggleColumn = (column) => {
    if (isRunning) return;

    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  return (
    <div>
      <label style={{ display: "block", marginBottom: 10 }}>SELECT Columns</label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 10
        }}
      >
        {allColumns.map((column) => (
          <label
            key={column}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#e5e7eb",
              fontWeight: 500,
              background: "rgba(15,23,42,0.35)",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.18)"
            }}
          >
            <input
              type="checkbox"
              checked={selectedColumns.includes(column)}
              onChange={() => toggleColumn(column)}
              disabled={isRunning}
            />
            {column}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function DBMSSQLBasicsSimulation({
  sampleTable,
  allColumns,
  selectedColumns,
  setSelectedColumns,
  whereColumn,
  setWhereColumn,
  whereOperator,
  setWhereOperator,
  whereValue,
  setWhereValue,
  orderByColumn,
  setOrderByColumn,
  orderDirection,
  setOrderDirection,
  limitValue,
  setLimitValue,
  runSimulation,
  reset,
  loadSample,
  message,
  displayRows,
  highlightedRowIds,
  stepHistory,
  selectedStep,
  generatedSQL,
  isRunning
}) {
  const observationText =
    selectedColumns.length > 0
      ? `Current query flow: filter rows using WHERE, sort using ORDER BY, limit results using LIMIT, and finally project selected columns: ${selectedColumns.join(", ")}.`
      : "Select at least one column to build a valid SQL query.";

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation <span style={{ color: "#38bdf8" }}>(SQL Basics)</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ width: "100%" }}>
            <ColumnSelector
              allColumns={allColumns}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              isRunning={isRunning}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 16,
              alignItems: "end"
            }}
          >
            <div>
              <label>WHERE Column</label>
              <select
                value={whereColumn}
                onChange={(e) => setWhereColumn(e.target.value)}
                className="lab-select"
                style={{ width: "100%" }}
                disabled={isRunning}
              >
                {allColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Operator</label>
              <select
                value={whereOperator}
                onChange={(e) => setWhereOperator(e.target.value)}
                className="lab-select"
                style={{ width: "100%" }}
                disabled={isRunning}
              >
                <option value="=">=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
              </select>
            </div>

            <div>
              <label>WHERE Value</label>
              <input
                value={whereValue}
                onChange={(e) => setWhereValue(e.target.value)}
                placeholder="Enter WHERE value"
                className="lab-input"
                style={{ width: "100%" }}
                disabled={isRunning}
              />
            </div>

            <div>
              <label>ORDER BY</label>
              <select
                value={orderByColumn}
                onChange={(e) => setOrderByColumn(e.target.value)}
                className="lab-select"
                style={{ width: "100%" }}
                disabled={isRunning}
              >
                {allColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Direction</label>
              <select
                value={orderDirection}
                onChange={(e) => setOrderDirection(e.target.value)}
                className="lab-select"
                style={{ width: "100%" }}
                disabled={isRunning}
              >
                <option value="asc">ASC</option>
                <option value="desc">DESC</option>
              </select>
            </div>

            <div>
              <label>LIMIT</label>
              <input
                value={limitValue}
                onChange={(e) => setLimitValue(e.target.value)}
                placeholder="Enter limit"
                className="lab-input"
                style={{ width: "100%" }}
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="buttons">
            <button className="btn primary" onClick={runSimulation} disabled={isRunning}>
              {isRunning ? "Running..." : "Run Query"}
            </button>

            <button className="btn info" onClick={loadSample} disabled={isRunning}>
              Load Sample
            </button>

            <button className="btn secondary" onClick={reset} disabled={isRunning}>
              Reset
            </button>
          </div>
        </div>

        <div className="info-box" style={{ marginTop: 16 }}>
          {message || "Run the query to begin."}
        </div>

        {selectedStep && (
          <div
            style={{
              marginTop: 14,
              color: "#facc15",
              fontWeight: 700,
              fontSize: "1rem"
            }}
          >
            Current Stage: {selectedStep}
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
          <InfoStatCard label="Input Rows" value={sampleTable.length} />
          <InfoStatCard label="Result Rows" value={displayRows.length} />
          <InfoStatCard label="Selected Columns" value={selectedColumns.length} />
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
            <div style={{ marginTop: 8 }}>{generatedSQL}</div>
          </div>
        )}

        <ObservationBox text={observationText} />
      </section>

      <SimpleTable
        title="Original Table"
        rows={sampleTable}
        highlightRows={highlightedRowIds}
        rowKeyField="id"
      />

      <SimpleTable
        title="Query Result"
        rows={displayRows}
      />

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}