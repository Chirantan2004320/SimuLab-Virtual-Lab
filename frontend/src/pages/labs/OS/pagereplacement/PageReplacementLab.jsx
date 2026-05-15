/* eslint-disable no-new-func */

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  HardDrive,
} from "lucide-react";

import "../../../SortingLab.css";

import PageReplacementOverview from "./PageReplacementOverview.jsx";
import PageReplacementQuiz from "./PageReplacementQuiz.jsx";
import PageReplacementCoding from "./PageReplacementCoding.jsx";
import PageReplacementSimulation from "./PageReplacementSimulation.jsx";

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
  fifo: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(frame size)",
    type: "Queue Based",
  },

  lru: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(frame size)",
    type: "Recency Based",
  },

  optimal: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(frame size)",
    type: "Future Knowledge",
  },
};

const modeNames = {
  fifo:
    "FIFO Page Replacement",

  lru:
    "LRU Page Replacement",

  optimal:
    "Optimal Page Replacement",
};

const problemBank = [
  {
    id: 1,

    mode: "fifo",

    title:
      "Implement FIFO Page Replacement",

    problem_statement:
      "Write logic to simulate FIFO page replacement and count page faults.",

    sample_input:
      "Reference String: 7 0 1 2 0 3 0 4\nFrames = 3",

    sample_output:
      "Total Page Faults = 7",
  },

  {
    id: 2,

    mode: "lru",

    title:
      "Implement LRU Page Replacement",

    problem_statement:
      "Write logic to replace the least recently used page.",

    sample_input:
      "Reference String: 7 0 1 2 0 3 0 4\nFrames = 3",

    sample_output:
      "Total Page Faults = 6",
  },

  {
    id: 3,

    mode: "optimal",

    title:
      "Implement Optimal Page Replacement",

    problem_statement:
      "Write logic to replace the page used farthest in future.",

    sample_input:
      "Reference String: 7 0 1 2 0 3 0 4\nFrames = 3",

    sample_output:
      "Total Page Faults = 5",
  },
];

export default function PageReplacementLab() {

  const [mode, setMode] =
    useState("fifo");

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

        const filtered =
          res.data.questions.filter(
            (q) =>
              q.lab ===
                "OS" &&
              q.experiment ===
                "Page Replacement"
          );

        const modeQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "fifo"
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
              "page-replacement",

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
            "7"
          ) ||
          normalized.includes(
            "page faults"
          );
      }

      else if (
        problemId === 2
      ) {

        passed =
          normalized.includes(
            "6"
          ) ||
          normalized.includes(
            "least recently used"
          );
      }

      else if (
        problemId === 3
      ) {

        passed =
          normalized.includes(
            "5"
          ) ||
          normalized.includes(
            "future"
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

  const progressPercent =
    activeSection ===
    "overview"
      ? 20
      : activeSection ===
        "simulation"
      ? 50
      : activeSection ===
        "quiz"
      ? 75
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
          </div>
        )}
      </aside>

      <main className="er-main-area">

        <div className="er-page-header">

          <div>

            <h1 className="er-page-title">
              {
                modeNames[
                  mode
                ]
              }
            </h1>

            <p className="er-page-subtitle">
              Learn Page Replacement
              algorithms visually
              using interactive
              simulations,
              quizzes and coding
              practice.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Algorithm Configuration
              </h2>

              <p>
                Configure and
                simulate Page
                Replacement
                algorithms.
              </p>

            </div>

            <div className="er-mode-pill">

              <div className="er-mode-pill-icon">

                <HardDrive
                  size={18}
                />

              </div>

              <div>

                <strong>
                  {
                    modeNames[
                      mode
                    ]
                  }
                </strong>

                <span>
                  {
                    modeMeta[
                      mode
                    ].type
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

              <option value="fifo">
                FIFO
              </option>

              <option value="lru">
                LRU
              </option>

              <option value="optimal">
                Optimal
              </option>

            </select>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              Best:
              {" "}
              {
                modeMeta[
                  mode
                ].best
              }
            </button>

            <button className="er-chip active">
              Avg:
              {" "}
              {
                modeMeta[
                  mode
                ].average
              }
            </button>

            <button className="er-chip active">
              Worst:
              {" "}
              {
                modeMeta[
                  mode
                ].worst
              }
            </button>

            <button className="er-chip active">
              Space:
              {" "}
              {
                modeMeta[
                  mode
                ].space
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
                experimentSlug="page-replacement"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <PageReplacementOverview
                mode={mode}
              />
            )}

            {activeSection ===
              "simulation" && (

              <PageReplacementSimulation
                mode={mode}
                setExperimentRun={
                  setExperimentRun
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <PageReplacementQuiz
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

              <PageReplacementCoding
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