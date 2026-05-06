import React from "react";
import { Target, BookOpen, Activity, Waves, CheckCircle2 } from "lucide-react";

export default function DTSPDFTIDFTOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Learn how DFT and IDFT connect time-domain and frequency-domain representations.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>DFT and IDFT</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          The Discrete Fourier Transform converts a finite discrete-time sequence into
          complex frequency-domain coefficients. Each coefficient shows how much of a
          particular frequency component is present in the original signal. The IDFT performs
          the reverse operation and reconstructs the original sequence from those coefficients.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To compute the DFT and IDFT of a finite-length sequence and study the relation
            between time-domain and frequency-domain representations.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>DFT</h4>
          </div>
          <p>
            DFT converts a discrete-time signal x[n] into complex-valued frequency-domain
            coefficients X[k].
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />
            <h4>Magnitude and Phase</h4>
          </div>
          <p>
            Magnitude shows the strength of each frequency component, while phase shows its
            angular shift.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>IDFT</h4>
          </div>
          <p>
            IDFT reconstructs the time-domain sequence from all DFT coefficients, proving that
            no information is lost when all coefficients are preserved.
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
            "Enter a discrete-time sequence as comma-separated values.",
            "Click Compute DFT to generate frequency-domain coefficients.",
            "Observe real part, imaginary part, magnitude, and phase.",
            "Select a frequency bin k to inspect step-by-step contribution.",
            "Click Compute IDFT to reconstruct the original sequence.",
            "Compare the reconstructed output with the original input."
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
          <h4>Applications</h4>
        </div>
        <p>
          DFT and IDFT are used in signal spectrum analysis, digital communication, audio
          processing, image processing, filtering, compression, and frequency-domain system design.
        </p>
      </div>
    </section>
  );
}