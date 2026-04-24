import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import { FlaskConical } from "lucide-react";

import DBMSSQLBasicsOverview from "./SQLBasicsOverview.jsx";
import DBMSSQLBasicsSimulation from "./SQLBasicsSimulation.jsx";
import DBMSSQLBasicsQuiz from "./SQLBasicsQuiz.jsx";
import DBMSSQLBasicsCoding from "./SQLBasicsCoding.jsx";

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

const codingProblem = {
  title: "Implement applyQuery(students)",
  description:
    "Write a function that returns only CSE students with marks >= 80, sorted by marks in descending order, and limited to top 3 rows."
};

const sqlCodeTemplates = {
  javascript: `function applyQuery(students) {
  return students
    .filter((student) => student.department === "CSE" && student.marks >= 80)
    .sort((a, b) => b.marks - a.marks)
    .slice(0, 3);
}`,
  python: `def apply_query(students):
    result = [
        student for student in students
        if student["department"] == "CSE" and student["marks"] >= 80
    ]
    result.sort(key=lambda x: x["marks"], reverse=True)
    return result[:3]`,
  cpp: `vector<Student> applyQuery(vector<Student> students) {
    vector<Student> result;
    // filter department == "CSE" and marks >= 80
    // sort by marks in descending order
    // return first 3
    return result;
}`,
  c: `// C version outline
// filter rows where department = CSE and marks >= 80
// sort by marks descending
// return top 3`,
  java: `static List<Student> applyQuery(List<Student> students) {
    List<Student> result = new ArrayList<>();
    // filter department == "CSE" and marks >= 80
    // sort by marks in descending order
    // return first 3
    return result;
}`
};

const sampleTable = [
  { id: 1, name: "Aarav", department: "CSE", age: 20, marks: 82 },
  { id: 2, name: "Diya", department: "ECE", age: 21, marks: 91 },
  { id: 3, name: "Kabir", department: "CSE", age: 19, marks: 76 },
  { id: 4, name: "Meera", department: "ME", age: 22, marks: 88 },
  { id: 5, name: "Rohan", department: "CSE", age: 20, marks: 95 },
  { id: 6, name: "Ishita", department: "ECE", age: 19, marks: 84 }
];

