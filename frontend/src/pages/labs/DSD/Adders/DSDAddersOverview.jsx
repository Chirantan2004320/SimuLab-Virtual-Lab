import React from "react";
import { Binary, Cpu, GitBranchPlus, Lightbulb } from "lucide-react";

export default function DSDAddersOverview({ selectedAdder, analysis }) {
  return (
    <div className="overview-shell">
      <section className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Binary Addition Visualizer</h3>
          <span className="overview-badge">{analysis.selected.title}</span>
        </div>

        <p className="overview-hero-text">
          Adders are the foundation of digital arithmetic. They combine binary inputs and
          generate a <strong>Sum</strong> output and a <strong>Carry</strong> output.
          The Half Adder is the starting point, while the Full Adder extends the concept
          by accepting an additional carry input.
        </p>
      </section>

      <div className="overview-grid">
        <section className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To study the working of Half Adder and Full Adder circuits by changing binary
            inputs and observing the resulting Sum and Carry outputs.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Core Theory</h4>
          </div>
          <p>
            A <strong>Half Adder</strong> adds two bits A and B.
            A <strong>Full Adder</strong> adds A, B, and Carry-in (Cin), making it suitable
            for multi-bit binary addition.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <GitBranchPlus size={18} />
            <h4>Current Formulas</h4>
          </div>
          <p>
            <strong>Sum:</strong> {analysis.selected.expressionSum}
            <br />
            <strong>Carry:</strong> {analysis.selected.expressionCarry}
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Practical Use</h4>
          </div>
          <p>
            Full Adders are cascaded to form ripple-carry adders and larger arithmetic units
            used inside processors, ALUs, embedded systems, and digital controllers.
          </p>
        </section>
      </div>

      <section className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Binary size={18} />
          <h4>Procedure</h4>
        </div>

        <ol className="overview-steps-list" style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span className="overview-step-index">1</span>
            <span>Select either Half Adder or Full Adder.</span>
          </li>
          <li>
            <span className="overview-step-index">2</span>
            <span>Toggle the input bits A and B.</span>
          </li>
          <li>
            <span className="overview-step-index">3</span>
            <span>For Full Adder, also toggle the Carry-in (Cin).</span>
          </li>
          <li>
            <span className="overview-step-index">4</span>
            <span>Observe the Sum and Carry outputs in simulation and circuits view.</span>
          </li>
          <li>
            <span className="overview-step-index">5</span>
            <span>Compare the observed values with the truth table.</span>
          </li>
        </ol>
      </section>

      <section className="overview-card">
        <div className="overview-card-head">
          <Cpu size={18} />
          <h4>Half Adder vs Full Adder</h4>
        </div>
        <p>
          <strong>Half Adder:</strong> takes two inputs and does not have a carry-in input.
          <br />
          <strong>Full Adder:</strong> takes three inputs including carry-in, so it can be
          chained with other adders for larger binary operations.
        </p>
      </section>
    </div>
  );
}