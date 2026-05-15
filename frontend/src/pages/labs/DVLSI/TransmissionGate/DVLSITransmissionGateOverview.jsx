import React from "react";

import {
  Target,
  BookOpen,
  Activity,
  Zap,
  Cpu,
  ShieldCheck
} from "lucide-react";

export default function DVLSITransmissionGateOverview() {
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
            Understand transmission
            gate switching,
            complementary control,
            and pass transistor
            behavior in CMOS VLSI
            circuits.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>
            Transmission Gate
          </h3>

          <span className="overview-badge">
            DVLSI Experiment
          </span>
        </div>

        <p className="overview-hero-text">
          A transmission gate is
          formed using one nMOS and
          one pMOS transistor in
          parallel with complementary
          control signals. It acts
          like a bidirectional CMOS
          switch and can pass both
          logic HIGH and logic LOW
          effectively.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>

          <p>
            To study transmission
            gate operation and
            compare it with single
            pass transistor logic
            behavior.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Switching Action</h4>
          </div>

          <p>
            When the control signal
            is active, both
            transistors conduct and
            the signal propagates to
            the output.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Complementary Control</h4>
          </div>

          <p>
            The nMOS gate receives
            the control signal while
            the pMOS gate receives
            the inverted control
            signal.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Pass Logic</h4>
          </div>

          <p>
            A transmission gate
            passes both logic levels
            more efficiently than a
            single nMOS pass
            transistor.
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
            "Select the operating mode.",
            "Choose the input signal value.",
            "Apply the control signal.",
            "Observe transistor conduction states.",
            "Study the current conduction path.",
            "Compare transmission gate and single pass nMOS behavior."
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
          Transmission gates are
          widely used in
          multiplexers, latches,
          flip-flops, clock gating,
          and switch-based CMOS logic
          circuits.
        </p>
      </div>
    </section>
  );
}