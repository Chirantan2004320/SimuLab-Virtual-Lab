import React from "react";
import { Target, BookOpen, CircleDot, X, CheckCircle2 } from "lucide-react";

export default function DTSPPoleZeroAnalysisOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand zeros, poles, z-plane behavior, and stability using the unit circle.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Pole-Zero Analysis</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          A discrete-time LTI system can be represented by a transfer function H(z) = N(z) / D(z).
          The roots of the numerator are zeros and the roots of the denominator are poles.
          Their locations in the z-plane describe system behavior, frequency selectivity, and stability.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To determine zeros and poles of discrete-time transfer functions and interpret stability
            using their locations in the z-plane.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CircleDot size={18} />
            <h4>Zeros</h4>
          </div>
          <p>
            Zeros are roots of the numerator polynomial and indicate frequencies that may be attenuated.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <X size={18} />
            <h4>Poles</h4>
          </div>
          <p>
            Poles are roots of the denominator polynomial and strongly influence system response.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Stability</h4>
          </div>
          <p>
            For a causal discrete-time system, all poles must lie strictly inside the unit circle
            for stability.
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
            "Enter numerator coefficients in descending powers of z.",
            "Enter denominator coefficients in descending powers of z.",
            "Click Analyze.",
            "Observe computed zeros and poles.",
            "Open the z-plane graph.",
            "Check the stability interpretation using the unit circle."
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
          The unit circle is the main reference for discrete-time stability. Poles inside the
          unit circle indicate stable behavior, while poles outside it indicate instability.
        </p>
      </div>
    </section>
  );
}