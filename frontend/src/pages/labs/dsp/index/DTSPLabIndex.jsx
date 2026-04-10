import React from "react";
import { Link } from "react-router-dom";
import "../../../../styles/Lab.css";

export default function DTSPLabIndex() {
  const experiments = [
    {
      name: "Pole–Zero Analysis",
      path: "/labs/dtsp/pole-zero-analysis",
      desc: "Visualize pole–zero locations of discrete-time systems and relate them to system stability and frequency response.",
      icon: "📍",
      color: "#f97316"
    },
    {
      name: "DFT and IDFT",
      path: "/labs/dtsp/dft-idft",
      desc: "Perform Discrete Fourier Transform and its inverse to understand time–frequency representation of signals.",
      icon: "📊",
      color: "#22c55e"
    },
    {
      name: "DFT Properties",
      path: "/labs/dtsp/dft-properties",
      desc: "Explore key DFT properties such as linearity, circular shift, and convolution through interactive examples.",
      icon: "📈",
      color: "#3b82f6"
    },
    {
      name: "Linear Convolution via Circular Convolution",
      path: "/labs/dtsp/linear-convolution-using-circular-convolution",
      desc: "Use circular convolution and zero-padding to implement and compare with standard linear convolution.",
      icon: "🔁",
      color: "#a855f7"
    },
    {
      name: "Linear Phase FIR Analysis",
      path: "/labs/dtsp/linear-phase-fir-analysis",
      desc: "Analyze linear phase FIR filters, their impulse responses, and magnitude/phase characteristics.",
      icon: "🎚️",
      color: "#ec4899"
    }
  ];

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">📡 DTSP Lab</h1>
        <p className="lab-desc">
          Choose a Digital Time Signal Processing experiment to begin. Each experiment includes an
          interactive simulation and conceptual questions to strengthen your understanding.
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

