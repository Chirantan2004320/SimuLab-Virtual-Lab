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
  GitCompare,
} from "lucide-react";

import "./Lab.css";
import "./SortingLab.css";

import SimuLabLogo from "../components/SimuLabLogo";
import MarkCompleteButton from "../components/MarkCompleteButton";

import LinkedListOverview from "./labs/linked-list/LinkedListOverview.jsx";
import LinkedListSimulation from "./labs/linked-list/LinkedListSimulation.jsx";
import LinkedListQuiz from "./labs/linked-list/LinkedListQuiz.jsx";
import LinkedListCoding from "./labs/linked-list/LinkedListCoding.jsx";
import LinkedListComparison from "./labs/linked-list/LinkedListComparison.jsx";

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

const problemBank = {
  singly: [
    {
      id: 1,

      title:
        "Insert at Head",

      problem_statement:
        "Write a function insertAtHead(head, value) that inserts a node at the beginning.",

      sample_input:
        "10 -> 20 -> NULL , value = 5",

      sample_output:
        "5 -> 10 -> 20 -> NULL",
    },

    {
      id: 2,

      title:
        "Insert at Tail",

      problem_statement:
        "Insert a node at the end of a singly linked list.",

      sample_input:
        "10 -> 20 -> NULL , value = 30",

      sample_output:
        "10 -> 20 -> 30 -> NULL",
    },

    {
      id: 3,

      title:
        "Search Node",

      problem_statement:
        "Search whether a value exists in linked list.",

      sample_input:
        "10 -> 20 -> 30 , value = 20",

      sample_output:
        "true",
    },
  ],

  doubly: [
    {
      id: 4,

      title:
        "Insert at Tail",

      problem_statement:
        "Insert a node at tail in doubly linked list.",

      sample_input:
        "10 <-> 20 , value = 30",

      sample_output:
        "10 <-> 20 <-> 30",
    },

    {
      id: 5,

      title:
        "Insert at Head",

      problem_statement:
        "Insert a node at head in doubly linked list.",

      sample_input:
        "20 <-> 30 , value = 10",

      sample_output:
        "10 <-> 20 <-> 30",
    },

    {
      id: 6,

      title:
        "Backward Traversal",

      problem_statement:
        "Traverse a doubly linked list backward.",

      sample_input:
        "10 <-> 20 <-> 30",

      sample_output:
        "[30,20,10]",
    },
  ],
};

