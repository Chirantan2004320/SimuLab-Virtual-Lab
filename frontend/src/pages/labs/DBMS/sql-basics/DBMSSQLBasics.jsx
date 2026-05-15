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
  Database,
} from "lucide-react";

import "../../../SortingLab.css";

import SimuLabLogo from "../../../../components/SimuLabLogo";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import DBMSSQLBasicsOverview from "./SQLBasicsOverview.jsx";
import DBMSSQLBasicsSimulation from "./SQLBasicsSimulation.jsx";
import DBMSSQLBasicsQuiz from "./SQLBasicsQuiz.jsx";
import DBMSSQLBasicsCoding from "./SQLBasicsCoding.jsx";

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

const queryModes = {
  "select-where-order-limit": {
    title:
      "SELECT Pipeline",

    type:
      "Query Processing",

    best:
      "O(n)",

    average:
      "O(n log n)",

    worst:
      "O(n²)",

    space:
      "O(n)",

    difficulty:
      "Intermediate",

    status:
      "Interactive",

    icon:
      Database,

    glow:
      "rgba(77,168,255,0.35)",
  },
};

const sampleTable = [
  {
    id: 1,
    name: "Aarav",
    department: "CSE",
    age: 20,
    marks: 82,
  },

  {
    id: 2,
    name: "Diya",
    department: "ECE",
    age: 21,
    marks: 91,
  },

  {
    id: 3,
    name: "Kabir",
    department: "CSE",
    age: 19,
    marks: 76,
  },

  {
    id: 4,
    name: "Meera",
    department: "ME",
    age: 22,
    marks: 88,
  },

  {
    id: 5,
    name: "Rohan",
    department: "CSE",
    age: 20,
    marks: 95,
  },

  {
    id: 6,
    name: "Ishita",
    department: "ECE",
    age: 19,
    marks: 84,
  },
];

const allColumns = [
  "id",
  "name",
  "department",
  "age",
  "marks",
];


//eslint-disable-next-line
const advancedSQLProblems = [
  {
    id: 1,

    title:
      "Department Wise Topper Analysis",

    difficulty:
      "Hard",

    problem_statement:
      "Write an SQL query to display the highest scoring student from each department using GROUP BY, MAX and JOIN logic.",

    sample_input:
      "Students table",

    sample_output:
      "Topper from every department",
  },

  {
    id: 2,

    title:
      "Second Highest Salary Query",

    difficulty:
      "Hard",

    problem_statement:
      "Write an SQL query to find the second highest salary from an Employees table without using LIMIT.",

    sample_input:
      "Employees table",

    sample_output:
      "Second highest salary",
  },

  {
    id: 3,

    title:
      "Customers Without Orders",

    difficulty:
      "Hard",

    problem_statement:
      "Write an SQL query using LEFT JOIN to display customers who have never placed an order.",

    sample_input:
      "Customers and Orders tables",

    sample_output:
      "Customers without orders",
  },

  {
    id: 4,

    title:
      "Nth Highest Marks Query",

    difficulty:
      "Hard",

    problem_statement:
      "Write an SQL query to find the 3rd highest marks scored by students using nested subqueries.",

    sample_input:
      "Students table",

    sample_output:
      "3rd highest marks",
  },
];

function projectColumns(
  rows,
  columns
) {

  return rows.map(
    (row) => {

      const projected = {};

      columns.forEach(
        (col) => {

          projected[col] =
            row[col];
        }
      );

      return projected;
    }
  );
}

