import React from "react";
import { Cpu, Timer, Workflow, Lightbulb } from "lucide-react";

export default function LEDBlinkOverview({ analysis }) {
  return (
    <div className="overview-shell">
      <section className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Timed GPIO Output for LED Blinking</h3>
          <div className="overview-badge">LED Blink</div>
        </div>
        <p className="overview-hero-text">
          LED blinking is the first microcontroller timing experiment. The controller sets a GPIO pin HIGH,
          waits for a delay, sets it LOW, waits again, and repeats this loop continuously.
        </p>
      </section>

      <div className="overview-grid">
        <section className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Aim</h4>
          </div>
          <p>Understand how GPIO output and delay instructions create a visible blinking LED pattern.</p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Timer size={18} />
            <h4>Timing Logic</h4>
          </div>
          <p>
            Current delay is <strong>{analysis.delayMs} ms</strong>. Smaller delay means faster blinking.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>Blink Sequence</h4>
          </div>
          <p>
            HIGH → wait → LOW → wait → repeat. This cycle creates the blink effect.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Practical Insight</h4>
          </div>
          <p>
            Blinking patterns are used for device status indicators, alarms, debugging, and simple output signaling.
          </p>
        </section>
      </div>

      <section className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Workflow size={18} />
          <h4>Procedure</h4>
        </div>

        <ul className="overview-steps-list">
          <li><span className="overview-step-index">1</span><span>Select blink speed.</span></li>
          <li><span className="overview-step-index">2</span><span>Start the blink simulation.</span></li>
          <li><span className="overview-step-index">3</span><span>Observe LED ON/OFF phases.</span></li>
          <li><span className="overview-step-index">4</span><span>Compare the timing with the state table.</span></li>
        </ul>
      </section>
    </div>
  );
}