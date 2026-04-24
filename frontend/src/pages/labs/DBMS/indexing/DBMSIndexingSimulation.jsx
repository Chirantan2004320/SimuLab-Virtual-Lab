import React from "react";
import { Activity, Play, RotateCcw, Database, Search, Zap } from "lucide-react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function RecordCard({ record, index, currentIndex, foundIndex }) {
  const isActive = currentIndex === index;
  const isFound = foundIndex === index;

  return (
    <div
      style={{
        position: "relative",
        padding: 16,
        borderRadius: 18,
        minWidth: 200,
        background: isFound
          ? "rgba(34,197,94,0.18)"
          : isActive
          ? "rgba(250,204,21,0.18)"
          : "rgba(15,23,42,0.75)",
        border: isFound
          ? "2px solid #22c55e"
          : isActive
          ? "2px solid #facc15"
          : "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.3s ease",
        boxShadow: isFound
          ? "0 0 20px rgba(34,197,94,0.2)"
          : isActive
          ? "0 0 18px rgba(250,204,21,0.18)"
          : "none"
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 18,
            color: "#facc15"
          }}
        >
          👇
        </div>
      )}

      <div style={{ color: "#f8fafc", fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>
        {record.name}
      </div>
      <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
        <div><strong>Roll:</strong> {record.roll_no}</div>
        <div><strong>Dept:</strong> {record.department}</div>
        <div><strong>CGPA:</strong> {record.cgpa}</div>
      </div>
    </div>
  );
}

function ComplexityMeter({ comparisons, mode }) {
  const max = 10;
  const percentage = Math.min((comparisons / max) * 100, 100);

  return (
    <div
      className="overview-card"
      style={{
        marginTop: 18,
        marginBottom: 0
      }}
    >
      <div className="overview-card-head">
        <Zap size={18} />
        <h4>Search Efficiency</h4>
      </div>

      <div
        style={{
          height: 12,
          borderRadius: 999,
          background: "rgba(148,163,184,0.18)",
          overflow: "hidden",
          marginBottom: 10
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background:
              mode === "linear"
                ? "linear-gradient(90deg, #ef4444, #f87171)"
                : "linear-gradient(90deg, #10b981, #34d399)",
            transition: "width 0.35s ease"
          }}
        />
      </div>

      <p style={{ margin: 0, color: "#cbd5e1" }}>
        {mode === "linear"
          ? "Linear scan is slower because it checks rows one by one."
          : "Indexed lookup is faster because it jumps using the lookup structure."}
      </p>
    </div>
  );
}

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
      ? "Without an index, the DBMS scans records one by one until it finds the target."
      : "With an index, the DBMS uses a lookup structure to directly reach the target row.";

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
                Visualize how search works {searchMode === "linear" ? "without an index" : "with an index"}.
              </p>
            </div>
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
          <button className="sim-btn sim-btn-primary" onClick={runSimulation} disabled={isRunning}>
            <Play size={16} />
            {isRunning ? "Running..." : "Run Search"}
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
          className="sorting-stats-grid"
          style={{
            marginTop: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
          }}
        >
          <InfoStatCard
            label="Search Mode"
            value={searchMode === "linear" ? "Without Index" : "With Index"}
          />
          <InfoStatCard label="Comparisons / Lookups" value={comparisons} />
          <InfoStatCard
            label="Search Result"
            value={foundRecord ? `${foundRecord.name} (${foundRecord.roll_no})` : "Not found yet"}
          />
          <InfoStatCard
            label="Target Found"
            value={foundIndex !== null ? "Yes" : "No / Pending"}
          />
        </div>

        <ObservationBox text={observationText} />

        <ComplexityMeter comparisons={comparisons} mode={searchMode} />

        {searchMode === "indexed" && (
          <div className="overview-card" style={{ marginTop: 18 }}>
            <div className="overview-card-head">
              <Search size={18} />
              <h4>Index Structure</h4>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Object.keys(indexMap).map((key) => (
                <div
                  key={key}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 14,
                    background:
                      Number(key) === selectedIndexKey
                        ? "rgba(250,204,21,0.22)"
                        : "rgba(56,189,248,0.12)",
                    border:
                      Number(key) === selectedIndexKey
                        ? "1px solid rgba(250,204,21,0.35)"
                        : "1px solid rgba(56,189,248,0.2)",
                    color: "#e2e8f0",
                    fontWeight: 700
                  }}
                >
                  {key} → Row {indexMap[key] + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="sorting-visualizer-wrap"
          style={{
            minHeight: 320,
            marginTop: 20,
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 12,
              flexWrap: "wrap"
            }}
          >
            {records.map((rec, i) => (
              <RecordCard
                key={i}
                record={rec}
                index={i}
                currentIndex={currentIndex}
                foundIndex={foundIndex}
              />
            ))}
          </div>
        </div>
      </section>

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}