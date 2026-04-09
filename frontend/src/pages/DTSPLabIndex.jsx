import React from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

export default function DTSPLabIndex() {
  const experiments = [
    {
      name: "Sampling & Aliasing",
      path: "/labs/dtsp/sampling-aliasing",
      desc: "Visualize how continuous-time signals are sampled and observe aliasing when the sampling frequency violates the Nyquist criterion.",
      icon: "🎧",
      color: "#06b6d4"
    },
    {
      name: "DFT and IDFT",
      path: "/labs/dtsp/dft-idft",
      desc: "Compute the Discrete Fourier Transform and its inverse to understand time-domain and frequency-domain representations of signals.",
      icon: "📊",
      color: "#22c55e"
    },
    {
      name: "DFT Properties",
      path: "/labs/dtsp/dft-properties",
      desc: "Explore important DFT properties such as linearity, time shift, and frequency shift through interactive examples.",
      icon: "📈",
      color: "#3b82f6"
    },
    {
      name: "FFT vs DFT",
      path: "/labs/dtsp/fft-vs-dft",
      desc: "Compare direct DFT and Fast Fourier Transform in terms of spectral output and computational efficiency.",
      icon: "⚡",
      color: "#14b8a6"
    },
    {
      name: "Linear Convolution via Circular Convolution",
      path: "/labs/dtsp/linear-convolution-using-circular-convolution",
      desc: "Use circular convolution and zero-padding to implement and compare it with standard linear convolution.",
      icon: "🔁",
      color: "#a855f7"
    },
    {
      name: "Pole–Zero Analysis",
      path: "/labs/dtsp/pole-zero-analysis",
      desc: "Visualize pole-zero locations of discrete-time systems and relate them to system stability and frequency response.",
      icon: "📍",
      color: "#f97316"
    },
    {
      name: "Linear Phase FIR Analysis",
      path: "/labs/dtsp/linear-phase-fir-analysis",
      desc: "Analyze linear phase FIR filters through their impulse responses, symmetry conditions, and magnitude-phase characteristics.",
      icon: "🎚️",
      color: "#ec4899"
    },
    {
      name: "FIR Filter Design",
      path: "/labs/dtsp/filter-design",
      desc: "Design FIR filters using window methods and study how filter type, cutoff frequency, and window choice affect performance.",
      icon: "🎛️",
      color: "#8b5cf6"
    }
  ];

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">📡 DTSP Lab</h1>
        <p className="lab-desc">
          Choose a Digital Time Signal Processing experiment to begin. Each experiment includes
          interactive simulation, conceptual learning, visualization, and practice.
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