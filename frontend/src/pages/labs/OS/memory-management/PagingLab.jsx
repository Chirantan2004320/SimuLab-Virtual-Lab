/* eslint-disable no-new-func */

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import axios from "axios";

import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  ShieldCheck,
  Layers3,
  Activity,
} from "lucide-react";

import "../../../SortingLab.css";

import PagingOverview from "./PagingOverview.jsx";
import PagingQuiz from "./PagingQuiz.jsx";
import PagingCoding from "./PagingCoding.jsx";
import PagingSimulation from "./PagingSimulation.jsx";

import SimuLabLogo from "../../../../components/SimuLabLogo";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

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

const modeMeta = {
  paging: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(Page Table)",
    type: "Fixed Size Paging",
    difficulty: "Intermediate",
    status: "Stable",
    icon: Layers3,
    glow: "rgba(77,168,255,0.4)",
  },

  segmentation: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(Segment Table)",
    type: "Variable Partitioning",
    difficulty: "Advanced",
    status: "Optimized",
    icon: ShieldCheck,
    glow: "rgba(111,255,196,0.35)",
  },

  virtual: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n²)",
    space: "O(Page Frames)",
    type: "Virtual Memory Management",
    difficulty: "Advanced",
    status: "Dynamic",
    icon: Activity,
    glow: "rgba(190,120,255,0.35)",
  },
};

const modeNames = {
  paging: "Paging",

  segmentation:
    "Segmentation",

  virtual:
    "Virtual Memory",
};


const problemBank = [
  {
    id: 1,

    mode: "paging",

    title:
      "Paging Address Translation",

    difficulty:
      "Intermediate",

    tags: [
      "Page Table",
      "Address Translation",
      "Frames",
    ],

    problem_statement:
      "Write logic to convert logical address into physical address using page size.",

    sample_input:
      "Logical Address = 245\nPage Size = 100",

    sample_output:
      "Page Number = 2\nOffset = 45",
  },

  {
    id: 2,

    mode: "segmentation",

    title:
      "Segmentation Address Mapping",

    difficulty:
      "Advanced",

    tags: [
      "Segment Table",
      "Offset",
      "Memory Mapping",
    ],

    problem_statement:
      "Write logic to calculate physical address using segment number and offset.",

    sample_input:
      "Segment = 1\nOffset = 120",

    sample_output:
      "Physical Address Calculated",
  },

  {
    id: 3,

    mode: "virtual",

    title:
      "Virtual Memory Page Fault",

    difficulty:
      "Advanced",

    tags: [
      "Page Fault",
      "Demand Paging",
      "Memory Frames",
    ],

    problem_statement:
      "Write logic to detect page fault and load missing page into memory.",

    sample_input:
      "Reference String = 7,0,1,2",

    sample_output:
      "Page Fault Detected",
  },
];

