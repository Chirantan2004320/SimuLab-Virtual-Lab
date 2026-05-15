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

import SearchingOverview from "./SearchingOverview";
import SearchingSimulation from "./SearchingSimulation";
import SearchingQuiz from "./SearchingQuiz";
import SearchingCoding from "./SearchingCoding";

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

const linearProblemBank = [
  {
    id: 1,

    algorithm: "linear",

    title:
      "Implement Linear Search",

    problem_statement:
      "Write a function linearSearch(arr, target) that returns the index of the target element or -1 if not found.",

    sample_input:
      "[5, 10, 15, 20], 15",

    sample_output:
      "2",
  },

  {
    id: 2,

    algorithm: "linear",

    title:
      "Find First Occurrence",

    problem_statement:
      "Write a function firstOccurrence(arr, target) that returns the first occurrence of the target.",

    sample_input:
      "[4, 2, 4, 9], 4",

    sample_output:
      "0",
  },

  {
    id: 3,

    algorithm: "linear",

    title:
      "Check Element Existence",

    problem_statement:
      "Write a function existsLinear(arr, target) that returns true if the target exists.",

    sample_input:
      "[1, 2, 3], 5",

    sample_output:
      "false",
  },
];

const binaryProblemBank = [
  {
    id: 101,

    algorithm: "binary",

    title:
      "Implement Binary Search",

    problem_statement:
      "Write a function binarySearch(arr, target) that returns the index of target in sorted array.",

    sample_input:
      "[5, 10, 15, 20], 15",

    sample_output:
      "2",
  },

  {
    id: 102,

    algorithm: "binary",

    title:
      "Find Insertion Position",

    problem_statement:
      "Return the index where target should be inserted in sorted order.",

    sample_input:
      "[5, 10, 15, 20], 12",

    sample_output:
      "2",
  },

  {
    id: 103,

    algorithm: "binary",

    title:
      "Find Lower Bound",

    problem_statement:
      "Return the first valid insertion index of target in sorted array.",

    sample_input:
      "[1,2,2,2,5], 2",

    sample_output:
      "1",
  },
];

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const parseArrayInput = (
  input
) =>
  input
    .split(",")
    .map((item) =>
      item.trim()
    )
    .filter(
      (item) => item !== ""
    )
    .map(Number)
    .filter(
      (num) =>
        !Number.isNaN(num)
    );

