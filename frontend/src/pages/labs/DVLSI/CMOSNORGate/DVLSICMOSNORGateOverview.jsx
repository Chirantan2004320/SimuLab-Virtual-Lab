import React from "react";
import {
  Target,
  BookOpen,
  Activity,
  Zap,
  GitBranch,
  ShieldCheck
} from "lucide-react";

export default function DVLSICMOSNOROverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand transistor-level operation, pull-up and pull-down paths, and logic behavior
            of a CMOS NOR gate.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>CMOS NOR Gate</h3>
          <span className="overview-badge">DVLSI Experiment</span>
        </div>

        <p className="overview-hero-text">
          A 2-input CMOS NOR gate is implemented using two pMOS transistors in series in the
          pull-up network and two nMOS transistors in parallel in the pull-down network. The
          circuit produces HIGH output only when both inputs are LOW.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To study the transistor-level implementation and logic behavior of a 2-input CMOS NOR
            gate for different input combinations.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Logic Action</h4>
          </div>
          <p>
            The output remains HIGH only when both inputs are LOW. If either input becomes HIGH,
            the pull-down network conducts and forces the output LOW.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <GitBranch size={18} />
            <h4>Pull-Up Network</h4>
          </div>
          <p>
            The pMOS transistors are connected in series, so both must conduct together to create
            a valid path from VDD to the output.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Pull-Down Network</h4>
          </div>
          <p>
            The nMOS transistors are connected in parallel. If any one transistor turns ON, the
            output gets connected to ground.
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
            "Select input values A and B.",
            "Observe the resulting output logic level.",
            "Check which pMOS and nMOS transistors are ON or OFF.",
            "Study the current path in the circuit diagram.",
            "Compare the result with the NOR truth table.",
            "Understand why the pull-up or pull-down network dominates for each input combination."
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
          <ShieldCheck size={18} />
          <h4>Practical Insight</h4>
        </div>
        <p>
          CMOS NOR gates are fundamental building blocks in digital VLSI design. Their transistor
          arrangement clearly demonstrates how complementary pull-up and pull-down networks
          implement Boolean logic efficiently.
        </p>
      </div>
    </section>
  );
}