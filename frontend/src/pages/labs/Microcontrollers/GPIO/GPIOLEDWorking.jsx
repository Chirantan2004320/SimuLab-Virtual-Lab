// GPIOLEDWorking.jsx
import React from "react";
import { Table2, CheckCircle2, Cpu } from "lucide-react";

export default function GPIOLEDWorking({ ledState, analysis }) {
  const rows = [
    {
      gpio: 0,
      voltage: "0V",
      led: "OFF",
      current: "No current flow",
    },
    {
      gpio: 1,
      voltage: "5V / 3.3V",
      led: "ON",
      current: "Current flows through resistor and LED",
    },
  ];

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Table2 size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Working</h2>
            <p className="sorting-sim-subtitle">
              Understand how a GPIO pin controls an LED using HIGH and LOW logic.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        {analysis?.note ||
          `When GPIO = ${ledState}, the LED is ${
            ledState === 1 ? "ON because current flows." : "OFF because current is stopped."
          }`}
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>GPIO Pin</h4>
          </div>
          <p>
            A GPIO pin is a digital output pin of a microcontroller. It can be
            programmed as HIGH or LOW.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Current State</h4>
          </div>
          <p>
            GPIO = <strong>{ledState}</strong>, so the LED is{" "}
            <strong style={{ color: ledState === 1 ? "#22c55e" : "#ef4444" }}>
              {ledState === 1 ? "ON" : "OFF"}
            </strong>
            .
          </p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1rem", color: "#f8fafc" }}>
          GPIO LED Working Table
        </h3>

        <table className="dbms-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>GPIO Output</th>
              <th>Pin Voltage</th>
              <th>LED State</th>
              <th>Explanation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const active = row.gpio === ledState;

              return (
                <tr key={row.gpio} className={active ? "highlight-row" : ""}>
                  <td>
                    <strong>{row.gpio}</strong>
                  </td>
                  <td>{row.voltage}</td>
                  <td
                    style={{
                      color: row.gpio === 1 ? "#22c55e" : "#ef4444",
                      fontWeight: 800,
                    }}
                  >
                    {row.led}
                  </td>
                  <td>{row.current}</td>
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
            <h4>When GPIO is HIGH</h4>
          </div>
          <p>
            The microcontroller pin outputs voltage. Current flows from the GPIO
            pin through the resistor and LED, so the LED glows.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>When GPIO is LOW</h4>
          </div>
          <p>
            The microcontroller pin outputs 0V. Current does not flow through
            the LED path, so the LED remains OFF.
          </p>
        </div>
      </div>
    </section>
  );
}