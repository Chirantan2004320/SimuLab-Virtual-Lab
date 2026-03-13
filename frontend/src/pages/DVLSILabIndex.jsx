import React from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

export default function DVLSILabIndex() {
  const experiments = [
    {
      name: "MOSFET Characteristics",
      path: "/labs/dvlsi/mosfet-characteristics",
      desc: "Study output and transfer characteristics of nMOS and pMOS devices and understand key MOSFET parameters.",
      icon: "⚡",
      color: "#22c55e",
    },
    {
      name: "Lambda Rules and Microwind",
      path: "/labs/dvlsi/lambda-rules-microwind",
      desc: "Explore lambda-based layout rules, spacing concepts, and introductory Microwind layout ideas.",
      icon: "📐",
      color: "#3b82f6",
    },
    {
      name: "CMOS Inverter Simulation",
      path: "/labs/dvlsi/cmos-inverter-simulation",
      desc: "Analyze CMOS inverter behavior including transfer characteristics, transient response, and delay concepts.",
      icon: "🔁",
      color: "#a855f7",
    },
    {
      name: "CMOS Inverter Layout",
      path: "/labs/dvlsi/cmos-inverter-layout",
      desc: "Understand stick diagrams, layout structure, and layout-level representation of a CMOS inverter.",
      icon: "🧩",
      color: "#f97316",
    },
    {
      name: "CMOS NOR Gate",
      path: "/labs/dvlsi/cmos-nor-gate",
      desc: "Study a 2-input CMOS NOR gate and observe its behavior for different input combinations.",
      icon: "🔲",
      color: "#ec4899",
    },
  ];

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">🧪 DVLSI Lab</h1>
        <p className="lab-desc">
          Virtual experiments for Digital VLSI, covering MOSFET behavior,
          layout concepts, CMOS inverter analysis, and basic CMOS gate design.
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