import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.js";
import {
  ArrowLeftRight,
  BookOpen,
  Brain,
  ChevronsLeft,
  Code2,
  Database,
  Filter,
  Gauge
} from "lucide-react";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import DBMSQueryOptimizationOverview from "./DBMSQueryOptimizationOverview";
import DBMSQueryOptimizationSimulation from "./DBMSQueryOptimizationSimulation";
import DBMSQueryOptimizationQuiz from "./DBMSQueryOptimizationQuiz";
import DBMSQueryOptimizationCoding from "./DBMSQueryOptimizationCoding";

const simulabLogo = "/assets/logo.png";
const LAB_SLUG = "dbms";
const EXPERIMENT_SLUG = "query-optimization";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: Gauge },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: Code2 }
];

const quizQuestionsByMode = {
  selection: [
    {
      question: "Query optimization mainly tries to:",
      options: ["Increase redundancy", "Reduce execution cost", "Delete all indexes", "Convert SQL into HTML"],
      correct: 1
    },
    {
      question: "A selective WHERE clause usually helps because it:",
      options: ["Filters rows early", "Increases table size", "Creates duplicates", "Avoids all joins"],
      correct: 0
    },
    {
      question: "Applying selection early is usually beneficial because:",
      options: ["Fewer rows move to later steps", "It disables optimization", "It removes primary keys", "It always sorts data"],
      correct: 0
    }
  ],
  projection: [
    {
      question: "Projection means:",
      options: ["Choosing needed columns", "Deleting rows only", "Creating locks", "Updating indexes"],
      correct: 0
    },
    {
      question: "Early projection can improve performance by:",
      options: ["Reducing data passed forward", "Adding more columns", "Creating anomalies", "Removing WHERE clause"],
      correct: 0
    },
    {
      question: "Projection optimization mainly reduces:",
      options: ["Number of columns processed", "Transaction rollback only", "Primary key count", "Concurrency issues"],
      correct: 0
    }
  ],
  join: [
    {
      question: "Join optimization often tries to:",
      options: ["Choose a better join order", "Remove all foreign keys", "Disable indexing", "Avoid all conditions"],
      correct: 0
    },
    {
      question: "Joining smaller filtered tables first is often better because:",
      options: ["Intermediate results are smaller", "It increases memory use only", "It always makes joins incorrect", "It avoids SQL parsing"],
      correct: 0
    },
    {
      question: "A bad join order can lead to:",
      options: ["Larger intermediate results", "Automatic normalization", "Stronger primary keys", "Fewer tables in schema"],
      correct: 0
    }
  ]
};

