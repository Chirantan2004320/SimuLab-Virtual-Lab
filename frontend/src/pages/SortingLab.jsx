/* eslint-disable no-new-func */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import axios from "axios";

import MarkCompleteButton from "../components/MarkCompleteButton";

import {
  BookOpen,
  PlayCircle,
  GitCompare,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu,
} from "lucide-react";

import "./SortingLab.css";

import SortingOverview from "./labs/sorting/SortingOverview";
import SortingSimulation from "./labs/sorting/SortingSimulation";
import SortingQuiz from "./labs/sorting/SortingQuiz";
import SortingCoding from "./labs/sorting/SortingCoding";
import SortingComparison from "./labs/sorting/SortingComparison";

import SimuLabLogo from "../components/SimuLabLogo";

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
    key: "comparison",
    label: "Comparison",
    icon: GitCompare,
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

const problemBank = [
  {
    id: 1,

    algorithm: "bubble",

    title:
      "Implement Bubble Sort",

    problem_statement:
      "Write a function bubbleSort(arr) that sorts the array in ascending order using Bubble Sort.",

    sample_input:
      "[5, 2, 9, 1]",

    sample_output:
      "[1, 2, 5, 9]",
  },

  {
    id: 2,

    algorithm: "selection",

    title:
      "Implement Selection Sort",

    problem_statement:
      "Write a function selectionSort(arr) that sorts the array in ascending order using Selection Sort.",

    sample_input:
      "[64, 25, 12, 22]",

    sample_output:
      "[12, 22, 25, 64]",
  },

  {
    id: 3,

    algorithm: "insertion",

    title:
      "Implement Insertion Sort",

    problem_statement:
      "Write a function insertionSort(arr) that sorts the array using Insertion Sort.",

    sample_input:
      "[12, 11, 13, 5]",

    sample_output:
      "[5, 11, 12, 13]",
  },
];

