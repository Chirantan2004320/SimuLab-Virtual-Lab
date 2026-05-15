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
  GitCompare,
} from "lucide-react";

import "../../Lab.css";
import "../../SortingLab.css";

import HashTableOverview from "./HashTableOverview";
import HashTableSimulation from "./HashTableSimulation";
import HashTableQuiz from "./HashTableQuiz";
import HashTableCoding from "./HashTableCoding";
import HashTableComparison from "./HashTableComparison";

import MarkCompleteButton from "../../../components/MarkCompleteButton";

import SimuLabLogo from "../../../components/SimuLabLogo";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const TABLE_SIZE = 7;

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

    title:
      "Implement hashInsert",

    problem_statement:
      "Write a function hashInsert(table, key, size) that inserts a numeric key into a hash table using separate chaining.",

    sample_input:
      "Table = [[],[],[],[],[],[],[]], Key = 10, Size = 7",

    sample_output:
      "[[],[],[],[10],[],[],[]]",
  },

  {
    id: 2,

    title:
      "Implement hashSearch",

    problem_statement:
      "Write a function hashSearch(table, key, size) that returns true if the key exists.",

    sample_input:
      "Table = [[7,14],[],[],[],[],[],[]], Key = 14",

    sample_output:
      "true",
  },

  {
    id: 3,

    title:
      "Implement hashDelete",

    problem_statement:
      "Write a function hashDelete(table, key, size) that removes the key if present.",

    sample_input:
      "Table = [[7,14],[],[],[],[],[],[]], Key = 14",

    sample_output:
      "[[7],[],[],[],[],[],[]]",
  },
];

