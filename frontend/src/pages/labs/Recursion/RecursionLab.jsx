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

import SimuLabLogo from "../../../components/SimuLabLogo";
import MarkCompleteButton from "../../../components/MarkCompleteButton";

import RecursionOverview from "./RecursionOverview";
import RecursionSimulation from "./RecursionSimulation";
import RecursionQuiz from "./RecursionQuiz";
import RecursionCoding from "./RecursionCoding";

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

const factorialProblemBank =
  [
    {
      id: 1,

      title:
        "Implement factorial(n)",

      problem_statement:
        "Write a recursive function factorial(n) that returns n! using recursion.",

      sample_input:
        "5",

      sample_output:
        "120",
    },

    {
      id: 2,

      title:
        "Factorial Sum",

      problem_statement:
        "Write a recursive function factorialSum(n) that returns 1! + 2! + ... + n!.",

      sample_input:
        "4",

      sample_output:
        "33",
    },

    {
      id: 3,

      title:
        "Recursive Multiplication",

      problem_statement:
        "Implement multiplication using recursive repeated addition.",

      sample_input:
        "3 4",

      sample_output:
        "12",
    },
  ];

const fibonacciProblemBank =
  [
    {
      id: 101,

      title:
        "Implement fibonacci(n)",

      problem_statement:
        "Write a recursive function fibonacci(n) that returns nth Fibonacci number.",

      sample_input:
        "6",

      sample_output:
        "8",
    },

    {
      id: 102,

      title:
        "Fibonacci Sum",

      problem_statement:
        "Return sum of fibonacci numbers from fib(0) to fib(n).",

      sample_input:
        "5",

      sample_output:
        "12",
    },

    {
      id: 103,

      title:
        "Tribonacci",

      problem_statement:
        "Implement recursive tribonacci sequence.",

      sample_input:
        "5",

      sample_output:
        "7",
    },
  ];

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function RecursionLab() {

  const [
    recursionType,
    setRecursionType,
  ] = useState(
    "factorial"
  );

  const [
    inputValue,
    setInputValue,
  ] = useState("4");

  const [
    activeSection,
    setActiveSection,
  ] = useState(
    "overview"
  );

  const [message, setMessage] =
    useState(
      "Recursion visualizer initialized."
    );

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

  const [steps, setSteps] =
    useState([]);

  const [
    activeStepIndex,
    setActiveStepIndex,
  ] = useState(null);

  const [
    finalResult,
    setFinalResult,
  ] = useState(null);

  const [
    callFrames,
    setCallFrames,
  ] = useState([]);

  const [isRunning, setIsRunning] =
    useState(false);

  const [
    animationSpeed,
    setAnimationSpeed,
  ] = useState(700);

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const stopRequestedRef =
    useRef(false);

  const inputRef =
    useRef(null);

  // =========================
  // QUIZ STATES
  // =========================

  const [
    quizQuestions,
    setQuizQuestions,
  ] = useState({
    factorial: [],
    fibonacci: [],
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

  // =========================
  // QUIZ FETCH
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

        const factorial =
          res.data.questions
            .filter(
              (q) =>
                q.lab ===
                  "DSA" &&
                q.experiment ===
                  "Recursion Factorial"
            )
            .map((q) => ({
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

        const fibonacci =
          res.data.questions
            .filter(
              (q) =>
                q.lab ===
                  "DSA" &&
                q.experiment ===
                  "Recursion Fibonacci"
            )
            .map((q) => ({
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

        setQuizQuestions({
          factorial,
          fibonacci,
        });

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    fetchQuizQuestions();

  }, []);

  const currentQuizQuestions =
    quizQuestions[
      recursionType
    ] || [];

  useEffect(() => {

    setQuizAnswers(
      Array(
        currentQuizQuestions.length
      ).fill(null)
    );

    setQuizSubmitted(false);

    setQuizScore(0);

  }, [
    recursionType,
    currentQuizQuestions.length,
  ]);

  const addStep = (
    text,
    level = 0
  ) => {

    setSteps(
      (prev) => [
        ...prev,
        {
          text,
          level,
        },
      ]
    );
  };

  const addCallFrame = (
    label,
    level
  ) => {

    const frameId =
      Date.now() +
      Math.random();

    setCallFrames(
      (prev) => [
        ...prev,
        {
          id: frameId,
          label,
          level,
          status:
            "active",
          returnValue:
            null,
        },
      ]
    );

    return frameId;
  };

  const completeCallFrame =
    (
      id,
      returnValue
    ) => {

      setCallFrames(
        (prev) =>
          prev.map(
            (
              frame
            ) =>
              frame.id ===
              id
                ? {
                    ...frame,
                    status:
                      "returned",
                    returnValue,
                  }
                : frame
          )
      );
    };

  const validateInput =
    () => {

      const n = Number(
        inputValue
      );

      if (
        inputValue.trim() ===
          "" ||
        Number.isNaN(n) ||
        !Number.isInteger(
          n
        ) ||
        n < 0
      ) {

        setMessage(
          "Please enter a valid non-negative integer."
        );

        return null;
      }

      return n;
    };

  const runVisualization =
    async () => {

      if (isRunning)
        return;

      const n =
        validateInput();

      if (n === null)
        return;

      stopRequestedRef.current =
        false;

      setSteps([]);

      setActiveStepIndex(
        null
      );

      setFinalResult(
        null
      );

      setCallFrames([]);

      setIsRunning(true);

      setExperimentRun(true);

      try {

        if (
          recursionType ===
          "factorial"
        ) {

          addStep(
            `Starting factorial(${n}) visualization`
          );

          let stepCounter = 0;

          const factorialTrace =
            async (
              value,
              level = 0
            ) => {

              const frameId =
                addCallFrame(
                  `factorial(${value})`,
                  level
                );

              addStep(
                `Call factorial(${value})`,
                level
              );

              setActiveStepIndex(
                stepCounter++
              );

              await sleep(
                animationSpeed
              );

              if (
                value ===
                  0 ||
                value ===
                  1
              ) {

                addStep(
                  `Base case reached for factorial(${value})`,
                  level
                );

                completeCallFrame(
                  frameId,
                  1
                );

                return 1;
              }

              const child =
                await factorialTrace(
                  value - 1,
                  level +
                    1
                );

              const result =
                value *
                child;

              addStep(
                `Return factorial(${value}) = ${result}`,
                level
              );

              completeCallFrame(
                frameId,
                result
              );

              return result;
            };

          const result =
            await factorialTrace(
              n
            );

          setFinalResult(
            result
          );

          setMessage(
            `factorial(${n}) = ${result}`
          );

        } else {

          addStep(
            `Starting fibonacci(${n}) visualization`
          );

          let stepCounter = 0;

          const fibonacciTrace =
            async (
              value,
              level = 0
            ) => {

              const frameId =
                addCallFrame(
                  `fibonacci(${value})`,
                  level
                );

              addStep(
                `Call fibonacci(${value})`,
                level
              );

              setActiveStepIndex(
                stepCounter++
              );

              await sleep(
                animationSpeed
              );

              if (
                value ===
                0
              ) {

                completeCallFrame(
                  frameId,
                  0
                );

                return 0;
              }

              if (
                value ===
                1
              ) {

                completeCallFrame(
                  frameId,
                  1
                );

                return 1;
              }

              const left =
                await fibonacciTrace(
                  value - 1,
                  level +
                    1
                );

              const right =
                await fibonacciTrace(
                  value - 2,
                  level +
                    1
                );

              const result =
                left +
                right;

              addStep(
                `Return fibonacci(${value}) = ${result}`,
                level
              );

              completeCallFrame(
                frameId,
                result
              );

              return result;
            };

          const result =
            await fibonacciTrace(
              n
            );

          setFinalResult(
            result
          );

          setMessage(
            `fibonacci(${n}) = ${result}`
          );
        }

      } finally {

        setIsRunning(false);
      }
    };

  const reset = () => {

    if (isRunning)
      return;

    setInputValue("");

    setSteps([]);

    setActiveStepIndex(
      null
    );

    setFinalResult(
      null
    );

    setCallFrames([]);

    setMessage(
      "Recursion visualizer reset."
    );

    setExperimentRun(false);
  };

  const loadSample =
    () => {

      if (
        recursionType ===
        "factorial"
      ) {

        setInputValue(
          "4"
        );

      } else {

        setInputValue(
          "5"
        );
      }

      setMessage(
        "Sample loaded."
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

      currentQuizQuestions.forEach(
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
        currentQuizQuestions.length
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
        recursionType ===
        "factorial"
          ? factorialProblemBank
          : fibonacciProblemBank;

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
      ? 50
      : activeSection ===
        "quiz"
      ? 80
      : 95;

  const recursionModeLabel =
    recursionType ===
    "fibonacci"
      ? "Fibonacci Recursion"
      : "Factorial Recursion";

  const complexityLabel =
    recursionType ===
    "fibonacci"
      ? "O(2ⁿ)"
      : "O(n)";

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
                recursionModeLabel
              }
            </h1>

            <p className="er-page-subtitle">
              Visualize recursive
              calls, stack frames,
              base cases, and
              return flow step by
              step.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Recursion Configuration
              </h2>

              <p>
                Select recursion
                type and visualize
                recursive call stack
                execution.
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
                    recursionModeLabel
                  }
                </strong>

                <span>
                  Complexity:
                  {" "}
                  {
                    complexityLabel
                  }
                </span>

              </div>

            </div>
          </div>

          <div className="er-config-grid">

            <div>

              <label className="sorting-label">
                Recursion Type
              </label>

              <select
                value={
                  recursionType
                }
                onChange={(
                  e
                ) =>
                  setRecursionType(
                    e.target
                      .value
                  )
                }
                className="sorting-select"
                disabled={
                  isRunning
                }
              >

                <option value="factorial">
                  Factorial
                </option>

                <option value="fibonacci">
                  Fibonacci
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
              Mode =
              {" "}
              {
                recursionModeLabel
              }
            </button>

            <button className="er-chip active">
              Complexity =
              {" "}
              {
                complexityLabel
              }
            </button>

            <button className="er-chip active">
              Frames =
              {" "}
              {
                callFrames.length
              }
            </button>

            <button className="er-chip active">
              Steps =
              {" "}
              {
                steps.length
              }
            </button>

            <button className="er-chip active">
              Result =
              {" "}
              {finalResult !==
              null
                ? finalResult
                : "Pending"}
            </button>

            <button
              className={`er-chip ${
                experimentRun
                  ? "active"
                  : ""
              }`}
            >
              {experimentRun
                ? "Simulation Run"
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
                experimentSlug="recursion"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <RecursionOverview
                recursionType={
                  recursionType
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <RecursionSimulation
                recursionType={
                  recursionType
                }
                inputValue={
                  inputValue
                }
                setInputValue={
                  setInputValue
                }
                runVisualization={
                  runVisualization
                }
                reset={reset}
                loadSample={
                  loadSample
                }
                message={
                  message
                }
                steps={steps}
                activeStepIndex={
                  activeStepIndex
                }
                finalResult={
                  finalResult
                }
                inputRef={
                  inputRef
                }
                isRunning={
                  isRunning
                }
                callFrames={
                  callFrames
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <RecursionQuiz
                recursionType={
                  recursionType
                }
                quizQuestions={
                  currentQuizQuestions
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

              <RecursionCoding
                recursionType={
                  recursionType
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