import React from "react";
import {
  BookOpen,
  Target,
  TimerReset,
  Cpu,
  Repeat,
  Zap,
  CheckCircle2,
  Binary
} from "lucide-react";

export default function DSDCounterOverview({ analysis }) {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand how a counter stores state and advances on each clock pulse.
          </p>
        </div>
      </div>

      <div className="er-overview-hero">
        <div className="er-overview-hero-top">
          <div>
            <h3>2-bit Binary Counter</h3>
            <p>
              A counter is a sequential circuit that moves through a fixed sequence of states.
              This lab shows a 2-bit counter that cycles through <strong>00</strong>,{" "}
              <strong>01</strong>, <strong>10</strong>, and <strong>11</strong>.
            </p>
          </div>

          <span className="overview-badge">Sequential Logic</span>
        </div>

        <div className="er-overview-metrics">
          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <Binary size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">States</div>
              <div className="er-mini-metric-value">4</div>
            </div>
          </div>

          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <TimerReset size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">Trigger</div>
              <div className="er-mini-metric-value">Clock Pulse</div>
            </div>
          </div>

          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <Repeat size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">Sequence</div>
              <div className="er-mini-metric-value">{analysis?.sequence || "00 → 01 → 10 → 11"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To study the working of a 2-bit binary counter and observe how its output changes
            with every clock pulse.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            A counter is built using flip-flops. Since flip-flops store previous state,
            a counter is a sequential circuit, not just a combinational circuit.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Repeat size={18} />
            <h4>Counting Sequence</h4>
          </div>
          <p>
            The 2-bit counter sequence is <strong>00 → 01 → 10 → 11 → 00</strong>.
            After reaching 11, it rolls over to 00.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Applications</h4>
          </div>
          <p>
            Counters are used in digital clocks, timers, frequency dividers, event counters,
            processors, and control circuits.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <CheckCircle2 size={18} />
          <h4>Procedure</h4>
        </div>

        <ol className="overview-steps-list">
          <li>
            <span className="overview-step-index">1</span>
            <span>Observe the current binary state Q1Q0.</span>
          </li>
          <li>
            <span className="overview-step-index">2</span>
            <span>Apply a clock pulse.</span>
          </li>
          <li>
            <span className="overview-step-index">3</span>
            <span>Watch the counter move to the next binary state.</span>
          </li>
          <li>
            <span className="overview-step-index">4</span>
            <span>Repeat the process to verify the full 4-state sequence.</span>
          </li>
          <li>
            <span className="overview-step-index">5</span>
            <span>Use reset to bring the counter back to 00.</span>
          </li>
        </ol>
      </div>
    </section>
  );
}