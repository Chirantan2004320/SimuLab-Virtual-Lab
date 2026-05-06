import React from "react";
import { Target, BookOpen, Activity, Waves, CheckCircle2 } from "lucide-react";

export default function DTSPIIRFilterDesignOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Learn how Butterworth-style IIR filters are designed and analyzed.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>IIR Filter Design</h3>
          <span className="overview-badge">Butterworth Filter</span>
        </div>

        <p className="overview-hero-text">
          An <strong>IIR filter</strong> has recursive behavior, meaning its
          output depends on present input, past inputs, and past outputs.
          Butterworth filters are widely used because they provide a smooth,
          maximally flat response in the passband.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To design and analyze Butterworth-style low-pass and high-pass IIR
            filters using order, cutoff frequency, magnitude response, and pole
            locations.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Butterworth Response</h4>
          </div>
          <p>
            Butterworth filters are known for their flat passband. Increasing
            the filter order makes the transition from passband to stopband
            sharper.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />
            <h4>IIR vs FIR</h4>
          </div>
          <p>
            FIR filters have finite impulse response and are always stable. IIR
            filters can achieve sharp transitions with lower order but require
            stability checking because they contain poles.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Stability</h4>
          </div>
          <p>
            For a causal digital IIR filter, all poles must lie inside the unit
            circle for the system to be stable.
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
            "Select low-pass or high-pass filter type.",
            "Choose the Butterworth filter order.",
            "Adjust the normalized cutoff frequency.",
            "Generate the magnitude response.",
            "Observe pole locations and stability condition.",
            "Compare input and output signals after filtering."
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