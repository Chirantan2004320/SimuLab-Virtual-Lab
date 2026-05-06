import React from "react";
import { Target, BookOpen, Zap, Gauge, CheckCircle2 } from "lucide-react";

export default function DTSPFFTvsDFTOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Compare DFT and FFT output accuracy, speed, and operation count.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>FFT vs DFT</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          The Discrete Fourier Transform converts a sequence from time domain to frequency domain.
          Direct DFT is simple but computationally expensive. FFT is an optimized algorithm that
          computes the same frequency spectrum much faster by breaking the sequence into smaller
          parts recursively.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To compare DFT and FFT in terms of output spectrum and computational efficiency.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>DFT Complexity</h4>
          </div>
          <p>
            Direct DFT requires approximately O(N²) operations because every output bin uses
            all input samples.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>FFT Complexity</h4>
          </div>
          <p>
            FFT computes the same result in approximately O(N log N), making it much faster for
            large sequences.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Key Point</h4>
          </div>
          <p>
            FFT does not produce a different transform. It produces the same spectrum as DFT,
            but more efficiently.
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
            "Enter a numeric sequence.",
            "Click Analyze FFT vs DFT.",
            "Observe whether zero padding is added to reach a power-of-two length.",
            "Compare DFT and FFT magnitude values.",
            "Study DFT and FFT operation counts.",
            "Analyze the FFT stage breakdown."
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