import React from "react";
import { Target, BookOpen, Activity, Zap, Timer, ShieldCheck } from "lucide-react";

export default function DVLSICMOSInverterSimulationOverview() {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand CMOS inverter switching, logic inversion, delay, and power behavior.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>CMOS Inverter</h3>
          <span className="overview-badge">DVLSI Experiment</span>
        </div>

        <p className="overview-hero-text">
          A CMOS inverter is built using one pMOS transistor connected to VDD and one nMOS
          transistor connected to ground. Both gates share the same input, and the output is taken
          from the common drain node. It produces the logical complement of the input.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To study the transfer behavior of a CMOS inverter and understand switching action,
            noise margins, propagation delay, and dynamic power trend.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Logic Action</h4>
          </div>
          <p>
            LOW input turns pMOS ON and nMOS OFF, giving HIGH output. HIGH input turns nMOS ON and pMOS OFF, giving LOW output.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Timer size={18} />
            <h4>Propagation Delay</h4>
          </div>
          <p>
            Delay is the time taken by output to respond after an input transition.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Dynamic Power</h4>
          </div>
          <p>
            Switching power increases with load capacitance and approximately with VDD².
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
            "Set the supply voltage VDD.",
            "Adjust the inverter switching point VM.",
            "Change the input voltage Vin.",
            "Observe output voltage, transistor states, and operating region.",
            "Open the circuit view to understand pull-up and pull-down paths.",
            "Study VTC and transient response in the graph section."
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
          CMOS inverters are the basic building blocks of digital integrated circuits. Their delay,
          power, switching threshold, and noise immunity strongly affect larger logic systems.
        </p>
      </div>
    </section>
  );
}