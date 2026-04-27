import React from "react";
import { Table2, CheckCircle2 } from "lucide-react";

export default function TrafficLightStateTable({ analysis }) {
  const rows = [
    {
      state: "RED",
      red: 1,
      yellow: 0,
      green: 0,
      delay: "5000 ms",
      next: "GREEN"
    },
    {
      state: "GREEN",
      red: 0,
      yellow: 0,
      green: 1,
      delay: "5000 ms",
      next: "YELLOW"
    },
    {
      state: "YELLOW",
      red: 0,
      yellow: 1,
      green: 0,
      delay: "2000 ms",
      next: "RED"
    }
  ];

  const bitColor = (value, color) => ({
    color: value ? color : "#94a3b8",
    fontWeight: "bold"
  });

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Table2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">State Table</h2>
          <p className="sorting-sim-subtitle">
            Traffic light controller states and next-state transitions.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row matches the currently active traffic light state.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ color: "#f8fafc", marginBottom: "1rem" }}>
          Traffic Light FSM State Table
        </h3>

        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>State</th>
              <th>Red</th>
              <th>Yellow</th>
              <th>Green</th>
              <th>Delay</th>
              <th>Next State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const highlight = row.state === analysis.state;

              return (
                <tr key={row.state} className={highlight ? "highlight-row" : ""}>
                  <td>
                    <strong>{row.state}</strong>
                  </td>
                  <td style={bitColor(row.red, "#ef4444")}>{row.red}</td>
                  <td style={bitColor(row.yellow, "#facc15")}>{row.yellow}</td>
                  <td style={bitColor(row.green, "#22c55e")}>{row.green}</td>
                  <td>{row.delay}</td>
                  <td>
                    <strong>{row.next}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="overview-grid" style={{ marginTop: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Current Observation</h4>
          </div>
          <p>
            The current active state is <strong>{analysis.state}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Table2 size={18} />
            <h4>State Machine Rule</h4>
          </div>
          <p>
            The controller always moves in a fixed sequence:
            <br />
            <strong>RED → GREEN → YELLOW → RED</strong>
          </p>
        </div>
      </div>
    </section>
  );
}