import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SimulabNavbar from "../components/SimulabNavbar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const labs = [
  {
    id: "dsa",
    title: "Data Structures Lab",
    subtitle: "7 experiments available",
    description:
      "Master fundamental data structures and algorithms through interactive visualizations and hands-on coding practice.",
    icon: "🔍",
    color: "185 80% 50%",
    route: "/labs/dsa",
    experiments: [
      {
        name: "Stack Simulation",
        description: "Understand LIFO behavior using push and pop operations.",
      },
      {
        name: "Sorting Algorithms",
        description: "Visualize bubble sort, merge sort, quick sort and more.",
      },
      {
        name: "Binary Tree Operations",
        description: "Traverse, insert, and delete nodes in binary trees.",
      },
    ],
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    subtitle: "8 experiments available",
    description:
      "Practice database concepts with interactive SQL queries, normalization, indexing, and transaction management.",
    icon: "💾",
    color: "260 70% 60%",
    route: "/labs/dbms",
    experiments: [
      {
        name: "Basic SQL Queries",
        description: "Run SELECT, INSERT and UPDATE queries.",
      },
      {
        name: "Normalization",
        description: "Convert tables through 1NF, 2NF, 3NF, BCNF.",
      },
      {
        name: "Transactions",
        description: "Understand ACID properties and transaction control.",
      },
    ],
  },
  {
    id: "os",
    title: "Operating Systems Lab",
    subtitle: "5 experiments available",
    description:
      "Explore scheduling, synchronization, memory management, and deadlock concepts through practical simulations.",
    icon: "🖥️",
    color: "330 75% 58%",
    route: "/labs/os",
    experiments: [
      {
        name: "CPU Scheduling",
        description: "Compare FCFS, SJF, Priority, and Round Robin.",
      },
      {
        name: "Process Synchronization",
        description: "Understand semaphores, mutexes, and critical sections.",
      },
      {
        name: "Page Replacement",
        description: "Simulate FIFO, LRU, and Optimal replacement.",
      },
    ],
  },
  {
    id: "dtsp",
    title: "Digital Signal Processing",
    subtitle: "8 experiments available",
    description:
      "Signal analysis, filtering techniques, and transform methods through interactive simulations.",
    icon: "📊",
    color: "150 60% 45%",
    route: "/labs/dtsp",
    experiments: [
      {
        name: "DFT / IDFT",
        description: "Visualize transform-domain behavior of signals.",
      },
      {
        name: "Pole-Zero Analysis",
        description: "Inspect system behavior using pole-zero plots.",
      },
      {
        name: "Filter Design",
        description: "Build and analyze digital filters interactively.",
      },
    ],
  },
  {
    id: "dsd",
    title: "Digital System Design",
    subtitle: "8 experiments available",
    description:
      "Learn digital logic using gates, adders, multiplexers, flip-flops, counters, and timing concepts.",
    icon: "🔧",
    color: "30 90% 55%",
    route: "/labs/dsd",
    experiments: [
      {
        name: "Logic Gates",
        description: "Simulate AND, OR, NOT, NAND, NOR, XOR gates.",
      },
      {
        name: "Adders",
        description: "Understand half adders and full adders interactively.",
      },
      {
        name: "Flip-Flops",
        description: "Explore bistable circuits and memory behavior.",
      },
    ],
  },
  {
    id: "dvlsi",
    title: "Digital VLSI Design",
    subtitle: "9 experiments available",
    description:
      "Explore VLSI circuit concepts with CMOS simulations, layout design, and device-level experiments.",
    icon: "⚡",
    color: "42 95% 58%",
    route: "/labs/dvlsi",
    experiments: [
      {
        name: "MOSFET Characteristics",
        description: "Study device behavior and key transfer properties.",
      },
      {
        name: "CMOS Inverter",
        description: "Analyze CMOS inverter characteristics and transfer curves.",
      },
      {
        name: "Transmission Gate",
        description: "Understand bidirectional switching in CMOS design.",
      },
    ],
  },
];

const Labs = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SimulabNavbar />
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Virtual <span className="text-gradient">Labs</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              Choose a lab to begin your interactive learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {labs.map((lab, i) => (
              <motion.div
                key={lab.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                className="glass rounded-2xl overflow-hidden group hover:glow-border transition-all duration-500"
              >
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(${lab.color}), hsl(${lab.color} / 0.35))`,
                  }}
                />

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{lab.icon}</span>
                    <div>
                      <h2 className="font-display text-2xl font-bold">
                        {lab.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {lab.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {lab.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {lab.experiments.map((exp) => (
                      <div
                        key={exp.name}
                        className="flex items-start gap-3 p-4 rounded-xl bg-secondary/45 hover:bg-secondary/70 transition-colors"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: `hsl(${lab.color})` }}
                        />
                        <div>
                          <p className="text-sm font-semibold">{exp.name}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to={lab.route}>
                    <Button variant="hero" className="w-full gap-2 font-display">
                      Open Lab <ArrowRight className="w-4 h-4" />
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
};

export default Labs;