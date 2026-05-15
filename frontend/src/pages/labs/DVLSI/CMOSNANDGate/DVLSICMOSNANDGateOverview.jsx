import React from "react";
import {
  Target,
  BookOpen,
  Activity,
  Zap,
  ShieldCheck,
  Cpu
} from "lucide-react";

export default function DVLSICMOSNANDGateOverview() {
  return (
    <section className="overview-shell">
      <div
        className="sorting-sim-title-wrap"
        style={{ marginBottom: 20 }}
      >
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Overview
          </h2>

          <p className="sorting-sim-subtitle">
            Understand CMOS NAND logic,
            transistor switching, pull-up and
            pull-down networks.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>CMOS NAND Gate</h3>

          <span className="overview-badge">
            DVLSI Experiment
          </span>
        </div>

        <p className="overview-hero-text">
          A CMOS NAND gate uses parallel pMOS
          transistors and series nMOS
          transistors to implement NAND logic.
          The output becomes LOW only when
          both inputs are HIGH.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>

          <p>
            To study CMOS NAND gate
            operation, transistor conduction,
            current paths, and logic
            realization.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Logic Action</h4>
          </div>

          <p>
            Output becomes LOW only when
            both nMOS transistors conduct
            together in series.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Pull-Up Network</h4>
          </div>

          <p>
            Parallel pMOS transistors ensure
            output remains HIGH if any input
            becomes LOW.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Universal Gate</h4>
          </div>

          <p>
            NAND gates can implement any
            Boolean function and are widely
            used in digital IC design.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <BookOpen size={18} />
          <h4>Procedure</h4>
        </div>

        <ol className="overview-steps-list">
          {[
            "Set input A and B values.",
            "Observe NAND output logic.",
            "Study pMOS and nMOS states.",
            "Analyze current conduction path.",
            "Visualize pull-up and pull-down networks.",
            "Verify operation using truth table."
          ].map((step, index) => (
            <li key={index}>
              <span className="overview-step-index">
                {index + 1}
              </span>

              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <ShieldCheck size={18} />
          <h4>Practical Insight</h4>
        </div>

        <p>
          CMOS NAND gates are among the most
          important digital building blocks
          because they provide low power
          operation and complete logic
          flexibility.
        </p>
      </div>
    </section>
  );
}