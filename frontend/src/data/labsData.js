export const labsData = {
  dsa: {
    id: "dsa",
    title: "Data Structures Lab",
    description:
      "Master fundamental data structures and algorithms through interactive visualizations and hands-on coding practice.",
    icon: "🔍",
    color: "185 80% 50%",
    experiments: [
      {
        id: "stack",
        name: "Stack Simulation",
        description: "Understand LIFO behavior using push and pop operations.",
        component: "StackExperiment",
        theory:
          "A stack is a linear data structure that follows Last In First Out (LIFO).",
      },
      {
        id: "sorting",
        name: "Sorting Algorithms",
        description: "Visualize bubble sort, merge sort, quick sort and more.",
        component: null,
      },
      {
        id: "binary-tree",
        name: "Binary Tree Operations",
        description: "Traverse, insert, and delete nodes in binary trees.",
        component: null,
      },
      {
        id: "graph",
        name: "Graph Algorithms",
        description: "BFS, DFS, shortest paths and spanning trees.",
        component: null,
      },
    ],
  },
  dbms: {
    id: "dbms",
    title: "Database Management Systems",
    description:
      "Practice database concepts with interactive SQL queries, normalization, and transaction management.",
    icon: "💾",
    color: "260 70% 60%",
    experiments: [
      {
        id: "sql-basic",
        name: "Basic SQL Queries",
        description: "Run SELECT, INSERT and UPDATE queries.",
        component: null,
      },
      {
        id: "normalization",
        name: "Normalization",
        description: "Convert tables through 1NF, 2NF, 3NF, BCNF.",
        component: null,
      },
    ],
  },
  dtsp: {
    id: "dtsp",
    title: "Digital Signal Processing",
    description:
      "Signal analysis, filtering techniques, and transform methods through interactive simulations.",
    icon: "📊",
    color: "150 60% 45%",
    experiments: [
      {
        id: "signal-plot",
        name: "Signal Plotter",
        description: "Visualize digital signals in time and frequency domains.",
        component: null,
      },
      {
        id: "fir-filter",
        name: "FIR Filter Design",
        description: "Design and test finite impulse response filters.",
        component: null,
      },
    ],
  },
  dvlsi: {
    id: "dvlsi",
    title: "Digital VLSI Design",
    description:
      "Explore VLSI circuit concepts with logic gate simulators and layout design tools.",
    icon: "⚡",
    color: "30 90% 55%",
    experiments: [
      {
        id: "logic-gates",
        name: "Logic Gate Simulator",
        description:
          "Simulate basic AND, OR, NOT, NAND, NOR, XOR gates.",
        component: null,
      },
      {
        id: "cmos",
        name: "CMOS Inverter",
        description:
          "Analyze CMOS inverter characteristics and transfer curves.",
        component: null,
      },
    ],
  },
};

export const labFeatures = [
  {
    title: "Interactive Simulations",
    description:
      "Hands-on experiments with real-time visual feedback and step-by-step animations.",
    icon: "🎯",
  },
  {
    title: "Instant Feedback",
    description:
      "Get immediate results and performance analytics as you learn.",
    icon: "⚡",
  },
  {
    title: "Theory + Practice",
    description:
      "Each experiment includes detailed theory and practical exercises.",
    icon: "📖",
  },
  {
    title: "Progress Tracking",
    description:
      "Track your learning journey across all labs and experiments.",
    icon: "📈",
  },
];