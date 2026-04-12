import React from "react";

export default function DSDDecoderEncoderOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the working of decoder and encoder circuits and understand how binary information
          is converted between input lines and output codes.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A <strong>decoder</strong> is a combinational circuit that converts an n-bit binary input
          into one of 2ⁿ active output lines.
        </p>
        <p>
          A <strong>2-to-4 decoder</strong> has two inputs and four outputs. For each binary input
          combination, only one output becomes active.
        </p>
        <p>
          An <strong>encoder</strong> performs the reverse operation. It converts one active input
          line into its corresponding binary code.
        </p>
        <p>
          A <strong>4-to-2 encoder</strong> accepts four input lines and produces a two-bit binary output
          corresponding to the active input.
        </p>
      </section>

      <section className="card">
        <h2>Decoder Mapping</h2>
        <p><strong>00 → Y0</strong></p>
        <p><strong>01 → Y1</strong></p>
        <p><strong>10 → Y2</strong></p>
        <p><strong>11 → Y3</strong></p>
      </section>

      <section className="card">
        <h2>Encoder Mapping</h2>
        <p><strong>I0 active → 00</strong></p>
        <p><strong>I1 active → 01</strong></p>
        <p><strong>I2 active → 10</strong></p>
        <p><strong>I3 active → 11</strong></p>
      </section>

      <section className="card">
        <h2>Applications</h2>
        <p>
          Decoders are used in memory addressing, display selection, and control systems.
        </p>
        <p>
          Encoders are used in keyboards, interrupt systems, digital communication, and data compression logic.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select Decoder or Encoder mode.</li>
          <li>In Decoder mode, toggle inputs A and B.</li>
          <li>In Encoder mode, activate one input line among I0 to I3.</li>
          <li>Observe the corresponding output pattern.</li>
          <li>Compare the observed result with the truth table and circuit diagram.</li>
        </ol>
      </section>
    </div>
  );
}