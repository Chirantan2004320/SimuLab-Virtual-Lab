import React from "react";

export default function DVLSICMOSNANDOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the transistor-level implementation and logic behavior of a 2-input
          CMOS NAND gate for different input combinations.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A CMOS NAND gate is implemented using a pull-up network made of pMOS transistors
          in parallel and a pull-down network made of nMOS transistors in series.
        </p>
        <p>
          The NAND gate outputs LOW only when both inputs are HIGH. If either input is LOW,
          the output is pulled HIGH through the pull-up network.
        </p>
        <p>
          This makes the NAND gate one of the most important universal gates in digital design.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select input values A and B.</li>
          <li>Observe the output logic state.</li>
          <li>Check which pMOS and nMOS transistors are ON or OFF.</li>
          <li>Study the current path in the circuit diagram.</li>
          <li>Verify the behavior with the truth table.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          In a CMOS NAND gate, the output becomes LOW only when both nMOS transistors conduct
          together in series and both pMOS transistors are OFF.
        </p>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          NAND gates are widely used in digital integrated circuits because any Boolean function
          can be implemented using only NAND gates.
        </p>
      </section>
    </div>
  );
}