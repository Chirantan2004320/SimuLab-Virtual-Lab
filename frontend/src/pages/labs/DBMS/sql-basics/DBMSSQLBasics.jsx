import React, { useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu,
} from "lucide-react";

import "../../../SortingLab.css";

import { saveQuizResult} from "../../../../API/progressApi";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import DBMSSQLBasicsOverview from "./SQLBasicsOverview.jsx";
import DBMSSQLBasicsSimulation from "./SQLBasicsSimulation.jsx";
import DBMSSQLBasicsQuiz from "./SQLBasicsQuiz.jsx";
import DBMSSQLBasicsCoding from "./SQLBasicsCoding.jsx";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const sampleTable = [
  { id: 1, name: "Aarav", department: "CSE", age: 20, marks: 82 },
  { id: 2, name: "Diya", department: "ECE", age: 21, marks: 91 },
  { id: 3, name: "Kabir", department: "CSE", age: 19, marks: 76 },
  { id: 4, name: "Meera", department: "ME", age: 22, marks: 88 },
  { id: 5, name: "Rohan", department: "CSE", age: 20, marks: 95 },
  { id: 6, name: "Ishita", department: "ECE", age: 19, marks: 84 }
];

const allColumns = ["id", "name", "department", "age", "marks"];

const sqlQuizQuestions = [
  {
    question: "Which SQL clause is used to choose specific columns?",
    options: ["WHERE", "LIMIT", "SELECT", "ORDER BY"],
    correct: 2
  },
  {
    question: "Which clause is used to filter rows?",
    options: ["SELECT", "WHERE", "ORDER BY", "FROM"],
    correct: 1
  },
  {
    question: "What does ORDER BY do?",
    options: ["Deletes rows", "Filters rows", "Sorts rows", "Adds new rows"],
    correct: 2
  },
  {
    question: "What does LIMIT do?",
    options: [
      "Sorts all rows",
      "Restricts the number of returned rows",
      "Renames columns",
      "Removes duplicates"
    ],
    correct: 1
  }
];

function projectColumns(rows, columns) {
  return rows.map((row) => {
    const projected = {};
    columns.forEach((col) => {
      projected[col] = row[col];
    });
    return projected;
  });
}

