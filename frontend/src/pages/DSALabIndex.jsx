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
  BrainCircuit,
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
  "Linear",
  "Tree",
  "Graph",
  "Searching",
  "Sorting",
  "Advanced",
];

const experiments = [
  {
    name: "Stack",
    slug: "stack",

    path: "/labs/dsa/stack",

    desc:
      "Visualize stack push/pop operations with coding practice and quizzes.",

    icon: "📚",

    color: "262 83% 58%",

    category: "Linear",
  },

  {
    name: "Queue",
    slug: "queue",

    path: "/labs/dsa/queue",

    desc:
      "Understand enqueue and dequeue operations using queue simulations.",

    icon: "📋",

    color: "160 84% 39%",

    category: "Linear",
  },

  {
    name: "Linked List",
    slug: "linked-list",

    path: "/labs/dsa/linked-list",

    desc:
      "Perform insertion, deletion, and traversal operations visually.",

    icon: "🔗",

    color: "38 92% 50%",

    category: "Linear",
  },

  {
    name: "Sorting Algorithms",
    slug: "sorting",

    path: "/labs/dsa/sorting",

    desc:
      "Visualize Bubble Sort, Selection Sort, Merge Sort, and more.",

    icon: "🔢",

    color: "198 93% 60%",

    category: "Sorting",
  },

  {
    name: "Searching Algorithms",
    slug: "searching",

    path: "/labs/dsa/searching",

    desc:
      "Learn Linear Search and Binary Search step-by-step.",

    icon: "🔍",

    color: "330 81% 60%",

    category: "Searching",
  },

  {
    name: "Binary Tree",
    slug: "tree",

    path: "/labs/dsa/tree",

    desc:
      "Visualize inorder, preorder, and postorder traversals.",

    icon: "🌳",

    color: "142 71% 45%",

    category: "Tree",
  },

  {
    name: "Graph Traversal",
    slug: "graph",

    path: "/labs/dsa/graph",

    desc:
      "Build graphs and perform BFS and DFS traversals visually.",

    icon: "🕸️",

    color: "351 89% 60%",

    category: "Graph",
  },

  {
    name: "Heap / Priority Queue",
    slug: "heap",

    path: "/labs/dsa/heap",

    desc:
      "Understand heapify, insertion, and extract max operations.",

    icon: "📦",

    color: "190 95% 39%",

    category: "Tree",
  },

  {
    name: "Hash Table",
    slug: "hash-table",

    path: "/labs/dsa/hash-table",

    desc:
      "Visualize hashing, collisions, insertions, and lookups.",

    icon: "🗂️",

    color: "270 91% 65%",

    category: "Advanced",
  },

  {
    name: "Recursion Visualizer",
    slug: "recursion",

    path: "/labs/dsa/recursion",

    desc:
      "Understand recursive calls using factorial and fibonacci.",

    icon: "🌀",

    color: "258 90% 66%",

    category: "Advanced",
  },
];

export default function DSALabIndex() {
  const [search, setSearch] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

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
          activeCategory === "All" ||
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
                "completed"
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

  const isCompleted = (slug) =>
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
              Data Structures &{" "}
              <span className="text-gradient">
                Algorithms
              </span>
            </h1>

            <p className="text-gray-400 max-w-2xl">
              Explore interactive DSA
              simulations, quizzes,
              and coding challenges
              with real-time visual
              learning.
            </p>

            <div className="absolute right-0 top-0 hidden lg:block">
              <BrainCircuit
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
              icon={<GraduationCap />}
              title="Interactive Learning"
              text="Learn visually with simulations"
            />

            <Feature
              icon={<Rocket />}
              title="Coding Challenges"
              text="Practice real coding problems"
            />

            <Feature
              icon={<Code2 />}
              title="Quiz Assessments"
              text="Evaluate your understanding"
            />

            <Feature
              icon={<ShieldCheck />}
              title="Track Progress"
              text="Monitor completed experiments"
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