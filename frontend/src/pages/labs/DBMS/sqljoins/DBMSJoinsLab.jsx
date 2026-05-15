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
  Link2,
} from "lucide-react";

import "../../../SortingLab.css";

import SimuLabLogo from "../../../../components/SimuLabLogo";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import DBMSJoinsOverview from "./DBMSJoinsOverview";
import DBMSJoinsSimulation from "./DBMSJoinsSimulation";
import DBMSJoinsQuiz from "./DBMSJoinsQuiz";
import DBMSJoinsCoding from "./DBMSJoinsCoding";

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

const studentsTable = [
  {
    id: 1,
    name: "Aarav",
    department_id: 101,
    age: 20,
  },

  {
    id: 2,
    name: "Diya",
    department_id: 102,
    age: 21,
  },

  {
    id: 3,
    name: "Kabir",
    department_id: 101,
    age: 19,
  },

  {
    id: 4,
    name: "Meera",
    department_id: 104,
    age: 22,
  },

  {
    id: 5,
    name: "Rohan",
    department_id: 105,
    age: 20,
  },
];

const departmentsTable = [
  {
    department_id: 101,
    department_name: "CSE",
    hod: "Dr. Sharma",
  },

  {
    department_id: 102,
    department_name: "ECE",
    hod: "Dr. Iyer",
  },

  {
    department_id: 103,
    department_name: "ME",
    hod: "Dr. Khan",
  },

  {
    department_id: 104,
    department_name: "Civil",
    hod: "Dr. Rao",
  },
];

const joinNames = {
  inner: "INNER JOIN",

  left: "LEFT JOIN",

  right: "RIGHT JOIN",
};

