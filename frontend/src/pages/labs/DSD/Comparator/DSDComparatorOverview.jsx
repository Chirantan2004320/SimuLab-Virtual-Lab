import React from "react";

export default function DSDComparatorOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the working of a 1-bit comparator and observe how two binary inputs are compared.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A comparator is a combinational circuit used to compare two binary inputs and determine their relationship.
        </p>
        <p>
          For two 1-bit inputs A and B, the comparator produces three outputs:
        </p>
        <p><strong>A &gt; B</strong> — active when A is greater than B.</p>
        <p><strong>A = B</strong> — active when both inputs are equal.</p>
        <p><strong>A &lt; B</strong> — active when A is less than B.</p>
      </section>

      <section className="card">
        <h2>Logic Conditions</h2>
        <p><strong>A &gt; B = A · B̅</strong></p>
        <p><strong>A = B = A̅B̅ + AB</strong></p>
        <p><strong>A &lt; B = A̅ · B</strong></p>
      </section>

      <section className="card">
        <h2>Applications</h2>
        <p>
          Comparators are used in processors, arithmetic units, digital control systems, sorting logic, and decision-making circuits.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Toggle inputs A and B.</li>
          <li>Observe which comparison output becomes active.</li>
          <li>Verify the result using the truth table.</li>
          <li>Study the circuit and logic interpretation.</li>
        </ol>
      </section>
    </div>
  );
}