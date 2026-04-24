import React from "react";
import { BookOpen, Target, Lightbulb, Workflow, Cpu, Binary } from "lucide-react";

const gateCards = [
  {
    title: "BUFFER & NOT",
    text: "BUFFER passes the input unchanged, while NOT inverts it. These are the simplest one-input logic operations.",
    icon: <Binary size={18} />,
  },
  {
    title: "AND / OR",
    text: "AND requires both inputs to be 1. OR gives 1 when at least one input is 1. These gates form the base of many combinational circuits.",
    icon: <Workflow size={18} />,
  },
  {
    title: "NAND / NOR",
    text: "NAND and NOR are inverted forms of AND and OR. They are called universal gates because entire circuits can be built using only one of them.",
    icon: <Cpu size={18} />,
  },
  {
    title: "XOR / XNOR",
    text: "XOR outputs 1 when inputs are different. XNOR outputs 1 when inputs are equal. These are widely used in adders, comparators, and parity logic.",
    icon: <Lightbulb size={18} />,
  },
];

export default function DSDLogicGatesOverview({ selectedGate, analysis }) {
  return (
    <div className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand the foundation of digital electronics before moving into simulation.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Basic Logic Gate Visualizer</h3>
          <span className="overview-badge">DSD Core Concept</span>
        </div>

        <p className="overview-hero-text">
          Logic gates are the foundation of digital electronics. They take binary
          inputs such as 0 and 1, perform Boolean operations, and generate a binary
          output. Every digital system, from arithmetic units to memory and control
          circuits, is built from combinations of these gates.
        </p>

        <div className="er-overview-mini-grid">
          <div className="er-overview-mini-card">
            <div className="er-overview-mini-label">Current Gate</div>
            <div className="er-overview-mini-value">{selectedGate}</div>
          </div>

          <div className="er-overview-mini-card">
            <div className="er-overview-mini-label">Expression</div>
            <div className="er-overview-mini-value">{analysis.selected.expression}</div>
          </div>

          <div className="er-overview-mini-card">
            <div className="er-overview-mini-label">Inputs Required</div>
            <div className="er-overview-mini-value">
              {analysis.isSingleInput ? "1 Input" : "2 Inputs"}
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
            To study the behavior of basic digital logic gates by changing binary
            inputs and observing the corresponding outputs.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <BookOpen size={18} />
            <h4>Theory</h4>
          </div>
          <p>
            Logic gates perform Boolean operations on binary inputs. Common gates
            include BUFFER, NOT, AND, OR, NAND, NOR, XOR, and XNOR. Each gate
            follows a truth table that defines its output for every possible input
            combination.
          </p>
        </div>

        <div className="overview-card overview-steps-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>Procedure</h4>
          </div>

          <ul className="overview-steps-list">
            <li>
              <span className="overview-step-index">1</span>
              <span>Select a logic gate from the experiment configuration or simulation section.</span>
            </li>
            <li>
              <span className="overview-step-index">2</span>
              <span>Toggle input A and input B where required.</span>
            </li>
            <li>
              <span className="overview-step-index">3</span>
              <span>Observe the resulting logic output and current expression.</span>
            </li>
            <li>
              <span className="overview-step-index">4</span>
              <span>Study the circuit symbol and truth table for the selected gate.</span>
            </li>
            <li>
              <span className="overview-step-index">5</span>
              <span>Validate your understanding with quiz and coding practice.</span>
            </li>
          </ul>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Practical Insight</h4>
          </div>
          <p>
            More complex digital circuits such as adders, multiplexers, decoders,
            latches, counters, and processors are built using combinations of these
            basic logic gates.
          </p>
        </div>
      </div>

      <div className="overview-grid">
        {gateCards.map((item) => (
          <div key={item.title} className="overview-card er-entity-overview-card">
            <div className="overview-card-head">
              {item.icon}
              <h4>{item.title}</h4>
            </div>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}