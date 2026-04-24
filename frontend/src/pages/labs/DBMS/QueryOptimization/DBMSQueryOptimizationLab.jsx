import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  ArrowLeftRight,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  Filter,
  Gauge,
} from "lucide-react";

import DBMSQueryOptimizationOverview from "./DBMSQueryOptimizationOverview";
import DBMSQueryOptimizationSimulation from "./DBMSQueryOptimizationSimulation";
import DBMSQueryOptimizationQuiz from "./DBMSQueryOptimizationQuiz";
import DBMSQueryOptimizationCoding from "./DBMSQueryOptimizationCoding";

const simulabLogo = "/assets/logo.png";

const quizQuestionsByMode = {
  selection: [
    {
      question: "Query optimization mainly tries to:",
      options: [
        "Increase redundancy",
        "Reduce execution cost",
        "Delete all indexes",
        "Convert SQL into HTML",
      ],
      correct: 1,
    },
    {
      question: "A selective WHERE clause usually helps because it:",
      options: [
        "Filters rows early",
        "Increases table size",
        "Creates duplicates",
        "Avoids all joins",
      ],
      correct: 0,
    },
    {
      question: "Applying selection early is usually beneficial because:",
      options: [
        "Fewer rows move to later steps",
        "It disables optimization",
        "It removes primary keys",
        "It always sorts data",
      ],
      correct: 0,
    },
  ],
  projection: [
    {
      question: "Projection means:",
      options: [
        "Choosing needed columns",
        "Deleting rows only",
        "Creating locks",
        "Updating indexes",
      ],
      correct: 0,
    },
    {
      question: "Early projection can improve performance by:",
      options: [
        "Reducing data passed forward",
        "Adding more columns",
        "Creating anomalies",
        "Removing WHERE clause",
      ],
      correct: 0,
    },
    {
      question: "Projection optimization mainly reduces:",
      options: [
        "Number of columns processed",
        "Transaction rollback only",
        "Primary key count",
        "Concurrency issues",
      ],
      correct: 0,
    },
  ],
  join: [
    {
      question: "Join optimization often tries to:",
      options: [
        "Choose a better join order",
        "Remove all foreign keys",
        "Disable indexing",
        "Avoid all conditions",
      ],
      correct: 0,
    },
    {
      question: "Joining smaller filtered tables first is often better because:",
      options: [
        "Intermediate results are smaller",
        "It increases memory use only",
        "It always makes joins incorrect",
        "It avoids SQL parsing",
      ],
      correct: 0,
    },
    {
      question: "A bad join order can lead to:",
      options: [
        "Larger intermediate results",
        "Automatic normalization",
        "Stronger primary keys",
        "Fewer tables in schema",
      ],
      correct: 0,
    },
  ],
};

const codingProblemsByMode = {
  selection: [
    {
      title: "Optimize selection query",
      description:
        "Write an optimized version of a query that filters rows early using a WHERE condition.",
    },
    {
      title: "Reduce scanned rows",
      description:
        "Write a query optimization idea that pushes the department filter before any expensive processing.",
    },
    {
      title: "Selection pushdown plan",
      description:
        "Show a structured answer that explains how early filtering reduces intermediate rows.",
    },
  ],
  projection: [
    {
      title: "Optimize projection query",
      description:
        "Write an optimized version of a query that selects only the required columns.",
    },
    {
      title: "Avoid SELECT *",
      description:
        "Rewrite a query so it returns only student_id and name from Students.",
    },
    {
      title: "Projection pushdown plan",
      description:
        "Write a structured answer showing how early projection reduces data transfer and processing.",
    },
  ],
  join: [
    {
      title: "Optimize join order",
      description:
        "Write an optimized query plan idea where filtering happens before a join to reduce intermediate rows.",
    },
    {
      title: "Join filtered inputs first",
      description:
        "Show how filtering Students before joining with Enrollments improves performance.",
    },
    {
      title: "Reduce join cost",
      description:
        "Write a structured answer explaining how a better join order reduces query cost.",
    },
  ],
};

