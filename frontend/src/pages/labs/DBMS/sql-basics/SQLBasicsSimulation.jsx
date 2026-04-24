import React from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Database,
  AlertTriangle
} from "lucide-react";
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
      <label
        style={{
          display: "block",
          marginBottom: 12,
          color: "#e5e7eb",
          fontWeight: 700,
          fontSize: "1rem"
        }}
      >
        SELECT Columns
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 14
        }}
      >
        {allColumns.map((column) => (
          <label
            key={column}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#e5e7eb",
              fontWeight: 600,
              background: "rgba(2, 8, 23, 0.65)",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid rgba(148,163,184,0.18)",
              minWidth: 0
            }}
          >
            <input
              type="checkbox"
              checked={selectedColumns.includes(column)}
              onChange={() => toggleColumn(column)}
              disabled={isRunning}
            />
            <span>{column}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ClauseBadge({ text, color }) {
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 999,
        fontWeight: 800,
        fontSize: "0.92rem",
        letterSpacing: "0.02em",
        border: `1px solid ${color}`,
        color,
        background: "rgba(15, 23, 42, 0.6)"
      }}
    >
      {text}
    </div>
  );
}

function QueryWarning({ selectedColumns, whereColumn, whereValue, limitValue }) {
  const warnings = [];

  if (selectedColumns.length === 0) {
    warnings.push("Select at least one column in the SELECT clause.");
  }

  if (
    (whereColumn === "id" || whereColumn === "age" || whereColumn === "marks") &&
    whereValue.trim() !== "" &&
    Number.isNaN(Number(whereValue))
  ) {
    warnings.push(`WHERE value for ${whereColumn} must be numeric.`);
  }

  if (limitValue.trim() !== "" && Number.isNaN(Number(limitValue))) {
    warnings.push("LIMIT must be a valid number.");
  }

  if (warnings.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 16,
        padding: "14px 16px",
        borderRadius: 14,
        background: "rgba(239, 68, 68, 0.10)",
        border: "1px solid rgba(239, 68, 68, 0.22)",
        color: "#fecaca"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 800,
          marginBottom: 8
        }}
      >
        <AlertTriangle size={16} />
        Invalid Query Warning
      </div>

      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
        {warnings.map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}

