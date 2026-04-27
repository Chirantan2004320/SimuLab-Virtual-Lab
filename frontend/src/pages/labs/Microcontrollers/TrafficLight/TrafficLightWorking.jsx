import React from "react";
import { ListChecks, Cpu, Timer, Workflow } from "lucide-react";

export default function TrafficLightWorking({ analysis }) {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <ListChecks size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Working</h2>
          <p className="sorting-sim-subtitle">
            Step-by-step working of a traffic light controller.
          </p>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>1. GPIO Setup</h4>
          </div>
          <p>
            The microcontroller configures three GPIO pins as output pins:
            red, yellow, and green.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>2. State Machine</h4>
          </div>
          <p>
            Only one state is active at a time. The sequence is RED, then GREEN,
            then YELLOW.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Timer size={18} />
            <h4>3. Delay Control</h4>
          </div>
          <p>
            Each light remains ON for a fixed time before moving to the next
            state.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ListChecks size={18} />
            <h4>4. Repeat</h4>
          </div>
          <p>
            After YELLOW, the controller returns to RED and repeats the cycle.
          </p>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        Current state: <strong>{analysis.state}</strong>. {analysis.note}
      </div>
    </section>
  );
}