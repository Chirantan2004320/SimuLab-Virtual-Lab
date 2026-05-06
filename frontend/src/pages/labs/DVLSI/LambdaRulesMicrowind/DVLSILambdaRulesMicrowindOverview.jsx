import React from "react";
import { Target, BookOpen, Ruler, LayoutGrid, ShieldCheck } from "lucide-react";

export default function DVLSILambdaRulesMicrowindOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand scalable lambda rules, Microwind-style layers, and DRC validation.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Lambda Design Rules</h3>
          <span className="overview-badge">DVLSI Experiment</span>
        </div>

        <p className="overview-hero-text">
          Lambda rules are scalable layout rules used in VLSI physical design. Instead of directly
          writing every width and spacing in micrometers, dimensions are expressed as multiples of
          lambda. This makes layouts process-scalable, easier to teach, and easier to validate using
          design-rule checks.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand lambda-based layout design rules and validate simple layout dimensions
            using Microwind-style DRC checks.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Ruler size={18} />
            <h4>Lambda Unit</h4>
          </div>
          <p>
            Lambda is a scalable unit used to express widths, spacings, and contact sizes.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <LayoutGrid size={18} />
            <h4>Layout Layers</h4>
          </div>
          <p>
            Metal, polysilicon, diffusion, and contacts are represented as colored physical layers.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ShieldCheck size={18} />
            <h4>DRC</h4>
          </div>
          <p>
            Design-rule checking ensures that the layout can be fabricated reliably.
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
            "Choose a lambda value.",
            "Set poly width, metal width, contact size, and spacing values.",
            "Observe the generated Microwind-style layout.",
            "Open the rules check section.",
            "Identify any DRC-style violations.",
            "Adjust dimensions until the layout becomes rule-compliant."
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
          In real VLSI design, design-rule violations can cause shorts, opens, weak connectivity,
          or fabrication yield issues. DRC is therefore a critical step before fabrication.
        </p>
      </div>
    </section>
  );
}