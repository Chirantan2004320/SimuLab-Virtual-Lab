import React from "react";
import { Target, BookOpen, Activity, ShieldCheck, GitCompare } from "lucide-react";

export default function DTSPLinearPhaseFIROverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Study FIR symmetry, linear phase behavior, and filter type classification.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Linear Phase FIR Filter</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          FIR filters have finite impulse responses, making them inherently stable.
          A FIR filter shows linear phase when its impulse response is symmetric or
          antisymmetric about the center. Linear phase is important because it delays
          all frequency components equally and helps preserve waveform shape.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To analyze FIR impulse response and frequency response and determine whether
            the filter has linear phase characteristics.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Linear Phase</h4>
          </div>
          <p>
            Linear phase occurs when the phase response is approximately linear with frequency.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <GitCompare size={18} />
            <h4>Symmetry Rule</h4>
          </div>
          <p>
            FIR filters are linear phase when h[n] is symmetric or antisymmetric around its center.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ShieldCheck size={18} />
            <h4>Stability</h4>
          </div>
          <p>
            FIR filters are stable because their impulse response has finite duration.
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
            "Enter FIR impulse response coefficients as comma-separated values.",
            "Click Analyze FIR.",
            "Observe whether the sequence is symmetric or antisymmetric.",
            "Check the detected FIR type.",
            "Open the graph section.",
            "Study magnitude and phase response."
          ].map((step, index) => (
            <li key={index}>
              <span className="overview-step-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Target size={18} />
          <h4>Key Observation</h4>
        </div>
        <p>
          Symmetry in the impulse response is the main indicator of linear phase behavior
          in FIR filters. The length and symmetry type decide whether the filter is Type I,
          Type II, Type III, or Type IV.
        </p>
      </div>
    </section>
  );
}