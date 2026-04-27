import React from "react";
import { Cpu, Timer, Workflow, Lightbulb } from "lucide-react";

export default function TrafficLightOverview({ analysis }) {
  return (
    <div className="overview-shell">
      <section className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Traffic Light Control Using Microcontroller</h3>
          <div className="overview-badge">FSM + GPIO</div>
        </div>
        <p className="overview-hero-text">
          A traffic light controller is a real-world embedded system that uses
          GPIO pins, timers, and state sequencing to control red, yellow, and
          green lights in a fixed order.
        </p>
      </section>

      <div className="overview-grid">
        <section className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            Study how a microcontroller controls multiple LEDs using GPIO pins
            and timing logic.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>State Sequence</h4>
          </div>
          <p>
            The controller follows this sequence:
            <br />
            <strong>RED → GREEN → YELLOW → RED</strong>
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Timer size={18} />
            <h4>Timing</h4>
          </div>
          <p>
            Current state: <strong>{analysis.state}</strong>
            <br />
            Delay: <strong>{analysis.delay} ms</strong>
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Practical Insight</h4>
          </div>
          <p>
            Traffic systems, elevators, washing machines, and vending machines
            all use similar state-machine logic.
          </p>
        </section>
      </div>

      <section className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Workflow size={18} />
          <h4>Procedure</h4>
        </div>

        <ul className="overview-steps-list">
          <li>
            <span className="overview-step-index">1</span>
            <span>Start the traffic light simulation.</span>
          </li>
          <li>
            <span className="overview-step-index">2</span>
            <span>Observe the RED, GREEN, and YELLOW sequence.</span>
          </li>
          <li>
            <span className="overview-step-index">3</span>
            <span>Notice how each state has a fixed delay.</span>
          </li>
          <li>
            <span className="overview-step-index">4</span>
            <span>Compare the result with the state table and circuit section.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}