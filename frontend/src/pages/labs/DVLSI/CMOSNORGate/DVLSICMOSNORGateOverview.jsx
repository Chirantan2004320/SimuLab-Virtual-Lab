import React from "react";

export default function DVLSICMOSNOROverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the transistor-level implementation and logic behavior of a 2-input
          CMOS NOR gate for different input combinations.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A CMOS NOR gate is implemented using a pull-up network made of pMOS transistors
          in series and a pull-down network made of nMOS transistors in parallel.
        </p>
        <p>
          The NOR gate outputs HIGH only when both inputs are LOW. If either input becomes
          HIGH, the output is pulled LOW through the pull-down network.
        </p>
        <p>
          This arrangement demonstrates how CMOS logic uses complementary transistor networks
          to realize digital gates efficiently.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select input values A and B.</li>
          <li>Observe the output logic state.</li>
          <li>Check which pMOS and nMOS transistors are ON or OFF.</li>
          <li>Study the current path in the circuit diagram.</li>
          <li>Verify the result with the truth table.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          In a CMOS NOR gate, the pMOS network conducts only when both inputs are LOW,
          while the nMOS network conducts whenever any one input is HIGH.
        </p>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          CMOS NOR gates are fundamental building blocks in digital circuit design. Their
          pull-up and pull-down arrangements clearly illustrate how transistor networks
          implement Boolean logic in VLSI systems.
        </p>
      </section>
    </div>
  );
}