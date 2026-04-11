import React from "react";

export default function DVLSICMOSInverterSimulationOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the transfer behavior of a CMOS inverter and understand its
          switching action, noise margin concepts, propagation delay, and dynamic power trend.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A CMOS inverter consists of a pMOS transistor connected to VDD and an nMOS
          transistor connected to ground. Both transistor gates are connected to the input,
          and the output is taken from their common drain node.
        </p>
        <p>
          When the input is LOW, the pMOS is ON and the nMOS is OFF, producing a HIGH output.
          When the input is HIGH, the nMOS is ON and the pMOS is OFF, producing a LOW output.
        </p>
        <p>
          During the switching region, both transistors may conduct simultaneously. This
          transition region is important for propagation delay, switching power, and noise margins.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Set the supply voltage VDD.</li>
          <li>Adjust the inverter switching point VM.</li>
          <li>Change the input voltage Vin.</li>
          <li>Observe output voltage, transistor states, and operating region.</li>
          <li>Study the transfer characteristic and transient response graphs.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          A CMOS inverter produces the logical complement of its input. Its voltage transfer
          characteristic is steep near the switching point, which helps in achieving noise immunity.
        </p>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          CMOS inverters are the basic building blocks of digital integrated circuits. Their
          delay, power, and switching threshold strongly affect the behavior of larger logic systems.
        </p>
      </section>
    </div>
  );
}