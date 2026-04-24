import React from "react";
import {
  BookOpen,
  Target,
  Network,
  Database,
  CheckCircle2,
  Layers3,
  Sparkles,
  KeyRound
} from "lucide-react";

function MiniMetric({ icon: Icon, label, value }) {
  return (
    <div className="er-mini-metric">
      <div className="er-mini-metric-icon">
        <Icon size={16} />
      </div>
      <div>
        <div className="er-mini-metric-label">{label}</div>
        <div className="er-mini-metric-value">{value}</div>
      </div>
    </div>
  );
}

export default function DBMSERModelingOverview({
  mode,
  erEntities,
  relationalTables
}) {
  const isEntities = mode === "entities";
  const isRelationships = mode === "relationships";
  const isMapping = mode === "mapping";

  const theoryText = isEntities
    ? "Entities represent real-world objects and attributes describe their details. Primary keys help uniquely identify each entity instance."
    : isRelationships
    ? "Relationships show how entities interact. Cardinality such as 1:1, 1:N, and M:N tells us how many entity instances can participate."
    : "ER to relational mapping converts conceptual design into implementable database tables while preserving keys and relationships.";

  const flowSteps = isEntities
    ? [
        "Identify real-world objects like Student, Course, and Instructor.",
        "List meaningful attributes for each entity.",
        "Mark the primary key that uniquely identifies each record.",
        "Group attributes under the correct entity."
      ]
    : isRelationships
    ? [
        "Find which entities interact with each other.",
        "Assign a meaningful relationship name.",
        "Decide the correct cardinality like 1:1, 1:N, or M:N.",
        "Use relationships to capture how data is connected."
      ]
    : [
        "Create one table for each strong entity.",
        "Preserve the primary key in each table.",
        "Use foreign keys for one-to-many relationships.",
        "Create a separate junction table for many-to-many relationships."
      ];

  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Build a strong understanding of ER modelling before moving to implementation.
          </p>
        </div>
      </div>

      <div className="er-overview-hero">
        <div className="er-overview-hero-top">
          <div>
            <h3>ER Modelling Visualizer</h3>
            <p>
              ER modelling is the foundation of database design. It helps you think about
              <strong> entities</strong>, <strong>attributes</strong>, <strong>relationships</strong>,
              and finally how the whole design becomes a real set of database tables.
            </p>
          </div>

          <span className="overview-badge">DBMS Design Core</span>
        </div>

        <div className="er-overview-metrics">
          <MiniMetric icon={Database} label="Core Focus" value="Objects & Fields" />
          <MiniMetric icon={Sparkles} label="Goal" value="Clear Data Model" />
          <MiniMetric icon={CheckCircle2} label="Key Skill" value="Identify PKs" />
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand and visualize{" "}
            {isEntities
              ? "entities and attributes"
              : isRelationships
              ? "relationships and cardinalities"
              : "ER to relational mapping"}{" "}
            in database design.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>{theoryText}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Network size={18} />
            <h4>Why It Matters</h4>
          </div>
          <p>
            ER modelling makes your database easier to understand before implementation.
            A good ER model reduces confusion, avoids design mistakes, and makes later
            table creation much easier.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>What You Learn</h4>
          </div>
          <p>
            This lab helps you identify the right entities, connect them with proper
            relationships, and convert the conceptual ER design into a relational schema.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Layers3 size={18} />
          <h4>Concept Flow</h4>
        </div>

        <ol className="overview-steps-list">
          {flowSteps.map((step, index) => (
            <li key={index}>
              <span className="overview-step-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Database size={18} />
          <h4>Entities in This Lab</h4>
        </div>

        <div className="linked-overview-grid">
          {erEntities.map((entity) => (
            <div key={entity.key} className="linked-overview-card er-entity-overview-card">
              <div className="linked-overview-card-title">
                <span>{entity.name}</span>
              </div>
              <ul>
                {entity.attributes.map((attr) => (
                  <li key={attr.name}>
                    {attr.primary ? <KeyRound size={14} style={{ display: "inline", marginRight: 6, color: "#4ade80" }} /> : null}
                    {attr.name} {attr.primary ? "(PK)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {isMapping && (
        <div className="overview-card">
          <div className="overview-card-head">
            <Database size={18} />
            <h4>Relational Schema Result</h4>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="dbms-table">
              <thead>
                <tr>
                  <th>TABLE NAME</th>
                  <th>COLUMNS</th>
                </tr>
              </thead>
              <tbody>
                {relationalTables.map((row, index) => (
                  <tr key={index}>
                    <td>{row.table_name}</td>
                    <td>{row.columns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}