import React from "react";

export default function DSDCounterOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study the working of a 2-bit binary counter and observe how its output changes with each clock pulse.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A counter is a sequential circuit that goes through a prescribed sequence of states in response to clock pulses.
        </p>
        <p>
          A <strong>2-bit binary counter</strong> has two output bits and counts in binary sequence:
        </p>
        <p>
          <strong>00 → 01 → 10 → 11 → 00</strong>
        </p>
        <p>
          Counters are commonly built using flip-flops and are widely used in digital clocks, timers, control units, and event counting circuits.
        </p>
      </section>

      <section className="card">
        <h2>Key Idea</h2>
        <p>
          Each clock pulse causes the counter to move to the next state.
        </p>
        <p>
          Since this is a 2-bit counter, there are 4 possible states before the sequence repeats.
        </p>
      </section>

      <section className="card">
        <h2>Applications</h2>
        <p>
          Counters are used in frequency division, digital measurement systems, finite state machines, and microprocessor timing circuits.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Observe the current binary state of the counter.</li>
          <li>Apply a clock pulse.</li>
          <li>Notice how the output changes to the next binary value.</li>
          <li>Repeat the process to verify the full counting sequence.</li>
          <li>Use Reset to bring the counter back to 00.</li>
        </ol>
      </section>
    </div>
  );
}