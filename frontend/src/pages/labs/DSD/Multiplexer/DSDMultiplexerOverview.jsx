import React from "react";
import { Binary, GitBranch, Workflow, Lightbulb } from "lucide-react";

export default function DSDMultiplexerOverview({ analysis }) {
  return (
    <div className="overview-shell">
      <section className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Data Selection in Digital Systems</h3>
          <div className="overview-badge">4-to-1 MUX</div>
        </div>
        <p className="overview-hero-text">
          A multiplexer is a combinational circuit that chooses one input from many available data lines
          and forwards it to a single output. In a 4-to-1 multiplexer, the select lines S1 and S0 decide
          whether I0, I1, I2, or I3 reaches the output Y.
        </p>
      </section>

      <div className="overview-grid">
        <section className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            Study how a 4-to-1 multiplexer routes one selected input to the output using binary select lines.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <GitBranch size={18} />
            <h4>Selection Logic</h4>
          </div>
          <p>
            The select combination decides the active path:
            <br />00 → I0
            <br />01 → I1
            <br />10 → I2
            <br />11 → I3
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>Boolean Expression</h4>
          </div>
          <p>{analysis.expression}</p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Practical Insight</h4>
          </div>
          <p>
            Multiplexers are used in processors, communication systems, ALUs, and digital switching networks.
          </p>
        </section>
      </div>

      <section className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Workflow size={18} />
          <h4>Procedure</h4>
        </div>

        <ul className="overview-steps-list">
          <li>
            <span className="overview-step-index">1</span>
            <span>Toggle the data inputs I0, I1, I2, and I3.</span>
          </li>
          <li>
            <span className="overview-step-index">2</span>
            <span>Set the select lines S1 and S0.</span>
          </li>
          <li>
            <span className="overview-step-index">3</span>
            <span>Observe which input gets connected to output Y.</span>
          </li>
          <li>
            <span className="overview-step-index">4</span>
            <span>Verify the result with the truth table and circuit view.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}