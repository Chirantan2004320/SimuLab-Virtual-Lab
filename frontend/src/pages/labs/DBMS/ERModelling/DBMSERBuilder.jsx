import React, { useMemo, useState } from "react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";

function EntityDiagramBox({ entity, x, y, onDeleteEntity, onDeleteAttribute }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 220,
        padding: 12,
        borderRadius: 10,
        background: "rgba(15,23,42,0.85)",
        border: "2px solid #38bdf8",
        color: "#e5e7eb",
        boxShadow: "0 4px 12px rgba(56,189,248,0.15)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          marginBottom: 8
        }}
      >
        <div style={{ fontWeight: 800, color: "#38bdf8" }}>{entity.name}</div>
        <button
          className="btn danger"
          style={{ padding: "4px 10px", fontSize: "0.8rem" }}
          onClick={() => onDeleteEntity(entity.id)}
        >
          Delete
        </button>
      </div>

      {entity.attributes.length === 0 ? (
        <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No attributes yet</div>
      ) : (
        entity.attributes.map((attr, index) => (
          <div
            key={`${entity.id}-${attr.name}-${index}`}
            style={{
              fontSize: "0.9rem",
              padding: "6px 8px",
              marginBottom: 6,
              borderRadius: 8,
              background: attr.primary
                ? "rgba(250,204,21,0.12)"
                : "rgba(15,23,42,0.35)",
              border: attr.primary
                ? "1px solid rgba(250,204,21,0.35)"
                : "1px solid rgba(148,163,184,0.18)",
              color: attr.primary ? "#facc15" : "#cbd5e1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8
            }}
          >
            <span>
              {attr.name} {attr.primary ? "(PK)" : ""}
            </span>

            <button
              className="btn danger"
              style={{ padding: "2px 8px", fontSize: "0.72rem" }}
              onClick={() => onDeleteAttribute(entity.id, index)}
            >
              ×
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

          const x1 = from.x + 220;
          const y1 = from.y + 100;
          const x2 = to.x;
          const y2 = to.y + 100;

          return (
            <line
              key={rel.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#38bdf8"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {relationships.map((rel) => {
        const from = positions[rel.fromEntityId];
        const to = positions[rel.toEntityId];
        if (!from || !to || !byId[rel.fromEntityId] || !byId[rel.toEntityId]) return null;

        const midX = (from.x + 220 + to.x) / 2;
        const midY = (from.y + 100 + to.y + 100) / 2;

        return (
          <div
            key={`label-${rel.id}`}
            style={{
              position: "absolute",
              left: midX,
              top: midY + 28,
              transform: "translate(-50%, -50%)",
              background: "rgba(15,23,42,0.95)",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: "0.8rem",
              color: "#facc15",
              border: "1px solid rgba(250,204,21,0.25)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 5,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.35)"
            }}
          >
            <span>
              {rel.name} ({rel.cardinality})
            </span>
            <button
              className="btn danger"
              style={{ padding: "2px 8px", fontSize: "0.72rem", pointerEvents: "auto" }}
              onClick={() => onDeleteRelationship(rel.id)}
            >
              ×
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
        y: 40 + row * 240
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

    const entityNameForStep =
      entities.find((e) => e.id === selectedEntityId)?.name || "Entity";

    addStep(
      `Added attribute "${trimmed}"${isPrimary ? " as primary key" : ""} to "${entityNameForStep}".`
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

    addStep(`Deleted entity "${entity?.name || entityId}" and its connected relationships.`);
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
      <section className="card experiment">
        <h2>
          ER Builder <span style={{ color: "#38bdf8" }}>(Interactive)</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 16
          }}
        >
          <InfoStatCard label="Entities" value={entities.length} />
          <InfoStatCard label="Relationships" value={relationships.length} />
          <InfoStatCard
            label="Total Attributes"
            value={entities.reduce((sum, e) => sum + e.attributes.length, 0)}
          />
        </div>

        <ObservationBox text={observationText} />
      </section>

      <section className="card">
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Add Entity</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            alignItems: "end"
          }}
        >
          <div>
            <label>Entity Name</label>
            <input
              className="lab-input"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="Example: Department"
              style={{ width: "100%" }}
            />
          </div>

          <div className="buttons">
            <button className="btn primary" onClick={addEntity}>
              Add Entity
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Add Attribute</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            alignItems: "end"
          }}
        >
          <div>
            <label>Select Entity</label>
            <select
              className="lab-select"
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">Select entity</option>
              {entityOptions.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Attribute Name</label>
            <input
              className="lab-input"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              placeholder="Example: department_id"
              style={{ width: "100%" }}
            />
          </div>

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

          <div className="buttons">
            <button className="btn primary" onClick={addAttribute}>
              Add Attribute
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Add Relationship</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            alignItems: "end"
          }}
        >
          <div>
            <label>From Entity</label>
            <select
              className="lab-select"
              value={fromEntityId}
              onChange={(e) => setFromEntityId(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">Select entity</option>
              {entityOptions.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>To Entity</label>
            <select
              className="lab-select"
              value={toEntityId}
              onChange={(e) => setToEntityId(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">Select entity</option>
              {entityOptions.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Relationship Name</label>
            <input
              className="lab-input"
              value={relationshipName}
              onChange={(e) => setRelationshipName(e.target.value)}
              placeholder="Example: BELONGS_TO"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label>Cardinality</label>
            <select
              className="lab-select"
              value={cardinality}
              onChange={(e) => setCardinality(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="1:1">1:1</option>
              <option value="1:N">1:N</option>
              <option value="M:N">M:N</option>
            </select>
          </div>

          <div className="buttons">
            <button className="btn primary" onClick={addRelationship}>
              Add Relationship
            </button>
            <button className="btn secondary" onClick={clearBuilder}>
              Clear Builder
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Live ER Diagram</h3>

        <div
          style={{
            position: "relative",
            minHeight: 560,
            background: "rgba(15,23,42,0.4)",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,0.2)",
            overflow: "auto"
          }}
        >
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

      <section className="card">
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Export to Relational Schema</h3>
        <div className="buttons" style={{ marginBottom: 14 }}>
          <button className="btn success" onClick={exportToRelationalSchema}>
            Generate Tables
          </button>
        </div>

        <SimpleTable title="Generated Relational Schema" rows={generatedTables} />
      </section>

      <StepHistoryPanel steps={steps} />
    </>
  );
}