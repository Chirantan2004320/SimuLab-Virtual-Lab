import React from "react";
import { ListChecks, Cpu, Activity, Lightbulb } from "lucide-react";

export default function PWMLedWorking({ analysis }) {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <ListChecks size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Working</h2>
          <p className="sorting-sim-subtitle">
            Step-by-step working of PWM LED brightness control.
          </p>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>1. Configure PWM Pin</h4>
          </div>
          <p>Pin D9 is configured as a PWM-capable output pin.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>2. Generate Pulses</h4>
          </div>
          <p>The pin switches HIGH and LOW very quickly to create a pulse waveform.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>3. Control Brightness</h4>
          </div>
          <p>
            Current duty cycle is <strong>{analysis.dutyCycle}%</strong>, so the LED appears{" "}
            <strong>{analysis.brightnessLabel}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ListChecks size={18} />
            <h4>4. Average Voltage</h4>
          </div>
          <p>
            The LED responds to average power, which is currently <strong>{analysis.voltageText}</strong>.
          </p>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        {analysis.note}
      </div>
    </section>
  );
}