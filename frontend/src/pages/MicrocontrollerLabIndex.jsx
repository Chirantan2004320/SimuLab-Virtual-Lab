import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Cpu,
  Rocket,
  ShieldCheck,
  GraduationCap,
  Code2
} from "lucide-react";
import { Button } from "../components/ui/button";
import SimulabNavbar from "../components/SimulabNavbar";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.42 }
  })
};

const categories = ["All", "GPIO", "Input", "Output", "Display", "Control", "Timing"];

export default function MicrocontrollerLabIndex() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const experiments = [
    {
      name: "GPIO LED Control",
      path: "/labs/microcontroller/gpio-led",
      desc: "Control an LED using a microcontroller GPIO pin and understand digital output behavior.",
      icon: "💡",
      color: "198 93% 60%",
      category: "GPIO"
    },
    {
      name: "Button Input",
      path: "/labs/microcontroller/button-input",
      desc: "Read push button input and observe how digital HIGH and LOW signals affect output.",
      icon: "🔘",
      color: "160 84% 39%",
      category: "Input"
    },
    {
      name: "LED Blink",
      path: "/labs/microcontroller/led-blink",
      desc: "Understand delay-based LED blinking using basic microcontroller timing logic.",
      icon: "✨",
      color: "38 92% 50%",
      category: "Timing"
    },
    {
      name: "Traffic Light Controller",
      path: "/labs/microcontroller/traffic-light",
      desc: "Simulate a traffic signal system using timed GPIO outputs.",
      icon: "🚦",
      color: "351 89% 60%",
      category: "Control"
    },
    {
      name: "7-Segment Display",
      path: "/labs/microcontroller/seven-segment",
      desc: "Drive a 7-segment display using GPIO pins and binary digit patterns.",
      icon: "🔢",
      color: "262 83% 58%",
      category: "Display"
    },
    {
      name: "PWM LED Brightness",
      path: "/labs/microcontroller/pwm-led",
      desc: "Control LED brightness using pulse width modulation and duty cycle concepts.",
      icon: "🌗",
      color: "270 91% 65%",
      category: "Output"
    }
  ];

  const filtered = useMemo(() => {
    return experiments.filter((exp) => {
      const matchCategory =
        activeCategory === "All" || exp.category === activeCategory;

      const matchSearch =
        exp.name.toLowerCase().includes(search.toLowerCase()) ||
        exp.desc.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#050b16] text-white relative overflow-hidden">
      <SimulabNavbar />

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.2),transparent_30%)]" />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* HERO */}
          <div className="relative mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Microcontroller{" "}
              <span className="text-gradient">Experiments</span>
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Explore interactive simulations and learn GPIO, PWM, displays,
              and embedded logic through hands-on experiments.
            </p>

            {/* Chip Visual */}
            <div className="absolute right-0 top-0 hidden lg:block">
              <Cpu size={120} className="text-cyan-400 opacity-20" />
            </div>
          </div>

          {/* FILTER + SEARCH */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                      : "border-gray-700 text-gray-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search experiments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#0b1628] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {filtered.map((exp, i) => (
              <motion.div
                key={exp.name}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                className="rounded-2xl bg-[#091426] border border-gray-800 hover:border-cyan-400 transition-all duration-300"
              >
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(${exp.color}), transparent)`
                  }}
                />

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-xl bg-[#0b1a30] flex items-center justify-center text-3xl">
                      {exp.icon}
                    </div>

                    <h3 className="text-xl font-bold">{exp.name}</h3>
                  </div>

                  <p className="text-gray-400 text-sm mb-6">
                    {exp.desc}
                  </p>

                  <Link to={exp.path}>
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
                      Start Experiment <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FEATURES SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            <Feature icon={<GraduationCap />} title="Learn by Doing" text="Hands-on experiments" />
            <Feature icon={<Rocket />} title="Real-time Simulation" text="Instant feedback" />
            <Feature icon={<Code2 />} title="Beginner Friendly" text="Easy explanations" />
            <Feature icon={<ShieldCheck />} title="Safe Environment" text="No hardware needed" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="bg-[#091426] border border-gray-800 rounded-xl p-4 flex gap-3 items-center">
      <div className="text-cyan-400">{icon}</div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-400">{text}</p>
      </div>
    </div>
  );
}