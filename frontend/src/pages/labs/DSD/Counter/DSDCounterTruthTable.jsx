import React from "react";
import { Table2, CheckCircle2, TimerReset } from "lucide-react";

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

export default function DSDCounterTruthTable({ count, analysis }) {
  const rows = [
    { dec: 0, q1: 0, q0: 0, binary: "00", next: "01" },
    { dec: 1, q1: 0, q0: 1, binary: "01", next: "10" },
    { dec: 2, q1: 1, q0: 0, binary: "10", next: "11" },
    { dec: 3, q1: 1, q0: 1, binary: "11", next: "00" }
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
              Verify the counter state sequence and next-state transition.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row corresponds to the current counter state.
      </div>

      <div className="overview-card" style={{ marginTop: 18 }}>
        <div className="overview-card-head">
          <Table2 size={18} />
          <h4>2-bit Counter State Table</h4>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="dbms-table">
            <thead>
              <tr>
                <th>Decimal State</th>
                <th>Q1</th>
                <th>Q0</th>
                <th>Binary</th>
                <th>Next State</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const highlight = row.dec === count;
                return (
                  <tr key={row.dec} className={highlight ? "highlight-row" : ""}>
                    <td>{row.dec}</td>
                    <td>{bitCell(row.q1, highlight && row.q1 === 1, "#38bdf8")}</td>
                    <td>{bitCell(row.q0, highlight && row.q0 === 1, "#22c55e")}</td>
                    <td>
                      <strong style={{ color: highlight ? "#38bdf8" : "#e2e8f0" }}>
                        {row.binary}
                      </strong>
                    </td>
                    <td>
                      <strong>{row.next}</strong>
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
            <TimerReset size={18} />
            <h4>Current State</h4>
          </div>
          <p>
            The counter is currently at state <strong>{analysis.binary}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Next State</h4>
          </div>
          <p>
            After the next clock pulse, it moves to <strong>{analysis.nextBinary}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}