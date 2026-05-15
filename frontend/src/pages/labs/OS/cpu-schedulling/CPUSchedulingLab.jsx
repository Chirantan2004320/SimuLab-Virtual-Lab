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
  Cpu,
} from "lucide-react";

import "../../../SortingLab.css";

import CPUSchedulingOverview from "./CPUSchedulingOverview.jsx";
import CPUSchedulingQuiz from "./CPUSchedulingQuiz.jsx";
import CPUSchedulingCoding from "./CPUSchedulingCoding.jsx";
import CPUSchedulingSimulation from "./CPUSchedullingSimulation.jsx";

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

const algorithmMeta = {
  fcfs: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    type: "Non-Preemptive",
  },

  sjf: {
    best: "O(n log n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    type: "Non-Preemptive",
  },

  rr: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(n)",
    type: "Preemptive",
  },

  priority: {
    best: "O(n log n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    type: "Non-Preemptive",
  },
};

const algorithmNames = {
  fcfs:
    "First Come First Serve",

  sjf:
    "Shortest Job First",

  rr:
    "Round Robin",

  priority:
    "Priority Scheduling",
};

const problemBank = [
  {
    id: 1,

    algorithm: "fcfs",

    title:
      "Implement FCFS Scheduling",

    problem_statement:
      "Write logic to calculate waiting time and turnaround time using FCFS scheduling.",

    sample_input:
      "P1 AT=0 BT=4\nP2 AT=1 BT=3",

    sample_output:
      "WT: P1=0 P2=3\nTAT: P1=4 P2=6",
  },

  {
    id: 2,

    algorithm: "sjf",

    title:
      "Implement SJF Scheduling",

    problem_statement:
      "Write logic to execute processes using non-preemptive SJF scheduling.",

    sample_input:
      "P1 BT=6\nP2 BT=2\nP3 BT=4",

    sample_output:
      "Execution Order: P2 P3 P1",
  },

  {
    id: 3,

    algorithm: "rr",

    title:
      "Implement Round Robin Scheduling",

    problem_statement:
      "Write logic to execute processes using Round Robin scheduling.",

    sample_input:
      "Quantum=2\nP1 BT=5\nP2 BT=3",

    sample_output:
      "Execution: P1 P2 P1 P2 P1",
  },

  {
    id: 4,

    algorithm: "priority",

    title:
      "Implement Priority Scheduling",

    problem_statement:
      "Write logic to execute processes using Priority Scheduling.",

    sample_input:
      "P1 Priority=2\nP2 Priority=1",

    sample_output:
      "Execution Order: P2 P1",
  },
];

export default function CPUSchedulingLab() {

  const [algorithm, setAlgorithm] =
    useState("fcfs");

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
                "CPU Scheduling"
          );

        const algorithmQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "fcfs"
              ).toLowerCase() ===
              algorithm
          );

        setQuizQuestions(
          algorithmQuestions
        );

        setQuizAnswers(
          Array(
            algorithmQuestions.length
          ).fill(null)
        );

      } catch (error) {

        console.error(error);

        setQuizQuestions([]);
      }
    }, [algorithm]);

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
              "cpu-scheduling",

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
          p.algorithm ===
          algorithm
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

      const key = `${problemId}_${language}`;

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
          "wt: p1=0 p2=3"
        ) &&
        normalized.includes(
          "tat: p1=4 p2=6"
        );
    }

    else if (
      problemId === 2
    ) {

      passed =
        normalized.includes(
          "p2 p3 p1"
        );
    }

    else if (
      problemId === 3
    ) {

      passed =
        normalized.includes(
          "p1 p2 p1 p2 p1"
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
                algorithmNames[
                  algorithm
                ]
              }
            </h1>

            <p className="er-page-subtitle">
              Learn CPU Scheduling
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
                simulate CPU
                scheduling
                algorithms.
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
                    algorithmNames[
                      algorithm
                    ]
                  }
                </strong>

                <span>
                  {
                    algorithmMeta[
                      algorithm
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
              value={algorithm}
              onChange={(e) =>
                setAlgorithm(
                  e.target.value
                )
              }
              className="sorting-select"
              style={{
                maxWidth: 320,
              }}
            >

              <option value="fcfs">
                FCFS
              </option>

              <option value="sjf">
                SJF
              </option>

              <option value="rr">
                Round Robin
              </option>

              <option value="priority">
                Priority
              </option>

            </select>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              Best:
              {" "}
              {
                algorithmMeta[
                  algorithm
                ].best
              }
            </button>

            <button className="er-chip active">
              Avg:
              {" "}
              {
                algorithmMeta[
                  algorithm
                ].average
              }
            </button>

            <button className="er-chip active">
              Worst:
              {" "}
              {
                algorithmMeta[
                  algorithm
                ].worst
              }
            </button>

            <button className="er-chip active">
              Space:
              {" "}
              {
                algorithmMeta[
                  algorithm
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
                experimentSlug="cpu-scheduling"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <CPUSchedulingOverview
                algorithm={
                  algorithm
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <CPUSchedulingSimulation
                algorithm={
                  algorithm
                }
                setExperimentRun={
                  setExperimentRun
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <CPUSchedulingQuiz
                algorithm={
                  algorithm
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

              <CPUSchedulingCoding
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