export default function DBMSSQLBasicsLab() {

  const [queryType] =
    useState(
      "select-where-order-limit"
    );

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState(
    "DBMS SQL Basics lab initialized."
  );

  const [
    experimentRun,
    setExperimentRun,
  ] = useState(false);

  const [
    isRunning,
    setIsRunning,
  ] = useState(false);

  const [
    animationSpeed,
    setAnimationSpeed,
  ] = useState(700);

  const [
    stepHistory,
    setStepHistory,
  ] = useState([]);

  const [
    selectedColumns,
    setSelectedColumns,
  ] = useState([
    "name",
    "department",
    "marks",
  ]);

  const [
    whereColumn,
    setWhereColumn,
  ] = useState(
    "department"
  );

  const [
    whereOperator,
    setWhereOperator,
  ] = useState("=");

  const [
    whereValue,
    setWhereValue,
  ] = useState("CSE");

  const [
    orderByColumn,
    setOrderByColumn,
  ] = useState("marks");

  const [
    orderDirection,
    setOrderDirection,
  ] = useState("desc");

  const [
    limitValue,
    setLimitValue,
  ] = useState("3");

  const [
    displayRows,
    setDisplayRows,
  ] = useState([]);

  const [
    highlightedRowIds,
    setHighlightedRowIds,
  ] = useState([]);

  const [
    selectedStep,
    setSelectedStep,
  ] = useState("");

  const [
    generatedSQL,
    setGeneratedSQL,
  ] = useState("");

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
                "DBMS" &&
              q.experiment ===
                "SQL Basics"
          );

        setQuizQuestions(
          filtered
        );

        setQuizAnswers(
          Array(
            filtered.length
          ).fill(null)
        );

      } catch (error) {

        console.error(error);

        setQuizQuestions([]);
      }
    }, []);

  useEffect(() => {

    fetchQuizQuestions();

  }, [fetchQuizQuestions]);

  // =========================
  // SAFE MODE META
  // =========================

  const currentMeta =
    queryModes[
      queryType
    ] ||
    queryModes[
      "select-where-order-limit"
    ];

  const CurrentIcon =
    currentMeta.icon ||
    Database;

  // =========================
  // PROGRESS
  // =========================

  const progressPercent =
    activeSection ===
    "overview"
      ? 20
      : activeSection ===
        "simulation"
      ? 55
      : activeSection ===
        "quiz"
      ? 82
      : 95;

  // =========================
  // HELPERS
  // =========================

  const sleep =
    useCallback(
      (ms) =>
        new Promise(
          (resolve) => {
            setTimeout(
              resolve,
              ms
            );
          }
        ),
      []
    );

  const addStep =
    useCallback(
      (text) => {

        setStepHistory(
          (prev) => [
            ...prev,
            text,
          ]
        );
      },
      []
    );

  const buildSQLQuery =
    useCallback(() => {

      const selectClause =
        selectedColumns.length >
        0
          ? selectedColumns.join(
              ", "
            )
          : "*";

      const isNumericColumn =
        whereColumn ===
          "id" ||
        whereColumn ===
          "age" ||
        whereColumn ===
          "marks";

      const formattedWhereValue =
        whereValue.trim() ===
        ""
          ? ""
          : isNumericColumn
          ? whereValue
          : `'${whereValue}'`;

      let query =
        `SELECT ${selectClause} FROM students`;

      if (
        whereValue.trim() !==
        ""
      ) {

        query +=
          ` WHERE ${whereColumn} ${whereOperator} ${formattedWhereValue}`;
      }

      if (orderByColumn) {

        query +=
          ` ORDER BY ${orderByColumn} ${orderDirection.toUpperCase()}`;
      }

      if (
        limitValue.trim() !==
        ""
      ) {

        query +=
          ` LIMIT ${limitValue}`;
      }

      return `${query};`;

    }, [
      selectedColumns,
      whereColumn,
      whereOperator,
      whereValue,
      orderByColumn,
      orderDirection,
      limitValue,
    ]);

  const compareValue = (
    rowValue,
    operator,
    inputValue
  ) => {

    switch (operator) {

      case "=":
        return (
          rowValue ===
          inputValue
        );

      case ">":
        return (
          rowValue >
          inputValue
        );

      case "<":
        return (
          rowValue <
          inputValue
        );

      case ">=":
        return (
          rowValue >=
          inputValue
        );

      case "<=":
        return (
          rowValue <=
          inputValue
        );

      default:
        return true;
    }
  };

  // =========================
  // SIMULATION
  // =========================

  const runSimulation =
    async () => {

      if (isRunning) {
        return;
      }

      if (
        selectedColumns.length ===
        0
      ) {

        setMessage(
          "Please select at least one column."
        );

        return;
      }

      setIsRunning(true);

      setExperimentRun(true);

      setStepHistory([]);

      setHighlightedRowIds(
        []
      );

      setSelectedStep("");

      setGeneratedSQL(
        buildSQLQuery()
      );

      try {

        let rows = [
          ...sampleTable,
        ];

        setDisplayRows(rows);

        setMessage(
          "Loaded original students table."
        );

        addStep(
          "Loaded the original students table."
        );

        await sleep(
          animationSpeed
        );

        if (
          whereValue.trim() !==
          ""
        ) {

          const typedWhereValue =
            whereColumn ===
              "id" ||
            whereColumn ===
              "age" ||
            whereColumn ===
              "marks"
              ? Number(
                  whereValue
                )
              : whereValue;

          const matchedRows =
            rows.filter(
              (row) =>
                compareValue(
                  row[
                    whereColumn
                  ],
                  whereOperator,
                  typedWhereValue
                )
            );

          rows = matchedRows;

          setDisplayRows(rows);

          setHighlightedRowIds(
            matchedRows.map(
              (row) =>
                row.id
            )
          );

          addStep(
            `Applied WHERE condition: ${whereColumn} ${whereOperator} ${whereValue}.`
          );

          await sleep(
            animationSpeed
          );
        }

        if (orderByColumn) {

          rows = [
            ...rows,
          ].sort(
            (a, b) => {

              const first =
                a[
                  orderByColumn
                ];

              const second =
                b[
                  orderByColumn
                ];

              if (
                typeof first ===
                "string"
              ) {

                return orderDirection ===
                  "asc"
                  ? first.localeCompare(
                      second
                    )
                  : second.localeCompare(
                      first
                    );
              }

              return orderDirection ===
                "asc"
                ? first -
                    second
                : second -
                    first;
            }
          );

          setDisplayRows(rows);

          addStep(
            `Applied ORDER BY on ${orderByColumn}.`
          );

          await sleep(
            animationSpeed
          );
        }

        if (
          limitValue.trim() !==
          ""
        ) {

          rows = rows.slice(
            0,
            Number(limitValue)
          );

          setDisplayRows(rows);

          addStep(
            `Applied LIMIT ${limitValue}.`
          );

          await sleep(
            animationSpeed
          );
        }

        const projectedRows =
          projectColumns(
            rows,
            selectedColumns
          );

        setDisplayRows(
          projectedRows
        );

        addStep(
          `Projected selected columns: ${selectedColumns.join(", ")}.`
        );

        setMessage(
          "SQL query simulation completed."
        );

      } finally {

        setIsRunning(false);
      }
    };

  const loadSample =
    () => {

      if (isRunning) {
        return;
      }

      setSelectedColumns([
        "name",
        "department",
        "marks",
      ]);

      setWhereColumn(
        "department"
      );

      setWhereOperator("=");

      setWhereValue("CSE");

      setOrderByColumn(
        "marks"
      );

      setOrderDirection(
        "desc"
      );

      setLimitValue("2");

      setGeneratedSQL("");

      setDisplayRows([]);

      setHighlightedRowIds(
        []
      );

      setSelectedStep("");

      setStepHistory([
        "Sample SQL query loaded.",
      ]);

      setMessage(
        "Loaded sample query."
      );
    };

  const reset =
    () => {

      if (isRunning) {
        return;
      }

      setDisplayRows([]);

      setHighlightedRowIds(
        []
      );

      setStepHistory([]);

      setSelectedStep("");

      setGeneratedSQL("");

      setMessage(
        "DBMS SQL Basics lab reset."
      );

      setExperimentRun(false);
    };

  // =========================
  // QUIZ FUNCTIONS
  // =========================

  const handleQuizAnswer =
    (index, value) => {

      const updated = [
        ...quizAnswers,
      ];

      updated[index] =
        value;

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

      try {

        await axios.post(
          `${API_BASE_URL}/api/progress/update`,
          {
            experimentSlug:
              "sql-basics",

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
                DBMS Lab
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
              SQL Basics
            </h1>

            <p className="er-page-subtitle">

              Explore SQL query
              processing visually
              through immersive
              simulations, quizzes,
              execution analysis and
              coding practice.

            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Query Configuration
              </h2>

              <p>
                Configure SELECT,
                WHERE, ORDER BY and
                LIMIT operations and
                visualize query
                execution step by
                step.
              </p>

            </div>

            <div
              className="er-mode-pill"
              style={{
                boxShadow: `0 0 24px ${currentMeta.glow}`,
              }}
            >

              <div className="er-mode-pill-icon">

                <CurrentIcon
                  size={18}
                />

              </div>

              <div>

                <strong>
                  {
                    currentMeta.title
                  }
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
            className="er-config-grid"
            style={{
              marginTop: 20,
            }}
          >

            <div>

              <label className="sorting-label">
                Query Pipeline
              </label>

              <select
                value={queryType}
                className="sorting-select"
                disabled
              >

                <option value="select-where-order-limit">
                  SELECT + WHERE +
                  ORDER BY + LIMIT
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
                onChange={(e) =>
                  setAnimationSpeed(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="sorting-select"
                disabled={
                  isRunning
                }
              >

                <option
                  value={1100}
                >
                  Slow
                </option>

                <option
                  value={700}
                >
                  Normal
                </option>

                <option
                  value={350}
                >
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
              Rows:
              {" "}
              {
                sampleTable.length
              }
            </button>

            <button className="er-chip active">
              Columns:
              {" "}
              {
                selectedColumns.length
              }
            </button>

            <button className="er-chip active">
              {
                currentMeta.difficulty
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
                : "Ready"}
            </button>

          </div>

          {experimentRun && (

            <div
              style={{
                marginTop: 18,
              }}
            >

              <MarkCompleteButton
                labSlug="dbms"
                experimentSlug="sql-basics"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <DBMSSQLBasicsOverview
                sampleTable={
                  sampleTable
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <DBMSSQLBasicsSimulation
                sampleTable={
                  sampleTable
                }
                allColumns={
                  allColumns
                }
                selectedColumns={
                  selectedColumns
                }
                setSelectedColumns={
                  setSelectedColumns
                }
                whereColumn={
                  whereColumn
                }
                setWhereColumn={
                  setWhereColumn
                }
                whereOperator={
                  whereOperator
                }
                setWhereOperator={
                  setWhereOperator
                }
                whereValue={
                  whereValue
                }
                setWhereValue={
                  setWhereValue
                }
                orderByColumn={
                  orderByColumn
                }
                setOrderByColumn={
                  setOrderByColumn
                }
                orderDirection={
                  orderDirection
                }
                setOrderDirection={
                  setOrderDirection
                }
                limitValue={
                  limitValue
                }
                setLimitValue={
                  setLimitValue
                }
                runSimulation={
                  runSimulation
                }
                reset={reset}
                loadSample={
                  loadSample
                }
                message={
                  message
                }
                displayRows={
                  displayRows
                }
                highlightedRowIds={
                  highlightedRowIds
                }
                stepHistory={
                  stepHistory
                }
                selectedStep={
                  selectedStep
                }
                generatedSQL={
                  generatedSQL
                }
                isRunning={
                  isRunning
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <DBMSSQLBasicsQuiz
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

              <DBMSSQLBasicsCoding />
            )}

          </section>
        </div>
      </main>
    </div>
  );
}