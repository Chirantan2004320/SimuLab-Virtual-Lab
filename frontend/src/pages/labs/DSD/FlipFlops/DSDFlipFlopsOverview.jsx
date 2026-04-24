import React from "react";
import {
  BookOpen,
  Cpu,
  Binary,
  Lightbulb,
  Layers3,
  CheckCircle2
} from "lucide-react";

export default function DSDFlipFlopsOverview({ selectedType }) {
  const typeNotes = {
    sr: {
      title: "SR Latch",
      description:
        "The SR latch is the most basic storage element. It uses Set and Reset inputs to control whether the output becomes 1, becomes 0, or holds its previous state."
    },
    d: {
      title: "D Flip-Flop",
      description:
        "The D Flip-Flop removes ambiguity by using a single data input. When the clock is active, the value at D is transferred to Q."
    },
    jk: {
      title: "JK Flip-Flop",
      description:
        "The JK Flip-Flop improves the SR design. It behaves like hold, set, reset, or toggle depending on J, K, and the clock."
    },
    t: {
      title: "T Flip-Flop",
      description:
        "The T Flip-Flop is designed for toggling. When T is 1 and the clock is active, the output changes to its opposite state."
    }
  };

  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand how sequential circuits store one bit and transition from present state to next state.
          </p>
        </div>
      </div>

      <div className="er-overview-hero">
        <div className="er-overview-hero-top">
          <div>
            <h3>Sequential Memory Elements</h3>
            <p>
              Flip-flops are fundamental <strong>sequential circuits</strong>. Unlike combinational logic,
              they do not depend only on present inputs. They also remember the previous output state,
              which makes them useful for storage, synchronization, counting, and state machines.
            </p>
          </div>

          <span className="overview-badge">State Storage Core</span>
        </div>

        <div className="er-overview-metrics">
          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <Binary size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">Stores</div>
              <div className="er-mini-metric-value">1 Bit</div>
            </div>
          </div>

          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <Cpu size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">Role</div>
              <div className="er-mini-metric-value">Sequential Logic</div>
            </div>
          </div>

          <div className="er-mini-metric">
            <div className="er-mini-metric-icon">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div className="er-mini-metric-label">Current Focus</div>
              <div className="er-mini-metric-value">{typeNotes[selectedType].title}</div>
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
            To study the working of SR, D, JK, and T flip-flops by changing inputs and observing the transition from present state to next state.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Current Type</h4>
          </div>
          <p>{typeNotes[selectedType].description}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Key Idea</h4>
          </div>
          <p>
            A flip-flop stores one binary value. Depending on its inputs and clock, it may hold, set, reset, load, or toggle its output.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Applications</h4>
          </div>
          <p>
            Flip-flops are used in registers, counters, memory cells, synchronization blocks, frequency division circuits, and processor control units.
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
            <span>Select the required flip-flop type.</span>
          </li>
          <li>
            <span className="overview-step-index">2</span>
            <span>Set the input values and clock where needed.</span>
          </li>
          <li>
            <span className="overview-step-index">3</span>
            <span>Observe the current output Q and the predicted next state.</span>
          </li>
          <li>
            <span className="overview-step-index">4</span>
            <span>Apply the next state and compare the outcome with the truth table and circuit view.</span>
          </li>
        </ol>
      </div>
    </section>
  );
}