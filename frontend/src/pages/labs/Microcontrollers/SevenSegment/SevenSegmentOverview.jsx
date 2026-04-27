import React from "react";
import { Cpu, Binary, Lightbulb, Workflow } from "lucide-react";

export default function SevenSegmentOverview({ analysis }) {
  return (
    <div className="overview-shell">
      <section className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>7-Segment Display Interfacing</h3>
          <div className="overview-badge">GPIO Display</div>
        </div>
        <p className="overview-hero-text">
          A 7-segment display contains seven LED bars named a, b, c, d, e, f, and g.
          By turning selected segments ON, a microcontroller can display digits from 0 to 9.
        </p>
      </section>

      <div className="overview-grid">
        <section className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Aim</h4>
          </div>
          <p>Understand how GPIO pins control individual display segments to form decimal digits.</p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Current Pattern</h4>
          </div>
          <p>
            Digit <strong>{analysis.digit}</strong> uses segment pattern{" "}
            <strong>{analysis.binaryPattern}</strong>.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>Segment Names</h4>
          </div>
          <p>
            Segments are named <strong>a, b, c, d, e, f, g</strong>. Each one behaves like a small LED.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Applications</h4>
          </div>
          <p>
            Used in clocks, counters, calculators, elevators, meters, and embedded display systems.
          </p>
        </section>
      </div>
    </div>
  );
}