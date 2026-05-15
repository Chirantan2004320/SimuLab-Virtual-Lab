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

import MarkCompleteButton from "../../../components/MarkCompleteButton";

import TreeOverview from "./TreeOverview";
import TreeSimulation from "./TreeSimulation";
import TreeQuiz from "./TreeQuiz";
import TreeCoding from "./TreeCoding";

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

const binaryProblemBank = [
  {
    id: 1,

    algorithm: "binary",

    title:
      "Implement Inorder Traversal",

    problem_statement:
      "Write a function inorderTraversal(root) that returns inorder traversal of the binary tree.",

    sample_input:
      "Binary Tree Root",

    sample_output:
      "[10,20,30,40]",
  },

  {
    id: 2,

    algorithm: "binary",

    title:
      "Count Tree Nodes",

    problem_statement:
      "Write a function countNodes(root) that returns the total number of nodes in the binary tree.",

    sample_input:
      "Binary Tree Root",

    sample_output:
      "7",
  },

  {
    id: 3,

    algorithm: "binary",

    title:
      "Count Leaf Nodes",

    problem_statement:
      "Write a function countLeafNodes(root) that returns total leaf nodes.",

    sample_input:
      "Binary Tree Root",

    sample_output:
      "4",
  },
];

const bstProblemBank = [
  {
    id: 101,

    algorithm: "bst",

    title:
      "Search in BST",

    problem_statement:
      "Write a function searchBST(root, target) that returns true if target exists in BST.",

    sample_input:
      "BST Root, 50",

    sample_output:
      "true",
  },

  {
    id: 102,

    algorithm: "bst",

    title:
      "Find Minimum in BST",

    problem_statement:
      "Return minimum value present in BST.",

    sample_input:
      "BST Root",

    sample_output:
      "10",
  },

  {
    id: 103,

    algorithm: "bst",

    title:
      "Find Maximum in BST",

    problem_statement:
      "Return maximum value present in BST.",

    sample_input:
      "BST Root",

    sample_output:
      "70",
  },
];

const createNode = (
  value
) => ({
  id: `${Date.now()}-${Math.random()}`,
  value,
  left: null,
  right: null,
});

const cloneTree = (
  node
) => {

  if (!node) return null;

  return {
    id: node.id,
    value: node.value,
    left: cloneTree(
      node.left
    ),
    right: cloneTree(
      node.right
    ),
  };
};

const insertLevelOrder = (
  root,
  value
) => {

  const newNode =
    createNode(value);

  if (!root) return newNode;

  const clonedRoot =
    cloneTree(root);

  const queue = [
    clonedRoot,
  ];

  while (
    queue.length > 0
  ) {

    const current =
      queue.shift();

    if (!current.left) {

      current.left =
        newNode;

      return clonedRoot;
    }

    queue.push(
      current.left
    );

    if (!current.right) {

      current.right =
        newNode;

      return clonedRoot;
    }

    queue.push(
      current.right
    );
  }

  return clonedRoot;
};

const insertBST = (
  root,
  value
) => {

  const numericValue =
    Number(value);

  if (!root) {

    return {
      root: createNode(
        numericValue
      ),
      inserted: true,
      duplicate: false,
    };
  }

  const clonedRoot =
    cloneTree(root);

  let current =
    clonedRoot;

  while (current) {

    if (
      numericValue ===
      Number(
        current.value
      )
    ) {

      return {
        root: clonedRoot,
        inserted: false,
        duplicate: true,
      };
    }

    if (
      numericValue <
      Number(
        current.value
      )
    ) {

      if (!current.left) {

        current.left =
          createNode(
            numericValue
          );

        return {
          root: clonedRoot,
          inserted: true,
          duplicate: false,
        };
      }

      current =
        current.left;

    } else {

      if (!current.right) {

        current.right =
          createNode(
            numericValue
          );

        return {
          root: clonedRoot,
          inserted: true,
          duplicate: false,
        };
      }

      current =
        current.right;
    }
  }

  return {
    root: clonedRoot,
    inserted: false,
    duplicate: false,
  };
};

const buildPreorderNodes = (
  root,
  result = []
) => {

  if (!root)
    return result;

  result.push(root);

  buildPreorderNodes(
    root.left,
    result
  );

  buildPreorderNodes(
    root.right,
    result
  );

  return result;
};

const buildInorderNodes = (
  root,
  result = []
) => {

  if (!root)
    return result;

  buildInorderNodes(
    root.left,
    result
  );

  result.push(root);

  buildInorderNodes(
    root.right,
    result
  );

  return result;
};

