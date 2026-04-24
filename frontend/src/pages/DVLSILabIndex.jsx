import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SimulabNavbar from "../components/SimulabNavbar";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.42 },
  }),
};

export default function DVLSILabIndex() {
  const experiments = [
    {
      name: "MOSFET Characteristics",
      path: "/labs/dvlsi/mosfet-characteristics",
      desc: "Study the output and transfer characteristics of nMOS and pMOS devices.",
      icon: "⚡",
      color: "142 71% 45%",
    },
    {
      name: "Lambda Rules and Microwind",
      path: "/labs/dvlsi/lambda-rules-microwind",
      desc: "Explore lambda-based layout rules, spacing constraints, and Microwind concepts.",
      icon: "📐",
      color: "217 91% 60%",
    },
    {
      name: "CMOS Inverter Simulation",
      path: "/labs/dvlsi/cmos-inverter-simulation",
      desc: "Analyze inverter behavior through VTC, transient response, and delay concepts.",
      icon: "🔁",
      color: "277 84% 60%",
    },
    {
      name: "CMOS Inverter Layout",
      path: "/labs/dvlsi/cmos-inverter-layout",
      desc: "Understand stick diagrams, transistor placement, and layout-level inverter design.",
      icon: "🧩",
      color: "24 95% 53%",
    },
    {
      name: "CMOS NOR Gate",
      path: "/labs/dvlsi/cmos-nor-gate",
      desc: "Study the structure and behavior of a 2-input CMOS NOR gate.",
      icon: "🔲",
      color: "330 81% 60%",
    },
    {
      name: "CMOS NAND Gate",
      path: "/labs/dvlsi/cmos-nand-gate",
      desc: "Study a 2-input CMOS NAND gate and observe its behavior for different inputs.",
      icon: "🟩",
      color: "172 72% 40%",
    },
    {
      name: "Transmission Gate",
      path: "/labs/dvlsi/transmission-gate",
      desc: "Study how transmission gates and pass transistors transmit and switch signals.",
      icon: "🔀",
      color: "38 92% 50%",
    },
    {
      name: "Ring Oscillator",
      path: "/labs/dvlsi/ring-oscillator",
      desc: "Study oscillation in an odd-number inverter loop through delay and feedback.",
      icon: "🔄",
      color: "258 90% 66%",
    },
    {
      name: "SRAM Cell Basics",
      path: "/labs/dvlsi/sram-cell",
      desc: "Study how an SRAM cell stores, holds, reads, and writes one bit.",
      icon: "🧠",
      color: "190 95% 39%",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SimulabNavbar />

      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-220px] left-[-120px] w-[620px] h-[620px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-220px] right-[-120px] w-[520px] h-[520px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/10" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold">
                <span className="text-gradient">DVLSI Lab</span>
              </h1>
            </div>

            <p className="text-muted-foreground text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
              Explore Digital VLSI experiments covering device behavior, layout rules,
              CMOS analysis, layout design, and basic VLSI building blocks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {experiments.map((exp, i) => (
              <motion.div
                key={exp.name}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                className="glass rounded-2xl overflow-hidden group hover:glow-border transition-all duration-500"
              >
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(${exp.color}), hsl(${exp.color} / 0.35))`,
                  }}
                />

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/65 flex items-center justify-center text-3xl shadow-inner">
                      {exp.icon}
                    </div>

                    <div>
                      <h3 className="font-display text-[1.9rem] leading-tight font-bold">
                        {exp.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-base leading-relaxed min-h-[72px] mb-6">
                    {exp.desc}
                  </p>

                  <Link to={exp.path}>
                    <Button
                      variant="hero"
                      className="font-display gap-2 rounded-xl px-7 py-5 text-base"
                    >
                      Start Experiment <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}