import React from "react";
import { Cpu, Activity, Lightbulb, Workflow } from "lucide-react";

export default function PWMLedOverview({ analysis }) {
  return (
    <div className="overview-shell">
      <section className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>PWM LED Brightness Control</h3>
          <div className="overview-badge">PWM Output</div>
        </div>
        <p className="overview-hero-text">
          Pulse Width Modulation controls brightness by switching a digital pin HIGH and LOW very quickly.
          The LED appears brighter when the HIGH time is longer.
        </p>
      </section>

      <div className="overview-grid">
        <section className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Aim</h4>
          </div>
          <p>Understand how PWM controls LED brightness using duty cycle.</p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Current Duty Cycle</h4>
          </div>
          <p>
            Duty cycle is <strong>{analysis.dutyCycle}%</strong>, producing PWM value{" "}
            <strong>{analysis.pwmValue}</strong>.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Brightness</h4>
          </div>
          <p>
            Current brightness level: <strong>{analysis.brightnessLabel}</strong>.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>Applications</h4>
          </div>
          <p>
            PWM is used in LED dimming, motor speed control, buzzers, servo control, and power regulation.
          </p>
        </section>
      </div>
    </div>
  );
}