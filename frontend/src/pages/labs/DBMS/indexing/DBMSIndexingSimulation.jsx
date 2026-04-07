import React from "react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

export default function DBMSIndexingSimulation({
  searchMode,
  records,
  indexMap,
  runSimulation,
  reset,
  loadSample,
  message,
  currentIndex,
  foundIndex,
  currentStage,
  comparisons,
  stepHistory,
  selectedIndexKey,
  foundRecord,
  isRunning
}) {
  const observationText =
    searchMode === "linear"
      ? "Without an index, the DBMS may scan rows one by one until it finds the target."
      : "With an index, the DBMS can jump closer to the required row using a lookup structure, reducing comparisons.";

  const recordsWithRowNo = records.map((row, index) => ({
    row_no: index + 1,
    ...row
  }));

  const highlightedRecordRows = [
    ...(currentIndex !== null ? [currentIndex + 1] : []),
    ...(foundIndex !== null ? [foundIndex + 1] : [])
  ];

  const indexRows = Object.keys(indexMap).map((key) => ({
    indexed_roll_no: Number(key),
    row_position: indexMap[key] + 1
  }));

  const highlightedIndexRows =
    selectedIndexKey !== null ? [selectedIndexKey] : [];

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation{" "}
          <span style={{ color: "#38bdf8" }}>
            ({searchMode === "linear" ? "WITHOUT INDEX" : "WITH INDEX"})
          </span>
        </h2>

        <div className="buttons" style={{ marginBottom: 14 }}>
          <button className="btn primary" onClick={runSimulation} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Search"}
          </button>

          <button className="btn info" onClick={loadSample} disabled={isRunning}>
            Load Sample
          </button>

          <button className="btn secondary" onClick={reset} disabled={isRunning}>
            Reset
          </button>
        </div>

        <div className="info-box">
          {message || "Run the indexing simulation to begin."}
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
          <InfoStatCard label="Search Mode" value={searchMode === "linear" ? "Without Index" : "With Index"} />
          <InfoStatCard label="Comparisons / Lookups" value={comparisons} />
          <InfoStatCard
            label="Search Result"
            value={foundRecord ? `${foundRecord.name} (${foundRecord.roll_no})` : "Not found yet"}
          />
        </div>

        <ObservationBox text={observationText} />
      </section>

      {searchMode === "indexed" && (
        <SimpleTable
          title="Index Structure"
          rows={indexRows}
          highlightRows={highlightedIndexRows}
          rowKeyField="indexed_roll_no"
        />
      )}

      <SimpleTable
        title="Student Records"
        rows={recordsWithRowNo}
        highlightRows={highlightedRecordRows}
        rowKeyField="row_no"
      />

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}