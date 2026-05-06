import React from "react";
import { Target, BookOpen, GitBranch, Clock3, Radio } from "lucide-react";

export default function DTSPDFTPropertiesOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Study how common time-domain operations affect the DFT spectrum.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>DFT Properties</h3>
          <span className="overview-badge">DTSP Experiment</span>
        </div>

        <p className="overview-hero-text">
          DFT properties help us predict how operations on a discrete-time sequence affect
          its frequency-domain representation. Instead of recomputing everything blindly,
          properties like linearity, time shift, and frequency shift explain how the spectrum
          changes in a structured way.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To study and verify important properties of the Discrete Fourier Transform using
            numerical examples.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <GitBranch size={18} />
            <h4>Linearity</h4>
          </div>
          <p>
            The DFT of a sum of signals equals the sum of their individual DFTs.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Time Shift</h4>
          </div>
          <p>
            Circularly shifting a sequence mainly changes phase while preserving magnitude
            characteristics.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Radio size={18} />
            <h4>Frequency Shift</h4>
          </div>
          <p>
            Multiplying a sequence by a sinusoidal signal shifts or redistributes spectral
            energy across frequency bins.
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
            "Select a DFT property from the dropdown.",
            "Click Run Property Demo.",
            "Observe the original and transformed sequence.",
            "Compare DFT magnitude and phase values.",
            "Use graphs to understand time-domain and frequency-domain changes."
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
          Different operations in time domain produce predictable changes in the spectrum,
          making DFT properties useful in communication, modulation, filtering, and signal
          analysis.
        </p>
      </div>
    </section>
  );
}