const buildPostorderNodes = (
  root,
  result = []
) => {

  if (!root)
    return result;

  buildPostorderNodes(
    root.left,
    result
  );

  buildPostorderNodes(
    root.right,
    result
  );

  result.push(root);

  return result;
};

const buildLevelOrderNodes =
  (root) => {

    const result = [];

    if (!root)
      return result;

    const queue = [root];

    while (
      queue.length > 0
    ) {

      const node =
        queue.shift();

      result.push(node);

      if (node.left)
        queue.push(
          node.left
        );

      if (node.right)
        queue.push(
          node.right
        );
    }

    return result;
  };

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function TreeLab() {

  const [treeMode, setTreeMode] =
    useState("binary");

  const [treeRoot, setTreeRoot] =
    useState(null);

  const [input, setInput] =
    useState("");

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    deleteInput,
    setDeleteInput,
  ] = useState("");

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

  const [message, setMessage] =
    useState(
      "Tree initialized."
    );

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

  const [
    lastTraversal,
    setLastTraversal,
  ] = useState([]);

  const [
    visitedNodeIds,
    setVisitedNodeIds,
  ] = useState([]);

  const [
    activeNodeId,
    setActiveNodeId,
  ] = useState(null);

  const [isRunning, setIsRunning] =
    useState(false);

  const [
    animationSpeed,
    setAnimationSpeed,
  ] = useState(700);

  const [nodeCount, setNodeCount] =
    useState(0);

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const stopRequestedRef =
    useRef(false);

  const inputRef = useRef(null);

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

  const [
    setCodingAttempted,
  ] = useState(false);

  const treeNames = {
    binary:
      "Binary Tree",

    bst:
      "Binary Search Tree",
  };

  const treeMeta = {
    binary: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(n)",
      type: "Non Linear",
    },

    bst: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(n)",
      space: "O(n)",
      type: "Hierarchical",
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
                "Tree"
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

  useEffect(() => {

    const count =
      buildPreorderNodes(
        treeRoot,
        []
      ).length;

    setNodeCount(count);

  }, [treeRoot]);

  const clearHighlights =
    () => {

      setVisitedNodeIds([]);

      setActiveNodeId(null);

      setLastTraversal([]);
    };

  const insertNode = () => {

    if (isRunning) return;

    if (!input.trim()) {

      setMessage(
        "Please enter node value."
      );

      return;
    }

    if (
      treeMode ===
      "binary"
    ) {

      const updatedTree =
        insertLevelOrder(
          treeRoot,
          input.trim()
        );

      setTreeRoot(
        updatedTree
      );

      setMessage(
        `Inserted node ${input}`
      );

    } else {

      const result =
        insertBST(
          treeRoot,
          input.trim()
        );

      if (
        result.duplicate
      ) {

        setMessage(
          "Duplicate values are not allowed in BST."
        );

        return;
      }

      setTreeRoot(
        result.root
      );

      setMessage(
        `Inserted ${input} into BST`
      );
    }

    setInput("");

    clearHighlights();

    setExperimentRun(true);

    inputRef.current?.focus();
  };

  const animateTraversal =
    async (
      traversalType
    ) => {

      if (
        !treeRoot ||
        isRunning
      )
        return;

      stopRequestedRef.current =
        false;

      setIsRunning(true);

      setVisitedNodeIds([]);

      setActiveNodeId(null);

      setLastTraversal([]);

      setExperimentRun(true);

      try {

        const nodeSequence =
          traversalType ===
          "preorder"
            ? buildPreorderNodes(
                treeRoot,
                []
              )
            : traversalType ===
              "inorder"
            ? buildInorderNodes(
                treeRoot,
                []
              )
            : traversalType ===
              "postorder"
            ? buildPostorderNodes(
                treeRoot,
                []
              )
            : buildLevelOrderNodes(
                treeRoot
              );

        const values = [];

        for (
          let i = 0;
          i <
          nodeSequence.length;
          i++
        ) {

          if (
            stopRequestedRef.current
          )
            return;

          const node =
            nodeSequence[i];

          setActiveNodeId(
            node.id
          );

          await sleep(
            animationSpeed
          );

          values.push(
            node.value
          );

          setVisitedNodeIds(
            (
              prev
            ) => [
              ...prev,
              node.id,
            ]
          );

          setLastTraversal(
            [...values]
          );
        }

        setMessage(
          `${traversalType} Traversal: ${values.join(
            " → "
          )}`
        );

      } finally {

        setIsRunning(false);

        stopRequestedRef.current =
          false;
      }
    };

  const runPreorder =
    async () => {

      await animateTraversal(
        "preorder"
      );
    };

  const runInorder =
    async () => {

      await animateTraversal(
        "inorder"
      );
    };

  const runPostorder =
    async () => {

      await animateTraversal(
        "postorder"
      );
    };

  const runLevelOrder =
    async () => {

      await animateTraversal(
        "levelorder"
      );
    };

  const loadSampleTree =
    () => {

      if (isRunning) return;

      let root = null;

      if (
        treeMode ===
        "binary"
      ) {

        [
          "10",
          "20",
          "30",
          "40",
          "50",
          "60",
          "70",
        ].forEach(
          (value) => {

            root =
              insertLevelOrder(
                root,
                value
              );
          }
        );

      } else {

        [
          40,
          20,
          60,
          10,
          30,
          50,
          70,
        ].forEach(
          (value) => {

            const result =
              insertBST(
                root,
                value
              );

            root =
              result.root;
          }
        );
      }

      setTreeRoot(root);

      clearHighlights();

      setExperimentRun(true);
    };

  const reset = () => {

    if (isRunning) return;

    setTreeRoot(null);

    setInput("");

    setSearchInput("");

    setDeleteInput("");

    clearHighlights();

    setMessage(
      "Tree reset."
    );

    setExperimentRun(false);
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
        treeMode ===
        "bst"
          ? bstProblemBank
          : binaryProblemBank;

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

    setCodingAttempted(true);

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

  // =========================
  // PROGRESS
  // =========================

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
                treeNames[
                  treeMode
                ]
              }
            </h1>

            <p className="er-page-subtitle">
              Learn tree data
              structures visually
              using traversal,
              simulation, quiz and
              coding practice.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Tree Configuration
              </h2>

              <p>
                Configure tree mode
                and visualize tree
                operations step by
                step.
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
                    treeNames[
                      treeMode
                    ]
                  }
                </strong>

                <span>
                  Nodes:
                  {" "}
                  {
                    nodeCount
                  }
                  {" "}
                  | Visited:
                  {" "}
                  {
                    visitedNodeIds.length
                  }
                </span>

              </div>
            </div>
          </div>

          <div className="er-config-grid">

            <div>

              <label className="sorting-label">
                Tree Mode
              </label>

              <select
                value={
                  treeMode
                }
                onChange={(
                  e
                ) =>
                  setTreeMode(
                    e.target
                      .value
                  )
                }
                className="sorting-select"
                disabled={
                  isRunning
                }
              >

                <option value="binary">
                  Binary Tree
                </option>

                <option value="bst">
                  Binary Search Tree
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
              Best:
              {" "}
              {
                treeMeta[
                  treeMode
                ].best
              }
            </button>

            <button className="er-chip active">
              Avg:
              {" "}
              {
                treeMeta[
                  treeMode
                ].average
              }
            </button>

            <button className="er-chip active">
              Worst:
              {" "}
              {
                treeMeta[
                  treeMode
                ].worst
              }
            </button>

            <button className="er-chip active">
              Type:
              {" "}
              {
                treeMeta[
                  treeMode
                ].type
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
                experimentSlug="tree"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <TreeOverview
                treeMode={
                  treeMode
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <TreeSimulation
                treeMode={
                  treeMode
                }
                treeRoot={
                  treeRoot
                }
                input={input}
                setInput={
                  setInput
                }
                searchInput={
                  searchInput
                }
                setSearchInput={
                  setSearchInput
                }
                deleteInput={
                  deleteInput
                }
                setDeleteInput={
                  setDeleteInput
                }
                insertNode={
                  insertNode
                }
                runPreorder={
                  runPreorder
                }
                runInorder={
                  runInorder
                }
                runPostorder={
                  runPostorder
                }
                runLevelOrder={
                  runLevelOrder
                }
                stopTraversal={() =>
                  (stopRequestedRef.current =
                    true)
                }
                loadSampleTree={
                  loadSampleTree
                }
                reset={reset}
                message={
                  message
                }
                inputRef={
                  inputRef
                }
                lastTraversal={
                  lastTraversal
                }
                visitedNodeIds={
                  visitedNodeIds
                }
                activeNodeId={
                  activeNodeId
                }
                isRunning={
                  isRunning
                }
                nodeCount={
                  nodeCount
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <TreeQuiz
                treeMode={
                  treeMode
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

              <TreeCoding
                treeMode={
                  treeMode
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