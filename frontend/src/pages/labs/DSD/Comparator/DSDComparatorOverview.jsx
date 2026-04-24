import React from "react";
import {
  BookOpen,
  Target,
  Scale,
  Cpu,
  CheckCircle2,
  Workflow,
  Lightbulb
} from "lucide-react";

export default function DSDComparatorOverview({ analysis }) {
  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Learn how a 1-bit comparator decides whether A is greater than, equal to, or less than B.
          </p>
        </div>
      </div>

      <div className="er-overview-hero">
        <div className="er-overview-hero-top">
          <div>
            <h3>Binary Comparison Logic</h3>
            <p>
              A comparator is a combinational circuit that compares two binary inputs.
              For 1-bit inputs A and B, it produces three separate outputs:
              <strong> A &gt; B</strong>, <strong>A = B</strong>, and <strong>A &lt; B</strong>.
            </p>
          </div>

          <span className="overview-badge">1-bit Comparator</span>
        </div>

        <div className="er-overview-metrics">
          <div className="er-mini-metric">
            <div className="er-mini-metric-icon"><Scale size={16} /></div>
            <div>
              <div className="er-mini-metric-label">Core Focus</div>
              <div className="er-mini-metric-value">Binary Relation</div>
            </div>
          </div>

          <div className="er-mini-metric">
            <div className="er-mini-metric-icon"><CheckCircle2 size={16} /></div>
            <div>
              <div className="er-mini-metric-label">Outputs</div>
              <div className="er-mini-metric-value">GT / EQ / LT</div>
            </div>
          </div>

          <div className="er-mini-metric">
            <div className="er-mini-metric-icon"><Cpu size={16} /></div>
            <div>
              <div className="er-mini-metric-label">Used In</div>
              <div className="er-mini-metric-value">ALU & Control</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To study the working of a 1-bit comparator and observe how two binary inputs are compared.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            A comparator checks the relationship between two binary inputs and activates exactly one
            comparison output depending on the input values.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>Logic Expressions</h4>
          </div>
          <p>
            A &gt; B = {analysis?.expressions?.greater || "A · B̅"}<br />
            A = B = {analysis?.expressions?.equal || "A̅B̅ + AB"}<br />
            A &lt; B = {analysis?.expressions?.less || "A̅ · B"}
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Applications</h4>
          </div>
          <p>
            Comparators are used in processors, ALUs, digital control systems, sorting logic,
            magnitude comparison, and decision-making circuits.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Workflow size={18} />
          <h4>Procedure</h4>
        </div>

        <ol className="overview-steps-list">
          <li><span className="overview-step-index">1</span><span>Toggle input A and input B.</span></li>
          <li><span className="overview-step-index">2</span><span>Observe which comparator output becomes active.</span></li>
          <li><span className="overview-step-index">3</span><span>Verify the active output using the truth table.</span></li>
          <li><span className="overview-step-index">4</span><span>Study the symbolic circuit to understand the signal path.</span></li>
        </ol>
      </div>
    </section>
  );
}