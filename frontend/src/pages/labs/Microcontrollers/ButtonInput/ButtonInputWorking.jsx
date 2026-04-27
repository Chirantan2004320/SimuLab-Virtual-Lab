import React from "react";
import { ListChecks, MousePointerClick, Cpu, Zap } from "lucide-react";

export default function ButtonInputWorking({ analysis }) {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <ListChecks size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Working</h2>
          <p className="sorting-sim-subtitle">
            Step-by-step explanation of how the microcontroller reads a button.
          </p>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <MousePointerClick size={18} />
            <h4>1. Button creates a connection</h4>
          </div>
          <p>
            A push button acts like a switch. When pressed, it connects two
            nodes in the circuit.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>2. Resistor gives default state</h4>
          </div>
          <p>
            Pull-up or pull-down resistor prevents the GPIO pin from floating
            when the button is not pressed.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>3. MCU reads GPIO voltage</h4>
          </div>
          <p>
            The microcontroller converts the pin voltage into a digital reading:
            HIGH or LOW.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ListChecks size={18} />
            <h4>Current Reading</h4>
          </div>
          <p>
            Button is <strong>{analysis.buttonLabel}</strong>, so GPIO reads{" "}
            <strong>{analysis.readLabel}</strong>.
          </p>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        {analysis.note}
      </div>
    </section>
  );
}