export default function PagingLab() {

  const [mode, setMode] =
    useState("paging");

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [
    experimentRun,
    setExperimentRun,
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
    setCodingSaveStatus,
  ] = useState({});

  // =========================
  // SAFE MODE DATA
  // =========================

  const currentMeta =
    modeMeta[mode] ||
    modeMeta.paging;

  const currentModeName =
    modeNames[mode] ||
    modeNames.paging;

  
  const CurrentModeIcon =
    currentMeta.icon ||
    Layers3;

  // =========================
  // FETCH QUIZ QUESTIONS
  // =========================

  const fetchQuizQuestions =
    useCallback(async () => {

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

        const allQuestions =
          res?.data
            ?.questions || [];

        const filtered =
          allQuestions.filter(
            (q) =>
              q.lab ===
                "OS" &&
              q.experiment ===
                "Memory Management"
          );

        const modeQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "paging"
              ).toLowerCase() ===
              mode
          );

        setQuizQuestions(
          modeQuestions
        );

        setQuizAnswers(
          Array(
            modeQuestions.length
          ).fill(null)
        );

      } catch (error) {

        console.error(error);

        setQuizQuestions([]);
      }
    }, [mode]);

  useEffect(() => {

    fetchQuizQuestions();

  }, [fetchQuizQuestions]);

  // =========================
  // QUIZ FUNCTIONS
  // =========================

  const handleQuizAnswer = (
    index,
    value
  ) => {

    const updated = [
      ...quizAnswers,
    ];

    updated[index] = value;

    setQuizAnswers(updated);
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

      try {

        await axios.post(
          `${API_BASE_URL}/api/progress/update`,
          {
            experimentSlug:
              "memory-management",

            status:
              "completed",

            points:
              score * 10,
          }
        );

        setQuizSaveStatus(
          "Quiz submitted successfully."
        );

      } catch (error) {

        console.error(error);

        setQuizSaveStatus(
          "Failed to save quiz progress."
        );
      }
    };

  const redoQuiz = () => {

    setQuizSubmitted(false);

    setQuizScore(0);

    setQuizAnswers(
      Array(
        quizQuestions.length
      ).fill(null)
    );
  };

  // =========================
  // CODING FUNCTIONS
  // =========================

  const generateProblems =
    () => {

      const filtered =
        problemBank.filter(
          (p) =>
            p.mode ===
            mode
        );

      setCurrentProblems(
        filtered
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
      value
    ) => {

      const key =
        `${problemId}_${language}`;

      setCodes((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  const runCode =
    (
      problemId,
      language
    ) => {

      const key =
        `${problemId}_${language}`;

      const answer =
        codes[key] || "";

      if (!answer.trim()) {

        setResults((prev) => ({
          ...prev,

          [problemId]: {
            verdict:
              "failed",

            passedTests:
              0,

            totalTests:
              1,

            points:
              0,
          },
        }));

        return;
      }

      const normalized =
        answer
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase();

      let passed = false;

      if (
        problemId === 1
      ) {

        passed =
          normalized.includes(
            "page"
          ) ||
          normalized.includes(
            "offset"
          );
      }

      else if (
        problemId === 2
      ) {

        passed =
          normalized.includes(
            "segment"
          ) ||
          normalized.includes(
            "physical"
          );
      }

      else if (
        problemId === 3
      ) {

        passed =
          normalized.includes(
            "page fault"
          ) ||
          normalized.includes(
            "virtual"
          );
      }

      setResults((prev) => ({
        ...prev,

        [problemId]: {
          verdict:
            passed
              ? "passed"
              : "failed",

          passedTests:
            passed
              ? 1
              : 0,

          totalTests: 1,

          points:
            passed
              ? 10
              : 0,
        },
      }));

      setCodingSaveStatus(
        (prev) => ({
          ...prev,

          [problemId]:
            passed
              ? "Coding progress saved successfully."
              : "Incorrect answer. Try again.",
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
  // PROGRESS TRACKING
  // =========================

  const progressPercent =
    useMemo(() => {

      if (
        activeSection ===
        "overview"
      ) {
        return 20;
      }

      if (
        activeSection ===
        "simulation"
      ) {
        return 50;
      }

      if (
        activeSection ===
        "quiz"
      ) {
        return 75;
      }

      return 95;

    }, [activeSection]);

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
                OS Lab
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
                ) => !prev
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

            <div
              style={{
                marginTop: 18,
              }}
            >

              <div className="er-chip-row">

                <button className="er-chip active">
                  Interactive Lab
                </button>

                <button className="er-chip">
                  Premium UI
                </button>

              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">

        <div className="er-page-header">

          <div>

            <h1 className="er-page-title">
              {currentModeName}
            </h1>

            <p className="er-page-subtitle">

              Learn advanced memory
              management concepts
              visually through
              immersive simulations,
              execution analytics,
              quizzes and coding
              practice.

            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Memory Management Configuration
              </h2>

              <p>
                Configure and
                visualize modern
                memory management
                techniques using
                interactive execution
                environments.
              </p>

            </div>

            <div
              className="er-mode-pill"
              style={{
                boxShadow: `0 0 30px ${currentMeta.glow}`,
              }}
            >

              <div className="er-mode-pill-icon">

                <CurrentModeIcon
                  size={18}
                />

              </div>

              <div>

                <strong>
                  {currentModeName}
                </strong>

                <span>
                  {
                    currentMeta.type
                  }
                </span>

              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
            }}
          >

            <select
              value={mode}
              onChange={(e) =>
                setMode(
                  e.target.value
                )
              }
              className="sorting-select"
              style={{
                maxWidth: 320,
              }}
            >

              <option value="paging">
                Paging
              </option>

              <option value="segmentation">
                Segmentation
              </option>

              <option value="virtual">
                Virtual Memory
              </option>

            </select>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              Best:
              {" "}
              {
                currentMeta.best
              }
            </button>

            <button className="er-chip active">
              Avg:
              {" "}
              {
                currentMeta.average
              }
            </button>

            <button className="er-chip active">
              Worst:
              {" "}
              {
                currentMeta.worst
              }
            </button>

            <button className="er-chip active">
              Space:
              {" "}
              {
                currentMeta.space
              }
            </button>

            <button className="er-chip active">
              {
                currentMeta.difficulty
              }
            </button>

            <button className="er-chip">
              {
                currentMeta.status
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
                labSlug="os"
                experimentSlug="memory-management"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <PagingOverview
                mode={mode}
              />
            )}

            {activeSection ===
              "simulation" && (

              <PagingSimulation
                mode={mode}
                setExperimentRun={
                  setExperimentRun
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <PagingQuiz
                mode={mode}
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
                experimentRun={
                  experimentRun
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

              <PagingCoding
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
                mode={mode}
              />
            )}

          </section>
        </div>
      </main>
    </div>
  );
}