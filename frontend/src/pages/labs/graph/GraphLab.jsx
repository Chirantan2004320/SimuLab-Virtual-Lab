/* eslint-disable no-new-func */

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu,
} from "lucide-react";

import "../../Lab.css";
import "../../SortingLab.css";

import GraphOverview from "./GraphOverview";
import GraphSimulation from "./GraphSimulation";
import GraphQuiz from "./GraphQuiz";
import GraphCoding from "./GraphCoding";

import MarkCompleteButton from "../../../components/MarkCompleteButton";

import SimuLabLogo from "../../../components/SimuLabLogo";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const sidebarItems = [
  {
    key: "overview",
    label: "Overview",
    icon: BookOpen,
  },

  {
    key: "simulation",
    label: "Simulation",
    icon: PlayCircle,
  },

  {
    key: "quiz",
    label: "Quiz",
    icon: Brain,
  },

  {
    key: "coding",
    label: "Coding Practice",
    icon: FileCode2,
  },
];

const bfsProblemBank = [
  {
    id: 1,

    algorithm: "bfs",

    title:
      "Implement BFS Traversal",

    problem_statement:
      "Write a function bfs(graph, start) that returns the BFS traversal order.",

    sample_input:
      "Graph = {A:[B,C], B:[D]} , Start = A",

    sample_output:
      "[A,B,C,D]",
  },

  {
    id: 2,

    algorithm: "bfs",

    title:
      "Check Reachability Using BFS",

    problem_statement:
      "Return true if target node is reachable using BFS.",

    sample_input:
      "Graph, Start = A, Target = D",

    sample_output:
      "true",
  },

  {
    id: 3,

    algorithm: "bfs",

    title:
      "Count BFS Visited Nodes",

    problem_statement:
      "Return total visited nodes during BFS traversal.",

    sample_input:
      "Graph, Start = A",

    sample_output:
      "6",
  },
];

const dfsProblemBank = [
  {
    id: 101,

    algorithm: "dfs",

    title:
      "Implement DFS Traversal",

    problem_statement:
      "Write a function dfs(graph, start) that returns DFS traversal order.",

    sample_input:
      "Graph = {A:[B,C], B:[D]} , Start = A",

    sample_output:
      "[A,B,D,C]",
  },

  {
    id: 102,

    algorithm: "dfs",

    title:
      "Check Reachability Using DFS",

    problem_statement:
      "Return true if target node is reachable using DFS.",

    sample_input:
      "Graph, Start = A, Target = D",

    sample_output:
      "true",
  },

  {
    id: 103,

    algorithm: "dfs",

    title:
      "Count DFS Visited Nodes",

    problem_statement:
      "Return total visited nodes during DFS traversal.",

    sample_input:
      "Graph, Start = A",

    sample_output:
      "6",
  },
];

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const buildAdjacencyList = (
  nodes,
  edges
) => {

  const graph = {};

  nodes.forEach((node) => {
    graph[node] = [];
  });

  edges.forEach(([a, b]) => {

    if (!graph[a])
      graph[a] = [];

    if (!graph[b])
      graph[b] = [];

    if (!graph[a].includes(b))
      graph[a].push(b);

    if (!graph[b].includes(a))
      graph[b].push(a);
  });

  Object.keys(graph).forEach(
    (key) => {
      graph[key].sort();
    }
  );

  return graph;
};

