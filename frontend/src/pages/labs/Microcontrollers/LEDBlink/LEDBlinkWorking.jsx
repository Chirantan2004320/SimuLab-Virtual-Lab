import React from "react";
import { ListChecks, Cpu, Timer, Lightbulb } from "lucide-react";

export default function LEDBlinkWorking({ analysis }) {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <ListChecks size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Working</h2>
          <p className="sorting-sim-subtitle">
            Step-by-step explanation of the blink loop.
          </p>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>1. Configure GPIO</h4>
          </div>
          <p>The microcontroller configures pin D13 as OUTPUT.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>2. Turn LED ON</h4>
          </div>
          <p>The program writes HIGH to D13, allowing current to flow through the LED.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Timer size={18} />
            <h4>3. Wait</h4>
          </div>
          <p>The program waits for <strong>{analysis.delayMs} ms</strong> before changing state.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ListChecks size={18} />
            <h4>4. Repeat Loop</h4>
          </div>
          <p>The LED turns OFF, waits again, then repeats the ON/OFF cycle.</p>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        Current state: <strong>{analysis.status}</strong>, phase: <strong>{analysis.phase}</strong>.
      </div>
    </section>
  );
}