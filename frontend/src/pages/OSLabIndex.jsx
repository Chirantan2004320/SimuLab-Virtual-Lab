import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Search,
  Rocket,
  ShieldCheck,
  GraduationCap,
  Code2,
  CheckCircle2,
  Cpu,
} from "lucide-react";

import { Button } from "../components/ui/button";

import SimulabNavbar from "../components/SimulabNavbar";

import api from "../API/api";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  visible: (i) => ({
    opacity: 1,
    y: 0,

    transition: {
      delay: i * 0.06,
      duration: 0.42,
    },
  }),
};

const categories = [
  "All",
  "Scheduling",
  "Memory",
  "Synchronization",
  "Deadlock",
  "Advanced",
];

const experiments = [
  {
    name:
      "CPU Scheduling Lab",

    slug:
      "cpu-scheduling",

    path:
      "/labs/os/cpu-scheduling",

    desc:
      "Visualize FCFS, SJF, Round Robin, and Priority scheduling with animated Gantt charts.",

    icon: "🖥️",

    color:
      "198 93% 60%",

    category:
      "Scheduling",
  },

  {
    name:
      "Process Synchronization",

    slug:
      "process-synchronization",

    path:
      "/labs/os/process-synchronization",

    desc:
      "Understand semaphores, mutexes, and synchronization problems visually.",

    icon: "🔄",

    color:
      "160 84% 39%",

    category:
      "Synchronization",
  },

  {
    name:
      "Deadlock Lab",

    slug:
      "deadlock",

    path:
      "/labs/os/deadlock",

    desc:
      "Explore deadlock detection, prevention, avoidance, and Banker’s Algorithm.",

    icon: "⚠️",

    color:
      "38 92% 50%",

    category:
      "Deadlock",
  },

  {
    name:
      "Page Replacement Lab",

    slug:
      "page-replacement",

    path:
      "/labs/os/page-replacement",

    desc:
      "Compare FIFO, LRU, and Optimal page replacement algorithms visually.",

    icon: "📄",

    color:
      "262 83% 58%",

    category:
      "Memory",
  },

  {
    name:
      "Disk Scheduling Lab",

    slug:
      "disk-scheduling",

    path:
      "/labs/os/disk-scheduling",

    desc:
      "Visualize FCFS, SSTF, SCAN, and C-SCAN disk scheduling algorithms.",

    icon: "💽",

    color:
      "190 95% 39%",

    category:
      "Scheduling",
  },

  {
    name:
      "Paging & Memory Management",

    slug:
      "memory-management",

    path:
      "/labs/os/memory-management",

    desc:
      "Learn paging, segmentation, virtual memory, and address translation visually.",

    icon: "🧠",

    color:
      "270 91% 65%",

    category:
      "Memory",
  },
];