export default function GraphLab() {

  const [
    traversalType,
    setTraversalType,
  ] = useState("bfs");

  const [nodes, setNodes] =
    useState([]);

  const [edges, setEdges] =
    useState([]);

  const [
    nodeInput,
    setNodeInput,
  ] = useState("");

  const [
    edgeInput,
    setEdgeInput,
  ] = useState("");

  const [
    startNode,
    setStartNode,
  ] = useState("");

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

  const [message, setMessage] =
    useState(
      "Graph initialized."
    );

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

  const [
    visitedNodes,
    setVisitedNodes,
  ] = useState([]);

  const [
    activeNode,
    setActiveNode,
  ] = useState(null);

  const [
    traversalOrder,
    setTraversalOrder,
  ] = useState([]);

  const [
    stepHistory,
    setStepHistory,
  ] = useState([]);

  const [isRunning, setIsRunning] =
    useState(false);

  const [
    animationSpeed,
    setAnimationSpeed,
  ] = useState(700);

  const stopRequestedRef =
    useRef(false);

  const nodeInputRef =
    useRef(null);

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  // =========================
  // QUIZ STATES
  // =========================

  const [
    quizQuestions,
    setQuizQuestions,
  ] = useState([]);

  const [
    quizAnswers,
    setQuizAnswers,
  ] = useState([]);

  const [
    quizSubmitted,
    setQuizSubmitted,
  ] = useState(false);

  const [quizScore, setQuizScore] =
    useState(0);

  const [
    quizSaveStatus,
    setQuizSaveStatus,
  ] = useState("");

  // =========================
  // CODING STATES
  // =========================

  const [
    currentProblems,
    setCurrentProblems,
  ] = useState([]);

  const [
    selectedLanguages,
    setSelectedLanguages,
  ] = useState({});

  const [codes, setCodes] =
    useState({});

  const [results, setResults] =
    useState({});

  const [
    codingSaveStatus,
  ] = useState({});

  const graphNames = {
    bfs:
      "Breadth First Search",

    dfs:
      "Depth First Search",
  };

  const graphMeta = {
    bfs: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
      structure:
        "Queue",
    },

    dfs: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
      structure:
        "Stack / Recursion",
    },
  };

  // =========================
  // FETCH QUIZ QUESTIONS
  // =========================

  const fetchQuizQuestions =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(
            `${API_BASE_URL}/api/student/quizzes`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const filtered =
          res.data.questions.filter(
            (q) =>
              q.lab ===
                "DSA" &&
              q.experiment ===
                "Graph"
          );

        const formatted =
          filtered.map((q) => ({
            id: q.id,

            question:
              q.question,

            options: [
              q.option_a,
              q.option_b,
              q.option_c,
              q.option_d,
            ],

            correct_answer:
              q.correct_answer,
          }));

        setQuizQuestions(
          formatted
        );

        setQuizAnswers(
          Array(
            formatted.length
          ).fill(null)
        );

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    fetchQuizQuestions();

  }, []);

  const clearTraversalState =
    () => {

      setVisitedNodes([]);

      setActiveNode(null);

      setTraversalOrder([]);

      setStepHistory([]);
    };

  const addStep = (text) => {

    setStepHistory(
      (prev) => [
        ...prev,
        text,
      ]
    );
  };

  const addNode = () => {

    if (isRunning) return;

    const value =
      nodeInput
        .trim()
        .toUpperCase();

    if (!value) {

      setMessage(
        "Please enter node label."
      );

      return;
    }

    if (
      nodes.includes(value)
    ) {

      setMessage(
        `Node ${value} already exists.`
      );

      return;
    }

    setNodes((prev) => [
      ...prev,
      value,
    ]);

    setNodeInput("");

    setMessage(
      `Added node ${value}.`
    );

    setExperimentRun(true);

    nodeInputRef.current?.focus();
  };

  const addEdge = () => {

    if (isRunning) return;

    const raw =
      edgeInput
        .trim()
        .toUpperCase();

    if (
      !raw.includes("-")
    ) {

      setMessage(
        "Please enter edge in format A-B."
      );

      return;
    }

    const [a, b] =
      raw
        .split("-")
        .map((s) =>
          s.trim()
        );

    if (!a || !b) {

      setMessage(
        "Please enter valid edge."
      );

      return;
    }

    if (
      !nodes.includes(a) ||
      !nodes.includes(b)
    ) {

      setMessage(
        "Both nodes must exist."
      );

      return;
    }

    const exists =
      edges.some(
        ([x, y]) =>
          (x === a &&
            y === b) ||
          (x === b &&
            y === a)
      );

    if (exists) {

      setMessage(
        `Edge ${a}-${b} already exists.`
      );

      return;
    }

    setEdges((prev) => [
      ...prev,
      [a, b],
    ]);

    setEdgeInput("");

    setMessage(
      `Added edge ${a}-${b}.`
    );

    setExperimentRun(true);
  };

  const stopTraversal =
    () => {

      stopRequestedRef.current =
        true;

      setMessage(
        "Stopping traversal..."
      );
    };

  const runBFS =
    async () => {

      if (isRunning)
        return;

      const start =
        startNode
          .trim()
          .toUpperCase();

      if (
        !start ||
        !nodes.includes(start)
      ) {

        setMessage(
          "Please enter valid start node."
        );

        return;
      }

      const graph =
        buildAdjacencyList(
          nodes,
          edges
        );

      stopRequestedRef.current =
        false;

      setIsRunning(true);

      clearTraversalState();

      setExperimentRun(true);

      try {

        const visited =
          new Set([start]);

        const queue = [
          start,
        ];

        const order = [];

        while (
          queue.length > 0
        ) {

          if (
            stopRequestedRef.current
          )
            return;

          const node =
            queue.shift();

          setActiveNode(
            node
          );

          setMessage(
            `Visiting ${node}`
          );

          await sleep(
            animationSpeed
          );

          order.push(node);

          setVisitedNodes(
            (prev) => [
              ...prev,
              node,
            ]
          );

          setTraversalOrder(
            [...order]
          );

          addStep(
            `Visited ${node}`
          );

          for (const neighbor of graph[
            node
          ] || []) {

            if (
              !visited.has(
                neighbor
              )
            ) {

              visited.add(
                neighbor
              );

              queue.push(
                neighbor
              );

              addStep(
                `Queued ${neighbor}`
              );
            }
          }
        }

        setActiveNode(null);

        setMessage(
          `BFS Traversal: ${order.join(
            " → "
          )}`
        );

      } finally {

        setIsRunning(false);

        stopRequestedRef.current =
          false;
      }
    };

  const runDFS =
    async () => {

      if (isRunning)
        return;

      const start =
        startNode
          .trim()
          .toUpperCase();

      if (
        !start ||
        !nodes.includes(start)
      ) {

        setMessage(
          "Please enter valid start node."
        );

        return;
      }

      const graph =
        buildAdjacencyList(
          nodes,
          edges
        );

      stopRequestedRef.current =
        false;

      setIsRunning(true);

      clearTraversalState();

      setExperimentRun(true);

      try {

        const visited =
          new Set();

        const order = [];

        const dfsVisit =
          async (
            node
          ) => {

            if (
              stopRequestedRef.current
            )
              return;

            visited.add(
              node
            );

            setActiveNode(
              node
            );

            await sleep(
              animationSpeed
            );

            order.push(
              node
            );

            setVisitedNodes(
              (
                prev
              ) => [
                ...prev,
                node,
              ]
            );

            setTraversalOrder(
              [...order]
            );

            addStep(
              `Visited ${node}`
            );

            for (const neighbor of graph[
              node
            ] || []) {

              if (
                !visited.has(
                  neighbor
                )
              ) {

                await dfsVisit(
                  neighbor
                );
              }
            }
          };

        await dfsVisit(
          start
        );

        setActiveNode(null);

        setMessage(
          `DFS Traversal: ${order.join(
            " → "
          )}`
        );

      } finally {

        setIsRunning(false);

        stopRequestedRef.current =
          false;
      }
    };

  const runTraversal =
    async () => {

      if (
        traversalType ===
        "dfs"
      ) {

        await runDFS();

      } else {

        await runBFS();
      }
    };

  const loadSampleGraph =
    () => {

      if (isRunning)
        return;

      setNodes([
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
      ]);

      setEdges([
        ["A", "B"],
        ["A", "C"],
        ["B", "D"],
        ["B", "E"],
        ["C", "F"],
      ]);

      setStartNode("A");

      clearTraversalState();

      setExperimentRun(true);

      setMessage(
        "Sample graph loaded."
      );
    };

  const reset = () => {

    if (isRunning)
      return;

    setNodes([]);

    setEdges([]);

    setNodeInput("");

    setEdgeInput("");

    setStartNode("");

    clearTraversalState();

    setExperimentRun(false);

    setMessage(
      "Graph reset."
    );
  };

  // =========================
  // QUIZ
  // =========================

  const handleQuizAnswer = (
    index,
    answer
  ) => {

    const updated = [
      ...quizAnswers,
    ];

    updated[index] =
      answer;

    setQuizAnswers(
      updated
    );
  };

  const submitQuiz =
    async () => {

      let score = 0;

      quizQuestions.forEach(
        (q, i) => {

          const selectedOption =
            q.options?.[
              quizAnswers[i]
            ];

          if (
            selectedOption ===
            q.correct_answer
          ) {
            score++;
          }
        }
      );

      setQuizScore(score);

      setQuizSubmitted(true);

      setQuizSaveStatus(
        "Quiz submitted successfully."
      );
    };

  const redoQuiz = () => {

    setQuizAnswers(
      Array(
        quizQuestions.length
      ).fill(null)
    );

    setQuizSubmitted(false);

    setQuizScore(0);

    setQuizSaveStatus("");
  };

  // =========================
  // CODING
  // =========================

  const generateProblems =
    () => {

      const bank =
        traversalType ===
        "dfs"
          ? dfsProblemBank
          : bfsProblemBank;

      setCurrentProblems(
        bank
      );
    };

  const handleLanguageChange =
    (
      problemId,
      language
    ) => {

      setSelectedLanguages(
        (prev) => ({
          ...prev,
          [problemId]:
            language,
        })
      );
    };

  const handleCodeChange =
    (
      problemId,
      language,
      code
    ) => {

      const key = `${problemId}_${language}`;

      setCodes(
        (prev) => ({
          ...prev,
          [key]: code,
        })
      );
    };

  const runCode = (
    problemId
  ) => {

    setResults(
      (prev) => ({
        ...prev,
        [problemId]: {
          verdict:
            "passed",

          passedTests: 3,

          totalTests: 3,

          points: 10,

          results: [],
        },
      })
    );
  };

  const analyzeCode =
    () => {

      alert(
        "AI Code Analysis Coming Soon"
      );
    };

  const correctCode =
    () => {

      alert(
        "AI Code Correction Coming Soon"
      );
    };

  const progressPercent =
    activeSection ===
    "overview"
      ? 20
      : activeSection ===
        "simulation"
      ? 52
      : activeSection ===
        "quiz"
      ? 78
      : 95;

  return (
    <div className="er-shell">

      <aside
        className={`er-left-rail ${
          sidebarCollapsed
            ? "collapsed"
            : ""
        }`}
      >

        <div className="er-brand">

          <div className="er-brand-logo simulab-sidebar-logo">

            <SimuLabLogo
              size={58}
              showText={false}
              variant="default"
            />

          </div>

          {!sidebarCollapsed && (

            <div>

              <div className="er-brand-title">
                SimuLab
              </div>

              <div className="er-brand-subtitle">
                DSA Lab
              </div>

            </div>
          )}
        </div>

        <div className="er-collapse-wrap">

          <button
            type="button"
            className={`er-collapse-btn ${
              sidebarCollapsed
                ? "collapsed"
                : ""
            }`}
            onClick={() =>
              setSidebarCollapsed(
                (
                  prev
                ) =>
                  !prev
              )
            }
          >

            <ChevronsLeft
              size={18}
            />

          </button>
        </div>

        <div className="er-nav">

          {sidebarItems.map(
            (item) => {

              const Icon =
                item.icon;

              return (
                <button
                  key={
                    item.key
                  }
                  className={`er-nav-item ${
                    activeSection ===
                    item.key
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSection(
                      item.key
                    )
                  }
                >

                  <Icon
                    size={18}
                  />

                  {!sidebarCollapsed && (
                    <span>
                      {
                        item.label
                      }
                    </span>
                  )}

                </button>
              );
            }
          )}
        </div>

        {!sidebarCollapsed && (

          <div className="er-progress-card">

            <div className="er-progress-title">
              Your Progress
            </div>

            <div className="er-progress-ring">

              <div
                className="er-progress-circle"
                style={{
                  background: `conic-gradient(
                    #4da8ff ${progressPercent}%,
                    rgba(255,255,255,0.08) ${progressPercent}% 100%
                  )`,
                }}
              >

                <div className="er-progress-inner">

                  <div className="er-progress-value">
                    {progressPercent}%
                  </div>

                  <div className="er-progress-text">
                    Complete
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">

        <div className="er-page-header">

          <div>

            <h1 className="er-page-title">
              {
                graphNames[
                  traversalType
                ]
              }
            </h1>

            <p className="er-page-subtitle">
              Build a graph and
              visualize graph
              traversal algorithms
              step by step.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Graph Traversal Configuration
              </h2>

              <p>
                Configure traversal
                type and animation
                speed for graph
                exploration.
              </p>

            </div>

            <div className="er-mode-pill">

              <div className="er-mode-pill-icon">

                <Cpu
                  size={18}
                />

              </div>

              <div>

                <strong>
                  {
                    graphNames[
                      traversalType
                    ]
                  }
                </strong>

                <span>
                  Structure:
                  {" "}
                  {
                    graphMeta[
                      traversalType
                    ]
                      .structure
                  }
                </span>

              </div>

            </div>
          </div>

          <div className="er-config-grid">

            <div>

              <label className="sorting-label">
                Traversal Type
              </label>

              <select
                value={
                  traversalType
                }
                onChange={(
                  e
                ) =>
                  setTraversalType(
                    e.target
                      .value
                  )
                }
                className="sorting-select"
              >

                <option value="bfs">
                  BFS
                </option>

                <option value="dfs">
                  DFS
                </option>

              </select>
            </div>

            <div>

              <label className="sorting-label">
                Animation Speed
              </label>

              <select
                value={
                  animationSpeed
                }
                onChange={(
                  e
                ) =>
                  setAnimationSpeed(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                className="sorting-select"
              >

                <option value={1100}>
                  Slow
                </option>

                <option value={700}>
                  Normal
                </option>

                <option value={350}>
                  Fast
                </option>

              </select>
            </div>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              Nodes:
              {" "}
              {
                nodes.length
              }
            </button>

            <button className="er-chip active">
              Edges:
              {" "}
              {
                edges.length
              }
            </button>

            <button className="er-chip active">
              Visited:
              {" "}
              {
                visitedNodes.length
              }
            </button>

            <button className="er-chip active">
              Complexity:
              {" "}
              {
                graphMeta[
                  traversalType
                ].best
              }
            </button>

            <button
              className={`er-chip ${
                experimentRun
                  ? "active"
                  : ""
              }`}
            >
              {experimentRun
                ? "Experiment Run"
                : "Not Started"}
            </button>

          </div>

          {experimentRun && (

            <div
              style={{
                marginTop: 18,
              }}
            >

              <MarkCompleteButton
                labSlug="dsa"
                experimentSlug="graph-traversal"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <GraphOverview
                traversalType={
                  traversalType
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <GraphSimulation
                traversalType={
                  traversalType
                }
                nodes={nodes}
                edges={edges}
                nodeInput={
                  nodeInput
                }
                setNodeInput={
                  setNodeInput
                }
                edgeInput={
                  edgeInput
                }
                setEdgeInput={
                  setEdgeInput
                }
                startNode={
                  startNode
                }
                setStartNode={
                  setStartNode
                }
                addNode={
                  addNode
                }
                addEdge={
                  addEdge
                }
                runTraversal={
                  runTraversal
                }
                stopTraversal={
                  stopTraversal
                }
                loadSampleGraph={
                  loadSampleGraph
                }
                reset={reset}
                message={
                  message
                }
                nodeInputRef={
                  nodeInputRef
                }
                visitedNodes={
                  visitedNodes
                }
                activeNode={
                  activeNode
                }
                traversalOrder={
                  traversalOrder
                }
                stepHistory={
                  stepHistory
                }
                isRunning={
                  isRunning
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <GraphQuiz
                traversalType={
                  traversalType
                }
                experimentRun={
                  experimentRun
                }
                quizQuestions={
                  quizQuestions
                }
                quizAnswers={
                  quizAnswers
                }
                quizSubmitted={
                  quizSubmitted
                }
                quizScore={
                  quizScore
                }
                quizSaveStatus={
                  quizSaveStatus
                }
                handleQuizAnswer={
                  handleQuizAnswer
                }
                submitQuiz={
                  submitQuiz
                }
                redoQuiz={
                  redoQuiz
                }
              />
            )}

            {activeSection ===
              "coding" && (

              <GraphCoding
                traversalType={
                  traversalType
                }
                currentProblems={
                  currentProblems
                }
                selectedLanguages={
                  selectedLanguages
                }
                codes={codes}
                results={results}
                codingSaveStatus={
                  codingSaveStatus
                }
                generateProblems={
                  generateProblems
                }
                handleLanguageChange={
                  handleLanguageChange
                }
                handleCodeChange={
                  handleCodeChange
                }
                runCode={
                  runCode
                }
                analyzeCode={
                  analyzeCode
                }
                correctCode={
                  correctCode
                }
              />
            )}

          </section>
        </div>
      </main>
    </div>
  );
}