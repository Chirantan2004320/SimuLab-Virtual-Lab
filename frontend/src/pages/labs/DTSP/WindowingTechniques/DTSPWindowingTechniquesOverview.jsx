import React from "react";
import { Target, BookOpen, Activity, Waves, CheckCircle2 } from "lucide-react";

export default function DTSPWindowingTechniquesOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand how different window functions reduce spectral leakage.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Windowing Techniques</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          Windowing is used to reduce discontinuities caused by truncating a
          signal or ideal filter response. Different windows create different
          trade-offs between <strong>main-lobe width</strong> and{" "}
          <strong>side-lobe suppression</strong>.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To compare Rectangular, Hanning, Hamming, Blackman, and Bartlett
            windows in time domain and frequency domain.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Why Windows Are Used</h4>
          </div>
          <p>
            Windows reduce spectral leakage by smoothly tapering a finite signal
            at its boundaries.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />
            <h4>Window Trade-off</h4>
          </div>
          <p>
            Narrow main lobes give better frequency resolution, while lower side
            lobes reduce leakage.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Practical Use</h4>
          </div>
          <p>
            Hamming and Blackman windows are commonly used in FIR filter design
            because they reduce unwanted ripples.
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
            "Select a window type.",
            "Choose the window length.",
            "Generate the time-domain window samples.",
            "Observe the frequency-domain magnitude response.",
            "Compare energy and peak values across different windows.",
            "Understand the main-lobe and side-lobe trade-off."
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