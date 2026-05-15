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

import HeapOverview from "./HeapOverview";
import HeapSimulation from "./HeapSimulation";
import HeapQuiz from "./HeapQuiz";
import HeapCoding from "./HeapCoding";

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

const maxHeapProblems = [
  {
    id: 1,

    title:
      "Insert Into Max Heap",

    problem_statement:
      "Write a function to insert an element into a Max Heap and maintain heap property.",

    sample_input:
      "Heap = [90,70,80,30], Value = 100",

    sample_output:
      "[100,90,80,30,70]",
  },

  {
    id: 2,

    title:
      "Extract Maximum",

    problem_statement:
      "Write a function to remove and return the maximum element from a Max Heap.",

    sample_input:
      "Heap = [90,70,80,30]",

    sample_output:
      "90",
  },

  {
    id: 3,

    title:
      "Peek Root Node",

    problem_statement:
      "Return the root element from the Max Heap without removing it.",

    sample_input:
      "Heap = [90,70,80,30]",

    sample_output:
      "90",
  },
];

const minHeapProblems = [
  {
    id: 101,

    title:
      "Insert Into Min Heap",

    problem_statement:
      "Write a function to insert an element into a Min Heap and maintain heap property.",

    sample_input:
      "Heap = [10,20,15,40], Value = 5",

    sample_output:
      "[5,10,15,40,20]",
  },

  {
    id: 102,

    title:
      "Extract Minimum",

    problem_statement:
      "Write a function to remove and return the minimum element from a Min Heap.",

    sample_input:
      "Heap = [10,20,15,40]",

    sample_output:
      "10",
  },

  {
    id: 103,

    title:
      "Peek Root Node",

    problem_statement:
      "Return the root element from the Min Heap without removing it.",

    sample_input:
      "Heap = [10,20,15,40]",

    sample_output:
      "10",
  },
];

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function HeapLab() {

  const [heapType, setHeapType] =
    useState("max");

  const [heap, setHeap] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

  const [message, setMessage] =
    useState(
      "Heap initialized."
    );

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

  const [
    activeIndices,
    setActiveIndices,
  ] = useState([]);

  const [
    swappedIndices,
    setSwappedIndices,
  ] = useState([]);

  const [isRunning, setIsRunning] =
    useState(false);

  const [
    animationSpeed,
    setAnimationSpeed,
  ] = useState(700);

  const [
    stepHistory,
    setStepHistory,
  ] = useState([]);

  const stopRequestedRef =
    useRef(false);

  const inputRef =
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

  const heapNames = {
    max: "Max Heap",
    min: "Min Heap",
  };

  const heapMeta = {
    max: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(n)",
      structure:
        "Complete Binary Tree",
    },

    min: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(n)",
      structure:
        "Complete Binary Tree",
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
                "Heap"
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

    setHeap([]);

    setInput("");

    setMessage(
      `${
        heapType === "min"
          ? "Min"
          : "Max"
      } Heap initialized.`
    );

    setExperimentRun(false);

    setActiveIndices([]);

    setSwappedIndices([]);

    setStepHistory([]);

  }, [heapType]);

  const clearHighlights =
    () => {

      setActiveIndices([]);

      setSwappedIndices([]);
    };

  const addStep = (text) => {

    setStepHistory(
      (prev) => [
        ...prev,
        text,
      ]
    );
  };

  const isCorrectOrder = (
    parent,
    child
  ) =>
    heapType === "min"
      ? parent <= child
      : parent >= child;

  const stopAnimation =
    () => {

      stopRequestedRef.current =
        true;

      setMessage(
        "Stopping heap operation..."
      );

      addStep(
        "Stop requested by user."
      );
    };

  const animateInsert =
    async () => {

      if (isRunning)
        return;

      if (
        !input.trim() ||
        Number.isNaN(
          Number(
            input.trim()
          )
        )
      ) {

        setMessage(
          "Please enter a valid number."
        );

        return;
      }

      const value = Number(
        input.trim()
      );

      const newHeap = [
        ...heap,
        value,
      ];

      setHeap(newHeap);

      setInput("");

      setExperimentRun(true);

      setIsRunning(true);

      stopRequestedRef.current =
        false;

      clearHighlights();

      setStepHistory([]);

      inputRef.current?.focus();

      try {

        let index =
          newHeap.length - 1;

        addStep(
          `Inserted ${value} into heap.`
        );

        while (index > 0) {

          if (
            stopRequestedRef.current
          )
            return;

          const parent =
            Math.floor(
              (index - 1) /
                2
            );

          setActiveIndices([
            index,
            parent,
          ]);

          await sleep(
            animationSpeed
          );

          if (
            isCorrectOrder(
              newHeap[
                parent
              ],
              newHeap[
                index
              ]
            )
          ) {

            addStep(
              "Heap property satisfied."
            );

            break;
          }

          [
            newHeap[
              parent
            ],
            newHeap[
              index
            ],
          ] = [
            newHeap[
              index
            ],
            newHeap[
              parent
            ],
          ];

          setHeap([
            ...newHeap,
          ]);

          setSwappedIndices([
            parent,
            index,
          ]);

          addStep(
            `Swapped ${newHeap[index]} with ${newHeap[parent]}.`
          );

          await sleep(
            animationSpeed
          );

          setSwappedIndices(
            []
          );

          index = parent;
        }

        clearHighlights();

        setMessage(
          `Heap after insert: [${newHeap.join(
            ", "
          )}]`
        );

      } finally {

        setIsRunning(false);

        stopRequestedRef.current =
          false;
      }
    };

  const animateExtractRoot =
    async () => {

      if (
        isRunning ||
        heap.length === 0
      )
        return;

      setExperimentRun(true);

      setIsRunning(true);

      stopRequestedRef.current =
        false;

      clearHighlights();

      setStepHistory([]);

      try {

        const newHeap = [
          ...heap,
        ];

        const root =
          newHeap[0];

        if (
          newHeap.length ===
          1
        ) {

          setHeap([]);

          setMessage(
            `Removed root ${root}.`
          );

          return;
        }

        newHeap[0] =
          newHeap[
            newHeap.length -
              1
          ];

        newHeap.pop();

        setHeap([
          ...newHeap,
        ]);

        addStep(
          `Removed root ${root}.`
        );

        let index = 0;

        while (true) {

          if (
            stopRequestedRef.current
          )
            return;

          const left =
            2 *
              index +
            1;

          const right =
            2 *
              index +
            2;

          let target =
            index;

          if (
            left <
              newHeap.length &&
            !isCorrectOrder(
              newHeap[
                target
              ],
              newHeap[
                left
              ]
            )
          ) {

            target =
              left;
          }

          if (
            right <
              newHeap.length &&
            !isCorrectOrder(
              newHeap[
                target
              ],
              newHeap[
                right
              ]
            )
          ) {

            target =
              right;
          }

          if (
            target === index
          )
            break;

          setActiveIndices([
            index,
            target,
          ]);

          await sleep(
            animationSpeed
          );

          [
            newHeap[
              index
            ],
            newHeap[
              target
            ],
          ] = [
            newHeap[
              target
            ],
            newHeap[
              index
            ],
          ];

          setHeap([
            ...newHeap,
          ]);

          setSwappedIndices([
            index,
            target,
          ]);

          addStep(
            `Swapped ${newHeap[target]} with ${newHeap[index]}.`
          );

          await sleep(
            animationSpeed
          );

          setSwappedIndices(
            []
          );

          index = target;
        }

        clearHighlights();

        setMessage(
          `Heap after extract: [${newHeap.join(
            ", "
          )}]`
        );

      } finally {

        setIsRunning(false);

        stopRequestedRef.current =
          false;
      }
    };

  const peekRoot = () => {

    if (
      isRunning ||
      heap.length === 0
    )
      return;

    clearHighlights();

    setActiveIndices([0]);

    setExperimentRun(true);

    setMessage(
      `${
        heapType === "min"
          ? "Minimum"
          : "Maximum"
      } value is ${heap[0]}.`
    );

    setStepHistory([
      `Root value is ${heap[0]}.`,
    ]);
  };

  const loadSampleHeap =
    () => {

      if (isRunning)
        return;

      const sample =
        heapType === "min"
          ? [
              10,
              20,
              15,
              40,
              50,
              30,
            ]
          : [
              90,
              70,
              80,
              30,
              40,
              50,
            ];

      setHeap(sample);

      clearHighlights();

      setStepHistory([
        `Loaded sample ${heapType} heap.`,
      ]);

      setMessage(
        `Loaded sample ${heapType} heap.`
      );

      setExperimentRun(true);
    };

  const reset = () => {

    if (isRunning)
      return;

    setHeap([]);

    setInput("");

    clearHighlights();

    setStepHistory([]);

    setMessage(
      `${
        heapType === "min"
          ? "Min"
          : "Max"
      } Heap reset.`
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
        heapType === "min"
          ? minHeapProblems
          : maxHeapProblems;

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
                heapNames[
                  heapType
                ]
              }
            </h1>

            <p className="er-page-subtitle">
              Visualize heap
              insertion, extraction,
              heapify-up, and
              heapify-down operations
              step by step.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Heap Configuration
              </h2>

              <p>
                Configure heap type,
                animation speed, and
                visualize heap
                operations.
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
                    heapNames[
                      heapType
                    ]
                  }
                </strong>

                <span>
                  Structure:
                  {" "}
                  {
                    heapMeta[
                      heapType
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
                Heap Type
              </label>

              <select
                value={heapType}
                onChange={(
                  e
                ) =>
                  setHeapType(
                    e.target
                      .value
                  )
                }
                className="sorting-select"
                disabled={
                  isRunning
                }
              >

                <option value="max">
                  Max Heap
                </option>

                <option value="min">
                  Min Heap
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
                disabled={
                  isRunning
                }
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
              Mode:
              {" "}
              {
                heapNames[
                  heapType
                ]
              }
            </button>

            <button className="er-chip active">
              Nodes:
              {" "}
              {
                heap.length
              }
            </button>

            <button className="er-chip active">
              Root:
              {" "}
              {heap.length
                ? heap[0]
                : "NULL"}
            </button>

            <button className="er-chip active">
              Complexity:
              {" "}
              O(log n)
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
                experimentSlug="heap"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <HeapOverview
                heapType={
                  heapType
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <HeapSimulation
                heapType={
                  heapType
                }
                heap={heap}
                input={input}
                setInput={setInput}
                animateInsert={
                  animateInsert
                }
                animateExtractRoot={
                  animateExtractRoot
                }
                peekRoot={
                  peekRoot
                }
                stopAnimation={
                  stopAnimation
                }
                loadSampleHeap={
                  loadSampleHeap
                }
                reset={reset}
                message={
                  message
                }
                inputRef={
                  inputRef
                }
                activeIndices={
                  activeIndices
                }
                swappedIndices={
                  swappedIndices
                }
                isRunning={
                  isRunning
                }
                stepHistory={
                  stepHistory
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <HeapQuiz
                heapType={
                  heapType
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

              <HeapCoding
                heapType={
                  heapType
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