const joinMeta = {
  inner: {
    keeps:
      "Matching Rows",

    unmatched:
      "Excluded",

    use:
      "Common relationship lookup",

    best:
      "O(n log n)",

    average:
      "O(n²)",

    worst:
      "O(n²)",

    space:
      "O(n)",

    type:
      "Relational Join",
  },

  left: {
    keeps:
      "All Left Rows",

    unmatched:
      "Right side NULL",

    use:
      "Keep all students",

    best:
      "O(n log n)",

    average:
      "O(n²)",

    worst:
      "O(n²)",

    space:
      "O(n)",

    type:
      "Outer Join",
  },

  right: {
    keeps:
      "All Right Rows",

    unmatched:
      "Left side NULL",

    use:
      "Keep all departments",

    best:
      "O(n log n)",

    average:
      "O(n²)",

    worst:
      "O(n²)",

    space:
      "O(n)",

    type:
      "Outer Join",
  },
};

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function DBMSJoinsLab() {

  const [joinType, setJoinType] =
    useState("inner");

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
    "SQL Joins lab initialized."
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
  ] = useState(700);

  const [
    stepHistory,
    setStepHistory,
  ] = useState([]);

  const [
    selectedStudentId,
    setSelectedStudentId,
  ] = useState(null);

  const [
    selectedDepartmentId,
    setSelectedDepartmentId,
  ] = useState(null);

  const [
    matchedStudentIds,
    setMatchedStudentIds,
  ] = useState([]);

  const [
    matchedDepartmentIds,
    setMatchedDepartmentIds,
  ] = useState([]);

  const [
    joinedRows,
    setJoinedRows,
  ] = useState([]);

  const [
    generatedSQL,
    setGeneratedSQL,
  ] = useState("");

  const [
    currentStage,
    setCurrentStage,
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
                "SQL Joins"
          );

        const joinQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "inner"
              ).toLowerCase() ===
              joinType
          );

        setQuizQuestions(
          joinQuestions
        );

        setQuizAnswers(
          Array(
            joinQuestions.length
          ).fill(null)
        );

      } catch (error) {

        console.error(error);

        setQuizQuestions([]);
      }
    }, [joinType]);

  useEffect(() => {

    fetchQuizQuestions();

  }, [fetchQuizQuestions]);

  useEffect(() => {

    setStepHistory([]);

    setSelectedStudentId(
      null
    );

    setSelectedDepartmentId(
      null
    );

    setMatchedStudentIds([]);

    setMatchedDepartmentIds([]);

    setJoinedRows([]);

    setGeneratedSQL("");

    setCurrentStage("");

    setMessage(
      "SQL Joins lab initialized."
    );

    setExperimentRun(false);

    setIsRunning(false);

    setQuizSubmitted(false);

    setQuizScore(0);

  }, [joinType]);

  const addStep =
    useCallback((text) => {

      setStepHistory(
        (prev) => [
          ...prev,
          text,
        ]
      );

    }, []);

  const buildJoinQuery =
    useCallback(() => {

      const joinKeyword =
        joinType ===
        "inner"
          ? "INNER JOIN"
          : joinType ===
            "left"
          ? "LEFT JOIN"
          : "RIGHT JOIN";

      return `SELECT s.name, s.department_id, d.department_name, d.hod
FROM students s
${joinKeyword} departments d
ON s.department_id = d.department_id;`;

    }, [joinType]);

  const runSimulation =
    async () => {

      if (isRunning) {
        return;
      }

      setIsRunning(true);

      setExperimentRun(true);

      setStepHistory([]);

      setSelectedStudentId(
        null
      );

      setSelectedDepartmentId(
        null
      );

      setMatchedStudentIds([]);

      setMatchedDepartmentIds([]);

      setJoinedRows([]);

      setGeneratedSQL(
        buildJoinQuery()
      );

      setCurrentStage(
        "Preparing Join"
      );

      try {

        addStep(
          `Starting ${joinType.toUpperCase()} JOIN simulation.`
        );

        setMessage(
          `Starting ${joinType.toUpperCase()} JOIN simulation...`
        );

        await sleep(
          animationSpeed
        );

        const results = [];

        if (
          joinType ===
            "inner" ||
          joinType ===
            "left"
        ) {

          for (const student of studentsTable) {

            setSelectedStudentId(
              student.id
            );

            setCurrentStage(
              "Scanning Student Row"
            );

            await sleep(
              animationSpeed
            );

            const matches =
              departmentsTable.filter(
                (dept) =>
                  dept.department_id ===
                  student.department_id
              );

            if (
              matches.length > 0
            ) {

              for (const dept of matches) {

                setSelectedDepartmentId(
                  dept.department_id
                );

                setMatchedStudentIds(
                  (prev) => [
                    ...new Set([
                      ...prev,
                      student.id,
                    ]),
                  ]
                );

                setMatchedDepartmentIds(
                  (prev) => [
                    ...new Set([
                      ...prev,
                      dept.department_id,
                    ]),
                  ]
                );

                results.push({
                  student_name:
                    student.name,

                  student_department_id:
                    student.department_id,

                  department_name:
                    dept.department_name,

                  hod:
                    dept.hod,
                });

                addStep(
                  `Matched ${student.name} with ${dept.department_name}.`
                );

                await sleep(
                  animationSpeed
                );
              }
            }

            else if (
              joinType ===
              "left"
            ) {

              results.push({
                student_name:
                  student.name,

                student_department_id:
                  student.department_id,

                department_name:
                  "NULL",

                hod:
                  "NULL",
              });

              addStep(
                `LEFT JOIN retained unmatched row for ${student.name}.`
              );

              await sleep(
                animationSpeed
              );
            }

            setJoinedRows([
              ...results,
            ]);
          }
        }

        if (
          joinType ===
          "right"
        ) {

          for (const dept of departmentsTable) {

            setSelectedDepartmentId(
              dept.department_id
            );

            await sleep(
              animationSpeed
            );

            const matches =
              studentsTable.filter(
                (student) =>
                  student.department_id ===
                  dept.department_id
              );

            if (
              matches.length > 0
            ) {

              for (const student of matches) {

                setSelectedStudentId(
                  student.id
                );

                results.push({
                  student_name:
                    student.name,

                  student_department_id:
                    student.department_id,

                  department_name:
                    dept.department_name,

                  hod:
                    dept.hod,
                });

                addStep(
                  `Matched ${student.name} with ${dept.department_name}.`
                );

                await sleep(
                  animationSpeed
                );
              }
            }

            else {

              results.push({
                student_name:
                  "NULL",

                student_department_id:
                  "NULL",

                department_name:
                  dept.department_name,

                hod:
                  dept.hod,
              });

              addStep(
                `RIGHT JOIN retained unmatched department ${dept.department_name}.`
              );

              await sleep(
                animationSpeed
              );
            }

            setJoinedRows([
              ...results,
            ]);
          }
        }

        setMessage(
          `${joinType.toUpperCase()} JOIN simulation completed.`
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

      setStepHistory([
        `Sample prepared for ${joinType.toUpperCase()} JOIN.`,
      ]);

      setGeneratedSQL(
        buildJoinQuery()
      );

      setMessage(
        `Sample loaded for ${joinType.toUpperCase()} JOIN.`
      );
    };

  const reset =
    () => {

      if (isRunning) {
        return;
      }

      setStepHistory([]);

      setSelectedStudentId(
        null
      );

      setSelectedDepartmentId(
        null
      );

      setMatchedStudentIds([]);

      setMatchedDepartmentIds([]);

      setJoinedRows([]);

      setGeneratedSQL("");

      setCurrentStage("");

      setMessage(
        "SQL Joins lab reset."
      );

      setExperimentRun(false);
    };

  const handleQuizAnswer =
    (index, value) => {

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
              "sql-joins",

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

  const redoQuiz =
    () => {

      setQuizSubmitted(false);

      setQuizScore(0);

      setQuizAnswers(
        Array(
          quizQuestions.length
        ).fill(null)
      );
    };

  const progressPercent =
    activeSection ===
    "overview"
      ? 20
      : activeSection ===
        "simulation"
      ? 55
      : activeSection ===
        "quiz"
      ? 80
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
                (prev) => !prev
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
                  key={item.key}
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

                  <Icon size={18} />

                  {!sidebarCollapsed && (
                    <span>
                      {item.label}
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
              SQL Joins
            </h1>

            <p className="er-page-subtitle">
              Explore INNER,
              LEFT and RIGHT
              joins visually
              through immersive
              DBMS simulations.
            </p>

          </div>
        </div>

        <section className="er-config-card">

          <div className="er-config-top">

            <div>

              <h2>
                Join Configuration
              </h2>

              <p>
                Configure SQL
                joins and observe
                relational query
                execution visually.
              </p>

            </div>

            <div className="er-mode-pill">

              <div className="er-mode-pill-icon">

                <Link2
                  size={18}
                />

              </div>

              <div>

                <strong>
                  {
                    joinNames[
                      joinType
                    ]
                  }
                </strong>

                <span>
                  {
                    joinMeta[
                      joinType
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
              value={joinType}
              onChange={(e) =>
                setJoinType(
                  e.target.value
                )
              }
              className="sorting-select"
              style={{
                maxWidth: 320,
              }}
              disabled={
                isRunning
              }
            >

              <option value="inner">
                INNER JOIN
              </option>

              <option value="left">
                LEFT JOIN
              </option>

              <option value="right">
                RIGHT JOIN
              </option>

            </select>
          </div>

          <div className="er-chip-row">

            <button className="er-chip active">
              Keeps:
              {" "}
              {
                joinMeta[
                  joinType
                ].keeps
              }
            </button>

            <button className="er-chip active">
              Unmatched:
              {" "}
              {
                joinMeta[
                  joinType
                ].unmatched
              }
            </button>

            <button className="er-chip active">
              Use:
              {" "}
              {
                joinMeta[
                  joinType
                ].use
              }
            </button>

            <button className="er-chip active">
              Best:
              {" "}
              {
                joinMeta[
                  joinType
                ].best
              }
            </button>

            <button className="er-chip active">
              Avg:
              {" "}
              {
                joinMeta[
                  joinType
                ].average
              }
            </button>

            <button className="er-chip active">
              Space:
              {" "}
              {
                joinMeta[
                  joinType
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
                experimentSlug="sql-joins"
                points={10}
              />

            </div>
          )}
        </section>

        <div className="er-content-layout">

          <section className="er-content-card">

            {activeSection ===
              "overview" && (

              <DBMSJoinsOverview
                joinType={
                  joinType
                }
                studentsTable={
                  studentsTable
                }
                departmentsTable={
                  departmentsTable
                }
              />
            )}

            {activeSection ===
              "simulation" && (

              <DBMSJoinsSimulation
                joinType={
                  joinType
                }
                studentsTable={
                  studentsTable
                }
                departmentsTable={
                  departmentsTable
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
                selectedStudentId={
                  selectedStudentId
                }
                selectedDepartmentId={
                  selectedDepartmentId
                }
                matchedStudentIds={
                  matchedStudentIds
                }
                matchedDepartmentIds={
                  matchedDepartmentIds
                }
                joinedRows={
                  joinedRows
                }
                stepHistory={
                  stepHistory
                }
                generatedSQL={
                  generatedSQL
                }
                currentStage={
                  currentStage
                }
                isRunning={
                  isRunning
                }
              />
            )}

            {activeSection ===
              "quiz" && (

              <DBMSJoinsQuiz
                joinType={
                  joinType
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

              <DBMSJoinsCoding
                joinType={
                  joinType
                }
              />
            )}

          </section>
        </div>
      </main>
    </div>
  );
}