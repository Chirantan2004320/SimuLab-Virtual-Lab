import React from "react";
import { Target, BookOpen, Power, SlidersHorizontal, Cpu } from "lucide-react";

export default function DVLSIMOSFETOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Study MOSFET operating regions, drain current, channel behavior, and VLSI relevance.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>MOSFET Characteristics</h3>
          <span className="overview-badge">DVLSI Experiment</span>
        </div>

        <p className="overview-hero-text">
          A MOSFET is a voltage-controlled semiconductor device where drain current is controlled
          mainly by gate-to-source voltage. Depending on VGS, VDS, and threshold voltage, the MOSFET
          operates in cutoff, triode, or saturation region. These regions are fundamental in CMOS
          logic, switching circuits, analog amplifiers, current mirrors, and memory circuits.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To study MOSFET current-voltage characteristics and understand cutoff, triode,
            and saturation behavior through interactive analysis.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Power size={18} />
            <h4>Cutoff Region</h4>
          </div>
          <p>
            When VGS &lt; VT, no strong inversion channel forms and the MOSFET remains OFF.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <SlidersHorizontal size={18} />
            <h4>Triode Region</h4>
          </div>
          <p>
            When VGS &gt; VT and VDS &lt; VGS − VT, the MOSFET acts like a controlled resistor.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Saturation Region</h4>
          </div>
          <p>
            When VDS ≥ VGS − VT, the channel pinches off near the drain and current saturates.
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
            "Select the MOSFET type and device parameters.",
            "Adjust VGS, VDS, threshold voltage, device constant, and lambda.",
            "Observe drain current and operating region.",
            "Study Id–Vds and Id–Vgs graphs.",
            "Use the circuit view to understand channel formation.",
            "Use physics view to understand cutoff, triode, and pinch-off behavior."
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
          <h4>Practical Insight</h4>
        </div>
        <p>
          MOSFETs are the basic active devices used in CMOS digital logic and analog circuits.
          Understanding their operating regions is essential for designing inverters, amplifiers,
          switches, current sources, and memory cells.
        </p>
      </div>
    </section>
  );
}