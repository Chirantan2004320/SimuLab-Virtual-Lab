import React from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Database,
  Sparkles,
  ArrowRightLeft,
  TimerReset,
  Table2
} from "lucide-react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function EntityCard({ entity, isHighlighted }) {
  return (
    <div className={`er-sim-entity-card ${isHighlighted ? "active" : ""}`}>
      <div className="er-sim-entity-head">
        <span className="er-sim-entity-badge">Entity</span>
        <h3>{entity.name}</h3>
      </div>

      <div className="er-sim-attr-list">
        {entity.attributes.map((attribute) => (
          <div
            key={attribute.name}
            className={`er-sim-attr-item ${attribute.primary ? "primary" : ""}`}
          >
            {attribute.name} {attribute.primary ? "(PK)" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function RelationshipCard({ title, cardinality, active }) {
  return (
    <div className={`er-relationship-card ${active ? "active" : ""}`}>
      <div className="er-relationship-title">{title}</div>
      <div className="er-relationship-sub">{cardinality}</div>
    </div>
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

  const relationshipRows = [
    {
      title: "Student ENROLLS_IN Course",
      cardinality: "Many-to-Many",
      key: "enrolls"
    },
    {
      title: "Instructor TEACHES Course",
      cardinality: "One-to-Many",
      key: "teaches"
    }
  ];

  const entityCount = erEntities.length;
  const relationshipCount = 2;
  const mappedTableCount =
    mode === "mapping"
      ? (mappingRows.length > 0 ? mappingRows.length : 0)
      : relationalTables.length;

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
                Visualize how ER concepts are discovered and transformed step by step.
              </p>
            </div>
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
          <button className="sim-btn sim-btn-primary" onClick={runSimulation} disabled={isRunning}>
            <Play size={16} />
            {isRunning ? "Running..." : "Run Demo"}
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

        <div className="sorting-info-box">{message || "Run the ER modelling simulation to begin."}</div>

        {currentStage && (
          <div className="er-current-stage">
            <TimerReset size={16} />
            <span>Current Stage: {currentStage}</span>
          </div>
        )}

        <div
          className="sorting-stats-grid"
          style={{
            marginTop: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
          }}
        >
          <InfoStatCard label="Entities" value={entityCount} />
          <InfoStatCard label="Relationships" value={relationshipCount} />
          <InfoStatCard
            label={mode === "mapping" ? "Mapped Tables" : "Schema Items"}
            value={mappedTableCount}
          />
          <InfoStatCard
            label="Focus"
            value={
              mode === "entities"
                ? "Attributes"
                : mode === "relationships"
                ? "Cardinality"
                : "Mapping"
            }
          />
        </div>

        <ObservationBox text={summaryText} />
        <ObservationBox text={observationText} />
      </section>

      <section className="sorting-sim-card" style={{ marginTop: 22 }}>
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            {mode === "mapping" ? <Table2 size={18} /> : <Sparkles size={18} />}
          </div>
          <div>
            <h2 className="sorting-sim-title">
              {mode === "entities"
                ? "Entity Explorer"
                : mode === "relationships"
                ? "Relationship Explorer"
                : "Mapping Explorer"}
            </h2>
            <p className="sorting-sim-subtitle">
              {mode === "entities"
                ? "See how each entity and its attributes are organized."
                : mode === "relationships"
                ? "Understand how entities are connected using relationship rules."
                : "Watch how conceptual design becomes relational schema."}
            </p>
          </div>
        </div>

        {mode === "entities" && (
          <div className="er-sim-entity-grid">
            {erEntities.map((entity) => (
              <EntityCard
                key={entity.key}
                entity={entity}
                isHighlighted={highlightedEntity === entity.key}
              />
            ))}
          </div>
        )}

        {mode === "relationships" && (
          <div style={{ display: "grid", gap: 14 }}>
            {relationshipRows.map((row) => (
              <RelationshipCard
                key={row.key}
                title={row.title}
                cardinality={row.cardinality}
                active={highlightedRelationship === row.key}
              />
            ))}

            <div className="er-sim-hint">
              <ArrowRightLeft size={18} />
              Entity interactions are represented here visually
            </div>
          </div>
        )}

        {mode === "mapping" && (
          <SimpleTable
            title="Relational Mapping"
            rows={mappingRows.length > 0 ? mappingRows : []}
          />
        )}
      </section>

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}