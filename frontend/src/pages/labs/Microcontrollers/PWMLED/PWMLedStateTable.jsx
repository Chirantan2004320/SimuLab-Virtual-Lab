import React from "react";
import { Table2, CheckCircle2 } from "lucide-react";

const rows = [
  { duty: 0, pwm: 0, voltage: "0.00V", brightness: "OFF" },
  { duty: 25, pwm: 64, voltage: "1.25V", brightness: "DIM" },
  { duty: 50, pwm: 128, voltage: "2.50V", brightness: "MEDIUM" },
  { duty: 75, pwm: 191, voltage: "3.75V", brightness: "BRIGHT" },
  { duty: 100, pwm: 255, voltage: "5.00V", brightness: "FULL BRIGHTNESS" }
];

export default function PWMLedStateTable({ analysis }) {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Table2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">State Table</h2>
          <p className="sorting-sim-subtitle">
            PWM duty cycle, analogWrite value, and LED brightness.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        Arduino PWM values usually range from <strong>0 to 255</strong>.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Duty Cycle</th>
              <th>PWM Value</th>
              <th>Average Voltage</th>
              <th>LED Brightness</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const highlight = row.duty === analysis.dutyCycle;
              return (
                <tr key={row.duty} className={highlight ? "highlight-row" : ""}>
                  <td><strong>{row.duty}%</strong></td>
                  <td>{row.pwm}</td>
                  <td>{row.voltage}</td>
                  <td><strong>{row.brightness}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="overview-card" style={{ marginTop: 18 }}>
        <div className="overview-card-head">
          <CheckCircle2 size={18} />
          <h4>Current Observation</h4>
        </div>
        <p>{analysis.note}</p>
      </div>
    </section>
  );
}