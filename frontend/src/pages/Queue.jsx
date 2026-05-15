/* eslint-disable no-new-func */

import React, {
  useEffect,
  useRef,
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

import "./Lab.css";
import "./SortingLab.css";

import SimuLabLogo from "../components/SimuLabLogo";
import MarkCompleteButton from "../components/MarkCompleteButton";

import QueueOverview from "./labs/queue/QueueOverview";
import QueueSimulation from "./labs/queue/QueueSimulation";
import QueueQuiz from "./labs/queue/QueueQuiz";
import QueueCoding from "./labs/queue/QueueCoding";

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

const codingProblemBank = {
  normal: [
    {
      id: 1,

      title:
        "Implement enqueue(arr, value, maxSize)",

      problem_statement:
        "Write a function enqueue(arr, value, maxSize) that inserts value into queue if space exists.",

      sample_input:
        "[10,20], 30, 5",

      sample_output:
        "[10,20,30]",
    },

    {
      id: 2,

      title:
        "Implement dequeue(arr)",

      problem_statement:
        "Write a function dequeue(arr) that removes front element.",

      sample_input:
        "[10,20,30]",

      sample_output:
        "[20,30]",
    },

    {
      id: 3,

      title:
        "Implement peek(arr)",

      problem_statement:
        "Return front element without removing.",

      sample_input:
        "[10,20,30]",

      sample_output:
        "10",
    },
  ],

  circular: [
    {
      id: 4,

      title:
        "Implement circularEnqueue",

      problem_statement:
        "Insert element into circular queue using modulo arithmetic.",

      sample_input:
        "[10,20,null], rear=1",

      sample_output:
        "[10,20,30]",
    },

    {
      id: 5,

      title:
        "Implement circularDequeue",

      problem_statement:
        "Remove front element from circular queue.",

      sample_input:
        "[10,20,30]",

      sample_output:
        "[20,30]",
    },

    {
      id: 6,

      title:
        "Implement circularPeek",

      problem_statement:
        "Return front value of circular queue.",

      sample_input:
        "[10,20,30]",

      sample_output:
        "10",
    },
  ],
};

const queueCodeTemplates = {
  normal: {
    javascript: `function enqueue(arr, value, maxSize) {

  if(arr.length >= maxSize)
    return "Overflow";

  arr.push(value);

  return arr;
}`,
  },

  circular: {
    javascript: `function circularEnqueue(arr, rear, count, value, maxSize) {

  if(count >= maxSize)
    return "Overflow";

  rear = (rear + 1) % maxSize;

  arr[rear] = value;

  count++;

  return {
    arr,
    rear,
    count
  };
}`,
  },
};

export default function QueueLab() {

  const [queueType] =
    useState("normal");

  const [queueSize] =
    useState(8);

  const [queue, setQueue] =
    useState([]);

  const [
    circularQueue,
    setCircularQueue,
  ] = useState(
    new Array(8).fill(null)
  );

  const [front, setFront] =
    useState(-1);

  const [rear, setRear] =
    useState(-1);

  const [count, setCount] =
    useState(0);

  const [input, setInput] =
    useState("");

  const [log, setLog] =
    useState([
      "Queue initialized.",
    ]);

  const [warning, setWarning] =
    useState("");

  const [animating] =
    useState(false);

  const [
    animDuration,
    setAnimDuration,
  ] = useState(400);

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

  const [
    traversalActiveIndex,
  ] = useState(null);

  const inputRef = useRef();

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
                "Queue"
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

  const visibleSize =
    queueType === "normal"
      ? queue.length
      : count;

  const displayQueue =
    queueType === "normal"
      ? queue.map(
          (
            item,
            index
          ) => ({
            value: item,

            isFront:
              index === 0,

            isRear:
              index ===
              queue.length - 1,
          })
        )
      : circularQueue.map(
          (
            item,
            index
          ) => ({
            value: item,

            isFront:
              index === front,

            isRear:
              index === rear,
          })
        );

  // =========================
  // QUEUE OPERATIONS
  // =========================

  const enqueue = () => {

    if (!input.trim()) {

      setWarning(
        "Please enter a value."
      );

      return;
    }

    if (
      queueType === "normal"
    ) {

      if (
        queue.length >=
        queueSize
      ) {

        setWarning(
          "Queue Overflow"
        );

        return;
      }

      setQueue((prev) => [
        ...prev,
        input,
      ]);

    } else {

      if (
        count >= queueSize
      ) {

        setWarning(
          "Circular Queue Overflow"
        );

        return;
      }

      const updated = [
        ...circularQueue,
      ];

      let newFront =
        front;

      let newRear =
        rear;

      if (count === 0) {

        newFront = 0;
        newRear = 0;

      } else {

        newRear =
          (rear + 1) %
          queueSize;
      }

      updated[newRear] =
        input;

      setCircularQueue(
        updated
      );

      setFront(newFront);

      setRear(newRear);

      setCount(
        (prev) =>
          prev + 1
      );
    }

    setInput("");

    setExperimentRun(true);
  };

  const dequeue = () => {

    if (
      queueType === "normal"
    ) {

      if (
        queue.length === 0
      ) {

        setWarning(
          "Queue Underflow"
        );

        return;
      }

      setQueue((prev) =>
        prev.slice(1)
      );

    } else {

      if (
        count === 0
      ) {

        setWarning(
          "Circular Queue Underflow"
        );

        return;
      }

      const updated = [
        ...circularQueue,
      ];

      updated[front] =
        null;

      if (count === 1) {

        setFront(-1);

        setRear(-1);

      } else {

        setFront(
          (prev) =>
            (prev + 1) %
            queueSize
        );
      }

      setCircularQueue(
        updated
      );

      setCount(
        (prev) =>
          prev - 1
      );
    }

    setExperimentRun(true);
  };

  const peekFront = () => {

    setExperimentRun(true);
  };

  const traverseQueue = () => {

    setExperimentRun(true);
  };

  const clearLog = () => {

    setLog([
      "Log cleared.",
    ]);
  };

  const reset = () => {

    setQueue([]);

    setCircularQueue(
      new Array(
        queueSize
      ).fill(null)
    );

    setFront(-1);

    setRear(-1);

    setCount(0);

    setInput("");

    setExperimentRun(false);
  };

  const handleSpeedChange = (
    e
  ) => {

    setAnimDuration(
      Number(
        e.target.value
      )
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
        "Saving quiz result..."
      );

      try {

        await axios.post(
          `${API_BASE_URL}/api/student/submit-quiz`,
          {
            experimentId: 2,

            answers:
              quizAnswers.map(
                (
                  answer,
                  index
                ) => ({
                  questionId:
                    quizQuestions[
                      index
                    ].id,

                  selectedAnswer:
                    quizQuestions[
                      index
                    ].options[
                      answer
                    ],
                })
              ),
          },
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem(
                  "token"
                )}`,
            },
          }
        );

        setQuizSaveStatus(
          "Quiz result saved successfully."
        );

      } catch (error) {

        console.error(error);

        setQuizSaveStatus(
          "Quiz submitted but backend save failed."
        );
      }
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

  const generateProblems = useCallback(() => {

      const selected =
        queueType ===
        "circular"
          ? codingProblemBank.circular
          : codingProblemBank.normal;

      const initialLanguages =
        {};

      const initialCodes =
        {};

      selected.forEach(
        (problem) => {

          initialLanguages[
            problem.id
          ] = "javascript";

          initialCodes[
            `${problem.id}_javascript`
          ] =
            queueCodeTemplates[
              queueType
            ].javascript;
        }
      );

      setCurrentProblems(
        selected
      );

      setSelectedLanguages(
        initialLanguages
      );

      setCodes(initialCodes);

      setResults({});

      setCodingSaveStatus(
        {}
      );
    }, [queueType]);

  useEffect(() => {
  fetchQuizQuestions();
  generateProblems();
}, [generateProblems]);

  const handleLanguageChange =
    (
      problemId,
      language
    ) => {

      const key =
        `${problemId}_${language}`;

      setSelectedLanguages(
        (prev) => ({
          ...prev,
          [problemId]:
            language,
        })
      );

      setCodes((prev) => ({
        ...prev,

        [key]:
          prev[key] ||
          queueCodeTemplates[
            queueType
          ].javascript,
      }));
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

  const runCode = (
    problemId,
    language
  ) => {

    const key =
      `${problemId}_${language}`;

    const code =
      codes[key];

    try {

      new Function(code)();

      setResults(
        (prev) => ({
          ...prev,

          [problemId]: {
            verdict:
              "success",

            message:
              "Code executed successfully.",
          },
        })
      );

    } catch (error) {

      setResults(
        (prev) => ({
          ...prev,

          [problemId]: {
            verdict:
              "failed",

            message:
              error.message,
          },
        })
      );
    }
  };

  const analyzeCode = () => {

    alert(
      "AI analysis integration coming soon."
    );
  };

  const correctCode = () => {

    alert(
      "AI correction integration coming soon."
    );
  };

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
                (prev) =>
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
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`,
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
              Queue
            </h1>

            <p className="er-page-subtitle">
              Learn Queue and Circular Queue visually with simulation, quiz and coding practice.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Queue Configuration
              </h2>

              <p>
                Configure queue type and capacity.
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
                  {queueType ===
                  "circular"
                    ? "Circular Queue"
                    : "Normal Queue"}
                </strong>

                <span>
                  Current Size:
                  {" "}
                  {
                    visibleSize
                  }
                  /
                  {
                    queueSize
                  }
                </span>

              </div>
            </div>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              FIFO
            </button>

            <button className="er-chip active">
              Enqueue O(1)
            </button>

            <button className="er-chip active">
              Dequeue O(1)
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
                experimentSlug="queue"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <QueueOverview
                queueType={
                  queueType
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <QueueSimulation
                queueType={
                  queueType
                }
                queue={
                  queue
                }
                displayQueue={
                  displayQueue
                }
                front={
                  front
                }
                rear={
                  rear
                }
                count={
                  count
                }
                input={
                  input
                }
                setInput={
                  setInput
                }
                log={log}
                warning={
                  warning
                }
                animating={
                  animating
                }
                animDuration={
                  animDuration
                }
                handleSpeedChange={
                  handleSpeedChange
                }
                enqueue={
                  enqueue
                }
                dequeue={
                  dequeue
                }
                peekFront={
                  peekFront
                }
                traverseQueue={
                  traverseQueue
                }
                clearLog={
                  clearLog
                }
                reset={
                  reset
                }
                QUEUE_SIZE={
                  queueSize
                }
                inputRef={
                  inputRef
                }
                traversalActiveIndex={
                  traversalActiveIndex
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <QueueQuiz
                queueType={
                  queueType
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

              <QueueCoding
                currentProblems={
                  currentProblems
                }
                selectedLanguages={
                  selectedLanguages
                }
                codes={codes}
                results={
                  results
                }
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