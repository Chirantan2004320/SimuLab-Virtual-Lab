import React from "react";

function EntityBox({ entity, x, y }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 200,
        padding: 12,
        borderRadius: 10,
        background: "rgba(15,23,42,0.8)",
        border: "2px solid #38bdf8",
        color: "#e5e7eb"
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#38bdf8" }}>
        {entity.name}
      </div>

      {entity.attributes.map((attr) => (
        <div
          key={attr.name}
          style={{
            fontSize: "0.9rem",
            padding: "4px 0",
            color: attr.primary ? "#facc15" : "#cbd5e1"
          }}
        >
          {attr.name} {attr.primary ? "(PK)" : ""}
        </div>
      ))}
    </div>
  );
}

function Line({ x1, y1, x2, y2, label }) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <>
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none"
        }}
      >
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#38bdf8"
          strokeWidth="2"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: midX,
          top: midY,
          transform: "translate(-50%, -50%)",
          background: "rgba(15,23,42,0.8)",
          padding: "4px 8px",
          borderRadius: 6,
          fontSize: "0.8rem",
          color: "#facc15"
        }}
      >
        {label}
      </div>
    </>
  );
}

export default function DBMSERDiagram({ entities }) {
  const student = entities.find((e) => e.key === "student");
  const course = entities.find((e) => e.key === "course");
  const instructor = entities.find((e) => e.key === "instructor");

  return (
    <section className="card">
      <h2>ER Diagram</h2>

      <div
        style={{
          position: "relative",
          height: 400,
          background: "rgba(15,23,42,0.4)",
          borderRadius: 10,
          border: "1px solid rgba(148,163,184,0.2)",
          overflowX: "auto"
        }}
      >
        {student && <EntityBox entity={student} x={80} y={120} />}
        {course && <EntityBox entity={course} x={350} y={120} />}
        {instructor && <EntityBox entity={instructor} x={620} y={120} />}

        <Line x1={280} y1={200} x2={350} y2={200} label="ENROLLS_IN (M:N)" />
        <Line x1={550} y1={200} x2={620} y2={200} label="TEACHES (1:N)" />
      </div>
    </section>
  );
}