const allColumns = ["id", "name", "department", "age", "marks"];

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
  const [message, setMessage] = useState("DBMS SQL Basics lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const [selectedColumns, setSelectedColumns] = useState(["name", "department", "marks"]);
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

  const [quizAnswers, setQuizAnswers] = useState(Array(sqlQuizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(sqlCodeTemplates.javascript);
  const [codeResult, setCodeResult] = useState("");

  const quizQuestions = useMemo(() => sqlQuizQuestions, []);

  useEffect(() => {
    setCode(sqlCodeTemplates[selectedLanguage]);
    setCodeResult("");
  }, [selectedLanguage]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const buildSQLQuery = () => {
    const selectClause = selectedColumns.length > 0 ? selectedColumns.join(", ") : "*";

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
      (whereColumn === "id" || whereColumn === "age" || whereColumn === "marks") &&
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
      setMessage("Loaded original table.");
      addStep("Loaded the original students table.");
      setSelectedStep("Initial Table");
      await sleep(animationSpeed);

      if (whereValue.trim() !== "") {
        const typedWhereValue =
          whereColumn === "id" || whereColumn === "age" || whereColumn === "marks"
            ? Number(whereValue)
            : whereValue;

        const matchedRows = rows.filter((row) =>
          compareValue(row[whereColumn], whereOperator, typedWhereValue)
        );

        setHighlightedRowIds(matchedRows.map((row) => row.id));
        setMessage(`Applying WHERE ${whereColumn} ${whereOperator} ${whereValue}...`);
        addStep(
          `Applied WHERE condition: ${whereColumn} ${whereOperator} ${whereValue}. Matching rows were selected.`
        );
        setSelectedStep("WHERE Applied");
        await sleep(animationSpeed);

        rows = matchedRows;
        setDisplayRows(rows);
        await sleep(animationSpeed);
      }

      if (orderByColumn) {
        const sortedRows = [...rows].sort((a, b) => {
          const first = a[orderByColumn];
          const second = b[orderByColumn];

          if (typeof first === "string") {
            return orderDirection === "asc"
              ? first.localeCompare(second)
              : second.localeCompare(first);
          }

          return orderDirection === "asc" ? first - second : second - first;
        });

        rows = sortedRows;
        setDisplayRows(rows);
        setHighlightedRowIds(rows.map((row) => row.id));
        setMessage(`Applying ORDER BY ${orderByColumn} ${orderDirection.toUpperCase()}...`);
        addStep(
          `Applied ORDER BY on column ${orderByColumn} in ${orderDirection.toUpperCase()} order.`
        );
        setSelectedStep("ORDER BY Applied");
        await sleep(animationSpeed);
      }

      if (limitValue.trim() !== "") {
        rows = rows.slice(0, Number(limitValue));
        setDisplayRows(rows);
        setHighlightedRowIds(rows.map((row) => row.id));
        setMessage(`Applying LIMIT ${limitValue}...`);
        addStep(`Applied LIMIT ${limitValue}. Only the first ${limitValue} row(s) remain.`);
        setSelectedStep("LIMIT Applied");
        await sleep(animationSpeed);
      }

      const projectedRows = projectColumns(rows, selectedColumns);
      setDisplayRows(projectedRows);
      setHighlightedRowIds([]);
      setMessage("Applying SELECT projection...");
      addStep(`Projected only selected columns: ${selectedColumns.join(", ")}.`);
      setSelectedStep("SELECT Applied");
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
    setStepHistory(["Sample SQL query loaded for SQL Basics experiment."]);
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

  const submitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const scores = JSON.parse(localStorage.getItem("vlab_scores") || "[]");
    scores.push({
      subject: "DBMS",
      experiment: "sql-basics",
      correct: score,
      total: quizQuestions.length,
      time: Date.now()
    });
    localStorage.setItem("vlab_scores", JSON.stringify(scores));
  };

  const redoQuiz = () => {
  setQuizAnswers(Array(quizQuestions.length).fill(null));
  setQuizSubmitted(false);
  setQuizScore(0);
};


  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("students", `${code}; return applyQuery(students);`);
      const result = fn(sampleTable);
      setCodeResult(`Output: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-220px] left-[-120px] w-[620px] h-[620px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-220px] right-[-120px] w-[520px] h-[520px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 pt-24 pb-16 relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glow-border mb-5">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="text-sm font-display text-primary tracking-wide">
              Interactive SQL Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            SQL Basics
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Explore SQL visually through query simulation, quiz, and coding practice.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Query Mode</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16
            }}
          >
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
        </section>

        <div className="sorting-lab-layout">
          <aside className="sorting-sidebar glass">
            <button
              className={`sorting-sidebar-item ${activeSection === "overview" ? "active" : ""}`}
              onClick={() => setActiveSection("overview")}
            >
              Overview
            </button>

            <button
              className={`sorting-sidebar-item ${activeSection === "simulation" ? "active" : ""}`}
              onClick={() => setActiveSection("simulation")}
            >
              Simulation
            </button>

            <button
              className={`sorting-sidebar-item ${activeSection === "quiz" ? "active" : ""}`}
              onClick={() => setActiveSection("quiz")}
            >
              Quiz
            </button>

            <button
              className={`sorting-sidebar-item ${activeSection === "coding" ? "active" : ""}`}
              onClick={() => setActiveSection("coding")}
            >
              Coding
            </button>
          </aside>

          <main className="sorting-content">
            <div className="glass rounded-3xl p-5 sm:p-6">
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
                  experimentRun={experimentRun}
                  handleQuizAnswer={handleQuizAnswer}
                  submitQuiz={submitQuiz}
                  redoQuiz={redoQuiz}
                />
              )}

              {activeSection === "coding" && (
                <DBMSSQLBasicsCoding
                  codingProblem={codingProblem}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  code={code}
                  setCode={setCode}
                  codeResult={codeResult}
                  runCode={runCode}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}