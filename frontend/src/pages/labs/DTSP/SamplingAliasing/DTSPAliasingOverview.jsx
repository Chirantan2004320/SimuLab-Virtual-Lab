import React from "react";
import { Target, BookOpen, Activity, Waves, CheckCircle2 } from "lucide-react";

export default function DTSPAliasingOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Learn how sampling frequency controls signal reconstruction and aliasing.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Sampling & Aliasing</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          Sampling converts a continuous-time signal into a discrete-time signal by measuring
          its amplitude at fixed time intervals. If the sampling frequency is too low, the sampled
          points may represent a wrong lower-frequency signal. This false appearance is known as
          aliasing.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To study sampling and aliasing effects when a continuous signal is sampled at
            different rates.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Nyquist Theorem</h4>
          </div>
          <p>
            A signal must be sampled at least twice its highest frequency to avoid aliasing.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />
            <h4>Aliasing</h4>
          </div>
          <p>
            Aliasing occurs when a high-frequency signal appears as a lower-frequency signal
            because the sampling rate is insufficient.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Prevention</h4>
          </div>
          <p>
            Aliasing is avoided by using a sampling frequency greater than or equal to the
            Nyquist rate and by using anti-aliasing filters before sampling.
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
            "Set the signal frequency.",
            "Set the sampling frequency.",
            "Generate the continuous signal and sampled points.",
            "Compare the sampling frequency with the Nyquist rate.",
            "Observe whether aliasing occurs.",
            "Study the graphs to understand the apparent aliased signal."
          ].map((step, index) => (
            <li key={index}>
              <span className="overview-step-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}