function ExecutionOrder({ selectedColumns, whereValue, orderByColumn, limitValue }) {
  const steps = [
    {
      label: "FROM",
      text: "Load rows from the students table."
    },
    {
      label: "WHERE",
      text:
        whereValue.trim() !== ""
          ? "Filter rows that satisfy the WHERE condition."
          : "No WHERE condition applied, so all rows are kept."
    },
    {
      label: "ORDER BY",
      text: orderByColumn
        ? `Sort the remaining rows using ${orderByColumn}.`
        : "No ordering is applied."
    },
    {
      label: "LIMIT",
      text:
        limitValue.trim() !== ""
          ? `Keep only the first ${limitValue} row(s).`
          : "No LIMIT is applied."
    },
    {
      label: "SELECT",
      text: `Project only the chosen columns: ${selectedColumns.join(", ")}.`
    }
  ];

  return (
    <div
      style={{
        marginTop: 18,
        padding: "18px",
        borderRadius: 18,
        background: "rgba(8, 20, 45, 0.55)",
        border: "1px solid rgba(56,189,248,0.12)"
      }}
    >
      <h3
        style={{
          margin: "0 0 14px 0",
          color: "#f8fafc",
          fontSize: "1.02rem"
        }}
      >
        Pseudo Execution Order
      </h3>

      <div
        style={{
          display: "grid",
          gap: 12
        }}
      >
        {steps.map((step, index) => (
          <div
            key={step.label}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              padding: "12px 14px",
              borderRadius: 14,
              background: "rgba(15, 23, 42, 0.62)",
              border: "1px solid rgba(148,163,184,0.10)"
            }}
          >
            <div
              style={{
                minWidth: 34,
                height: 34,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(56,189,248,0.12)",
                color: "#38bdf8",
                fontWeight: 800
              }}
            >
              {index + 1}
            </div>

            <div>
              <div
                style={{
                  color: "#f8fafc",
                  fontWeight: 700,
                  marginBottom: 4
                }}
              >
                {step.label}
              </div>
              <div style={{ color: "#cbd5e1", lineHeight: 1.6 }}>{step.text}</div>
            </div>
          </div>
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

  const queryIsInvalid =
    selectedColumns.length === 0 ||
    ((whereColumn === "id" || whereColumn === "age" || whereColumn === "marks") &&
      whereValue.trim() !== "" &&
      Number.isNaN(Number(whereValue))) ||
    (limitValue.trim() !== "" && Number.isNaN(Number(limitValue)));

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
                Build and visualize SQL execution step by step.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <ColumnSelector
            allColumns={allColumns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            isRunning={isRunning}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              alignItems: "end"
            }}
          >
            <div style={{ minWidth: 0 }}>
              <label className="sorting-label">WHERE Column</label>
              <select
                value={whereColumn}
                onChange={(e) => setWhereColumn(e.target.value)}
                className="sorting-select"
                style={{ width: "100%", minWidth: 0 }}
                disabled={isRunning}
              >
                {allColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 0 }}>
              <label className="sorting-label">Operator</label>
              <select
                value={whereOperator}
                onChange={(e) => setWhereOperator(e.target.value)}
                className="sorting-select"
                style={{ width: "100%", minWidth: 0 }}
                disabled={isRunning}
              >
                <option value="=">=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
              </select>
            </div>

            <div style={{ minWidth: 0 }}>
              <label className="sorting-label">WHERE Value</label>
              <input
                value={whereValue}
                onChange={(e) => setWhereValue(e.target.value)}
                placeholder="Enter WHERE value"
                className="sorting-input"
                style={{ width: "100%", minWidth: 0, boxSizing: "border-box" }}
                disabled={isRunning}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <label className="sorting-label">ORDER BY</label>
              <select
                value={orderByColumn}
                onChange={(e) => setOrderByColumn(e.target.value)}
                className="sorting-select"
                style={{ width: "100%", minWidth: 0 }}
                disabled={isRunning}
              >
                {allColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 0 }}>
              <label className="sorting-label">Direction</label>
              <select
                value={orderDirection}
                onChange={(e) => setOrderDirection(e.target.value)}
                className="sorting-select"
                style={{ width: "100%", minWidth: 0 }}
                disabled={isRunning}
              >
                <option value="asc">ASC</option>
                <option value="desc">DESC</option>
              </select>
            </div>

            <div style={{ minWidth: 0 }}>
              <label className="sorting-label">LIMIT</label>
              <input
                value={limitValue}
                onChange={(e) => setLimitValue(e.target.value)}
                placeholder="Enter limit"
                className="sorting-input"
                style={{ width: "100%", minWidth: 0, boxSizing: "border-box" }}
                disabled={isRunning}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <ClauseBadge text="SELECT" color="#60a5fa" />
            <ClauseBadge text="WHERE" color="#34d399" />
            <ClauseBadge text="ORDER BY" color="#fb923c" />
            <ClauseBadge text="LIMIT" color="#a78bfa" />
          </div>

          <div className="sorting-btn-group">
            <button
              className="sim-btn sim-btn-primary"
              onClick={runSimulation}
              disabled={isRunning || queryIsInvalid}
            >
              <Play size={16} />
              {isRunning ? "Running..." : "Run Query"}
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
        </div>

        <QueryWarning
          selectedColumns={selectedColumns}
          whereColumn={whereColumn}
          whereValue={whereValue}
          limitValue={limitValue}
        />

        <div className="sorting-info-box" style={{ marginTop: 18 }}>
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
          className="sorting-stats-grid"
          style={{
            marginTop: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
          }}
        >
          <InfoStatCard label="Input Rows" value={sampleTable.length} />
          <InfoStatCard label="Result Rows" value={displayRows.length} />
          <InfoStatCard label="Selected Columns" value={selectedColumns.length} />
          <InfoStatCard label="Query Mode" value="SELECT Pipeline" />
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

        <ExecutionOrder
          selectedColumns={selectedColumns}
          whereValue={whereValue}
          orderByColumn={orderByColumn}
          limitValue={limitValue}
        />

        <ObservationBox text={observationText} />
      </section>

      <SimpleTable
        title="Original Table"
        rows={sampleTable}
        highlightRows={highlightedRowIds}
        rowKeyField="id"
      />

      <SimpleTable title="Query Result" rows={displayRows} />

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}