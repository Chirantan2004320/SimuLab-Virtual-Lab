import React from "react";
import { Table2, CheckCircle2 } from "lucide-react";

export default function ButtonInputStateTable({ inputMode, buttonPressed, analysis }) {
  const rows =
    inputMode === "PULL_DOWN"
      ? [
          { button: "Released", read: "LOW", value: 0, meaning: "Pull-down keeps input at 0V" },
          { button: "Pressed", read: "HIGH", value: 1, meaning: "Button connects input to 5V" }
        ]
      : [
          { button: "Released", read: "HIGH", value: 1, meaning: "Pull-up keeps input at 5V" },
          { button: "Pressed", read: "LOW", value: 0, meaning: "Button connects input to ground" }
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
            Compare button state with GPIO digital input reading.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row matches the current button condition.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ color: "#f8fafc", marginBottom: "1rem" }}>
          {inputMode === "PULL_DOWN" ? "Pull-down Input Table" : "Pull-up Input Table"}
        </h3>

        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Button State</th>
              <th>GPIO Reading</th>
              <th>Digital Value</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const highlight =
                (buttonPressed && row.button === "Pressed") ||
                (!buttonPressed && row.button === "Released");

              return (
                <tr key={index} className={highlight ? "highlight-row" : ""}>
                  <td>{row.button}</td>
                  <td
                    style={{
                      color: row.value ? "#22c55e" : "#ef4444",
                      fontWeight: "bold"
                    }}
                  >
                    {row.read}
                  </td>
                  <td>{row.value}</td>
                  <td>{row.meaning}</td>
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
            Button is <strong>{analysis.buttonLabel}</strong> and GPIO reads{" "}
            <strong>{analysis.readLabel}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Table2 size={18} />
            <h4>Input Mode</h4>
          </div>
          <p>
            Current configuration is{" "}
            <strong>{inputMode === "PULL_DOWN" ? "pull-down" : "pull-up"}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}