export default function LinkedListLab() {

  const [listType,] =
    useState("singly");

  const [nodes, setNodes] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [
    searchValue,
    setSearchValue,
  ] = useState("");

  const [
    highlightedIndex,
    setHighlightedIndex,
  ] = useState(null);

  const [
    scanningIndex,
    setScanningIndex,
  ] = useState(null);

  const [isSearching] =
    useState(false);

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
      "Linked list initialized."
    );

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

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
    setCodingSaveStatus,
  ] = useState({});

  const [
    setCodingAttempted,
  ] = useState(false);

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
                "Linked List"
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

    setNodes([]);

    setInput("");

    setSearchValue("");

    setHighlightedIndex(
      null
    );

    setScanningIndex(
      null
    );

    setMessage(
      "Linked list initialized."
    );

    setExperimentRun(false);

    setQuizSubmitted(false);

    setQuizScore(0);

    setQuizSaveStatus("");

    setResults({});

    setCodingSaveStatus({});

  }, [listType]);

  const progressPercent =
    activeSection ===
    "overview"
      ? 20
      : activeSection ===
        "simulation"
      ? 50
      : activeSection ===
        "comparison"
      ? 65
      : activeSection ===
        "quiz"
      ? 80
      : 95;

  const listModeLabel =
    listType === "doubly"
      ? "Doubly Linked List"
      : "Singly Linked List";

  // =========================
  // LINKED LIST OPERATIONS
  // =========================

  const createNode = (
    value
  ) => ({
    id: `${Date.now()}-${Math.random()}`,
    value,
  });

  const insertHead = () => {

    if (!input.trim()) {

      setMessage(
        "Please enter a value."
      );

      return;
    }

    const newNode =
      createNode(
        input.trim()
      );

    setNodes((prev) => [
      newNode,
      ...prev,
    ]);

    setMessage(
      `Inserted ${input.trim()} at head.`
    );

    setInput("");

    setExperimentRun(true);
  };

  const insertTail = () => {

    if (!input.trim()) {

      setMessage(
        "Please enter a value."
      );

      return;
    }

    const newNode =
      createNode(
        input.trim()
      );

    setNodes((prev) => [
      ...prev,
      newNode,
    ]);

    setMessage(
      `Inserted ${input.trim()} at tail.`
    );

    setInput("");

    setExperimentRun(true);
  };

  const deleteHead = () => {

    if (
      nodes.length === 0
    ) {

      setMessage(
        "Linked list is empty."
      );

      return;
    }

    setNodes((prev) =>
      prev.slice(1)
    );

    setExperimentRun(true);
  };

  const deleteTail = () => {

    if (
      nodes.length === 0
    ) {

      setMessage(
        "Linked list is empty."
      );

      return;
    }

    setNodes((prev) =>
      prev.slice(0, -1)
    );

    setExperimentRun(true);
  };

  const traverseForward =
    () => {

      if (
        nodes.length === 0
      ) {

        setMessage(
          "Linked list is empty."
        );

        return;
      }

      setMessage(
        `Traversal: ${nodes
          .map(
            (n) =>
              n.value
          )
          .join(
            " → "
          )} → NULL`
      );

      setExperimentRun(true);
    };

  const traverseBackward =
    () => {

      if (
        listType !==
        "doubly"
      ) {

        setMessage(
          "Backward traversal available only in doubly linked list."
        );

        return;
      }

      setMessage(
        [...nodes]
          .reverse()
          .map(
            (n) =>
              n.value
          )
          .join(
            " ← "
          )
      );

      setExperimentRun(true);
    };

  const searchNode =
    async () => {

      if (
        !searchValue.trim()
      ) {

        setMessage(
          "Enter value to search."
        );

        return;
      }

      for (
        let i = 0;
        i <
        nodes.length;
        i++
      ) {

        setScanningIndex(i);

        await new Promise(
          (
            resolve
          ) =>
            setTimeout(
              resolve,
              600
            )
        );

        if (
          String(
            nodes[i]
              .value
          ) ===
          searchValue.trim()
        ) {

          setHighlightedIndex(
            i
          );

          setScanningIndex(
            null
          );

          setMessage(
            `Value found at position ${i}.`
          );

          setExperimentRun(
            true
          );

          return;
        }
      }

      setScanningIndex(
        null
      );

      setHighlightedIndex(
        null
      );

      setMessage(
        "Value not found."
      );

      setExperimentRun(true);
    };

  const reset = () => {

    setNodes([]);

    setInput("");

    setSearchValue("");

    setHighlightedIndex(
      null
    );

    setScanningIndex(
      null
    );

    setExperimentRun(false);

    setMessage(
      "Linked list reset."
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
            experimentId: 3,

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

  const getStarterCode = (
    problem,
    language
  ) => {

    if (
      language !==
      "javascript"
    ) {

      return `// ${language.toUpperCase()} starter template`;
    }

    return `function solve() {

  // Write your solution here

}`;
  };

  const generateProblems =
    useCallback(() => {

      const selected =
        problemBank[
          listType
        ];

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

          initialCodes[
            `${problem.id}_javascript`
          ] =
            getStarterCode(
              problem,
              "javascript"
            );
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

    }, [listType]);

  useEffect(() => {

    generateProblems();

  }, [generateProblems]);

  const handleLanguageChange = (
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

    setCodes((prev) => {

      if (prev[key])
        return prev;

      return {
        ...prev,

        [key]:
          getStarterCode(
            problem,
            language
          ),
      };
    });
  };

  const handleCodeChange = (
    problemId,
    language,
    code
  ) => {

    const key = `${problemId}_${language}`;

    setCodes((prev) => ({
      ...prev,
      [key]: code,
    }));
  };

  const runCode =
    async (
      problemId,
      language
    ) => {

      setCodingAttempted(
        true
      );

      setResults(
        (prev) => ({
          ...prev,

          [problemId]:
            "Code executed successfully.",
        })
      );
    };

  const analyzeCode = (
    problemId,
    language
  ) => {

    alert(
      "AI Code Analysis triggered."
    );
  };

  const correctCode = (
    problemId,
    language
  ) => {

    alert(
      "AI Code Correction triggered."
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
                  background: `conic-gradient(
                    #4da8ff ${progressPercent}%,
                    rgba(255,255,255,0.08) ${progressPercent}% 100%
                  )`,
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
              Linked List
            </h1>

            <p className="er-page-subtitle">
              Learn singly and doubly linked lists visually with simulation, quiz and coding practice.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Linked List Configuration
              </h2>

              <p>
                Configure linked list type and operations.
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
                    listModeLabel
                  }
                </strong>

                <span>
                  Current Nodes:
                  {" "}
                  {
                    nodes.length
                  }
                </span>

              </div>
            </div>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              Type = {
                listType
              }
            </button>

            <button className="er-chip active">
              Nodes = {
                nodes.length
              }
            </button>

            <button className="er-chip active">
              Head = {
                nodes.length
                  ? nodes[0]
                      .value
                  : "NULL"
              }
            </button>

            <button className="er-chip active">
              Tail = {
                nodes.length
                  ? nodes[
                      nodes.length -
                        1
                    ].value
                  : "NULL"
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
                experimentSlug="linked-list"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <LinkedListOverview
                listType={
                  listType
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <LinkedListSimulation
                listType={
                  listType
                }
                nodes={nodes}
                input={input}
                setInput={setInput}
                searchValue={
                  searchValue
                }
                setSearchValue={
                  setSearchValue
                }
                insertHead={
                  insertHead
                }
                insertTail={
                  insertTail
                }
                deleteHead={
                  deleteHead
                }
                deleteTail={
                  deleteTail
                }
                traverseForward={
                  traverseForward
                }
                traverseBackward={
                  traverseBackward
                }
                searchNode={
                  searchNode
                }
                reset={reset}
                message={
                  message
                }
                inputRef={
                  inputRef
                }
                highlightedIndex={
                  highlightedIndex
                }
                scanningIndex={
                  scanningIndex
                }
                isSearching={
                  isSearching
                }
              />
            )}

            {activeSection ===
              "comparison" && (
              <LinkedListComparison />
            )}

            {activeSection ===
              "quiz" && (

              <LinkedListQuiz
                listType={
                  listType
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

              <LinkedListCoding
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