export default function DBMSSQLBasicsLab() {
  const [queryType, setQueryType] = useState("select-where-order-limit");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [message, setMessage] = useState("DBMS SQL Basics lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const [selectedColumns, setSelectedColumns] = useState([
    "name",
    "department",
    "marks"
  ]);
  const [whereColumn, setWhereColumn] = useState("department");
  const [whereOperator, setWhereOperator] = useState("=");
  const [whereValue, setWhereValue] = useState("CSE");
  const [orderByColumn, setOrderByColumn] = useState("marks");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [limitValue, setLimitValue] = useState("3");

  const [displayRows, setDisplayRows] = useState([]);
  const [highlightedRowIds, setHighlightedRowIds] = useState([]);
  const [selectedStep, setSelectedStep] = useState("");
  const [generatedSQL, setGeneratedSQL] = useState("");

  const quizQuestions = useMemo(() => sqlQuizQuestions, []);
  const [quizAnswers, setQuizAnswers] = useState(
    Array(sqlQuizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 55
      : activeSection === "quiz"
      ? 82
      : 95;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const buildSQLQuery = () => {
    const selectClause =
      selectedColumns.length > 0 ? selectedColumns.join(", ") : "*";

    const isNumericColumn =
      whereColumn === "id" || whereColumn === "age" || whereColumn === "marks";

    const formattedWhereValue =
      whereValue.trim() === ""
        ? ""
        : isNumericColumn
        ? whereValue
        : `'${whereValue}'`;

    let query = `SELECT ${selectClause} FROM students`;

    if (whereValue.trim() !== "") {
      query += ` WHERE ${whereColumn} ${whereOperator} ${formattedWhereValue}`;
    }

    if (orderByColumn) {
      query += ` ORDER BY ${orderByColumn} ${orderDirection.toUpperCase()}`;
    }

    if (limitValue.trim() !== "") {
      query += ` LIMIT ${limitValue}`;
    }

    return `${query};`;
  };

  const compareValue = (rowValue, operator, inputValue) => {
    switch (operator) {
      case "=":
        return rowValue === inputValue;
      case ">":
        return rowValue > inputValue;
      case "<":
        return rowValue < inputValue;
      case ">=":
        return rowValue >= inputValue;
      case "<=":
        return rowValue <= inputValue;
      default:
        return true;
    }
  };

  const runSimulation = async () => {
    if (isRunning) return;

    if (selectedColumns.length === 0) {
      setMessage("Please select at least one column.");
      return;
    }

    if (limitValue.trim() !== "" && Number.isNaN(Number(limitValue))) {
      setMessage("Please enter a valid LIMIT value.");
      return;
    }

    if (
      (whereColumn === "id" ||
        whereColumn === "age" ||
        whereColumn === "marks") &&
      whereValue.trim() !== "" &&
      Number.isNaN(Number(whereValue))
    ) {
      setMessage("Please enter a valid numeric WHERE value.");
      return;
    }

    setIsRunning(true);
    setExperimentRun(true);
    setStepHistory([]);
    setHighlightedRowIds([]);
    setSelectedStep("");
    setGeneratedSQL(buildSQLQuery());

    try {
      let rows = [...sampleTable];

      setDisplayRows(rows);
      setMessage("Loaded original students table.");
      setSelectedStep("Initial Table");
      addStep("Loaded the original students table.");
      await sleep(animationSpeed);

      if (whereValue.trim() !== "") {
        const typedWhereValue =
          whereColumn === "id" ||
          whereColumn === "age" ||
          whereColumn === "marks"
            ? Number(whereValue)
            : whereValue;

        const matchedRows = rows.filter((row) =>
          compareValue(row[whereColumn], whereOperator, typedWhereValue)
        );

        setHighlightedRowIds(matchedRows.map((row) => row.id));
        setMessage(
          `Applying WHERE ${whereColumn} ${whereOperator} ${whereValue}...`
        );
        setSelectedStep("WHERE Applied");
        addStep(
          `Applied WHERE condition: ${whereColumn} ${whereOperator} ${whereValue}.`
        );
        await sleep(animationSpeed);

        rows = matchedRows;
        setDisplayRows(rows);
        await sleep(animationSpeed);
      }

      if (orderByColumn) {
        rows = [...rows].sort((a, b) => {
          const first = a[orderByColumn];
          const second = b[orderByColumn];

          if (typeof first === "string") {
            return orderDirection === "asc"
              ? first.localeCompare(second)
              : second.localeCompare(first);
          }

          return orderDirection === "asc" ? first - second : second - first;
        });

        setDisplayRows(rows);
        setHighlightedRowIds(rows.map((row) => row.id));
        setMessage(
          `Applying ORDER BY ${orderByColumn} ${orderDirection.toUpperCase()}...`
        );
        setSelectedStep("ORDER BY Applied");
        addStep(
          `Applied ORDER BY on ${orderByColumn} in ${orderDirection.toUpperCase()} order.`
        );
        await sleep(animationSpeed);
      }

      if (limitValue.trim() !== "") {
        rows = rows.slice(0, Number(limitValue));

        setDisplayRows(rows);
        setHighlightedRowIds(rows.map((row) => row.id));
        setMessage(`Applying LIMIT ${limitValue}...`);
        setSelectedStep("LIMIT Applied");
        addStep(`Applied LIMIT ${limitValue}.`);
        await sleep(animationSpeed);
      }

      const projectedRows = projectColumns(rows, selectedColumns);

      setDisplayRows(projectedRows);
      setHighlightedRowIds([]);
      setMessage("Applying SELECT projection...");
      setSelectedStep("SELECT Applied");
      addStep(`Projected selected columns: ${selectedColumns.join(", ")}.`);
      await sleep(animationSpeed);

      setMessage("SQL query simulation completed.");
      addStep("Simulation completed successfully.");

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: "dbms-sql-basics", time: Date.now() })
      );
    } finally {
      setIsRunning(false);
    }
  };

  const loadSample = () => {
    if (isRunning) return;

    setSelectedColumns(["name", "department", "marks"]);
    setWhereColumn("department");
    setWhereOperator("=");
    setWhereValue("CSE");
    setOrderByColumn("marks");
    setOrderDirection("desc");
    setLimitValue("2");
    setGeneratedSQL("");
    setDisplayRows([]);
    setHighlightedRowIds([]);
    setSelectedStep("");
    setStepHistory(["Sample SQL query loaded."]);
    setMessage("Loaded sample query.");
  };

  const reset = () => {
    if (isRunning) return;

    setSelectedColumns(["name", "department", "marks"]);
    setWhereColumn("department");
    setWhereOperator("=");
    setWhereValue("CSE");
    setOrderByColumn("marks");
    setOrderDirection("desc");
    setLimitValue("3");
    setDisplayRows([]);
    setHighlightedRowIds([]);
    setStepHistory([]);
    setSelectedStep("");
    setGeneratedSQL("");
    setMessage("DBMS SQL Basics lab reset.");
    setExperimentRun(false);
  };

  const handleQuizAnswer = (i, v) => {
    const updated = [...quizAnswers];
    updated[i] = v;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
  let score = 0;

  quizQuestions.forEach((q, i) => {
    if (quizAnswers[i] === q.correct) score++;
  });

  setQuizScore(score);
  setQuizSubmitted(true);
  setQuizSaveStatus("Saving quiz result...");

  try {
    await saveQuizResult({
      labSlug: "dbms",
      experimentSlug: "sql-basics",
      correctAnswers: score,
      totalQuestions: quizQuestions.length
    });

    setQuizSaveStatus("Quiz result saved to dashboard.");
  } catch (error) {
    console.error("Quiz save failed:", error);
    setQuizSaveStatus("Quiz submitted, but backend save failed.");
  }
};

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
          <div className="er-brand-logo">
            <img
              src={simulabLogo}
              alt="SimuLab"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {!sidebarCollapsed && (
            <div>
              <div className="er-brand-title">SimuLab</div>
              <div className="er-brand-subtitle">DBMS Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
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
                className={`er-nav-item ${
                  activeSection === item.key ? "active" : ""
                }`}
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
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">SQL Basics</h1>
            <p className="er-page-subtitle">
              Explore SQL visually through query simulation, quiz, and coding
              practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Query Configuration</h2>
              <p>
                Build a SELECT pipeline and observe how rows and columns change
                during execution.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>SELECT Pipeline</strong>
                <span>WHERE • ORDER BY • LIMIT</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Query Type</label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="select-where-order-limit">
                  SELECT + WHERE + ORDER BY + LIMIT
                </option>
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
            <button className="er-chip active">Table: students</button>
            <button className="er-chip active">Rows: {sampleTable.length}</button>
            <button className="er-chip active">
              Selected Columns: {selectedColumns.length}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Status: Ready"}
            </button>
          </div>
          <div style={{ marginTop: 18 }}>
  <MarkCompleteButton
    labSlug="dbms"
    experimentSlug="sql-basics"
    points={10}
  />
</div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DBMSSQLBasicsOverview sampleTable={sampleTable} />
            )}

            {activeSection === "simulation" && (
              <DBMSSQLBasicsSimulation
                sampleTable={sampleTable}
                allColumns={allColumns}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                whereColumn={whereColumn}
                setWhereColumn={setWhereColumn}
                whereOperator={whereOperator}
                setWhereOperator={setWhereOperator}
                whereValue={whereValue}
                setWhereValue={setWhereValue}
                orderByColumn={orderByColumn}
                setOrderByColumn={setOrderByColumn}
                orderDirection={orderDirection}
                setOrderDirection={setOrderDirection}
                limitValue={limitValue}
                setLimitValue={setLimitValue}
                runSimulation={runSimulation}
                reset={reset}
                loadSample={loadSample}
                message={message}
                displayRows={displayRows}
                highlightedRowIds={highlightedRowIds}
                stepHistory={stepHistory}
                selectedStep={selectedStep}
                generatedSQL={generatedSQL}
                isRunning={isRunning}
              />
            )}

            {activeSection === "quiz" && (
              <DBMSSQLBasicsQuiz
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

            {activeSection === "coding" && <DBMSSQLBasicsCoding />}
          </section>
        </div>
      </main>
    </div>
  );
}