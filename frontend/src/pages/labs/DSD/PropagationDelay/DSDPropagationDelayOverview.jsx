import React from "react";
import {
  BookOpen,
  TimerReset,
  Cpu,
  Lightbulb,
  CheckCircle2,
  Layers3
} from "lucide-react";

export default function DSDPropagationDelayOverview({ selectedGate }) {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Learn why digital circuits do not respond instantly in real hardware.
          </p>
        </div>
      </div>

      <div className="er-overview-hero">
        <div className="er-overview-hero-top">
          <div>
            <h3>Signal Travel Is Not Instantaneous</h3>
            <p>
              In real digital systems, a logic gate needs a small but measurable amount of time
              to respond after its input changes. This interval is called <strong>propagation delay</strong>.
              It comes from the physical charging and discharging of internal transistor capacitances,
              not from ideal Boolean logic itself.
            </p>
          </div>

          <span className="overview-badge">Timing Behavior</span>
        </div>

        <div className="er-overview-metrics">
          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <TimerReset size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">Measured In</div>
              <div className="er-mini-metric-value">Nanoseconds</div>
            </div>
          </div>

          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <Cpu size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">Current Gate</div>
              <div className="er-mini-metric-value">{selectedGate}</div>
            </div>
          </div>

          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">Focus</div>
              <div className="er-mini-metric-value">Delayed Output Response</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand propagation delay in digital circuits and observe how output changes only after a finite time interval when the input changes.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <TimerReset size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            Propagation delay is the time difference between an input transition and the corresponding output transition of a gate.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Why It Matters</h4>
          </div>
          <p>
            If delays are ignored, digital systems may experience incorrect outputs, race conditions, or timing failures in high-speed operation.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Practical Importance</h4>
          </div>
          <p>
            Propagation delay affects timing analysis, maximum clock frequency, critical path design, and reliable combinational and sequential systems.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Layers3 size={18} />
          <h4>Procedure</h4>
        </div>

        <ol className="overview-steps-list">
          <li>
            <span className="overview-step-index">1</span>
            <span>Select a gate such as NOT or BUFFER.</span>
          </li>
          <li>
            <span className="overview-step-index">2</span>
            <span>Set the propagation delay value.</span>
          </li>
          <li>
            <span className="overview-step-index">3</span>
            <span>Toggle the input transition.</span>
          </li>
          <li>
            <span className="overview-step-index">4</span>
            <span>Advance time step by step and observe when the output finally changes.</span>
          </li>
        </ol>
      </div>
    </section>
  );
}