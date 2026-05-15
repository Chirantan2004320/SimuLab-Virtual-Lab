/* eslint-disable no-new-func */

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import "../../../SortingLab.css";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext.js";

import MarkCompleteButton from "../../../../components/MarkCompleteButton.jsx";

import SimuLabLogo from "../../../../components/SimuLabLogo";

import {
  saveCodingSubmission,
} from "../../../../API/progressApi.js";

import {
  ArrowLeftRight,
  BookOpen,
  Brain,
  ChevronsLeft,
  Code2,
  Database,
  Filter,
  Sparkles,
  Activity,
  GitCompare,
} from "lucide-react";

import DBMSQueryOptimizationOverview from "./DBMSQueryOptimizationOverview";
import DBMSQueryOptimizationSimulation from "./DBMSQueryOptimizationSimulation";
import DBMSQueryOptimizationQuiz from "./DBMSQueryOptimizationQuiz";
import DBMSQueryOptimizationCoding from "./DBMSQueryOptimizationCoding";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const experimentSlug =
  "query-optimization";

const sidebarItems = [
  {
    key: "overview",
    label: "Overview",
    icon: BookOpen,
  },

  {
    key: "simulation",
    label: "Simulation",
    icon: Activity,
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
    label: "Coding",
    icon: Code2,
  },
];

const codingProblemsByMode =
  {
    selection: [
      {
        title:
          "Optimize selection query",

        description:
          "Write an optimized version of a query that filters rows early using a WHERE condition.",
      },

      {
        title:
          "Reduce scanned rows",

        description:
          "Write a query optimization idea that pushes the department filter before expensive processing.",
      },

      {
        title:
          "Selection pushdown plan",

        description:
          "Show how early filtering reduces intermediate rows during query execution.",
      },
    ],

    projection: [
      {
        title:
          "Optimize projection query",

        description:
          "Write an optimized query that selects only required columns.",
      },

      {
        title:
          "Avoid SELECT *",

        description:
          "Rewrite a query so it returns only student_id and name from Students.",
      },

      {
        title:
          "Projection pushdown plan",

        description:
          "Explain how early projection reduces data transfer and processing overhead.",
      },
    ],

    join: [
      {
        title:
          "Optimize join order",

        description:
          "Write an optimized query plan where filtering happens before joins.",
      },

      {
        title:
          "Join filtered inputs first",

        description:
          "Show how filtering Students before joining with Enrollments improves performance.",
      },

      {
        title:
          "Reduce join cost",

        description:
          "Explain how optimized join ordering reduces query execution cost.",
      },
    ],
  };

const codeTemplates = {
  selection: {
    javascript: `const answer = {
  original: "SELECT * FROM Students WHERE department = 'CSE'",
  optimizedIdea: "Apply selection early so only filtered rows move forward"
};`,
  },

  projection: {
    javascript: `const answer = {
  original: "SELECT * FROM Students",
  optimized: "SELECT student_id, name FROM Students",
  optimizedIdea: "Project only required columns early"
};`,
  },

  join: {
    javascript: `const answer = {
  originalPlan: "Join Students and Enrollments first, then filter",
  optimizedPlan: "Filter Students before joining with Enrollments"
};`,
  },
};

const studentsTable = [
  {
    student_id: 1,
    name: "Aarav",
    department: "CSE",
    semester: 5,
  },

  {
    student_id: 2,
    name: "Diya",
    department: "ECE",
    semester: 3,
  },

  {
    student_id: 3,
    name: "Kabir",
    department: "CSE",
    semester: 5,
  },

  {
    student_id: 4,
    name: "Meera",
    department: "ME",
    semester: 4,
  },

  {
    student_id: 5,
    name: "Rohan",
    department: "CSE",
    semester: 6,
  },
];