const codeTemplates = {
  selection: {
    javascript: `const answer = {
  original: "SELECT * FROM Students WHERE department = 'CSE'",
  optimizedIdea: "Apply selection early so only CSE rows move to later stages"
};`,
    python: `answer = {
    "original": "SELECT * FROM Students WHERE department = 'CSE'",
    "optimizedIdea": "Apply selection early so only CSE rows move to later stages"
}`,
    cpp: `string answer =
"Apply the WHERE filter as early as possible to reduce rows processed later.";`,
    c: `char answer[] =
"Apply the WHERE filter as early as possible to reduce rows processed later.";`,
    java: `String answer =
"Apply the WHERE filter as early as possible to reduce rows processed later.";`,
  },
  projection: {
    javascript: `const answer = {
  original: "SELECT * FROM Students",
  optimized: "SELECT student_id, name FROM Students",
  optimizedIdea: "Project only required columns early"
};`,
    python: `answer = {
    "original": "SELECT * FROM Students",
    "optimized": "SELECT student_id, name FROM Students",
    "optimizedIdea": "Project only required columns early"
}`,
    cpp: `string answer =
"Select only required columns instead of SELECT * to reduce data transfer.";`,
    c: `char answer[] =
"Select only required columns instead of SELECT * to reduce data transfer.";`,
    java: `String answer =
"Select only required columns instead of SELECT * to reduce data transfer.";`,
  },
  join: {
    javascript: `const answer = {
  originalPlan: "Join Students and Enrollments first, then filter",
  optimizedPlan: "Filter Students by department first, then join with Enrollments"
};`,
    python: `answer = {
    "originalPlan": "Join Students and Enrollments first, then filter",
    "optimizedPlan": "Filter Students by department first, then join with Enrollments"
}`,
    cpp: `string answer =
"Apply selection before join so the join works on fewer rows.";`,
    c: `char answer[] =
"Apply selection before join so the join works on fewer rows.";`,
    java: `String answer =
"Apply selection before join so the join works on fewer rows.";`,
  },
};

const studentsTable = [
  { student_id: 1, name: "Aarav", department: "CSE", semester: 5 },
  { student_id: 2, name: "Diya", department: "ECE", semester: 3 },
  { student_id: 3, name: "Kabir", department: "CSE", semester: 5 },
  { student_id: 4, name: "Meera", department: "ME", semester: 4 },
  { student_id: 5, name: "Rohan", department: "CSE", semester: 6 },
];

const enrollmentsTable = [
  { student_id: 1, course_id: "C101", grade: "A" },
  { student_id: 1, course_id: "C102", grade: "B+" },
  { student_id: 2, course_id: "E201", grade: "A-" },
  { student_id: 3, course_id: "C101", grade: "A" },
  { student_id: 5, course_id: "C301", grade: "B" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sectionItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: Gauge },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding", icon: Code2 },
];

const modeMeta = {
  selection: {
    icon: Filter,
    title: "Selection Pushdown",
    desc: "Apply filters early to reduce the rows flowing through the plan.",
  },
  projection: {
    icon: Database,
    title: "Projection Pushdown",
    desc: "Keep only the needed columns as early as possible.",
  },
  join: {
    icon: ArrowLeftRight,
    title: "Join Order Optimization",
    desc: "Reduce intermediate results by joining better filtered inputs first.",
  },
};

