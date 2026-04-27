import React from "react";
import { Cpu, MousePointerClick, Workflow, Lightbulb } from "lucide-react";

export default function ButtonInputOverview({ analysis }) {
  return (
    <div className="overview-shell">
      <section className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Reading Digital Input from a Push Button</h3>
          <div className="overview-badge">GPIO Input</div>
        </div>
        <p className="overview-hero-text">
          A microcontroller can read external events using GPIO input pins.
          A push button is one of the simplest input devices. Depending on the
          pull-up or pull-down resistor configuration, the pin reads HIGH or LOW
          when the button is pressed or released.
        </p>
      </section>

      <div className="overview-grid">
        <section className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            Study how a GPIO pin reads a push button and how resistor biasing
            avoids floating input states.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <MousePointerClick size={18} />
            <h4>Button Logic</h4>
          </div>
          <p>
            In pull-down mode, released means LOW and pressed means HIGH.
            In pull-up mode, released means HIGH and pressed means LOW.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>Current State</h4>
          </div>
          <p>
            Button is <strong>{analysis.buttonLabel}</strong>, so GPIO reads{" "}
            <strong>{analysis.readLabel}</strong>.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Practical Insight</h4>
          </div>
          <p>
            Buttons are used in embedded systems for reset, menu selection,
            user input, interrupt triggers, and control panels.
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
            <span>Select pull-up or pull-down configuration.</span>
          </li>
          <li>
            <span className="overview-step-index">2</span>
            <span>Press or release the push button.</span>
          </li>
          <li>
            <span className="overview-step-index">3</span>
            <span>Observe the GPIO input reading.</span>
          </li>
          <li>
            <span className="overview-step-index">4</span>
            <span>Verify the result using the state table and circuit view.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}