export default function SortingLab() {

  const [
    selectedAlgorithm,
    setSelectedAlgorithm,
  ] = useState("bubble");

  const [input, setInput] =
    useState("5, 2, 9, 1, 6");

  const [steps, setSteps] =
    useState([]);

  const [idx, setIdx] =
    useState(0);

  const [playing, setPlaying] =
    useState(false);

  const [speed, setSpeed] =
    useState(600);

  const [info, setInfo] =
    useState("");

  const [
    comparisons,
    setComparisons,
  ] = useState(0);

  const [swaps, setSwaps] =
    useState(0);

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

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
  ] = useState({
    bubble: [],
    selection: [],
    insertion: [],
  });

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

  const timer = useRef(null);

  const algorithmNames = {
    bubble: "Bubble Sort",
    selection:
      "Selection Sort",
    insertion:
      "Insertion Sort",
  };

  const algorithmMeta = {
    bubble: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: "Yes",
    },

    selection: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: "No",
    },

    insertion: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: "Yes",
    },
  };

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
              "DSA" &&
            q.experiment ===
              "Sorting"
        );

      const grouped = {
        bubble: [],
        selection: [],
        insertion: [],
      };

      filtered.forEach((q) => {

        const algorithm =
          (
            q.topic ||
            "bubble"
          ).toLowerCase();

        if (
          grouped[
            algorithm
          ]
        ) {

          grouped[
            algorithm
          ].push({
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
          });
        }
      });

      setQuizQuestions(
        grouped
      );

    } catch (error) {

      console.error(error);
    }

  }, []);
  
  useEffect(() => {

    fetchQuizQuestions();

  }, [fetchQuizQuestions]);

  // =========================
  // SORTING LOGIC
  // =========================

  function parseInput(text) {

    return text
      .split(/,|\s+/)
      .map(Number)
      .filter(
        (n) =>
          !isNaN(n)
      );
  }

  function generateSteps(a0) {

    const a = [...a0];

    const s = [];

    let comp = 0;

    let sw = 0;

    s.push({
      array: [...a],
      info:
        "Initial array loaded.",
      comp,
      sw,
    });

    if (
      selectedAlgorithm ===
      "bubble"
    ) {

      for (
        let i = 0;
        i < a.length - 1;
        i++
      ) {

        for (
          let j = 0;
          j <
          a.length -
            i -
            1;
          j++
        ) {

          comp++;

          if (
            a[j] >
            a[j + 1]
          ) {

            [
              a[j],
              a[j + 1],
            ] = [
              a[j + 1],
              a[j],
            ];

            sw++;
          }

          s.push({
            array: [...a],
            info: `Comparing ${a[j]} and ${a[j + 1]}`,
            comp,
            sw,
            j,
          });
        }
      }
    }

    if (
      selectedAlgorithm ===
      "selection"
    ) {

      for (
        let i = 0;
        i < a.length - 1;
        i++
      ) {

        let min = i;

        for (
          let j = i + 1;
          j < a.length;
          j++
        ) {

          comp++;

          if (
            a[j] < a[min]
          ) {
            min = j;
          }

          s.push({
            array: [...a],
            info:
              "Finding minimum element",
            comp,
            sw,
            j,
          });
        }

        [
          a[i],
          a[min],
        ] = [
          a[min],
          a[i],
        ];

        sw++;

        s.push({
          array: [...a],
          info:
            "Swapping minimum element",
          comp,
          sw,
        });
      }
    }

    if (
      selectedAlgorithm ===
      "insertion"
    ) {

      for (
        let i = 1;
        i < a.length;
        i++
      ) {

        let key = a[i];

        let j = i - 1;

        while (
          j >= 0 &&
          a[j] > key
        ) {

          comp++;

          a[j + 1] =
            a[j];

          j--;

          sw++;

          s.push({
            array: [...a],
            info:
              "Shifting element",
            comp,
            sw,
          });
        }

        a[j + 1] =
          key;

        s.push({
          array: [...a],
          info:
            "Inserted key element",
          comp,
          sw,
        });
      }
    }

    return s;
  }

  function start() {

    const a =
      parseInput(input);

    if (a.length < 2)
      return;

    const s =
      generateSteps(a);

    setSteps(s);

    setIdx(0);

    setPlaying(true);

    setInfo(
      s[0]?.info
    );

    setComparisons(
      s[0]?.comp || 0
    );

    setSwaps(
      s[0]?.sw || 0
    );

    setExperimentRun(true);
  }

  function pause() {

    setPlaying(false);

    clearInterval(
      timer.current
    );
  }

  function reset() {

    setPlaying(false);

    clearInterval(
      timer.current
    );

    setSteps([]);

    setIdx(0);

    setInfo("");

    setComparisons(0);

    setSwaps(0);

    setExperimentRun(false);
  }

  function nextStep() {

    if (
      idx <
      steps.length - 1
    ) {

      const next =
        idx + 1;

      setIdx(next);

      setInfo(
        steps[next]
          ?.info
      );

      setComparisons(
        steps[next]
          ?.comp || 0
      );

      setSwaps(
        steps[next]
          ?.sw || 0
      );
    }
  }

  function prevStep() {

    if (idx > 0) {

      const prev =
        idx - 1;

      setIdx(prev);

      setInfo(
        steps[prev]
          ?.info
      );

      setComparisons(
        steps[prev]
          ?.comp || 0
      );

      setSwaps(
        steps[prev]
          ?.sw || 0
      );
    }
  }

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

      quizQuestions[
        selectedAlgorithm
      ]?.forEach(
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
        quizQuestions[
          selectedAlgorithm
        ]?.length || 0
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

      const filtered =
        problemBank.filter(
          (p) =>
            p.algorithm ===
            selectedAlgorithm
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

  // =========================
  // AUTO PLAYER
  // =========================

  useEffect(() => {

    if (
      playing &&
      steps.length > 0
    ) {

      timer.current =
        setInterval(
          () => {

            setIdx(
              (
                prev
              ) => {

                if (
                  prev >=
                  steps.length -
                    1
                ) {

                  clearInterval(
                    timer.current
                  );

                  setPlaying(
                    false
                  );

                  return prev;
                }

                const next =
                  prev +
                  1;

                setInfo(
                  steps[next]
                    ?.info
                );

                setComparisons(
                  steps[next]
                    ?.comp || 0
                );

                setSwaps(
                  steps[next]
                    ?.sw || 0
                );

                return next;
              }
            );
          },
          speed
        );

    } else {

      clearInterval(
        timer.current
      );
    }

    return () =>
      clearInterval(
        timer.current
      );

  }, [
    playing,
    steps,
    speed,
  ]);

  useEffect(() => {

    setQuizAnswers(
      Array(
        quizQuestions[
          selectedAlgorithm
        ]?.length || 0
      ).fill(null)
    );

    setQuizSubmitted(false);

    setQuizScore(0);

  }, [
    selectedAlgorithm,
    quizQuestions,
  ]);

  const current =
    steps[idx] || {};

  const highlight =
    current.j;

  const progressPercent =
    activeSection ===
    "overview"
      ? 20
      : activeSection ===
        "simulation"
      ? 45
      : activeSection ===
        "comparison"
      ? 65
      : activeSection ===
        "quiz"
      ? 82
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
                algorithmNames[
                  selectedAlgorithm
                ]
              }
            </h1>

            <p className="er-page-subtitle">
              Learn sorting
              algorithms visually
              with simulation,
              quiz and coding
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
                Configure sorting
                algorithm and
                observe operations.
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
                      selectedAlgorithm
                    ]
                  }
                </strong>

                <span>
                  Comparisons:
                  {" "}
                  {
                    comparisons
                  }
                  {" "}
                  | Swaps:
                  {" "}
                  {swaps}
                </span>

              </div>
            </div>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              Best:
              {" "}
              {
                algorithmMeta[
                  selectedAlgorithm
                ].best
              }
            </button>

            <button className="er-chip active">
              Avg:
              {" "}
              {
                algorithmMeta[
                  selectedAlgorithm
                ].average
              }
            </button>

            <button className="er-chip active">
              Worst:
              {" "}
              {
                algorithmMeta[
                  selectedAlgorithm
                ].worst
              }
            </button>

            <button className="er-chip active">
              Stable:
              {" "}
              {
                algorithmMeta[
                  selectedAlgorithm
                ].stable
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
                experimentSlug="sorting"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <SortingOverview
                selectedAlgorithm={
                  selectedAlgorithm
                }
                algorithmNames={
                  algorithmNames
                }
                setSelectedAlgorithm={
                  setSelectedAlgorithm
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <SortingSimulation
                selectedAlgorithm={
                  selectedAlgorithm
                }
                input={input}
                setInput={
                  setInput
                }
                start={start}
                pause={pause}
                reset={reset}
                prevStep={
                  prevStep
                }
                nextStep={
                  nextStep
                }
                idx={idx}
                steps={steps}
                comparisons={
                  comparisons
                }
                swaps={swaps}
                current={current}
                highlight={
                  highlight
                }
                info={info}
                speed={speed}
                setSpeed={
                  setSpeed
                }
              />
            )}

            {activeSection ===
              "comparison" && (
              <SortingComparison />
            )}

            {activeSection ===
              "quiz" && (

              <SortingQuiz
                selectedAlgorithm={
                  selectedAlgorithm
                }
                algorithmNames={
                  algorithmNames
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

              <SortingCoding
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