const codingProblemsByMode = {
  selection: [
    {
      title: "Optimize selection query",
      description: "Write an optimized version of a query that filters rows early using a WHERE condition."
    },
    {
      title: "Reduce scanned rows",
      description: "Write a query optimization idea that pushes the department filter before any expensive processing."
    },
    {
      title: "Selection pushdown plan",
      description: "Show a structured answer that explains how early filtering reduces intermediate rows."
    }
  ],
  projection: [
    {
      title: "Optimize projection query",
      description: "Write an optimized version of a query that selects only the required columns."
    },
    {
      title: "Avoid SELECT *",
      description: "Rewrite a query so it returns only student_id and name from Students."
    },
    {
      title: "Projection pushdown plan",
      description: "Write a structured answer showing how early projection reduces data transfer and processing."
    }
  ],
  join: [
    {
      title: "Optimize join order",
      description: "Write an optimized query plan idea where filtering happens before a join to reduce intermediate rows."
    },
    {
      title: "Join filtered inputs first",
      description: "Show how filtering Students before joining with Enrollments improves performance."
    },
    {
      title: "Reduce join cost",
      description: "Write a structured answer explaining how a better join order reduces query cost."
    }
  ]
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
"Apply the WHERE filter as early as possible to reduce rows processed later.";`
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
"Select only required columns instead of SELECT * to reduce data transfer.";`
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
"Apply selection before join so the join works on fewer rows.";`
  }
};

const studentsTable = [
  { student_id: 1, name: "Aarav", department: "CSE", semester: 5 },
  { student_id: 2, name: "Diya", department: "ECE", semester: 3 },
  { student_id: 3, name: "Kabir", department: "CSE", semester: 5 },
  { student_id: 4, name: "Meera", department: "ME", semester: 4 },
  { student_id: 5, name: "Rohan", department: "CSE", semester: 6 }
];

const enrollmentsTable = [
  { student_id: 1, course_id: "C101", grade: "A" },
  { student_id: 1, course_id: "C102", grade: "B+" },
  { student_id: 2, course_id: "E201", grade: "A-" },
  { student_id: 3, course_id: "C101", grade: "A" },
  { student_id: 5, course_id: "C301", grade: "B" }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const modeMeta = {
  selection: {
    icon: Filter,
    title: "Selection Pushdown",
    desc: "Apply filters early to reduce rows flowing through the query plan.",
    chip: "Selection"
  },
  projection: {
    icon: Database,
    title: "Projection Pushdown",
    desc: "Keep only required columns as early as possible.",
    chip: "Projection"
  },
  join: {
    icon: ArrowLeftRight,
    title: "Join Order Optimization",
    desc: "Reduce intermediate results by joining filtered inputs first.",
    chip: "Join"
  }
};

export default function DBMSQueryOptimizationLab() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("selection");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const quizQuestions = useMemo(() => quizQuestionsByMode[mode], [mode]);
  const codingProblems = useMemo(() => codingProblemsByMode[mode], [mode]);

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestionsByMode.selection.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codes, setCodes] = useState(
    Array(codingProblemsByMode.selection.length).fill(codeTemplates.selection.javascript)
  );
  const [results, setResults] = useState(Array(codingProblemsByMode.selection.length).fill(""));
  const [codingSaveStatus, setCodingSaveStatus] = useState({});

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

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
    setQuizSaveStatus("");

    const starter = codeTemplates[mode][selectedLanguage];
    const count = codingProblemsByMode[mode].length;
    setCodes(Array(count).fill(starter));
    setResults(Array(count).fill(""));
    setCodingSaveStatus({});
  }, [mode, selectedLanguage]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const saveQuizResult = async (score, total) => {
    try {
      setQuizSaveStatus("Saving quiz result...");

      const response = await fetch("http://localhost:5000/api/quiz-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          labSlug: LAB_SLUG,
          experimentSlug: EXPERIMENT_SLUG,
          correctAnswers: score,
          totalQuestions: total,
          scorePercentage: ((score / total) * 100).toFixed(2)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save quiz result");
      }

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error(error);
      setQuizSaveStatus("Quiz submitted, but dashboard save failed.");
    }
  };

  const saveCodingSubmission = async ({
  labSlug,
  experimentSlug,
  problemTitle,
  language,
  code,
  result,
  points
}) => {
  const response = await fetch("http://localhost:5000/api/coding-submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      labSlug,
      experimentSlug,
      problemTitle,
      language,
      code,
      result,
      points
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to save coding submission");
  }

  return data;
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
    setInputRowsCount(0);
    setOutputRowsCount(0);

    try {
      if (mode === "selection") {
        setInputRowsCount(studentsTable.length);
        setMessage("Starting selection pushdown demo...");
        addStep("Started selection pushdown optimization demo.");
        await sleep(animationSpeed);

        setCurrentStage("Apply WHERE Early");
        setPlanText("Apply WHERE department = 'CSE' before later processing.");
        setMessage("Filtering rows early using WHERE department = 'CSE'.");
        addStep("Selection applied early so fewer rows move forward.");
        await sleep(animationSpeed);

        const filtered = studentsTable.filter((row) => row.department === "CSE");
        setHighlightedRows(filtered.map((row) => row.student_id));
        setResultRows(filtered);
        setOutputRowsCount(filtered.length);
        await sleep(animationSpeed);
      }

      if (mode === "projection") {
        setInputRowsCount(studentsTable.length);
        setMessage("Starting projection pushdown demo...");
        addStep("Started projection pushdown optimization demo.");
        await sleep(animationSpeed);

        setCurrentStage("Reduce Columns Early");
        setPlanText("Select only student_id and name instead of using SELECT *.");
        setMessage("Projecting only required columns.");
        addStep("Projection applied early to reduce unnecessary column processing.");
        await sleep(animationSpeed);

        const projected = studentsTable.map((row) => ({
          student_id: row.student_id,
          name: row.name
        }));

        setHighlightedRows(studentsTable.map((row) => row.student_id));
        setResultRows(projected);
        setOutputRowsCount(projected.length);
        await sleep(animationSpeed);
      }

      if (mode === "join") {
        setInputRowsCount(studentsTable.length + enrollmentsTable.length);
        setMessage("Starting join optimization demo...");
        addStep("Started join order optimization demo.");
        await sleep(animationSpeed);

        setCurrentStage("Filter Before Join");
        setPlanText("Filter Students where department = 'CSE' before joining with Enrollments.");
        setMessage("Filtering Students first before join.");
        addStep("Reduced join input by filtering Students first.");
        await sleep(animationSpeed);

        const filteredStudents = studentsTable.filter((row) => row.department === "CSE");
        setHighlightedRows(filteredStudents.map((row) => row.student_id));
        await sleep(animationSpeed);

        setCurrentStage("Join Smaller Inputs");

        const joined = [];
        filteredStudents.forEach((student) => {
          enrollmentsTable.forEach((enrollment) => {
            if (student.student_id === enrollment.student_id) {
              joined.push({
                student_id: student.student_id,
                name: student.name,
                course_id: enrollment.course_id,
                grade: enrollment.grade
              });
            }
          });
        });

        setResultRows(joined);
        setOutputRowsCount(joined.length);
        setMessage("Joined filtered Students with Enrollments.");
        addStep("Joined smaller filtered input, reducing intermediate result size.");
        await sleep(animationSpeed);
      }

      setCurrentStage("Complete");
      setMessage(`${modeMeta[mode].title} completed.`);
      addStep(`${modeMeta[mode].title} simulation completed successfully.`);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({
          name: `dbms-query-optimization-${mode}`,
          time: Date.now()
        })
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
    setInputRowsCount(mode === "join" ? studentsTable.length + enrollmentsTable.length : studentsTable.length);
    setOutputRowsCount(0);
    setStepHistory([`Sample loaded for ${modeMeta[mode].title}.`]);
    setMessage(`Sample loaded for ${modeMeta[mode].title}.`);
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

  const handleQuizAnswer = (index, value) => {
    const updated = [...quizAnswers];
    updated[index] = value;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let score = 0;

    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const scores = JSON.parse(localStorage.getItem("vlab_scores") || "[]");
    scores.push({
      subject: "DBMS",
      experiment: EXPERIMENT_SLUG,
      mode,
      correct: score,
      total: quizQuestions.length,
      time: Date.now()
    });
    localStorage.setItem("vlab_scores", JSON.stringify(scores));

    await saveQuizResult(score, quizQuestions.length);
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const updateCodeAt = (index, value) => {
    setCodes((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const setResultAt = (index, value) => {
    setResults((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const runCode = async (problemIndex) => {
  if (selectedLanguage !== "javascript") {
    setResultAt(
      problemIndex,
      `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet.`
    );
    return;
  }

  try {
    //eslint-disable-next-line no-new-func
    const fn = new Function(`${codes[problemIndex]}; return answer;`);
    const output = fn();

    setResultAt(
      problemIndex,
      `Output:\n${JSON.stringify(output, null, 2)}`
    );

    // ✅ Try saving but DON'T break UI if it fails
    try {
      await saveCodingSubmission({
        labSlug: "dbms",
        experimentSlug: "query-optimization",
        problemTitle: codingProblems[problemIndex].title,
        language: selectedLanguage,
        code: codes[problemIndex],
        result: JSON.stringify(output),
        points: 10
      });
    } catch (err) {
      console.warn("Save failed, continuing anyway:", err.message);
      // ❌ DO NOT show error to user
    }

  } catch (error) {
    setResultAt(problemIndex, `Error: ${error.message}`);
  }
};

  const analyzeCode = (problemIndex) => {
    const content = (codes[problemIndex] || "").toLowerCase();

    const checks = {
      selection: ["where", "filter", "selection", "early", "rows"],
      projection: ["select", "columns", "projection", "student_id", "name"],
      join: ["join", "filter", "before", "intermediate", "rows"]
    };

    const keywords = checks[mode] || [];
    const matched = keywords.filter((word) => content.includes(word));

    if (matched.length >= 3) {
      setResultAt(
        problemIndex,
        `Analysis:\nGood answer. You included important optimization concepts: ${matched.join(", ")}.`
      );
    } else {
      setResultAt(
        problemIndex,
        `Analysis:\nYour answer is partially correct. Try including more ideas like: ${keywords.join(", ")}.`
      );
    }
  };

  const correctCode = (problemIndex) => {
    updateCodeAt(problemIndex, codeTemplates[mode][selectedLanguage]);
    setResultAt(problemIndex, "Model answer loaded for this problem.");
  };

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 52
      : activeSection === "quiz"
      ? 82
      : 95;

  const CurrentModeIcon = modeMeta[mode].icon;

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
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">Query Optimization</h1>
            <p className="er-page-subtitle">
              Learn selection pushdown, projection pushdown, and join order optimization through visual execution plans.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Optimization Configuration</h2>
              <p>
                Choose an optimization technique and observe how the query plan becomes more efficient.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <CurrentModeIcon size={18} />
              </div>
              <div>
                <strong>{modeMeta[mode].title}</strong>
                <span>{modeMeta[mode].desc}</span>
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
            {Object.entries(modeMeta).map(([key, meta]) => {
              const Icon = meta.icon;

              return (
                <button
                  key={key}
                  className={`er-chip ${mode === key ? "active" : ""}`}
                  onClick={() => setMode(key)}
                  disabled={isRunning}
                >
                  <Icon size={14} />
                  {meta.chip}
                </button>
              );
            })}

            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <MarkCompleteButton
              labSlug={LAB_SLUG}
              experimentSlug={EXPERIMENT_SLUG}
              points={10}
            />
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
                codingProblems={codingProblems}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                codes={codes}
                results={results}
                codingSaveStatus={codingSaveStatus}
                setCodingSaveStatus={setCodingSaveStatus}
                saveCodingSubmission={saveCodingSubmission}
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