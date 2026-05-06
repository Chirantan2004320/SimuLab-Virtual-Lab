import React from "react";
import { Target, BookOpen, Repeat, RotateCw, CheckCircle2 } from "lucide-react";

export default function DTSPLinearCircularConvolutionOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand linear convolution, circular convolution, wrap-around, and zero padding.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Linear Convolution via Circular Convolution</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          Linear convolution gives the output of an LTI system for an input sequence and impulse
          response. Circular convolution assumes periodic repetition, which can cause wrap-around.
          By zero-padding both sequences to length N + M - 1, circular convolution produces the
          same result as linear convolution.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To compute linear convolution and show how the same result can be obtained using
            circular convolution with proper zero padding.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Repeat size={18} />
            <h4>Linear Convolution</h4>
          </div>
          <p>
            If x[n] has length N and h[n] has length M, linear convolution has length N + M - 1.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <RotateCw size={18} />
            <h4>Circular Convolution</h4>
          </div>
          <p>
            Circular convolution uses modulo indexing and assumes sequences repeat periodically.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Zero Padding</h4>
          </div>
          <p>
            Padding to length N + M - 1 prevents unwanted wrap-around and matches linear convolution.
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
            "Enter x[n] and h[n] as comma-separated values.",
            "Click Compute Convolutions.",
            "Observe the linear convolution result.",
            "Compare with circular convolution without zero padding.",
            "Observe zero-padded circular convolution.",
            "Use contribution tables to locate wrap-around effects."
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
          Circular convolution without padding causes overlap because the tail wraps around.
          With length N + M - 1, this overlap is avoided and the output becomes identical to
          linear convolution.
        </p>
      </div>
    </section>
  );
}