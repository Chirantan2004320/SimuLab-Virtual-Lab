import React from "react";
import { Target, BookOpen, SlidersHorizontal, Waves, ShieldCheck } from "lucide-react";

export default function DTSPFilterDesignOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Learn FIR filter design using cutoff frequency, windowing, and filter length.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>FIR Filter Design</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          FIR filters can be designed by starting from an ideal frequency response and
          converting it into an impulse response. Since the ideal response is usually infinite,
          it is truncated using a window function. Window choice affects ripple and smoothness,
          while filter length controls transition sharpness.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To design FIR filters using the window method and study how type, cutoff, length,
            and window affect the response.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />
            <h4>Filter Types</h4>
          </div>
          <p>
            Low-pass filters pass low frequencies. High-pass filters pass high frequencies.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <SlidersHorizontal size={18} />
            <h4>Window Method</h4>
          </div>
          <p>
            Rectangular, Hamming, and Hanning windows control ripple and smoothness.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ShieldCheck size={18} />
            <h4>FIR Benefit</h4>
          </div>
          <p>
            FIR filters are always stable and can be designed with linear phase.
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
            "Select Low-pass or High-pass filter.",
            "Choose the normalized cutoff frequency.",
            "Select an odd FIR filter length.",
            "Choose a window function.",
            "Click Generate Filter.",
            "Observe impulse response, frequency response, and filtered output."
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
          Window choice affects ripple and smoothness, while filter length affects transition
          sharpness. Longer filters usually provide better selectivity but require more computation.
        </p>
      </div>
    </section>
  );
}