const enrollmentsTable = [
  {
    student_id: 1,
    course_id: "C101",
    grade: "A",
  },

  {
    student_id: 1,
    course_id: "C102",
    grade: "B+",
  },

  {
    student_id: 2,
    course_id: "E201",
    grade: "A-",
  },

  {
    student_id: 3,
    course_id: "C101",
    grade: "A",
  },

  {
    student_id: 5,
    course_id: "C301",
    grade: "B",
  },
];

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const modeMeta = {
  selection: {
    title:
      "Selection Pushdown",

    description:
      "Apply filters early to reduce rows flowing through the execution plan.",

    icon: Filter,
  },

  projection: {
    title:
      "Projection Pushdown",

    description:
      "Reduce unnecessary columns during query processing.",

    icon: Database,
  },

  join: {
    title:
      "Join Order Optimization",

    description:
      "Optimize joins by reducing intermediate result sizes.",

    icon: ArrowLeftRight,
  },
};

export default function DBMSQueryOptimizationLab() {

  const {
    user,
    loading,
  } = useAuth();

  const navigate =
    useNavigate();

  const [mode, setMode] =
    useState("selection");

  const [
    activeSection,
    setActiveSection,
  ] = useState(
    "overview"
  );

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState(
    "Query Optimization lab initialized."
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
    currentStage,
    setCurrentStage,
  ] = useState("");

  const [
    inputRowsCount,
    setInputRowsCount,
  ] = useState(0);

  const [
    outputRowsCount,
    setOutputRowsCount,
  ] = useState(0);

  const [
    highlightedRows,
    setHighlightedRows,
  ] = useState([]);

  const [
    resultRows,
    setResultRows,
  ] = useState([]);

  const [
    planText,
    setPlanText,
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
  // CODING STATES
  // =========================

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState(
    "javascript"
  );

  const [
    codes,
    setCodes,
  ] = useState([]);

  const [
    results,
    setResults,
  ] = useState([]);

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
                "DBMS" &&
              q.experiment ===
                "Query Optimization"
          );

        const modeQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "selection"
              ).toLowerCase() ===
              mode
          );

        setQuizQuestions(
          modeQuestions
        );

        setQuizAnswers(
          Array(
            modeQuestions.length
          ).fill(null)
        );

      } catch (error) {

        console.error(error);

        setQuizQuestions([]);
      }
    }, [mode]);

  useEffect(() => {

    fetchQuizQuestions();

  }, [fetchQuizQuestions]);

  useEffect(() => {

    if (
      !loading &&
      !user
    ) {

      navigate(
        "/login"
      );
    }

  }, [
    user,
    loading,
    navigate,
  ]);

  useEffect(() => {

    setStepHistory([]);

    setCurrentStage("");

    setInputRowsCount(0);

    setOutputRowsCount(0);

    setHighlightedRows([]);

    setResultRows([]);

    setPlanText("");

    setMessage(
      "Query Optimization lab initialized."
    );

    setExperimentRun(
      false
    );

    setIsRunning(false);

    setQuizSubmitted(
      false
    );

    setQuizScore(0);

    const starter =
      codeTemplates[
        mode
      ].javascript;

    const count =
      codingProblemsByMode[
        mode
      ].length;

    setCodes(
      Array(count).fill(
        starter
      )
    );

    setResults(
      Array(count).fill("")
    );

    setCodingSaveStatus(
      {}
    );

  }, [mode]);

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

  const runSimulation =
    async () => {

      if (isRunning) {
        return;
      }

      setIsRunning(true);

      setExperimentRun(
        true
      );

      setStepHistory([]);

      setCurrentStage(
        "Simulation Start"
      );

      setHighlightedRows(
        []
      );

      setResultRows([]);

      setPlanText("");

      setInputRowsCount(
        0
      );

      setOutputRowsCount(
        0
      );

      try {

        if (
          mode ===
          "selection"
        ) {

          setInputRowsCount(
            studentsTable.length
          );

          setMessage(
            "Starting selection pushdown simulation..."
          );

          addStep(
            "Started selection pushdown optimization."
          );

          await sleep(
            animationSpeed
          );

          setCurrentStage(
            "Apply WHERE Early"
          );

          setPlanText(
            "Apply WHERE department = 'CSE' before later processing."
          );

          addStep(
            "Applied selection pushdown."
          );

          await sleep(
            animationSpeed
          );

          const filtered =
            studentsTable.filter(
              (row) =>
                row.department ===
                "CSE"
            );

          setHighlightedRows(
            filtered.map(
              (row) =>
                row.student_id
            )
          );

          setResultRows(
            filtered
          );

          setOutputRowsCount(
            filtered.length
          );

          await sleep(
            animationSpeed
          );
        }

        if (
          mode ===
          "projection"
        ) {

          setInputRowsCount(
            studentsTable.length
          );

          setMessage(
            "Starting projection pushdown simulation..."
          );

          addStep(
            "Started projection optimization."
          );

          await sleep(
            animationSpeed
          );

          setCurrentStage(
            "Reduce Columns"
          );

          setPlanText(
            "Select only required columns early in the execution pipeline."
          );

          addStep(
            "Applied projection pushdown."
          );

          await sleep(
            animationSpeed
          );

          const projected =
            studentsTable.map(
              (row) => ({
                student_id:
                  row.student_id,

                name:
                  row.name,
              })
            );

          setHighlightedRows(
            studentsTable.map(
              (row) =>
                row.student_id
            )
          );

          setResultRows(
            projected
          );

          setOutputRowsCount(
            projected.length
          );

          await sleep(
            animationSpeed
          );
        }

        if (
          mode ===
          "join"
        ) {

          setInputRowsCount(
            studentsTable.length +
              enrollmentsTable.length
          );

          setMessage(
            "Starting join optimization simulation..."
          );

          addStep(
            "Started join order optimization."
          );

          await sleep(
            animationSpeed
          );

          setCurrentStage(
            "Filter Before Join"
          );

          setPlanText(
            "Reduce intermediate rows before performing JOIN operation."
          );

          addStep(
            "Applied filtering before join."
          );

          await sleep(
            animationSpeed
          );

          const filteredStudents =
            studentsTable.filter(
              (row) =>
                row.department ===
                "CSE"
            );

          setHighlightedRows(
            filteredStudents.map(
              (row) =>
                row.student_id
            )
          );

          await sleep(
            animationSpeed
          );

          setCurrentStage(
            "Join Filtered Inputs"
          );

          const joined =
            [];

          filteredStudents.forEach(
            (student) => {

              enrollmentsTable.forEach(
                (
                  enrollment
                ) => {

                  if (
                    student.student_id ===
                    enrollment.student_id
                  ) {

                    joined.push(
                      {
                        student_id:
                          student.student_id,

                        name:
                          student.name,

                        course_id:
                          enrollment.course_id,

                        grade:
                          enrollment.grade,
                      }
                    );
                  }
                }
              );
            }
          );

          setResultRows(
            joined
          );

          setOutputRowsCount(
            joined.length
          );

          addStep(
            "Joined filtered datasets."
          );

          await sleep(
            animationSpeed
          );
        }

        setCurrentStage(
          "Complete"
        );

        setMessage(
          `${modeMeta[mode].title} completed successfully.`
        );

        addStep(
          `${modeMeta[mode].title} simulation completed.`
        );

      } finally {

        setIsRunning(
          false
        );
      }
    };

  const loadSample =
    () => {

      if (isRunning) {
        return;
      }

      setCurrentStage(
        "Sample Ready"
      );

      setHighlightedRows(
        []
      );

      setResultRows([]);

      setPlanText(
        "Sample loaded successfully."
      );

      setInputRowsCount(
        mode ===
        "join"
          ? studentsTable.length +
              enrollmentsTable.length
          : studentsTable.length
      );

      setOutputRowsCount(
        0
      );

      setStepHistory([
        `Sample loaded for ${modeMeta[mode].title}.`,
      ]);

      setMessage(
        `Sample loaded for ${modeMeta[mode].title}.`
      );

      setExperimentRun(
        true
      );
    };

  const reset = () => {

    if (isRunning) {
      return;
    }

    setCurrentStage("");

    setInputRowsCount(
      0
    );

    setOutputRowsCount(
      0
    );

    setHighlightedRows(
      []
    );

    setResultRows([]);

    setPlanText("");

    setStepHistory([]);

    setMessage(
      "Query Optimization lab reset."
    );

    setExperimentRun(
      false
    );
  };

  const handleQuizAnswer =
    (i, v) => {

      const updated = [
        ...quizAnswers,
      ];

      updated[i] = v;

      setQuizAnswers(
        updated
      );
    };

  const submitQuiz =
    async () => {

      let score = 0;

      quizQuestions.forEach(
        (q, i) => {

          const selected =
            q.options?.[
              quizAnswers[i]
            ];

          if (
            selected ===
            q.correct_answer
          ) {

            score++;
          }
        }
      );

      setQuizScore(score);

      setQuizSubmitted(
        true
      );

      try {

        await axios.post(
          `${API_BASE_URL}/api/progress/update`,
          {
            experimentSlug:
              experimentSlug,

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

      setQuizAnswers(
        Array(
          quizQuestions.length
        ).fill(null)
      );

      setQuizSubmitted(
        false
      );

      setQuizScore(0);

      setQuizSaveStatus(
        ""
      );
    };

  const updateCodeAt =
    (
      index,
      value
    ) => {

      setCodes(
        (prev) =>
          prev.map(
            (
              item,
              i
            ) =>
              i === index
                ? value
                : item
          )
      );
    };

  const setResultAt =
    (
      index,
      value
    ) => {

      setResults(
        (prev) =>
          prev.map(
            (
              item,
              i
            ) =>
              i === index
                ? value
                : item
          )
      );
    };

  const runCode =
    async (
      problemIndex
    ) => {

      try {

        // eslint-disable-next-line no-new-func
        const fn =
          new Function(
            `${codes[problemIndex]}; return answer;`
          );

        const result =
          fn();

        setResultAt(
          problemIndex,
          `Output:\n${JSON.stringify(
            result,
            null,
            2
          )}`
        );

        try {

          await saveCodingSubmission(
            {
              experimentSlug,

              problemTitle:
                codingProblemsByMode[
                  mode
                ][
                  problemIndex
                ].title,

              language:
                selectedLanguage,

              code:
                codes[
                  problemIndex
                ],

              result:
                "passed",

              points: 10,
            }
          );

          setCodingSaveStatus(
            (
              prev
            ) => ({
              ...prev,

              [problemIndex]:
                "Submission saved successfully.",
            })
          );

        } catch (saveError) {

          console.error(
            saveError
          );
        }

      } catch (error) {

        setResultAt(
          problemIndex,
          `Error: ${error.message}`
        );
      }
    };

  const analyzeCode =
    (
      problemIndex
    ) => {

      const content =
        (
          codes[
            problemIndex
          ] || ""
        ).toLowerCase();

      if (
        content.includes(
          "join"
        ) ||
        content.includes(
          "filter"
        ) ||
        content.includes(
          "projection"
        ) ||
        content.includes(
          "selection"
        )
      ) {

        setResultAt(
          problemIndex,
          "Analysis:\nYour answer includes major query optimization concepts."
        );

      } else {

        setResultAt(
          problemIndex,
          "Analysis:\nYour answer is partially correct but missing important optimization terminology."
        );
      }
    };

  const correctCode =
    (
      problemIndex
    ) => {

      updateCodeAt(
        problemIndex,
        codeTemplates[
          mode
        ].javascript
      );

      setResultAt(
        problemIndex,
        "Model answer loaded successfully."
      );
    };

  const progressPercent =
    activeSection ===
    "overview"
      ? 20
      : activeSection ===
        "simulation"
      ? 45
      : activeSection ===
        "comparison"
      ? 60
      : activeSection ===
        "coding"
      ? 78
      : activeSection ===
        "quiz"
      ? 95
      : 50;

  const ActiveModeIcon =
    modeMeta[mode]
      ?.icon || Sparkles;

  if (loading) {

    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {

    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Please log in to access the lab.
      </div>
    );
  }

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
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
              <div className="er-brand-title">SimuLab</div>
              <div className="er-brand-subtitle">DBMS Virtual Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        <div className="er-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                className={`er-nav-item ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
                title={item.label}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div className="er-progress-card">
            <div className="er-progress-title">Your Progress</div>

            <div className="er-progress-ring">
              <div
                className="er-progress-circle"
                style={{
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`
                }}
              >
                <div className="er-progress-inner">
                  <div className="er-progress-value">{progressPercent}%</div>
                  <div className="er-progress-text">Complete</div>
                </div>
              </div>
            </div>

            <div className="er-last-activity">
              <div className="er-last-activity-label">Last Activity</div>

              <div className="er-last-activity-row">
                <span>
                  {sidebarItems.find((i) => i.key === activeSection)?.label ||
                    "Query Optimization"}
                </span>

                <span className="dot-live">
                  Just now
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">Query Optimization</h1>

            <p className="er-page-subtitle">
              Learn selection pushdown, projection pushdown, and join optimization through animated execution plans and interactive visualization. ✨
            </p>
          </div>

          <MarkCompleteButton experimentSlug={experimentSlug} />
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Optimization Configuration</h2>

              <p>
                Configure query optimization strategies and visualize efficient execution planning.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <ActiveModeIcon size={18} />
              </div>

              <div>
                <strong>{modeMeta[mode].title}</strong>
                <span>{modeMeta[mode].description}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Optimization Mode</label>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="selection">Selection Pushdown</option>
                <option value="projection">Projection Pushdown</option>
                <option value="join">Join Order Optimization</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Animation Speed</label>

              <select
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value={1100}>Slow</option>
                <option value={700}>Normal</option>
                <option value={350}>Fast</option>
              </select>
            </div>
          </div>

          <div className="er-chip-row">
            <button
              className={`er-chip ${mode === "selection" ? "active" : ""}`}
              onClick={() => setMode("selection")}
              type="button"
            >
              <Filter size={14} />
              Selection
            </button>

            <button
              className={`er-chip ${mode === "projection" ? "active" : ""}`}
              onClick={() => setMode("projection")}
              type="button"
            >
              <Database size={14} />
              Projection
            </button>

            <button
              className={`er-chip ${mode === "join" ? "active" : ""}`}
              onClick={() => setMode("join")}
              type="button"
            >
              <ArrowLeftRight size={14} />
              Join
            </button>

            <button
              className={`er-chip ${experimentRun ? "active" : ""}`}
              type="button"
            >
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">

            {activeSection === "overview" && (
              <DBMSQueryOptimizationOverview
                mode={mode}
                studentsTable={studentsTable}
                enrollmentsTable={enrollmentsTable}
              />
            )}

            {activeSection === "simulation" && (
              <DBMSQueryOptimizationSimulation
                mode={mode}
                studentsTable={studentsTable}
                enrollmentsTable={enrollmentsTable}
                runSimulation={runSimulation}
                reset={reset}
                loadSample={loadSample}
                message={message}
                currentStage={currentStage}
                inputRowsCount={inputRowsCount}
                outputRowsCount={outputRowsCount}
                highlightedRows={highlightedRows}
                resultRows={resultRows}
                planText={planText}
                stepHistory={stepHistory}
                isRunning={isRunning}
              />
            )}

            {/* {activeSection === "comparison" && (
              <DBMSQueryOptimizationComparison mode={mode} />
            )} */}

            {activeSection === "quiz" && (
              <DBMSQueryOptimizationQuiz
                mode={mode}
                quizQuestions={quizQuestions}
                quizAnswers={quizAnswers}
                quizSubmitted={quizSubmitted}
                quizScore={quizScore}
                quizSaveStatus={quizSaveStatus}
                experimentRun={experimentRun}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && (
              <DBMSQueryOptimizationCoding
                codingProblems={codingProblemsByMode[mode]}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                codes={codes}
                results={results}
                codingSaveStatus={codingSaveStatus}
                handleCodeChange={updateCodeAt}
                runCode={runCode}
                analyzeCode={analyzeCode}
                correctCode={correctCode}
                mode={mode}
              />
            )}

          </section>
        </div>
      </main>
    </div>
  );
}