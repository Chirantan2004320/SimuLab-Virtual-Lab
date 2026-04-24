import React from "react";
import { Table2, CheckCircle2, Scale } from "lucide-react";

function bitCell(value, active = false, color = "#22c55e") {
  return (
    <span
      style={{
        fontWeight: "800",
        color: value === 1 ? color : "#94a3b8",
        background: active ? "rgba(56,189,248,0.12)" : "transparent",
        border: active ? "1px solid rgba(56,189,248,0.25)" : "1px solid transparent",
        padding: "4px 10px",
        borderRadius: "999px"
      }}
    >
      {value}
    </span>
  );
}

export default function DSDComparatorTruthTable({ a, b, analysis }) {
  const rows = [
    { A: 0, B: 0, GT: 0, EQ: 1, LT: 0, relation: "A = B" },
    { A: 0, B: 1, GT: 0, EQ: 0, LT: 1, relation: "A < B" },
    { A: 1, B: 0, GT: 1, EQ: 0, LT: 0, relation: "A > B" },
    { A: 1, B: 1, GT: 0, EQ: 1, LT: 0, relation: "A = B" }
  ];

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Table2 size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Truth Table</h2>
            <p className="sorting-sim-subtitle">
              Verify the comparator output for each possible input combination.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row corresponds to the current input combination A = {a}, B = {b}.
      </div>

      <div className="overview-card" style={{ marginTop: 18 }}>
        <div className="overview-card-head">
          <Table2 size={18} />
          <h4>1-bit Comparator Truth Table</h4>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="dbms-table">
            <thead>
              <tr>
                <th>A</th>
                <th>B</th>
                <th>A &gt; B</th>
                <th>A = B</th>
                <th>A &lt; B</th>
                <th>Relation</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const highlight = row.A === a && row.B === b;
                return (
                  <tr key={i} className={highlight ? "highlight-row" : ""}>
                    <td>{row.A}</td>
                    <td>{row.B}</td>
                    <td>{bitCell(row.GT, highlight && row.GT === 1, "#22c55e")}</td>
                    <td>{bitCell(row.EQ, highlight && row.EQ === 1, "#38bdf8")}</td>
                    <td>{bitCell(row.LT, highlight && row.LT === 1, "#f59e0b")}</td>
                    <td>
                      <strong style={{ color: highlight ? "#38bdf8" : "#e2e8f0" }}>
                        {row.relation}
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overview-grid" style={{ marginTop: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Scale size={18} />
            <h4>Current Input Observation</h4>
          </div>
          <p>
            For inputs <strong>A = {a}</strong> and <strong>B = {b}</strong>, the comparator relation is{" "}
            <strong>{analysis.relation}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Output Result</h4>
          </div>
          <p>
            A &gt; B = <strong>{analysis.greater}</strong>, A = B ={" "}
            <strong>{analysis.equal}</strong>, A &lt; B ={" "}
            <strong>{analysis.less}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}