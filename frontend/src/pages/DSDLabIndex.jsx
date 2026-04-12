import React from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

export default function DSDLabIndex() {
  const experiments = [
    {
      name: "Basic Logic Gates",
      path: "/labs/dsd/logic-gates",
      desc: "Toggle inputs and observe outputs for fundamental digital logic gates.",
      icon: "🟢",
      color: "#22c55e"
    },
    {
      name: "Half Adder and Full Adder",
      path: "/labs/dsd/adders",
      desc: "Simulate binary addition using half and full adder circuits.",
      icon: "➕",
      color: "#38bdf8"
    },
    {
      name: "Multiplexer",
      path: "/labs/dsd/multiplexer",
      desc: "Explore how multiplexers select one of several inputs based on select lines.",
      icon: "🔀",
      color: "#a855f7"
    },
    {
      name: "Flip-Flops",
      path: "/labs/dsd/flip-flops",
      desc: "Understand basic sequential circuits such as SR, D, and JK flip-flops.",
      icon: "⏱️",
      color: "#f97316"
    },
    {
      name: "Propagation Delay",
      path: "/labs/dsd/propagation-delay",
      desc: "Demonstrate the concept of signal delay through digital logic gates.",
      icon: "⏲️",
      color: "#ec4899"
    },
    {
  name: "Decoder and Encoder",
  path: "/labs/dsd/decoder-encoder",
  desc: "Study 2-to-4 decoder and 4-to-2 encoder circuits with interactive signal flow, truth tables, and circuit visualization.",
  icon: "🔠",
  color: "#06b6d4"
},
{
  name: "Comparator",
  path: "/labs/dsd/comparator",
  desc: "Compare two binary inputs and observe whether A is greater than, equal to, or less than B using interactive logic visualization.",
  icon: "⚖️",
  color: "#14b8a6"
},
{
  name: "Counter",
  path: "/labs/dsd/counter",
  desc: "Study a 2-bit binary counter and observe how its state changes with each clock pulse in a sequential counting sequence.",
  icon: "🔢",
  color: "#8b5cf6"
}
  ];

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">🔧 DSD Lab</h1>
        <p className="lab-desc">
          Interactive experiments for Digital System Design, focusing on digital logic, and
          combinational and sequential circuits.
        </p>
      </div>

      <section className="lab-list">
        {experiments.map((exp, i) => (
          <div
            key={i}
            className="card experiment-card"
            style={{ borderLeftColor: exp.color }}
          >
            <div className="experiment-header">
              <span className="experiment-icon">{exp.icon}</span>
              <h3 className="experiment-name">{exp.name}</h3>
            </div>
            <p className="experiment-info">{exp.desc}</p>
            <Link to={exp.path} className="experiment-btn">
              Start Experiment <span>→</span>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}

