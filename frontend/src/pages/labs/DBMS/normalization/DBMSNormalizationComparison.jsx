import React from "react";
import { GitCompare, AlertTriangle, CheckCircle2, Database } from "lucide-react";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";

function getComparisonContent(normalForm) {
  if (normalForm === "1nf") {
    return {
      beforeTitle: "Before 1NF",
      beforeProblem:
        "The original table contains repeating groups and non-atomic values. Multiple course IDs, names, and instructors are stored inside single cells.",
      beforeTables: ["unf"],
      afterTitle: "After 1NF",
      afterBenefit:
        "Each field now stores only one value. Repeating groups are removed by creating separate rows.",
      afterTables: ["first"]
    };
  }

  if (normalForm === "2nf") {
    return {
      beforeTitle: "Before 2NF",
      beforeProblem:
        "The 1NF table still contains partial dependency. Some non-key attributes depend only on course_id, not on the full composite key.",
      beforeTables: ["first"],
      afterTitle: "After 2NF",
      afterBenefit:
        "Attributes depending only on course_id are moved to a separate Course table. The design now removes partial dependency.",
      afterTables: ["secondStudentCourse", "secondCourse", "secondStudent"]
    };
  }

  return {
    beforeTitle: "Before 3NF",
    beforeProblem:
      "The 2NF design still contains transitive dependency. department_office depends on department_name rather than directly on student_id.",
    beforeTables: ["secondStudent", "secondCourse", "secondStudentCourse"],
    afterTitle: "After 3NF",
    afterBenefit:
      "Department details are moved into a separate Department table so non-key attributes depend only on the key.",
    afterTables: ["thirdStudent", "thirdDepartment", "secondCourse", "secondStudentCourse"]
  };
}

export default function DBMSNormalizationComparison({
  normalForm,
  unfTable,
  firstNFTable,
  secondNFStudentCourse,
  secondNFCourse,
  secondNFStudent,
  thirdNFStudent,
  thirdNFDepartment
}) {
  const content = getComparisonContent(normalForm);

  const tableMap = {
    unf: {
      title: "Unnormalized Table",
      rows: unfTable
    },
    first: {
      title: "1NF Table",
      rows: firstNFTable
    },
    secondStudentCourse: {
      title: "StudentCourse Table",
      rows: secondNFStudentCourse
    },
    secondCourse: {
      title: "Course Table",
      rows: secondNFCourse
    },
    secondStudent: {
      title: "Student Table",
      rows: secondNFStudent
    },
    thirdStudent: {
      title: "Student Table",
      rows: thirdNFStudent
    },
    thirdDepartment: {
      title: "Department Table",
      rows: thirdNFDepartment
    }
  };

  const beforeTables = content.beforeTables.map((key) => tableMap[key]);
  const afterTables = content.afterTables.map((key) => tableMap[key]);

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <GitCompare size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Comparison</h2>
          <p className="sorting-sim-subtitle">
            Compare the schema before and after {normalForm.toUpperCase()} normalization.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
          marginBottom: 20
        }}
      >
        <div className="overview-card" style={{ margin: 0 }}>
          <div className="overview-card-head">
            <AlertTriangle size={18} />
            <h4>{content.beforeTitle}</h4>
          </div>
          <p>{content.beforeProblem}</p>
        </div>

        <div className="overview-card" style={{ margin: 0 }}>
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>{content.afterTitle}</h4>
          </div>
          <p>{content.afterBenefit}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 20
        }}
      >
        <div
          style={{
            background: "rgba(8, 20, 45, 0.78)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 18
          }}
        >
          <div className="sorting-sim-title-wrap" style={{ marginBottom: 16 }}>
            <div className="sorting-sim-icon" style={{ color: "#fca5a5", background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.22)" }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.2rem" }}>Before</h3>
              <p className="sorting-sim-subtitle" style={{ marginTop: 4 }}>
                Original structure before applying {normalForm.toUpperCase()}.
              </p>
            </div>
          </div>

          {beforeTables.map((table, index) => (
            <SimpleTable
              key={`before-${table.title}-${index}`}
              title={table.title}
              rows={table.rows}
              highlightRows={[]}
            />
          ))}
        </div>

        <div
          style={{
            background: "rgba(8, 20, 45, 0.78)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 18
          }}
        >
          <div className="sorting-sim-title-wrap" style={{ marginBottom: 16 }}>
            <div className="sorting-sim-icon" style={{ color: "#86efac", background: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.22)" }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.2rem" }}>After</h3>
              <p className="sorting-sim-subtitle" style={{ marginTop: 4 }}>
                Improved structure after applying {normalForm.toUpperCase()}.
              </p>
            </div>
          </div>

          {afterTables.map((table, index) => (
            <SimpleTable
              key={`after-${table.title}-${index}`}
              title={table.title}
              rows={table.rows}
              highlightRows={[]}
            />
          ))}
        </div>
      </div>

      <div className="overview-card" style={{ marginTop: 20 }}>
        <div className="overview-card-head">
          <Database size={18} />
          <h4>What Students Should Notice</h4>
        </div>
        <p>
          In the <strong>Before</strong> structure, the design contains redundancy or dependency problems.
          In the <strong>After</strong> structure, those issues are reduced by splitting the data into
          smaller tables with clearer responsibility. This is the key idea behind {normalForm.toUpperCase()} normalization.
        </p>
      </div>
    </section>
  );
}