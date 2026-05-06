import React from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Database,
  AlertTriangle,
  Filter,
  ArrowDownAZ,
  ListFilter,
  Columns3,
  Code2,
} from "lucide-react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function normalizeRowsForTable(rows) {
  return (rows || []).map((row, index) => ({
    __id: row.id ?? index,
    ...row
  }));
}

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
      <label className="sorting-label">SELECT Columns</label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
          marginTop: 10
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
              fontWeight: 700,
              background: selectedColumns.includes(column)
                ? "linear-gradient(135deg, rgba(14,165,233,0.20), rgba(37,99,235,0.18))"
                : "rgba(2, 8, 23, 0.65)",
              padding: "14px 16px",
              borderRadius: 16,
              border: selectedColumns.includes(column)
                ? "1px solid rgba(56,189,248,0.45)"
                : "1px solid rgba(148,163,184,0.18)"
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

function ClauseBadge({ icon: Icon, title, text, active }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: 18,
        background: active
          ? "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(37,99,235,0.14))"
          : "rgba(15, 23, 42, 0.58)",
        border: active
          ? "1px solid rgba(56,189,248,0.42)"
          : "1px solid rgba(148,163,184,0.14)",
        minHeight: 110
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Icon size={17} color="#38bdf8" />
        <strong style={{ color: "#f8fafc" }}>{title}</strong>
      </div>
      <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6, fontSize: "0.95rem" }}>
        {text}
      </p>
    </div>
  );
}

function QueryWarning({ selectedColumns, whereColumn, whereValue, limitValue }) {
  const warnings = [];

  if (selectedColumns.length === 0) warnings.push("Select at least one column.");
  if (
    ["id", "age", "marks"].includes(whereColumn) &&
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
        borderRadius: 16,
        background: "rgba(239, 68, 68, 0.10)",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        color: "#fecaca"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>
        <AlertTriangle size={16} />
        Invalid Query Warning
      </div>

      <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.7 }}>
        {warnings.map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}

function ExecutionPipeline({ selectedStep }) {
  const steps = [
    { key: "Initial Table", label: "FROM", icon: Database },
    { key: "WHERE Applied", label: "WHERE", icon: Filter },
    { key: "ORDER BY Applied", label: "ORDER BY", icon: ArrowDownAZ },
    { key: "LIMIT Applied", label: "LIMIT", icon: ListFilter },
    { key: "SELECT Applied", label: "SELECT", icon: Columns3 }
  ];

  return (
    <div
      style={{
        marginTop: 18,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12
      }}
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = selectedStep === step.key;

        return (
          <div
            key={step.key}
            style={{
              padding: "14px",
              borderRadius: 16,
              background: isActive
                ? "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(59,130,246,0.16))"
                : "rgba(15, 23, 42, 0.62)",
              border: isActive
                ? "1px solid rgba(56,189,248,0.55)"
                : "1px solid rgba(148,163,184,0.14)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon size={16} color="#38bdf8" />
              <strong style={{ color: "#f8fafc" }}>{step.label}</strong>
            </div>
            <div style={{ marginTop: 6, color: "#94a3b8", fontSize: "0.88rem" }}>
              Step {index + 1}
            </div>
          </div>
        );
      })}
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
    (["id", "age", "marks"].includes(whereColumn) &&
      whereValue.trim() !== "" &&
      Number.isNaN(Number(whereValue))) ||
    (limitValue.trim() !== "" && Number.isNaN(Number(limitValue)));

  const safeSampleRows = normalizeRowsForTable(sampleTable);
  const safeResultRows = normalizeRowsForTable(displayRows);

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginBottom: 22
          }}
        >
          <ClauseBadge
            icon={Database}
            title="FROM"
            text="Load rows from the students table."
            active={selectedStep === "Initial Table"}
          />
          <ClauseBadge
            icon={Filter}
            title="WHERE"
            text="Filter rows that satisfy the condition."
            active={selectedStep === "WHERE Applied"}
          />
          <ClauseBadge
            icon={ArrowDownAZ}
            title="ORDER BY"
            text="Sort the filtered rows."
            active={selectedStep === "ORDER BY Applied"}
          />
          <ClauseBadge
            icon={ListFilter}
            title="LIMIT"
            text="Keep only the required number of rows."
            active={selectedStep === "LIMIT Applied"}
          />
        </div>

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
            marginTop: 22,
            alignItems: "end"
          }}
        >
          <div>
            <label className="sorting-label">WHERE Column</label>
            <select
              value={whereColumn}
              onChange={(e) => setWhereColumn(e.target.value)}
              className="sorting-select"
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
            <label className="sorting-label">Operator</label>
            <select
              value={whereOperator}
              onChange={(e) => setWhereOperator(e.target.value)}
              className="sorting-select"
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
            <label className="sorting-label">WHERE Value</label>
            <input
              value={whereValue}
              onChange={(e) => setWhereValue(e.target.value)}
              placeholder="Enter WHERE value"
              className="sorting-input"
              disabled={isRunning}
            />
          </div>

          <div>
            <label className="sorting-label">ORDER BY</label>
            <select
              value={orderByColumn}
              onChange={(e) => setOrderByColumn(e.target.value)}
              className="sorting-select"
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
            <label className="sorting-label">Direction</label>
            <select
              value={orderDirection}
              onChange={(e) => setOrderDirection(e.target.value)}
              className="sorting-select"
              disabled={isRunning}
            >
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </select>
          </div>

          <div>
            <label className="sorting-label">LIMIT</label>
            <input
              value={limitValue}
              onChange={(e) => setLimitValue(e.target.value)}
              placeholder="Enter limit"
              className="sorting-input"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginTop: 22 }}>
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

        <QueryWarning
          selectedColumns={selectedColumns}
          whereColumn={whereColumn}
          whereValue={whereValue}
          limitValue={limitValue}
        />

        <div className="sorting-info-box" style={{ marginTop: 18 }}>
          {message || "Run the query to begin."}
        </div>

        <ExecutionPipeline selectedStep={selectedStep} />

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
          <InfoStatCard label="Current Stage" value={selectedStep || "Ready"} />
        </div>

        {generatedSQL && (
          <div
            style={{
              marginTop: 18,
              padding: "18px",
              borderRadius: 18,
              background: "rgba(2, 8, 23, 0.86)",
              border: "1px solid rgba(56,189,248,0.20)",
              overflowX: "auto"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#38bdf8",
                fontWeight: 800,
                marginBottom: 10
              }}
            >
              <Code2 size={16} />
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

        <ObservationBox text={observationText} />
      </section>

      <SimpleTable
        title="Original Table"
        rows={safeSampleRows}
        highlightRows={highlightedRowIds}
        rowKeyField="__id"
      />

      <SimpleTable
        title="Query Result"
        rows={safeResultRows}
        rowKeyField="__id"
      />

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}