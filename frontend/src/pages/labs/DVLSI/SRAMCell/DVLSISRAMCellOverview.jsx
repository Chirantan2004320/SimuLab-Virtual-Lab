import React from "react";

export default function DVLSISRAMCellOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand the basic operation of an SRAM cell and study how it stores,
          holds, reads, and writes binary data using cross-coupled inverters and access transistors.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A basic SRAM cell is typically formed using two cross-coupled inverters, which create
          a bistable circuit capable of storing one bit of data.
        </p>
        <p>
          Two access transistors connect the internal storage nodes to the bitline pair when the
          wordline is activated. This allows the cell to be read from or written into.
        </p>
        <p>
          Because the cross-coupled inverter pair has two stable states, the cell can store either
          logic 0 or logic 1 as long as power is present.
        </p>
      </section>

      <section className="card">
        <h2>Key Concepts</h2>
        <p><strong>Q and Q̅:</strong> complementary internal storage nodes.</p>
        <p><strong>Wordline:</strong> enables access to the cell.</p>
        <p><strong>Bitline and Bitline̅:</strong> used for reading and writing data.</p>
        <p><strong>Hold State:</strong> cell preserves data when isolated.</p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Choose an operation: Hold, Read, or Write.</li>
          <li>Set the wordline state.</li>
          <li>Adjust bitline values for write operations.</li>
          <li>Observe internal nodes Q and Q̅.</li>
          <li>Study how the cross-coupled structure maintains or changes the stored value.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          SRAM cells are widely used in cache memories and small high-speed memory arrays because
          they provide fast access and do not need refresh like DRAM.
        </p>
      </section>
    </div>
  );
}