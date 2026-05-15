import React from "react";

import {
  Database,
  Cpu,
  Workflow,
  MemoryStick,
  ShieldCheck,
  Layers3
} from "lucide-react";

export default function DVLSISRAMCellOverview() {
  return (
    <div className="overview-shell">
      <section className="hero-overview-card">
        <div className="hero-overview-content">
          <div className="hero-badge">
            SRAM MEMORY
          </div>

          <h1>
            SRAM Cell Basics
          </h1>

          <p>
            Explore how a
            6-transistor SRAM
            cell stores,
            preserves, reads,
            and writes binary
            information using
            cross-coupled
            inverter feedback.
          </p>
        </div>
      </section>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Database size={18} />

            <h4>Aim</h4>
          </div>

          <p>
            Study the working
            principle of an
            SRAM cell and
            understand hold,
            read, and write
            operations.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />

            <h4>
              Core Structure
            </h4>
          </div>

          <p>
            Two
            cross-coupled
            CMOS inverters
            form a bistable
            memory element
            capable of storing
            one bit.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />

            <h4>
              Access Control
            </h4>
          </div>

          <p>
            Access
            transistors
            controlled by the
            wordline connect
            the internal nodes
            to the bitline
            pair.
          </p>
        </div>
      </div>

      <section className="theory-card">
        <div className="theory-header">
          <Layers3 size={20} />
          <h2>
            SRAM Cell Theory
          </h2>
        </div>

        <div className="theory-content">
          <p>
            A standard 6T SRAM
            cell contains two
            CMOS inverters
            connected back to
            back. This creates
            a regenerative
            feedback loop with
            two stable logic
            states.
          </p>

          <p>
            The stored value
            appears at node Q,
            while the opposite
            value appears at
            Q̅. As long as
            power is applied,
            the feedback loop
            preserves the
            stored bit.
          </p>

          <p>
            During write
            operations, the
            bitline pair forces
            a new logic state
            into the cell.
            During read
            operations, the
            stored value is
            sensed through the
            access transistors.
          </p>
        </div>
      </section>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <MemoryStick
              size={18}
            />

            <h4>
              Key Signals
            </h4>
          </div>

          <ul className="overview-list">
            <li>
              Q and Q̅ are
              complementary
              storage nodes
            </li>

            <li>
              Wordline enables
              access
              transistors
            </li>

            <li>
              Bitlines carry
              read/write data
            </li>
          </ul>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ShieldCheck
              size={18}
            />

            <h4>
              Why SRAM?
            </h4>
          </div>

          <ul className="overview-list">
            <li>
              Very fast memory
              access
            </li>

            <li>
              No refresh
              operation needed
            </li>

            <li>
              Widely used in
              CPU cache memory
            </li>
          </ul>
        </div>
      </div>

      <section className="theory-card">
        <div className="theory-header">
          <Workflow size={20} />
          <h2>
            Experiment
            Procedure
          </h2>
        </div>

        <div className="theory-content">
          <ol className="overview-steps">
            <li>
              Select HOLD,
              READ, or WRITE
              mode.
            </li>

            <li>
              Configure the
              wordline signal.
            </li>

            <li>
              Set bitline
              values for write
              operations.
            </li>

            <li>
              Observe Q and Q̅
              node behavior.
            </li>

            <li>
              Analyze how the
              SRAM cell
              maintains stable
              data storage.
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}