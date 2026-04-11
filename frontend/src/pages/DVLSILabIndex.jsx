import React from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

export default function DVLSILabIndex() {
  const experiments = [
    {
      name: "MOSFET Characteristics",
      path: "/labs/dvlsi/mosfet-characteristics",
      desc: "Study the output and transfer characteristics of nMOS and pMOS devices and understand key MOSFET parameters.",
      icon: "⚡",
      color: "#22c55e"
    },
    {
      name: "Lambda Rules and Microwind",
      path: "/labs/dvlsi/lambda-rules-microwind",
      desc: "Explore lambda-based layout rules, spacing constraints, and introductory Microwind layout concepts.",
      icon: "📐",
      color: "#3b82f6"
    },
    {
      name: "CMOS Inverter Simulation",
      path: "/labs/dvlsi/cmos-inverter-simulation",
      desc: "Analyze CMOS inverter behavior through voltage transfer characteristics, transient response, and delay concepts.",
      icon: "🔁",
      color: "#a855f7"
    },
    {
      name: "CMOS Inverter Layout",
      path: "/labs/dvlsi/cmos-inverter-layout",
      desc: "Understand stick diagrams, transistor placement, and layout-level representation of a CMOS inverter.",
      icon: "🧩",
      color: "#f97316"
    },
    {
      name: "CMOS NOR Gate",
      path: "/labs/dvlsi/cmos-nor-gate",
      desc: "Study the circuit structure and logic behavior of a 2-input CMOS NOR gate for different input combinations.",
      icon: "🔲",
      color: "#ec4899"
    },
    {
  name: "CMOS NAND Gate",
  path: "/labs/dvlsi/cmos-nand-gate",
  desc: "Study a 2-input CMOS NAND gate and observe its behavior for different input combinations.",
  icon: "🟩",
  color: "#14b8a6",
},
{
  name: "Transmission Gate / Pass Transistor Logic",
  path: "/labs/dvlsi/transmission-gate",
  desc: "Study how transmission gates and pass transistors transmit signals and compare their switching behavior.",
  icon: "🔀",
  color: "#f59e0b",
},
{
  name: "Ring Oscillator",
  path: "/labs/dvlsi/ring-oscillator",
  desc: "Study how an odd-number inverter loop creates oscillation through propagation delay and feedback.",
  icon: "🔄",
  color: "#8b5cf6",
},
{
  name: "SRAM Cell Basics",
  path: "/labs/dvlsi/sram-cell",
  desc: "Study how a basic SRAM cell stores, holds, reads, and writes one bit using cross-coupled inverters.",
  icon: "🧠",
  color: "#06b6d4",
}
  ];

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">🧪 DVLSI Lab</h1>
        <p className="lab-desc">
          Explore Digital VLSI experiments covering MOSFET operation, layout rules,
          CMOS inverter analysis, layout design, and basic CMOS gate implementation.
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