export default function OSLabIndex() {

  const [search, setSearch] =
    useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    completedExperiments,
    setCompletedExperiments,
  ] = useState([]);

  /*
========================================
FILTERED EXPERIMENTS
========================================
*/

  const filtered = useMemo(() => {

    return experiments.filter(
      (exp) => {

        const matchCategory =
          activeCategory ===
            "All" ||
          exp.category ===
            activeCategory;

        const matchSearch =
          exp.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          exp.desc
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        return (
          matchCategory &&
          matchSearch
        );
      }
    );

  }, [search, activeCategory]);

  /*
========================================
FETCH PROGRESS
========================================
*/

  const fetchCompletedExperiments =
    async () => {

      try {

        const res =
          await api.get(
            "/api/progress/me"
          );

        const completed =
          res.data.experiments
            .filter(
              (exp) =>
                exp.status ===
                  "completed" &&
                exp.labSlug ===
                  "os"
            )
            .map(
              (exp) =>
                exp.experimentSlug
            );

        setCompletedExperiments(
          completed
        );

      } catch (error) {

        console.error(
          "Failed to load progress:",
          error
        );
      }
    };

  useEffect(() => {

    fetchCompletedExperiments();

  }, []);

  useEffect(() => {

    const refresh = () =>
      fetchCompletedExperiments();

    window.addEventListener(
      "progress-updated",
      refresh
    );

    return () => {

      window.removeEventListener(
        "progress-updated",
        refresh
      );
    };

  }, []);

  const isCompleted = (
    slug
  ) =>
    completedExperiments.includes(
      slug
    );

  return (
    <div className="min-h-screen bg-[#050b16] text-white relative overflow-hidden">

      <SimulabNavbar />

      {/* BACKGROUND GLOW */}

      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.2),transparent_30%)]" />

      <div className="pt-24 pb-16 px-4">

        <div className="container mx-auto max-w-7xl">

          {/* HERO */}

          <div className="relative mb-12">

            <h1 className="text-5xl font-bold mb-4">
              Operating System{" "}
              <span className="text-gradient">
                Virtual Lab
              </span>
            </h1>

            <p className="text-gray-400 max-w-2xl">
              Explore interactive
              Operating System
              simulations including
              CPU scheduling,
              deadlocks, memory
              management, process
              synchronization, and
              disk scheduling with
              real-time visual
              learning.
            </p>

            <div className="absolute right-0 top-0 hidden lg:block">

              <Cpu
                size={120}
                className="text-cyan-400 opacity-20"
              />

            </div>
          </div>

          {/* FILTER + SEARCH */}

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">

            <div className="flex flex-wrap gap-2">

              {categories.map(
                (cat) => (

                  <button
                    key={cat}
                    onClick={() =>
                      setActiveCategory(
                        cat
                      )
                    }
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      activeCategory ===
                      cat
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                        : "border-gray-700 text-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}

            </div>

            <div className="relative">

              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search experiments..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="bg-[#0b1628] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-cyan-400"
              />

            </div>
          </div>

          {/* CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

            {filtered.map(
              (exp, i) => (

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
                      background: `linear-gradient(90deg, hsl(${exp.color}), transparent)`,
                    }}
                  />

                  <div className="p-6">

                    <div className="flex items-center gap-4 mb-5">

                      <div className="w-14 h-14 rounded-xl bg-[#0b1a30] flex items-center justify-center text-3xl">
                        {exp.icon}
                      </div>

                      <h3 className="text-xl font-bold">
                        {exp.name}
                      </h3>

                    </div>

                    <p className="text-gray-400 text-sm mb-6">
                      {exp.desc}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">

                      <Link to={exp.path}>

                        <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">

                          Start Experiment{" "}

                          <ArrowRight size={16} />

                        </Button>

                      </Link>

                      <button
                        disabled
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition-all duration-300 cursor-default border backdrop-blur-sm
                        ${
                          isCompleted(
                            exp.slug
                          )
                            ? "bg-green-500/15 border-green-400/40 text-green-300 shadow-lg shadow-green-500/10"
                            : "bg-white/5 border-white/10 text-muted-foreground"
                        }`}
                      >

                        <CheckCircle2 className="w-4 h-4" />

                        {isCompleted(
                          exp.slug
                        )
                          ? "Completed"
                          : "Not Completed"}

                      </button>

                    </div>
                  </div>
                </motion.div>
              )
            )}

          </div>

          {/* FEATURES */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">

            <Feature
              icon={
                <GraduationCap />
              }
              title="Interactive Learning"
              text="Learn OS concepts visually"
            />

            <Feature
              icon={<Rocket />}
              title="Live Simulations"
              text="Visualize scheduling and memory flow"
            />

            <Feature
              icon={<Code2 />}
              title="Quiz Assessments"
              text="Evaluate your OS understanding"
            />

            <Feature
              icon={
                <ShieldCheck />
              }
              title="Track Progress"
              text="Monitor completed OS experiments"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}) {

  return (
    <div className="bg-[#091426] border border-gray-800 rounded-xl p-4 flex gap-3 items-center">

      <div className="text-cyan-400">
        {icon}
      </div>

      <div>

        <h4 className="font-semibold">
          {title}
        </h4>

        <p className="text-sm text-gray-400">
          {text}
        </p>

      </div>
    </div>
  );
}