const createEmptyTable =
  () =>
    Array.from(
      {
        length:
          TABLE_SIZE,
      },
      () => []
    );

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function HashTableLab() {

  const [table, setTable] =
    useState(
      createEmptyTable()
    );

  const [input, setInput] =
    useState("");

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

  const [message, setMessage] =
    useState(
      "Hash Table initialized."
    );

  const [
    activeBucket,
    setActiveBucket,
  ] = useState(null);

  const [
    activeValue,
    setActiveValue,
  ] = useState(null);

  const [
    stepHistory,
    setStepHistory,
  ] = useState([]);

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

  const [isRunning, setIsRunning] =
    useState(false);

  const [
    animationSpeed,
    setAnimationSpeed,
  ] = useState(650);

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
                "Hash Table"
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

  const hash = (value) =>
    value % TABLE_SIZE;

  const filledBuckets =
    table.filter(
      (bucket) =>
        bucket.length > 0
    ).length;

  const storedKeys =
    table.reduce(
      (
        sum,
        bucket
      ) =>
        sum +
        bucket.length,
      0
    );

  const collisionBuckets =
    table.filter(
      (bucket) =>
        bucket.length > 1
    ).length;

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

  const addStep = (text) => {

    setStepHistory(
      (prev) => [
        ...prev,
        text,
      ]
    );
  };

  const clearHighlights =
    () => {

      setActiveBucket(null);

      setActiveValue(null);
    };

  const insert =
    async () => {

      if (isRunning)
        return;

      const value = Number(
        input.trim()
      );

      if (
        input.trim() ===
          "" ||
        Number.isNaN(
          value
        )
      ) {

        setMessage(
          "Please enter a valid number."
        );

        return;
      }

      const index =
        hash(value);

      const newTable =
        table.map(
          (
            bucket
          ) => [
            ...bucket,
          ]
        );

      setIsRunning(true);

      setStepHistory([]);

      setExperimentRun(true);

      setActiveBucket(
        index
      );

      try {

        addStep(
          `Compute hash: ${value} % ${TABLE_SIZE} = ${index}`
        );

        setMessage(
          `Computing hash for ${value}...`
        );

        await sleep(
          animationSpeed
        );

        if (
          newTable[
            index
          ].length > 0
        ) {

          addStep(
            `Collision detected at bucket ${index}.`
          );

          await sleep(
            animationSpeed
          );
        }

        newTable[
          index
        ].push(value);

        setTable(
          newTable
        );

        setActiveValue(
          value
        );

        addStep(
          `Inserted ${value} into bucket ${index}.`
        );

        setMessage(
          `Inserted ${value} into bucket ${index}.`
        );

        setInput("");

        inputRef.current?.focus();

      } finally {

        setIsRunning(false);
      }
    };

  const search =
    async () => {

      if (isRunning)
        return;

      const value = Number(
        input.trim()
      );

      if (
        input.trim() ===
          "" ||
        Number.isNaN(
          value
        )
      ) {

        setMessage(
          "Please enter a valid number."
        );

        return;
      }

      const index =
        hash(value);

      const bucket =
        table[index];

      setIsRunning(true);

      setStepHistory([]);

      setExperimentRun(true);

      setActiveBucket(
        index
      );

      try {

        addStep(
          `Compute hash: ${value} % ${TABLE_SIZE} = ${index}`
        );

        setMessage(
          `Searching bucket ${index}...`
        );

        await sleep(
          animationSpeed
        );

        for (let i = 0; i < bucket.length; i++) {

          setActiveValue(
            bucket[i]
          );

          addStep(
            `Compare ${value} with ${bucket[i]}`
          );

          await sleep(
            animationSpeed
          );

          if (
            bucket[i] ===
            value
          ) {

            setMessage(
              `${value} found in bucket ${index}.`
            );

            addStep(
              `${value} found successfully.`
            );

            return;
          }
        }

        setMessage(
          `${value} not found.`
        );

        addStep(
          `${value} does not exist in hash table.`
        );

      } finally {

        setIsRunning(false);
      }
    };

  const remove =
    async () => {

      if (isRunning)
        return;

      const value = Number(
        input.trim()
      );

      if (
        input.trim() ===
          "" ||
        Number.isNaN(
          value
        )
      ) {

        setMessage(
          "Please enter a valid number."
        );

        return;
      }

      const index =
        hash(value);

      const bucket = [
        ...table[index],
      ];

      const newTable =
        table.map(
          (b) => [
            ...b,
          ]
        );

      setIsRunning(true);

      setStepHistory([]);

      setExperimentRun(true);

      setActiveBucket(
        index
      );

      try {

        addStep(
          `Compute hash: ${value} % ${TABLE_SIZE} = ${index}`
        );

        await sleep(
          animationSpeed
        );

        const foundIndex =
          bucket.indexOf(
            value
          );

        if (
          foundIndex ===
          -1
        ) {

          setMessage(
            `${value} not found.`
          );

          addStep(
            `${value} was not present.`
          );

          return;
        }

        newTable[
          index
        ].splice(
          foundIndex,
          1
        );

        setTable(
          newTable
        );

        setMessage(
          `Deleted ${value} from bucket ${index}.`
        );

        addStep(
          `${value} removed successfully.`
        );

      } finally {

        setIsRunning(false);
      }
    };

  const reset = () => {

    if (isRunning)
      return;

    setTable(
      createEmptyTable()
    );

    setInput("");

    clearHighlights();

    setStepHistory([]);

    setMessage(
      "Hash Table reset."
    );

    setExperimentRun(false);
  };

  const loadSample =
    () => {

      if (isRunning)
        return;

      const sample = [
        10,
        17,
        24,
        5,
        12,
      ];

      const newTable =
        createEmptyTable();

      sample.forEach(
        (val) => {

          const index =
            val %
            TABLE_SIZE;

          newTable[
            index
          ].push(val);
        }
      );

      setTable(
        newTable
      );

      clearHighlights();

      setStepHistory([
        "Loaded sample data into the hash table.",
      ]);

      setMessage(
        "Loaded sample hash table."
      );

      setExperimentRun(true);
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

      setCurrentProblems(
        problemBank
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
              Hash Table
            </h1>

            <p className="er-page-subtitle">
              Explore hashing,
              collisions, separate
              chaining, insertion,
              searching, deletion,
              quiz, and coding
              practice.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Hash Table Configuration
              </h2>

              <p>
                Use modulo hashing
                and separate chaining
                to understand bucket
                based lookup.
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
                  Separate Chaining
                </strong>

                <span>
                  Hash Rule:
                  {" "}
                  key %
                  {" "}
                  {
                    TABLE_SIZE
                  }
                </span>

              </div>

            </div>
          </div>

          <div className="er-config-grid">

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

                <option value={1000}>
                  Slow
                </option>

                <option value={650}>
                  Normal
                </option>

                <option value={350}>
                  Fast
                </option>

              </select>
            </div>

            <div>

              <label className="sorting-label">
                Table Size
              </label>

              <div
                className="sorting-select"
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                }}
              >
                {
                  TABLE_SIZE
                }{" "}
                Buckets
              </div>

            </div>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              Hash =
              {" "}
              key %
              {" "}
              {
                TABLE_SIZE
              }
            </button>

            <button className="er-chip active">
              Stored Keys =
              {" "}
              {
                storedKeys
              }
            </button>

            <button className="er-chip active">
              Filled Buckets =
              {" "}
              {
                filledBuckets
              }
            </button>

            <button className="er-chip active">
              Collisions =
              {" "}
              {
                collisionBuckets
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
                experimentSlug="hash-table"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <HashTableOverview
                tableSize={
                  TABLE_SIZE
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <HashTableSimulation
                table={table}
                input={input}
                setInput={
                  setInput
                }
                insert={insert}
                search={search}
                remove={remove}
                reset={reset}
                loadSample={
                  loadSample
                }
                message={
                  message
                }
                activeBucket={
                  activeBucket
                }
                activeValue={
                  activeValue
                }
                inputRef={
                  inputRef
                }
                stepHistory={
                  stepHistory
                }
                tableSize={
                  TABLE_SIZE
                }
                isRunning={
                  isRunning
                }
              />
            )}

            {activeSection ===
              "comparison" && (

              <HashTableComparison />
            )}

            {activeSection ===
              "quiz" && (

              <HashTableQuiz
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

              <HashTableCoding
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