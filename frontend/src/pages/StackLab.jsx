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

import "./SortingLab.css";
import "./Lab.css";

import SimuLabLogo from "../components/SimuLabLogo";
import MarkCompleteButton from "../components/MarkCompleteButton";

import StackOverview from "./labs/stack/StackOverview.jsx";
import StackSimulation from "./labs/stack/StackSimulation.jsx";
import StackQuiz from "./labs/stack/StackQuiz.jsx";
import StackCoding from "./labs/stack/StackCoding.jsx";

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

export default function StackLab() {
  const [stack, setStack] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [message, setMessage] =
    useState(
      "Stack initialized. Ready to begin."
    );

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

  const [maxSize,] =
    useState(5);

  const [
    lastOperation,
    setLastOperation,
  ] = useState(
    "Not started"
  );

  const [
    highlightedIndex,
    setHighlightedIndex,
  ] = useState(null);

  // QUIZ STATES

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

  // CODING STATES

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

  // const [
  //   setCodingAttempted,
  // ] = useState(false);

  const inputRef = useRef(null);

  /*
========================================
FETCH QUIZ QUESTIONS
========================================
*/

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
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const filtered =
          res.data.questions.filter(
            (q) =>
              q.lab ===
                "DSA" &&
              q.experiment ===
                "Stack"
          );

    console.log(filtered);

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

  /*
========================================
FETCH CODING QUESTIONS
========================================
*/

  const fetchCodingQuestions =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(
            `${API_BASE_URL}/api/student/coding`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const filtered =
          res.data.questions.filter(
            (q) =>
              q.lab ===
                "DSA" &&
              q.experiment ===
                "Stack"
          );

        setCurrentProblems(
          filtered
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchQuizQuestions();

    fetchCodingQuestions();
  }, []);

  /*
========================================
STACK OPERATIONS
========================================
*/

  const persistRun = () => {
    setExperimentRun(true);
  };

  const pushElement = () => {
    const value =
      input.trim();

    if (!value) {
      setMessage(
        "Please enter a value before pushing."
      );

      return;
    }

    if (
      stack.length >= maxSize
    ) {
      setMessage(
        `Stack Overflow! Maximum size is ${maxSize}.`
      );

      setLastOperation(
        "Overflow"
      );

      persistRun();

      return;
    }

    const newStack = [
      ...stack,
      value,
    ];

    setStack(newStack);

    setMessage(
      `Pushed ${value} onto the stack.`
    );

    setLastOperation(
      `Push(${value})`
    );

    setHighlightedIndex(
      newStack.length - 1
    );

    setInput("");

    persistRun();
  };

  const popElement = () => {
    if (
      stack.length === 0
    ) {
      setMessage(
        "Stack Underflow!"
      );

      setLastOperation(
        "Underflow"
      );

      persistRun();

      return;
    }

    const removed =
      stack[
        stack.length - 1
      ];

    const newStack =
      stack.slice(0, -1);

    setStack(newStack);

    setMessage(
      `Popped ${removed}`
    );

    setLastOperation(
      `Pop()`
    );

    persistRun();
  };

  const peekElement = () => {
    if (
      stack.length === 0
    ) {
      setMessage(
        "Stack is empty."
      );

      return;
    }

    setMessage(
      `Top element is ${
        stack[
          stack.length - 1
        ]
      }`
    );

    persistRun();
  };

  const checkIsEmpty =
    () => {
      setMessage(
        stack.length === 0
          ? "Stack is empty."
          : "Stack is not empty."
      );

      persistRun();
    };

  const showSize = () => {
    setMessage(
      `Current stack size is ${stack.length}`
    );

    persistRun();
  };

  const reset = () => {
    setStack([]);

    setInput("");

    setMessage(
      "Stack reset."
    );

    setExperimentRun(
      false
    );

    setHighlightedIndex(
      null
    );
  };

  /*
========================================
QUIZ
========================================
*/

  const handleQuizAnswer =
    (index, answer) => {
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

      quizQuestions.forEach((q, i) => {
        const selectedOption =
          q.options?.[quizAnswers[i]];

        if (
            selectedOption ===
            q.correct_answer
        ) {
            score++;
          }
        });

      setQuizScore(score);

      setQuizSubmitted(
        true
      );

      setQuizSaveStatus(
        "Saving quiz result..."
      );

      try {
        await axios.post(
          `${API_BASE_URL}/api/student/submit-quiz`,
          {
            experimentId: 1,

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
              Authorization: `Bearer ${localStorage.getItem(
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

    setQuizSubmitted(
      false
    );

    setQuizScore(0);

    setQuizSaveStatus("");
  };

  /*
========================================
CODING
========================================
*/

  const generateProblems =
    () => {
      const shuffled = [
        ...currentProblems,
      ].sort(
        () => 0.5 - Math.random()
      );

      const selected =
        shuffled.slice(0, 3);

      const initialLanguages =
        {};

      const initialCodes =
        {};

      selected.forEach(
        (problem) => {
          initialLanguages[
            problem.id
          ] =
            "javascript";

          initialCodes[`${problem.id}_javascript`] =
  problem.starter_code ||
   `function solve() {

  // Write your code here

}

solve();`;
        }
      );

      setCurrentProblems(
        selected
      );

      setSelectedLanguages(
        initialLanguages
      );

      setCodes(
        initialCodes
      );

      setResults({});

      setCodingSaveStatus(
        {}
      );
    };

  const handleLanguageChange =
  (
    problemId,
    language,
    problem
  ) => {
    const key = `${problemId}_${language}`;

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
        problem.starter_code ||
`function solve() {

  // Write your code here

}

solve();`,
    }));
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

  const runCode = async (
  problemId,
  language
) => {
  try {

    const problem =
      currentProblems.find(
        (p) =>
          p.id === problemId
      );

    if (!problem) {
      return;
    }

    const codeKey =
      `${problemId}_${language}`;

    const code =
      codes[codeKey];

    const token =
      localStorage.getItem(
        "token"
      );

    console.log("RUNNING CODE");

    const res =
      await axios.post(
        `${API_BASE_URL}/api/student/run-code`,
        {
          questionId:
            problem.id,

          language,

          code,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "BACKEND RESPONSE:",
      res.data
    );

    setResults(
      (prev) => ({
        ...prev,

        [problemId]:
          res.data,
      })
    );

    setCodingSaveStatus(
      (prev) => ({
        ...prev,

        [problemId]:
          "Submission saved successfully",
      })
    );

  } catch (error) {

    console.error(
      "RUN CODE ERROR:",
      error
    );

    setResults(
      (prev) => ({
        ...prev,

        [problemId]: {
          verdict:
            "failed",

          passedTests: 0,

          totalTests: 0,

          points: 0,

          results: [],

          message:
            error.response?.data?.message ||
            "Execution failed",
        },
      })
    );
  }
};


  const analyzeCode = (
    problemId,
    language
  ) => {
    alert(
      "AI analysis integration next."
    );
  };

  const correctCode = (
    problemId,
    language
  ) => {
    alert(
      "AI correction integration next."
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
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`,
                }}
              >
                <div className="er-progress-inner">
                  <div className="er-progress-value">
                    {
                      progressPercent
                    }
                    %
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
              Stack
            </h1>

            <p className="er-page-subtitle">
              Learn stack
              operations visually
              with simulation,
              quizzes, and coding
              practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>
                Stack
                Configuration
              </h2>

              <p>
                Observe LIFO
                stack behavior
                in real time.
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
                  LIFO Stack
                </strong>

                <span>
                  Current
                  size:{" "}
                  {
                    stack.length
                  }
                  /
                  {
                    maxSize
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              Principle =
              LIFO
            </button>

            <button className="er-chip active">
              Size ={" "}
              {
                stack.length
              }
              /
              {maxSize}
            </button>

            <button className="er-chip active">
              Push/Pop =
              O(1)
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
  <div style={{ marginTop: 18 }}>
    <MarkCompleteButton
      labSlug="dsa"
      experimentSlug="stack"
      points={10}
      onComplete={() => {
        window.dispatchEvent(
          new Event(
            "progress-updated"
          )
        );
      }}
    />
  </div>
)}
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection ===
              "overview" && (
              <StackOverview />
            )}

            {activeSection ===
              "simulation" && (
              <StackSimulation
                stack={
                  stack
                }
                input={
                  input
                }
                setInput={
                  setInput
                }
                pushElement={
                  pushElement
                }
                popElement={
                  popElement
                }
                peekElement={
                  peekElement
                }
                checkIsEmpty={
                  checkIsEmpty
                }
                showSize={
                  showSize
                }
                reset={
                  reset
                }
                message={
                  message
                }
                inputRef={
                  inputRef
                }
                maxSize={
                  maxSize
                }
                highlightedIndex={
                  highlightedIndex
                }
                lastOperation={
                  lastOperation
                }
              />
            )}

            {activeSection ===
              "quiz" && (
              <StackQuiz
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
              <StackCoding
                currentProblems={
                  currentProblems
                }
                selectedLanguages={
                  selectedLanguages
                }
                codes={
                  codes
                }
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