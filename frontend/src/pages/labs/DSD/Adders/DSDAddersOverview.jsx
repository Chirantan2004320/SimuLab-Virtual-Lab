import React from "react";

export default function DSDAddersOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the working of Half Adder and Full Adder circuits by changing binary inputs
          and observing the resulting Sum and Carry outputs.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          Adders are digital circuits used to perform binary addition. They are fundamental
          building blocks in arithmetic logic units and processors.
        </p>
        <p>
          A <strong>Half Adder</strong> adds two binary inputs A and B. It produces:
        </p>
        <p>
          <strong>Sum = A ⊕ B</strong><br />
          <strong>Carry = A · B</strong>
        </p>
        <p>
          A <strong>Full Adder</strong> adds three inputs A, B, and Carry-in (Cin). It produces:
        </p>
        <p>
          <strong>Sum = A ⊕ B ⊕ Cin</strong><br />
          <strong>Carry = (A·B) + (B·Cin) + (A·Cin)</strong>
        </p>
      </section>

      <section className="card">
        <h2>Difference Between Half Adder and Full Adder</h2>
        <p>
          <strong>Half Adder:</strong> accepts only two inputs and has no carry-in.
        </p>
        <p>
          <strong>Full Adder:</strong> accepts three inputs, including carry-in, and is more useful
          in multi-bit binary addition.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select either Half Adder or Full Adder in the simulation section.</li>
          <li>Toggle the input bits A and B.</li>
          <li>For Full Adder, also toggle Carry-in (Cin).</li>
          <li>Observe the Sum and Carry outputs.</li>
          <li>Compare the observed values with the truth table and circuit view.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          Full Adders are used in cascaded form to build larger binary adders, such as 4-bit,
          8-bit, and 16-bit arithmetic units in digital systems.
        </p>
      </section>
    </div>
  );
}