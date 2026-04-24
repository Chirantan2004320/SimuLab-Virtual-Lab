import React, { useMemo, useState } from "react";
import {
  PlusCircle,
  Trash2,
  Sparkles,
  Database,
  Network,
  KeyRound
} from "lucide-react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";

function EntityDiagramBox({ entity, x, y, onDeleteEntity, onDeleteAttribute }) {
  return (
    <div
      className="er-builder-entity"
      style={{
        left: x,
        top: y
      }}
    >
      <div className="er-builder-entity-head">
        <div>{entity.name}</div>

        <button
          className="sim-btn sim-btn-danger"
          style={{ padding: "6px 10px", borderRadius: 10 }}
          onClick={() => onDeleteEntity(entity.id)}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {entity.attributes.length === 0 ? (
        <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No attributes yet</div>
      ) : (
        entity.attributes.map((attr, index) => (
          <div
            key={`${entity.id}-${attr.name}-${index}`}
            className={`er-builder-attr ${attr.primary ? "primary" : ""}`}
          >
            <span>
              {attr.name} {attr.primary ? "(PK)" : ""}
            </span>

            <button
              className="sim-btn sim-btn-danger"
              style={{ padding: "4px 8px", borderRadius: 8 }}
              onClick={() => onDeleteAttribute(entity.id, index)}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function RelationshipLines({
  entities,
  relationships,
  positions,
  onDeleteRelationship
}) {
  const byId = Object.fromEntries(entities.map((e) => [e.id, e]));

  return (
    <>
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1
        }}
      >
        {relationships.map((rel) => {
          const from = positions[rel.fromEntityId];
          const to = positions[rel.toEntityId];
          if (!from || !to || !byId[rel.fromEntityId] || !byId[rel.toEntityId]) return null;

          const x1 = from.x + 230;
          const y1 = from.y + 110;
          const x2 = to.x;
          const y2 = to.y + 110;

          return (
            <line
              key={rel.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#38bdf8"
              strokeWidth="2.4"
              strokeDasharray="8 6"
            />
          );
        })}
      </svg>

      {relationships.map((rel) => {
        const from = positions[rel.fromEntityId];
        const to = positions[rel.toEntityId];
        if (!from || !to || !byId[rel.fromEntityId] || !byId[rel.toEntityId]) return null;

        const midX = (from.x + 230 + to.x) / 2;
        const midY = (from.y + 110 + to.y + 110) / 2;

        return (
          <div
            key={`label-${rel.id}`}
            className="er-builder-rel-label"
            style={{
              left: midX,
              top: midY + 28
            }}
          >
            <span>
              {rel.name} ({rel.cardinality})
            </span>
            <button
              className="sim-btn sim-btn-danger"
              style={{ padding: "4px 8px", borderRadius: 8, pointerEvents: "auto" }}
              onClick={() => onDeleteRelationship(rel.id)}
            >
              <Trash2 size={12} />
            </button>
          </div>
        );
      })}
    </>
  );
}

export default function DBMSERBuilder() {
  const [entities, setEntities] = useState([
    {
      id: "student",
      name: "Student",
      attributes: [
        { name: "student_id", primary: true },
        { name: "name", primary: false }
      ]
    },
    {
      id: "course",
      name: "Course",
      attributes: [
        { name: "course_id", primary: true },
        { name: "course_name", primary: false }
      ]
    }
  ]);

  const [relationships, setRelationships] = useState([
    {
      id: "rel-1",
      fromEntityId: "student",
      toEntityId: "course",
      name: "ENROLLS_IN",
      cardinality: "M:N"
    }
  ]);

  const [entityName, setEntityName] = useState("");
  const [selectedEntityId, setSelectedEntityId] = useState("student");
  const [attributeName, setAttributeName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const [fromEntityId, setFromEntityId] = useState("student");
  const [toEntityId, setToEntityId] = useState("course");
  const [relationshipName, setRelationshipName] = useState("RELATES_TO");
  const [cardinality, setCardinality] = useState("1:N");

  const [steps, setSteps] = useState([
    "Sample ER Builder loaded with Student and Course."
  ]);

  const [generatedTables, setGeneratedTables] = useState([]);

  const positions = useMemo(() => {
    const map = {};
    entities.forEach((entity, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      map[entity.id] = {
        x: 40 + col * 340,
        y: 40 + row * 250
      };
    });
    return map;
  }, [entities]);

  const addStep = (text) => setSteps((prev) => [...prev, text]);

  const entityOptions = entities.map((e) => ({ id: e.id, name: e.name }));

  const addEntity = () => {
    const trimmed = entityName.trim();
    if (!trimmed) return;

    const id = `${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    const newEntity = {
      id,
      name: trimmed,
      attributes: []
    };

    setEntities((prev) => [...prev, newEntity]);
    setEntityName("");
    setSelectedEntityId(id);
    setFromEntityId(id);
    setToEntityId(id);
    addStep(`Added entity "${trimmed}".`);
  };

  const addAttribute = () => {
    const trimmed = attributeName.trim();
    if (!trimmed || !selectedEntityId) return;

    setEntities((prev) =>
      prev.map((entity) =>
        entity.id === selectedEntityId
          ? {
              ...entity,
              attributes: [...entity.attributes, { name: trimmed, primary: isPrimary }]
            }
          : entity
      )
    );

    const selectedEntityName =
      entities.find((e) => e.id === selectedEntityId)?.name || "Entity";

    addStep(
      `Added attribute "${trimmed}"${isPrimary ? " as primary key" : ""} to "${selectedEntityName}".`
    );

    setAttributeName("");
    setIsPrimary(false);
  };

  const addRelationship = () => {
    if (!fromEntityId || !toEntityId || fromEntityId === toEntityId) return;

    const relName = relationshipName.trim() || "RELATES_TO";

    setRelationships((prev) => [
      ...prev,
      {
        id: `rel-${Date.now()}`,
        fromEntityId,
        toEntityId,
        name: relName,
        cardinality
      }
    ]);

    const fromName = entities.find((e) => e.id === fromEntityId)?.name || "Entity 1";
    const toName = entities.find((e) => e.id === toEntityId)?.name || "Entity 2";

    addStep(
      `Added relationship "${relName}" between "${fromName}" and "${toName}" with cardinality ${cardinality}.`
    );
  };

  const deleteEntity = (entityId) => {
    const entity = entities.find((e) => e.id === entityId);

    setEntities((prev) => prev.filter((e) => e.id !== entityId));
    setRelationships((prev) =>
      prev.filter(
        (rel) => rel.fromEntityId !== entityId && rel.toEntityId !== entityId
      )
    );

    if (selectedEntityId === entityId) setSelectedEntityId("");
    if (fromEntityId === entityId) setFromEntityId("");
    if (toEntityId === entityId) setToEntityId("");

    addStep(`Deleted entity "${entity?.name || entityId}" and its related links.`);
  };

  const deleteAttribute = (entityId, attrIndex) => {
    const entity = entities.find((e) => e.id === entityId);
    const attrName = entity?.attributes?.[attrIndex]?.name || "attribute";

    setEntities((prev) =>
      prev.map((e) =>
        e.id === entityId
          ? {
              ...e,
              attributes: e.attributes.filter((_, index) => index !== attrIndex)
            }
          : e
      )
    );

    addStep(`Deleted attribute "${attrName}" from "${entity?.name || entityId}".`);
  };

  const deleteRelationship = (relId) => {
    const rel = relationships.find((r) => r.id === relId);
    setRelationships((prev) => prev.filter((r) => r.id !== relId));
    addStep(`Deleted relationship "${rel?.name || relId}".`);
  };

  const clearBuilder = () => {
    setEntities([]);
    setRelationships([]);
    setSelectedEntityId("");
    setFromEntityId("");
    setToEntityId("");
    setGeneratedTables([]);
    setSteps(["Builder cleared. Start designing a new ER diagram."]);
  };

  const exportToRelationalSchema = () => {
    const tables = [];

    entities.forEach((entity) => {
      const columns =
        entity.attributes.length > 0
          ? entity.attributes
              .map((attr) => `${attr.name}${attr.primary ? " (PK)" : ""}`)
              .join(", ")
          : "No columns defined";

      tables.push({
        table_name: entity.name,
        columns
      });
    });

    relationships.forEach((rel) => {
      const fromEntity = entities.find((e) => e.id === rel.fromEntityId);
      const toEntity = entities.find((e) => e.id === rel.toEntityId);

      if (!fromEntity || !toEntity) return;

      if (rel.cardinality === "M:N") {
        tables.push({
          table_name: rel.name,
          columns: `${fromEntity.name.toLowerCase()}_id (FK), ${toEntity.name.toLowerCase()}_id (FK)`
        });
      } else if (rel.cardinality === "1:N") {
        tables.push({
          table_name: `${toEntity.name}`,
          columns: `${fromEntity.name.toLowerCase()}_id (FK) added to existing table`
        });
      } else if (rel.cardinality === "1:1") {
        tables.push({
          table_name: rel.name,
          columns: `${fromEntity.name.toLowerCase()}_id (FK), ${toEntity.name.toLowerCase()}_id (FK)`
        });
      }
    });

    setGeneratedTables(tables);
    addStep("Exported ER diagram to relational schema.");
  };

  const observationText =
    "Build your own ER diagram by adding entities, attributes, primary keys, and relationships. Then export it into a relational schema.";

  return (
    <>
      <section className="sorting-sim-card">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">ER Builder</h2>
            <p className="sorting-sim-subtitle">
              Create entities, add attributes, connect relationships, and generate schema.
            </p>
          </div>
        </div>

        <div
          className="sorting-stats-grid"
          style={{
            marginBottom: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
          }}
        >
          <InfoStatCard label="Entities" value={entities.length} />
          <InfoStatCard label="Relationships" value={relationships.length} />
          <InfoStatCard
            label="Total Attributes"
            value={entities.reduce((sum, e) => sum + e.attributes.length, 0)}
          />
          <InfoStatCard label="Generated Tables" value={generatedTables.length} />
        </div>

        <ObservationBox text={observationText} />
      </section>

      <section className="sorting-sim-card" style={{ marginTop: 22 }}>
        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-card-head">
              <Database size={18} />
              <h4>Add Entity</h4>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <input
                className="sorting-input"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Example: Department"
              />
              <button className="sim-btn sim-btn-primary" onClick={addEntity}>
                <PlusCircle size={16} />
                Add Entity
              </button>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <KeyRound size={18} />
              <h4>Add Attribute</h4>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <select
                className="sorting-select"
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
              >
                <option value="">Select entity</option>
                {entityOptions.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>

              <input
                className="sorting-input"
                value={attributeName}
                onChange={(e) => setAttributeName(e.target.value)}
                placeholder="Example: department_id"
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#e5e7eb",
                  fontWeight: 600
                }}
              >
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                />
                Mark as Primary Key
              </label>

              <button className="sim-btn sim-btn-primary" onClick={addAttribute}>
                <PlusCircle size={16} />
                Add Attribute
              </button>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-card-head">
              <Network size={18} />
              <h4>Add Relationship</h4>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <select
                className="sorting-select"
                value={fromEntityId}
                onChange={(e) => setFromEntityId(e.target.value)}
              >
                <option value="">From entity</option>
                {entityOptions.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>

              <select
                className="sorting-select"
                value={toEntityId}
                onChange={(e) => setToEntityId(e.target.value)}
              >
                <option value="">To entity</option>
                {entityOptions.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>

              <input
                className="sorting-input"
                value={relationshipName}
                onChange={(e) => setRelationshipName(e.target.value)}
                placeholder="Example: BELONGS_TO"
              />

              <select
                className="sorting-select"
                value={cardinality}
                onChange={(e) => setCardinality(e.target.value)}
              >
                <option value="1:1">1:1</option>
                <option value="1:N">1:N</option>
                <option value="M:N">M:N</option>
              </select>

              <button className="sim-btn sim-btn-primary" onClick={addRelationship}>
                <PlusCircle size={16} />
                Add Relationship
              </button>
            </div>
          </div>
        </div>

        <div className="sorting-btn-group" style={{ marginTop: 18 }}>
          <button className="sim-btn sim-btn-success" onClick={exportToRelationalSchema}>
            Generate Tables
          </button>
          <button className="sim-btn sim-btn-danger" onClick={clearBuilder}>
            Clear Builder
          </button>
        </div>
      </section>

      <section className="sorting-sim-card" style={{ marginTop: 22 }}>
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <Network size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Live ER Diagram</h2>
            <p className="sorting-sim-subtitle">
              Your entities and relationships are rendered below in real time.
            </p>
          </div>
        </div>

        <div className="er-builder-canvas">
          <RelationshipLines
            entities={entities}
            relationships={relationships}
            positions={positions}
            onDeleteRelationship={deleteRelationship}
          />

          {entities.map((entity) => {
            const pos = positions[entity.id];
            return (
              <EntityDiagramBox
                key={entity.id}
                entity={entity}
                x={pos?.x || 0}
                y={pos?.y || 0}
                onDeleteEntity={deleteEntity}
                onDeleteAttribute={deleteAttribute}
              />
            );
          })}
        </div>
      </section>

      <section className="sorting-sim-card" style={{ marginTop: 22 }}>
        <SimpleTable title="Generated Relational Schema" rows={generatedTables} />
      </section>

      <StepHistoryPanel steps={steps} />
    </>
  );
}