export default function SearchingLab() {

  const [searchType, setSearchType] =
    useState("linear");

  const [
    arrayInput,
    setArrayInput,
  ] = useState(
    "10, 20, 30, 40, 50"
  );

  const [target, setTarget] =
    useState("");

  const [array, setArray] =
    useState([]);

  const [message, setMessage] =
    useState(
      "Searching lab initialized."
    );

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

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

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(null);

  const [
    foundIndex,
    setFoundIndex,
  ] = useState(null);

  const [lowIndex, setLowIndex] =
    useState(null);

  const [
    highIndex,
    setHighIndex,
  ] = useState(null);

  const [midIndex, setMidIndex] =
    useState(null);

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const stopRequestedRef =
    useRef(false);

  const targetRef = useRef(null);

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

  const searchNames = {
    linear: "Linear Search",
    binary: "Binary Search",
  };

  const searchMeta = {
    linear: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      sorted: "No",
    },

    binary: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1)",
      sorted: "Yes",
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
                "Searching"
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

  // =========================
  // SEARCHING LOGIC
  // =========================

  const addStep = (text) => {

    setStepHistory(
      (prev) => [
        ...prev,
        text,
      ]
    );
  };

  const loadSample = () => {

    if (isRunning) return;

    if (
      searchType === "linear"
    ) {

      setArrayInput(
        "15, 8, 23, 4, 42, 16, 9"
      );

      setTarget("42");

      setMessage(
        "Loaded sample for Linear Search."
      );

    } else {

      setArrayInput(
        "5, 10, 15, 20, 25, 30, 35"
      );

      setTarget("25");

      setMessage(
        "Loaded sample for Binary Search."
      );
    }

    setArray([]);

    setCurrentIndex(null);

    setFoundIndex(null);

    setLowIndex(null);

    setHighIndex(null);

    setMidIndex(null);

    setStepHistory([]);
  };

  const stopSearch = () => {

    stopRequestedRef.current =
      true;

    setMessage(
      "Stopping search..."
    );

    addStep(
      "Stop requested by user."
    );
  };

  const runSearch =
    async () => {

      if (isRunning) return;

      const parsed =
        parseArrayInput(
          arrayInput
        );

      if (
        parsed.length === 0
      ) {

        setMessage(
          "Please enter valid array."
        );

        return;
      }

      if (
        target.trim() === "" ||
        Number.isNaN(
          Number(target)
        )
      ) {

        setMessage(
          "Please enter valid target."
        );

        return;
      }

      const targetValue =
        Number(target);

      stopRequestedRef.current =
        false;

      setCurrentIndex(null);

      setFoundIndex(null);

      setLowIndex(null);

      setHighIndex(null);

      setMidIndex(null);

      setStepHistory([]);

      setIsRunning(true);

      setExperimentRun(true);

      try {

        if (
          searchType ===
          "linear"
        ) {

          setArray(parsed);

          addStep(
            `Starting Linear Search for ${targetValue}`
          );

          for (
            let i = 0;
            i < parsed.length;
            i++
          ) {

            if (
              stopRequestedRef.current
            ) {
              return;
            }

            setCurrentIndex(i);

            setMessage(
              `Checking index ${i}`
            );

            addStep(
              `Checking element ${parsed[i]}`
            );

            await sleep(
              animationSpeed
            );

            if (
              parsed[i] ===
              targetValue
            ) {

              setFoundIndex(
                i
              );

              setMessage(
                `Target found at index ${i}`
              );

              addStep(
                `Target found at index ${i}`
              );

              break;
            }
          }

        } else {

          const sorted = [
            ...parsed,
          ].sort(
            (a, b) => a - b
          );

          setArray(sorted);

          let low = 0;

          let high =
            sorted.length - 1;

          while (
            low <= high
          ) {

            if (
              stopRequestedRef.current
            ) {
              return;
            }

            const mid =
              Math.floor(
                (low + high) / 2
              );

            setLowIndex(low);

            setHighIndex(high);

            setMidIndex(mid);

            addStep(
              `Checking mid index ${mid}`
            );

            await sleep(
              animationSpeed
            );

            if (
              sorted[mid] ===
              targetValue
            ) {

              setFoundIndex(
                mid
              );

              setMessage(
                `Target found at index ${mid}`
              );

              break;
            }

            if (
              sorted[mid] <
              targetValue
            ) {

              low = mid + 1;

            } else {

              high = mid - 1;
            }
          }
        }

      } finally {

        setIsRunning(false);

        stopRequestedRef.current =
          false;
      }
    };

  const reset = () => {

    if (isRunning) return;

    setArray([]);

    setArrayInput("");

    setTarget("");

    setCurrentIndex(null);

    setFoundIndex(null);

    setLowIndex(null);

    setHighIndex(null);

    setMidIndex(null);

    setStepHistory([]);

    setMessage(
      "Searching lab reset."
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
        searchType ===
        "binary"
          ? binaryProblemBank
          : linearProblemBank;

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
                searchNames[
                  searchType
                ]
              }
            </h1>

            <p className="er-page-subtitle">
              Learn searching
              algorithms visually
              using simulation,
              quiz and coding
              practice.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Search Configuration
              </h2>

              <p>
                Configure search
                algorithm and
                visualize the
                searching process.
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
                    searchNames[
                      searchType
                    ]
                  }
                </strong>

                <span>
                  Complexity:
                  {" "}
                  {
                    searchMeta[
                      searchType
                    ].average
                  }
                  {" "}
                  | Steps:
                  {" "}
                  {
                    stepHistory.length
                  }
                </span>

              </div>
            </div>
          </div>

          <div className="er-config-grid">

            <div>

              <label className="sorting-label">
                Search Type
              </label>

              <select
                value={
                  searchType
                }
                onChange={(
                  e
                ) =>
                  setSearchType(
                    e.target
                      .value
                  )
                }
                className="sorting-select"
                disabled={
                  isRunning
                }
              >

                <option value="linear">
                  Linear Search
                </option>

                <option value="binary">
                  Binary Search
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
                searchMeta[
                  searchType
                ].best
              }
            </button>

            <button className="er-chip active">
              Avg:
              {" "}
              {
                searchMeta[
                  searchType
                ].average
              }
            </button>

            <button className="er-chip active">
              Worst:
              {" "}
              {
                searchMeta[
                  searchType
                ].worst
              }
            </button>

            <button className="er-chip active">
              Sorted:
              {" "}
              {
                searchMeta[
                  searchType
                ].sorted
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
                experimentSlug="searching"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <SearchingOverview
                searchType={
                  searchType
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <SearchingSimulation
                searchType={
                  searchType
                }
                arrayInput={
                  arrayInput
                }
                setArrayInput={
                  setArrayInput
                }
                target={
                  target
                }
                setTarget={
                  setTarget
                }
                runSearch={
                  runSearch
                }
                stopSearch={
                  stopSearch
                }
                reset={reset}
                loadSample={
                  loadSample
                }
                message={
                  message
                }
                array={array}
                currentIndex={
                  currentIndex
                }
                foundIndex={
                  foundIndex
                }
                lowIndex={
                  lowIndex
                }
                highIndex={
                  highIndex
                }
                midIndex={
                  midIndex
                }
                targetRef={
                  targetRef
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

              <SearchingQuiz
                searchType={
                  searchType
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

              <SearchingCoding
                searchType={
                  searchType
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