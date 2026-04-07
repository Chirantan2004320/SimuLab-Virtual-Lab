import React from "react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function EntityCard({ entity, isHighlighted }) {
  let border = "2px solid #38bdf8";
  let background =
    "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))";
  let boxShadow = "0 4px 12px rgba(56,189,248,0.15)";

  if (isHighlighted) {
    border = "2px solid #facc15";
    background =
      "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(234,179,8,0.18))";
    boxShadow = "0 0 18px rgba(250,204,21,0.25)";
  }

  return (
    <div
      style={{
        minWidth: 220,
        padding: "18px 16px",
        borderRadius: 12,
        background,
        border,
        color: "#ffffff",
        boxShadow,
        transition: "all 0.25s ease"
      }}
    >
      <div style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 12 }}>
        {entity.name}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {entity.attributes.map((attribute) => (
          <div
            key={attribute.name}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              background: attribute.primary
                ? "rgba(34,197,94,0.18)"
                : "rgba(15,23,42,0.35)",
              border: attribute.primary
                ? "1px solid rgba(34,197,94,0.4)"
                : "1px solid rgba(148,163,184,0.18)"
            }}
          >
            {attribute.name}
            {attribute.primary ? " (PK)" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function RelationshipPanel({ highlightedRelationship }) {
  const relationshipRows = [
    {
      name: "Student ENROLLS_IN Course",
      cardinality: "Many-to-Many",
      key: "enrolls"
    },
    {
      name: "Instructor TEACHES Course",
      cardinality: "One-to-Many",
      key: "teaches"
    }
  ];

  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Relationships</h3>

      <div style={{ display: "grid", gap: 12 }}>
        {relationshipRows.map((row) => {
          const isHighlighted = highlightedRelationship === row.key;

          return (
            <div
              key={row.key}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: isHighlighted
                  ? "rgba(250,204,21,0.18)"
                  : "rgba(15,23,42,0.35)",
                border: isHighlighted
                  ? "1px solid rgba(250,204,21,0.4)"
                  : "1px solid rgba(56,189,248,0.22)",
                color: "#e5e7eb",
                transition: "0.25s ease"
              }}
            >
              <strong style={{ color: "#38bdf8" }}>{row.name}</strong>
              <div style={{ marginTop: 8 }}>{row.cardinality}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DBMSERModelingSimulation({
  mode,
  erEntities,
  relationalTables,
  runSimulation,
  reset,
  loadSample,
  message,
  highlightedEntity,
  highlightedRelationship,
  currentStage,
  observationText,
  mappingRows,
  stepHistory,
  isRunning
}) {
  const summaryText =
    mode === "entities"
      ? "Entities represent real-world objects, and attributes describe their properties. Primary keys uniquely identify each entity instance."
      : mode === "relationships"
      ? "Relationships connect entities and define how they interact, such as one-to-many or many-to-many."
      : "ER to Relational Mapping converts entities and relationships into relational tables, preserving keys and constraints.";

  const entityCount = erEntities.length;
  const relationshipCount = 2;
  const mappedTableCount =
    mode === "mapping" ? (mappingRows.length > 0 ? mappingRows.length : 0) : relationalTables.length;

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
          {message || "Run the ER modelling simulation to begin."}
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
          <InfoStatCard label="Entities" value={entityCount} />
          <InfoStatCard label="Relationships" value={relationshipCount} />
          <InfoStatCard
            label={mode === "mapping" ? "Mapped Tables" : "Available Tables"}
            value={mappedTableCount}
          />
        </div>

        <ObservationBox text={summaryText} />
        <ObservationBox text={observationText} />
      </section>

      <section className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Entities</h3>

        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {erEntities.map((entity) => (
            <EntityCard
              key={entity.key}
              entity={entity}
              isHighlighted={highlightedEntity === entity.key}
            />
          ))}
        </div>
      </section>

      <RelationshipPanel highlightedRelationship={highlightedRelationship} />

      {mode === "mapping" && (
        <SimpleTable
          title="Relational Mapping"
          rows={mappingRows.length > 0 ? mappingRows : relationalTables.slice(0, 0)}
        />
      )}

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}