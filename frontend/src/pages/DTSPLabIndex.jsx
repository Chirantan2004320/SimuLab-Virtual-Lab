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

export default function DTSPLabIndex() {
  const experiments = [
    {
      name: "Sampling & Aliasing",
      path: "/labs/dtsp/sampling-aliasing",
      desc: "Visualize signal sampling and observe aliasing when the Nyquist criterion is violated.",
      icon: "🎧",
      color: "190 95% 39%",
    },
    {
      name: "DFT and IDFT",
      path: "/labs/dtsp/dft-idft",
      desc: "Compute the Discrete Fourier Transform and its inverse to understand spectral representation.",
      icon: "📊",
      color: "142 71% 45%",
    },
    {
      name: "DFT Properties",
      path: "/labs/dtsp/dft-properties",
      desc: "Explore properties like linearity, time shift, and frequency shift through examples.",
      icon: "📈",
      color: "217 91% 60%",
    },
    {
      name: "FFT vs DFT",
      path: "/labs/dtsp/fft-vs-dft",
      desc: "Compare direct DFT and FFT in terms of output and computational efficiency.",
      icon: "⚡",
      color: "172 72% 40%",
    },
    {
      name: "Linear Convolution",
      path: "/labs/dtsp/linear-convolution-using-circular-convolution",
      desc: "Use circular convolution and zero-padding to implement standard linear convolution.",
      icon: "🔁",
      color: "277 84% 60%",
    },
    {
      name: "Pole–Zero Analysis",
      path: "/labs/dtsp/pole-zero-analysis",
      desc: "Visualize pole-zero locations and relate them to stability and frequency response.",
      icon: "📍",
      color: "24 95% 53%",
    },
    {
      name: "Linear Phase FIR",
      path: "/labs/dtsp/linear-phase-fir-analysis",
      desc: "Analyze linear phase FIR filters through symmetry, impulse response, and phase behavior.",
      icon: "🎚️",
      color: "330 81% 60%",
    },
    {
      name: "FIR Filter Design",
      path: "/labs/dtsp/filter-design",
      desc: "Design FIR filters using window methods and study how design choices affect performance.",
      icon: "🎛️",
      color: "258 90% 66%",
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
                <span className="text-gradient">DTSP Lab</span>
              </h1>
            </div>

            <p className="text-muted-foreground text-base sm:text-lg max-w-4xl mx-auto leading-relaxed">
              Choose a Digital Time Signal Processing experiment to begin. Each experiment includes
              simulation, visualization, and conceptual practice.
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