import React from "react";
import { GitCompare, Database, Network, Layers3 } from "lucide-react";

export default function DBMSERModelingComparison({ mode }) {
  const comparisonRows =
    mode === "entities"
      ? [
          ["Entity", "Represents a real-world object", "Student, Course, Instructor"],
          ["Attribute", "Describes a property of an entity", "student_id, name, credits"],
          ["Primary Key", "Uniquely identifies an entity instance", "student_id, course_id"],
          ["Goal", "Structure the objects and their details", "Build a clear conceptual model"]
        ]
      : mode === "relationships"
      ? [
          ["Relationship", "Connects two or more entities", "Student ENROLLS_IN Course"],
          ["1:1", "One entity instance maps to one other", "Person ↔ Passport"],
          ["1:N", "One entity connects to many others", "Instructor → Course"],
          ["M:N", "Many instances connect on both sides", "Student ↔ Course"]
        ]
      : [
          ["Strong Entity", "Becomes its own table", "Student, Course, Instructor"],
          ["1:N Relationship", "Usually handled with a foreign key", "Course has instructor_id"],
          ["M:N Relationship", "Needs a junction table", "Enrollment(student_id, course_id)"],
          ["Final Goal", "Convert ER model into implementable schema", "Relational database design"]
        ];

  const leftCard =
    mode === "entities"
      ? {
          title: "Conceptual ER View",
          lines: [
            "Objects are identified first",
            "Attributes are grouped under entities",
            "Primary keys are highlighted",
            "Focus is on understanding the domain"
          ]
        }
      : mode === "relationships"
      ? {
          title: "Entity Interaction View",
          lines: [
            "Entities are connected through named relationships",
            "Cardinality explains participation",
            "Many-to-many needs extra attention later",
            "Focus is on data connections"
          ]
        }
      : {
          title: "ER Diagram View",
          lines: [
            "Conceptual model is complete",
            "Entities and relationships are known",
            "Keys and cardinalities are identified",
            "Ready for table conversion"
          ]
        };

  const rightCard =
    mode === "entities"
      ? {
          title: "Practical Design Outcome",
          lines: [
            "You know what data objects exist",
            "You know what each object stores",
            "You can mark identifiers properly",
            "This is the base of good DB design"
          ]
        }
      : mode === "relationships"
      ? {
          title: "Practical Design Outcome",
          lines: [
            "You know how tables will later connect",
            "You can choose correct cardinality",
            "You avoid wrong schema assumptions",
            "This improves normalization and mapping"
          ]
        }
      : {
          title: "Relational Schema View",
          lines: [
            "Entities become tables",
            "Primary keys remain keys",
            "Foreign keys represent links",
            "M:N relationships become junction tables"
          ]
        };

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <GitCompare size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Comparison</h2>
          <p className="sorting-sim-subtitle">
            Compare the core ideas behind this ER modelling concept.
          </p>
        </div>
      </div>

      <div className="comparison-grid-upgraded" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="comparison-card">
          <div className="comparison-card-head">
            <h3>{leftCard.title}</h3>
            <span className="comparison-chip">
              {mode === "entities" ? "Entity Focus" : mode === "relationships" ? "Connection Focus" : "Conceptual"}
            </span>
          </div>

          <div className="comparison-mini-stats">
            {leftCard.lines.map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </div>
        </div>

        <div className="comparison-card">
          <div className="comparison-card-head">
            <h3>{rightCard.title}</h3>
            <span className="comparison-chip">
              {mode === "mapping" ? "Implementation" : "Design Outcome"}
            </span>
          </div>

          <div className="comparison-mini-stats">
            {rightCard.lines.map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="comparison-card" style={{ marginTop: 18 }}>
        <div className="comparison-card-head">
          <h3>Quick Reference Table</h3>
          <span className="comparison-chip">Summary</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="dbms-table">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>MEANING</th>
                <th>EXAMPLE</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr key={index}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overview-grid" style={{ marginTop: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Database size={18} />
            <h4>Database View</h4>
          </div>
          <p>
            ER modelling helps you design the structure before writing SQL tables, keys,
            or foreign key constraints.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Network size={18} />
            <h4>Connection View</h4>
          </div>
          <p>
            Good ER design makes the relationships between entities clear and reduces
            confusion in later schema design.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Layers3 size={18} />
            <h4>Implementation View</h4>
          </div>
          <p>
            Once the ER model is correct, relational mapping becomes much easier and
            more accurate.
          </p>
        </div>
      </div>
    </section>
  );
}