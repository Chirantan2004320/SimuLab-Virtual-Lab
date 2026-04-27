import React from "react";
import { ListChecks, Cpu, Binary, Lightbulb } from "lucide-react";

export default function SevenSegmentWorking({ analysis }) {
  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <ListChecks size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Working</h2>
          <p className="sorting-sim-subtitle">
            Step-by-step working of a 7-segment display.
          </p>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>1. Configure GPIO</h4>
          </div>
          <p>The microcontroller configures segment pins A to G as output pins.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>2. Load Pattern</h4>
          </div>
          <p>
            Digit <strong>{analysis.digit}</strong> uses pattern{" "}
            <strong>{analysis.binaryPattern}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>3. Turn ON Segments</h4>
          </div>
          <p>
            Active segments are <strong>{analysis.activeSegments.join(", ")}</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ListChecks size={18} />
            <h4>4. Display Digit</h4>
          </div>
          <p>The glowing segments combine visually to form the selected digit.</p>
        </div>
      </div>

      <div className="sorting-info-box" style={{ marginTop: 18 }}>
        {analysis.note}
      </div>
    </section>
  );
}