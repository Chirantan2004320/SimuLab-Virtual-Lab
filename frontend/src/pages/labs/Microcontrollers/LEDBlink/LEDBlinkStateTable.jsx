import React from "react";
import { Table2, CheckCircle2 } from "lucide-react";

export default function LEDBlinkStateTable({ analysis }) {
  const rows = [
    {
      phase: "ON Phase",
      gpio: "HIGH",
      led: "ON",
      voltage: "5V",
      duration: `${analysis.delayMs} ms`
    },
    {
      phase: "OFF Phase",
      gpio: "LOW",
      led: "OFF",
      voltage: "0V",
      duration: `${analysis.delayMs} ms`
    }
  ];

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Table2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">State Table</h2>
          <p className="sorting-sim-subtitle">
            Observe the two states that repeat in an LED blink program.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row matches the current LED phase.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ color: "#f8fafc", marginBottom: "1rem" }}>LED Blink State Table</h3>

        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Phase</th>
              <th>GPIO D13</th>
              <th>LED</th>
              <th>Voltage</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const highlight = row.phase === analysis.phase;

              return (
                <tr key={index} className={highlight ? "highlight-row" : ""}>
                  <td>{row.phase}</td>
                  <td style={{ color: row.gpio === "HIGH" ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>
                    {row.gpio}
                  </td>
                  <td>{row.led}</td>
                  <td>{row.voltage}</td>
                  <td>{row.duration}</td>
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
            Current phase is <strong>{analysis.phase}</strong>, so the LED is{" "}
            <strong>{analysis.ledState ? "ON" : "OFF"}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Table2 size={18} />
            <h4>Loop Behavior</h4>
          </div>
          <p>
            The program alternates between the ON and OFF rows repeatedly.
          </p>
        </div>
      </div>
    </section>
  );
}