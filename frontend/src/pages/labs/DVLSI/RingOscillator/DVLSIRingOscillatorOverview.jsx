import React from "react";

import {
  Target,
  BookOpen,
  Waves,
  Activity,
  Cpu,
  TimerReset
} from "lucide-react";

export default function DVLSIRingOscillatorOverview() {
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
            Learn how inverter
            feedback and propagation
            delay generate continuous
            oscillation in CMOS ring
            oscillator circuits.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>
            Ring Oscillator
          </h3>

          <span className="overview-badge">
            DVLSI Timing Circuit
          </span>
        </div>

        <p className="overview-hero-text">
          A ring oscillator is
          formed by connecting an
          odd number of CMOS
          inverters in a feedback
          loop. Propagation delay
          causes the logic state to
          continuously toggle around
          the loop, generating a
          periodic oscillating
          signal.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>

          <p>
            Study the oscillation
            condition and timing
            behavior of CMOS ring
            oscillators.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />
            <h4>Oscillation</h4>
          </div>

          <p>
            Oscillation occurs
            because an odd number of
            inversions combined with
            propagation delay
            prevents the loop from
            settling.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <TimerReset size={18} />
            <h4>Period Formula</h4>
          </div>

          <p>
            Oscillation period is
            approximately:
          </p>

          <div
            style={{
              marginTop: 10,
              fontWeight: 800,
              fontSize: 18,
              color: "#38bdf8"
            }}
          >
            T ≈ 2 × N × tp
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Frequency</h4>
          </div>

          <p>
            Oscillation frequency is
            approximately inversely
            proportional to the loop
            delay.
          </p>

          <div
            style={{
              marginTop: 10,
              fontWeight: 800,
              fontSize: 18,
              color: "#f59e0b"
            }}
          >
            f ≈ 1 / (2 × N × tp)
          </div>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Cpu size={18} />
          <h4>Procedure</h4>
        </div>

        <ol className="overview-steps-list">
          {[
            "Choose the number of inverter stages.",
            "Adjust the propagation delay value.",
            "Enable or disable the oscillator loop.",
            "Observe whether oscillation occurs.",
            "Analyze waveform behavior and timing graphs.",
            "Study how stage count affects frequency."
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
          <BookOpen size={18} />
          <h4>Applications</h4>
        </div>

        <p>
          Ring oscillators are used
          in clock generation,
          random number generators,
          process monitoring,
          frequency characterization,
          and on-chip timing
          analysis.
        </p>
      </div>
    </section>
  );
}