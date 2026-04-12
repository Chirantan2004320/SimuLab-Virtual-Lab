import React from "react";

export default function DSDFlipFlopsOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the working of basic sequential storage elements such as SR, D, JK,
          and T flip-flops by changing input conditions and observing the next state of the output.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          Flip-flops are sequential circuits that can store one bit of information.
          Unlike combinational circuits, their outputs depend not only on current inputs,
          but also on previous states.
        </p>
        <p>
          Common flip-flops include:
        </p>
        <p><strong>SR Latch:</strong> basic set-reset memory element.</p>
        <p><strong>D Flip-Flop:</strong> stores the value of input D when clock is active.</p>
        <p><strong>JK Flip-Flop:</strong> improved version of SR flip-flop without invalid state during normal clocked use.</p>
        <p><strong>T Flip-Flop:</strong> toggles output when T = 1 and clock is active.</p>
      </section>

      <section className="card">
        <h2>Key Idea</h2>
        <p>
          Flip-flops are used to build registers, counters, memory blocks, and state machines.
          They are fundamental to sequential digital systems.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select the required flip-flop type.</li>
          <li>Set the input values and clock where applicable.</li>
          <li>Observe the current state Q and predicted next state.</li>
          <li>Apply the new state and see how the output changes.</li>
          <li>Compare the result with the truth table and circuit section.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          Flip-flops are the foundation of clocked digital systems. They are used in timing,
          synchronization, storage, counters, and processor control logic.
        </p>
      </section>
    </div>
  );
}