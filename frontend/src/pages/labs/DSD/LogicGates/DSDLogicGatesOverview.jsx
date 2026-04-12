import React from "react";

export default function DSDLogicGatesOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the behavior of basic digital logic gates by changing binary inputs
          and observing the corresponding outputs.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          Logic gates are the basic building blocks of digital circuits. They perform
          Boolean operations on binary inputs and generate binary outputs.
        </p>
        <p>
          Common logic gates include BUFFER, NOT, AND, OR, NAND, NOR, XOR, and XNOR.
          Each gate follows a truth table that defines its output for every possible input combination.
        </p>
        <p>
          These gates are used in combinational circuits, arithmetic units, control circuits,
          memory systems, and processors.
        </p>
      </section>

      <section className="card">
        <h2>Gate Functions</h2>
        <p><strong>BUFFER:</strong> passes the input directly to output.</p>
        <p><strong>NOT:</strong> inverts the input.</p>
        <p><strong>AND:</strong> output is 1 only if both inputs are 1.</p>
        <p><strong>OR:</strong> output is 1 if at least one input is 1.</p>
        <p><strong>NAND:</strong> inverse of AND.</p>
        <p><strong>NOR:</strong> inverse of OR.</p>
        <p><strong>XOR:</strong> output is 1 if inputs are different.</p>
        <p><strong>XNOR:</strong> output is 1 if inputs are equal.</p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select a logic gate from the simulation section.</li>
          <li>Toggle input A, and input B where required.</li>
          <li>Observe the output for the selected gate.</li>
          <li>Study the gate symbol and truth table.</li>
          <li>Compare the observed output with Boolean logic rules.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          More complex digital circuits such as adders, multiplexers, decoders, latches,
          and processors are built using combinations of these basic logic gates.
        </p>
      </section>
    </div>
  );
}