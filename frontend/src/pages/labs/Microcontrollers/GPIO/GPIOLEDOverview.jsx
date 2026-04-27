import React from "react";

export default function GPIOLEDOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand how a microcontroller controls an LED using a GPIO pin.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          GPIO (General Purpose Input Output) pins allow a microcontroller to interact with external devices.
        </p>
        <p>
          When configured as OUTPUT:
        </p>
        <ul>
          <li>HIGH (1) → LED turns ON</li>
          <li>LOW (0) → LED turns OFF</li>
        </ul>
      </section>

      <section className="card">
        <h2>Concept</h2>
        <p>
          The microcontroller sends a digital signal through a pin which controls current flow through the LED.
        </p>
      </section>

      <section className="card">
        <h2>Applications</h2>
        <ul>
          <li>Status indicators</li>
          <li>Debug signals</li>
          <li>Embedded system outputs</li>
        </ul>
      </section>
    </div>
  );
}