export default function DBMSQueryOptimizationLab() {
  const [mode, setMode] = useState("selection");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Query Optimization lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const [currentStage, setCurrentStage] = useState("");
  const [inputRowsCount, setInputRowsCount] = useState(0);
  const [outputRowsCount, setOutputRowsCount] = useState(0);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [resultRows, setResultRows] = useState([]);
  const [planText, setPlanText] = useState("");

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codes, setCodes] = useState(
    Array(codingProblemsByMode.selection.length).fill(
      codeTemplates.selection.javascript
    )
  );
  const [results, setResults] = useState(
    Array(codingProblemsByMode.selection.length).fill("")
  );

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const quizQuestions = useMemo(() => quizQuestionsByMode[mode], [mode]);
  const codingProblems = useMemo(() => codingProblemsByMode[mode], [mode]);
  const currentModeMeta = modeMeta[mode];
  const CurrentModeIcon = currentModeMeta.icon;

  useEffect(() => {
    setStepHistory([]);
    setCurrentStage("");
    setInputRowsCount(0);
    setOutputRowsCount(0);
    setHighlightedRows([]);
    setResultRows([]);
    setPlanText("");
    setMessage("Query Optimization lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setQuizAnswers(Array(quizQuestionsByMode[mode].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);

    const starter = codeTemplates[mode][selectedLanguage];
    const problemCount = codingProblemsByMode[mode].length;
    setCodes(Array(problemCount).fill(starter));
    setResults(Array(problemCount).fill(""));
  }, [mode, selectedLanguage]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const runSimulation = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setExperimentRun(true);
    setStepHistory([]);
    setCurrentStage("Simulation Start");
    setHighlightedRows([]);
    setResultRows([]);
    setPlanText("");

    try {
      if (mode === "selection") {
        setInputRowsCount(studentsTable.length);
        setMessage("Starting selection optimization demo...");
        addStep("Started selection optimization demo.");
        await sleep(animationSpeed);

        setCurrentStage("Apply WHERE Early");
        setPlanText("Optimization: Apply WHERE department = 'CSE' as early as possible.");
        setMessage("Filtering rows early using WHERE department = 'CSE'.");
        addStep("Applied selection early to reduce rows before later processing.");
        await sleep(animationSpeed);

        const filtered = studentsTable.filter((row) => row.department === "CSE");
        setHighlightedRows(filtered.map((row) => row.student_id));
        setResultRows(filtered);
        setOutputRowsCount(filtered.length);
        await sleep(animationSpeed);
      }

      if (mode === "projection") {
        setInputRowsCount(studentsTable.length);
        setMessage("Starting projection optimization demo...");
        addStep("Started projection optimization demo.");
        await sleep(animationSpeed);

        setCurrentStage("Reduce Columns Early");
        setPlanText("Optimization: Select only needed columns instead of SELECT *.");
        setMessage("Projecting only student_id and name.");
        addStep("Applied projection early to reduce unnecessary column processing.");
        await sleep(animationSpeed);

        const projected = studentsTable.map((row) => ({
          student_id: row.student_id,
          name: row.name,
        }));

        setHighlightedRows(studentsTable.map((row) => row.student_id));
        setResultRows(projected);
        setOutputRowsCount(projected.length);
        await sleep(animationSpeed);
      }

      if (mode === "join") {
        setInputRowsCount(studentsTable.length + enrollmentsTable.length);
        setMessage("Starting join optimization demo...");
        addStep("Started join optimization demo.");
        await sleep(animationSpeed);

        setCurrentStage("Filter Before Join");
        setPlanText(
          "Optimization: Filter Students where department = 'CSE' before joining with Enrollments."
        );
        setMessage("Filtering Students first, then joining with Enrollments.");
        addStep("Reduced join input by filtering Students before join.");
        await sleep(animationSpeed);

        const filteredStudents = studentsTable.filter(
          (row) => row.department === "CSE"
        );
        setHighlightedRows(filteredStudents.map((row) => row.student_id));
        await sleep(animationSpeed);

        setCurrentStage("Join Smaller Inputs");
        const joined = [];
        for (const student of filteredStudents) {
          for (const enrollment of enrollmentsTable) {
            if (student.student_id === enrollment.student_id) {
              joined.push({
                student_id: student.student_id,
                name: student.name,
                course_id: enrollment.course_id,
                grade: enrollment.grade,
              });
            }
          }
        }

        setResultRows(joined);
        setOutputRowsCount(joined.length);
        setMessage("Joined filtered Students with Enrollments.");
        addStep("Joined smaller filtered input, reducing intermediate result size.");
        await sleep(animationSpeed);
      }

      setCurrentStage("Complete");
      setMessage(`${mode.toUpperCase()} optimization demo completed.`);
      addStep(`${mode.toUpperCase()} optimization simulation completed successfully.`);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `dbms-query-opt-${mode}`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
    }
  };

  const loadSample = () => {
    if (isRunning) return;

    setCurrentStage("Sample Ready");
    setHighlightedRows([]);
    setResultRows([]);
    setPlanText("Sample loaded. Run the demo to observe optimization steps.");
    setInputRowsCount(
      mode === "join"
        ? studentsTable.length + enrollmentsTable.length
        : studentsTable.length
    );
    setOutputRowsCount(0);
    setStepHistory([`Sample loaded for ${mode.toUpperCase()} optimization demo.`]);
    setMessage(`Sample loaded for ${mode.toUpperCase()} optimization demo.`);
  };

  const reset = () => {
    if (isRunning) return;

    setCurrentStage("");
    setInputRowsCount(0);
    setOutputRowsCount(0);
    setHighlightedRows([]);
    setResultRows([]);
    setPlanText("");
    setStepHistory([]);
    setMessage("Query Optimization lab reset.");
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
      experiment: `query-opt-${mode}`,
      correct: score,
      total: quizQuestions.length,
      time: Date.now(),
    });
    localStorage.setItem("vlab_scores", JSON.stringify(scores));
  };

  const updateCodeAt = (index, value) => {
    setCodes((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const setResultAt = (index, value) => {
    setResults((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const runCode = (problemIndex) => {
    if (selectedLanguage !== "javascript") {
      setResultAt(
        problemIndex,
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${codes[problemIndex]}; return answer;`);
      const result = fn();
      setResultAt(problemIndex, `Output:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResultAt(problemIndex, `Error: ${error.message}`);
    }
  };

  const analyzeCode = (problemIndex) => {
    const content = codes[problemIndex].toLowerCase();

    const modeChecks = {
      selection: ["where", "filter", "selection", "early", "rows"],
      projection: ["select", "columns", "projection", "student_id", "name"],
      join: ["join", "filter", "before", "intermediate", "rows"],
    };

    const keywords = modeChecks[mode] || [];
    const score = keywords.filter((k) => content.includes(k)).length;

    if (score >= Math.max(2, keywords.length - 2)) {
      setResultAt(
        problemIndex,
        "Analysis:\nYour answer includes the main query optimization ideas expected for this problem."
      );
    } else {
      setResultAt(
        problemIndex,
        "Analysis:\nYour answer is partially correct, but it should include more optimization keywords relevant to this mode."
      );
    }
  };

  const correctCode = (problemIndex) => {
    const corrected = codeTemplates[mode][selectedLanguage];
    updateCodeAt(problemIndex, corrected);
    setResultAt(problemIndex, "Model answer loaded for this problem.");
  };

  const progressValue = experimentRun ? 75 : 35;
  const ringAngle = Math.max(0, Math.min(100, progressValue)) * 3.6;

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="er-brand">
          <div className="er-brand-logo">
            <img src={simulabLogo} alt="SimuLab" />
          </div>

          {!sidebarCollapsed && (
            <div>
              <div className="er-brand-title">SimuLab</div>
              <div className="er-brand-subtitle">DBMS Virtual Lab</div>
            </div>
          )}
        </div>

        <nav className="er-nav">
          {sectionItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`er-nav-item ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
                title={item.label}
              >
                <Icon size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="er-progress-card">
            <div className="er-progress-title">Your Progress</div>

            <div className="er-progress-ring">
              <div
                className="er-progress-circle"
                style={{
                  background: `conic-gradient(#4aa8ff ${ringAngle}deg, rgba(255,255,255,0.08) 0deg)`,
                }}
              >
                <div className="er-progress-inner">
                  <div className="er-progress-value">{progressValue}%</div>
                  <div className="er-progress-text">Complete</div>
                </div>
              </div>
            </div>

            <div className="er-last-activity">
              <div className="er-last-activity-label">Last Activity</div>
              <div className="er-last-activity-row">
                <span>Query Optimization</span>
                <span className="dot-live">● Just now</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <header className="er-page-header">
          <h1 className="er-page-title">Query Optimization</h1>
          <p className="er-page-subtitle">
            Learn selection pushdown, projection pushdown, and join order optimization
            through visual exploration. ✨
          </p>
        </header>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Optimization Configuration</h2>
              <p>
                Choose the optimization mode and control the animation flow for the simulation.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <CurrentModeIcon size={24} />
              </div>
              <div>
                <strong>{currentModeMeta.title}</strong>
                <span>{currentModeMeta.desc}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Mode</label>
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
            {Object.entries(modeMeta).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <button
                  key={key}
                  className={`er-chip ${mode === key ? "active" : ""}`}
                  onClick={() => setMode(key)}
                  disabled={isRunning}
                >
                  <Icon size={16} />
                  <span>
                    {key === "selection"
                      ? "Selection"
                      : key === "projection"
                      ? "Projection"
                      : "Join"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="er-content-layout">
          <div className="er-content-card">
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

            {activeSection === "quiz" && (
              <DBMSQueryOptimizationQuiz
                mode={mode}
                quizQuestions={quizQuestions}
                quizAnswers={quizAnswers}
                quizSubmitted={quizSubmitted}
                quizScore={quizScore}
                experimentRun={experimentRun}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
              />
            )}

            {activeSection === "coding" && (
              <DBMSQueryOptimizationCoding
                codingProblems={codingProblems}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                codes={codes}
                results={results}
                handleCodeChange={updateCodeAt}
                runCode={runCode}
                analyzeCode={analyzeCode}
                correctCode={correctCode}
                mode={mode}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}