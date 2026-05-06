import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  Link2
} from "lucide-react";
import "../../../SortingLab.css";

import { saveQuizResult } from "../../../../API/progressApi";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import DBMSJoinsOverview from "./DBMSJoinsOverview";
import DBMSJoinsSimulation from "./DBMSJoinsSimulation";
import DBMSJoinsQuiz from "./DBMSJoinsQuiz";
import DBMSJoinsCoding from "./DBMSJoinsCoding";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const joinQuizQuestionsByType = {
  inner: [
    {
      question: "What does INNER JOIN return?",
      options: [
        "All rows from left table only",
        "Only matching rows from both tables",
        "All rows from both tables always",
        "Only non-matching rows"
      ],
      correct: 1
    },
    {
      question: "INNER JOIN works using:",
      options: [
        "A matching condition between columns",
        "Only row order",
        "Only primary key names",
        "Random pairing"
      ],
      correct: 0
    },
    {
      question: "If a row has no match in INNER JOIN:",
      options: ["It is still shown", "It is duplicated", "It is excluded", "It becomes zero"],
      correct: 2
    }
  ],
  left: [
    {
      question: "What does LEFT JOIN always keep?",
      options: ["All rows from right table", "Only matching rows", "All rows from left table", "No rows"],
      correct: 2
    },
    {
      question: "If no right-side match is found in LEFT JOIN:",
      options: ["The left row is removed", "Right-side columns become NULL", "The query fails", "The row is sorted last"],
      correct: 1
    },
    {
      question: "LEFT JOIN is useful when you want to:",
      options: ["Keep all left-table data", "Delete unmatched rows", "Sort rows only", "Create indexes"],
      correct: 0
    }
  ],
  right: [
    {
      question: "What does RIGHT JOIN always keep?",
      options: ["All rows from left table", "All rows from right table", "Only matching rows", "No unmatched rows"],
      correct: 1
    },
    {
      question: "If no left-side match is found in RIGHT JOIN:",
      options: ["Left-side columns become NULL", "The right row is removed", "The database crashes", "The row is duplicated"],
      correct: 0
    },
    {
      question: "RIGHT JOIN is the mirror version of:",
      options: ["GROUP BY", "LEFT JOIN", "ORDER BY", "UNION"],
      correct: 1
    }
  ]
};

const studentsTable = [
  { id: 1, name: "Aarav", department_id: 101, age: 20 },
  { id: 2, name: "Diya", department_id: 102, age: 21 },
  { id: 3, name: "Kabir", department_id: 101, age: 19 },
  { id: 4, name: "Meera", department_id: 104, age: 22 },
  { id: 5, name: "Rohan", department_id: 105, age: 20 }
];

const departmentsTable = [
  { department_id: 101, department_name: "CSE", hod: "Dr. Sharma" },
  { department_id: 102, department_name: "ECE", hod: "Dr. Iyer" },
  { department_id: 103, department_name: "ME", hod: "Dr. Khan" },
  { department_id: 104, department_name: "Civil", hod: "Dr. Rao" }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DBMSJoinsLab() {
  const [joinType, setJoinType] = useState("inner");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [message, setMessage] = useState("SQL Joins lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [matchedStudentIds, setMatchedStudentIds] = useState([]);
  const [matchedDepartmentIds, setMatchedDepartmentIds] = useState([]);
  const [joinedRows, setJoinedRows] = useState([]);
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [currentStage, setCurrentStage] = useState("");

  const quizQuestions = useMemo(() => joinQuizQuestionsByType[joinType], [joinType]);

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const joinNames = {
    inner: "INNER JOIN",
    left: "LEFT JOIN",
    right: "RIGHT JOIN"
  };

  const joinMeta = {
    inner: {
      keeps: "Matching Rows",
      unmatched: "Excluded",
      use: "Common relationship lookup"
    },
    left: {
      keeps: "All Left Rows",
      unmatched: "Right side NULL",
      use: "Keep all students"
    },
    right: {
      keeps: "All Right Rows",
      unmatched: "Left side NULL",
      use: "Keep all departments"
    }
  };

  useEffect(() => {
    setStepHistory([]);
    setSelectedStudentId(null);
    setSelectedDepartmentId(null);
    setMatchedStudentIds([]);
    setMatchedDepartmentIds([]);
    setJoinedRows([]);
    setGeneratedSQL("");
    setCurrentStage("");
    setMessage("SQL Joins lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setQuizAnswers(Array(joinQuizQuestionsByType[joinType].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [joinType]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const buildJoinQuery = () => {
    const joinKeyword =
      joinType === "inner" ? "INNER JOIN" : joinType === "left" ? "LEFT JOIN" : "RIGHT JOIN";

    return `SELECT s.name, s.department_id, d.department_name, d.hod
FROM students s
${joinKeyword} departments d
ON s.department_id = d.department_id;`;
  };

  const runSimulation = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setExperimentRun(true);
    setStepHistory([]);
    setSelectedStudentId(null);
    setSelectedDepartmentId(null);
    setMatchedStudentIds([]);
    setMatchedDepartmentIds([]);
    setJoinedRows([]);
    setGeneratedSQL(buildJoinQuery());
    setCurrentStage("Preparing Join");

    try {
      addStep(`Starting ${joinType.toUpperCase()} JOIN simulation.`);
      setMessage(`Starting ${joinType.toUpperCase()} JOIN simulation...`);
      await sleep(animationSpeed);

      const results = [];

      if (joinType === "inner" || joinType === "left") {
        for (const student of studentsTable) {
          setSelectedStudentId(student.id);
          setSelectedDepartmentId(null);
          setCurrentStage("Scanning Student Row");
          setMessage(`Checking ${student.name} with department_id = ${student.department_id}`);
          addStep(`Scanning student row: ${student.name} (${student.department_id}).`);
          await sleep(animationSpeed);

          const matches = departmentsTable.filter(
            (dept) => dept.department_id === student.department_id
          );

          if (matches.length > 0) {
            for (const dept of matches) {
              setSelectedDepartmentId(dept.department_id);
              setMatchedStudentIds((prev) => [...new Set([...prev, student.id])]);
              setMatchedDepartmentIds((prev) => [...new Set([...prev, dept.department_id])]);

              setCurrentStage("Match Found");
              setMessage(`Match found: ${student.name} ↔ ${dept.department_name}`);
              addStep(`Match found between ${student.name} and ${dept.department_name}.`);
              await sleep(animationSpeed);

              results.push({
                student_name: student.name,
                student_department_id: student.department_id,
                department_name: dept.department_name,
                hod: dept.hod
              });
            }
          } else if (joinType === "left") {
            setCurrentStage("No Right Match");
            setMessage(`No department found for ${student.name}. LEFT JOIN keeps this row.`);
            addStep(`No department match for ${student.name}. Added NULL right-side values.`);
            await sleep(animationSpeed);

            results.push({
              student_name: student.name,
              student_department_id: student.department_id,
              department_name: "NULL",
              hod: "NULL"
            });
          } else {
            setCurrentStage("No Match");
            setMessage(`No department found for ${student.name}. INNER JOIN excludes it.`);
            addStep(`No department match for ${student.name}. Row excluded.`);
            await sleep(animationSpeed);
          }

          setJoinedRows([...results]);
        }
      }

      if (joinType === "right") {
        for (const dept of departmentsTable) {
          setSelectedDepartmentId(dept.department_id);
          setSelectedStudentId(null);
          setCurrentStage("Scanning Department Row");
          setMessage(`Checking ${dept.department_name} with department_id = ${dept.department_id}`);
          addStep(`Scanning department row: ${dept.department_name} (${dept.department_id}).`);
          await sleep(animationSpeed);

          const matches = studentsTable.filter(
            (student) => student.department_id === dept.department_id
          );

          if (matches.length > 0) {
            for (const student of matches) {
              setSelectedStudentId(student.id);
              setMatchedStudentIds((prev) => [...new Set([...prev, student.id])]);
              setMatchedDepartmentIds((prev) => [...new Set([...prev, dept.department_id])]);

              setCurrentStage("Match Found");
              setMessage(`Match found: ${student.name} ↔ ${dept.department_name}`);
              addStep(`Match found between ${dept.department_name} and ${student.name}.`);
              await sleep(animationSpeed);

              results.push({
                student_name: student.name,
                student_department_id: student.department_id,
                department_name: dept.department_name,
                hod: dept.hod
              });
            }
          } else {
            setCurrentStage("No Left Match");
            setMessage(`No student matched ${dept.department_name}. RIGHT JOIN keeps this row.`);
            addStep(`No student match for ${dept.department_name}. Added NULL left-side values.`);
            await sleep(animationSpeed);

            results.push({
              student_name: "NULL",
              student_department_id: "NULL",
              department_name: dept.department_name,
              hod: dept.hod
            });
          }

          setJoinedRows([...results]);
        }
      }

      setSelectedStudentId(null);
      setSelectedDepartmentId(null);
      setCurrentStage("Join Complete");
      setMessage(`${joinType.toUpperCase()} JOIN simulation completed.`);
      addStep(`${joinType.toUpperCase()} JOIN simulation completed successfully.`);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `dbms-${joinType}-join`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
    }
  };

  const loadSample = () => {
    if (isRunning) return;

    setStepHistory([`Sample prepared for ${joinType.toUpperCase()} JOIN.`]);
    setJoinedRows([]);
    setMatchedStudentIds([]);
    setMatchedDepartmentIds([]);
    setSelectedStudentId(null);
    setSelectedDepartmentId(null);
    setGeneratedSQL(buildJoinQuery());
    setCurrentStage("Sample Ready");
    setMessage(`Sample loaded for ${joinType.toUpperCase()} JOIN.`);
  };

  const reset = () => {
    if (isRunning) return;

    setStepHistory([]);
    setSelectedStudentId(null);
    setSelectedDepartmentId(null);
    setMatchedStudentIds([]);
    setMatchedDepartmentIds([]);
    setJoinedRows([]);
    setGeneratedSQL("");
    setCurrentStage("");
    setMessage("SQL Joins lab reset.");
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
      experimentSlug: "sql-joins",
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
  setQuizSaveStatus("");
};

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 55
      : activeSection === "quiz"
      ? 80
      : 95;

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
            <h1 className="er-page-title">SQL Joins</h1>
            <p className="er-page-subtitle">
              Explore INNER, LEFT, and RIGHT joins visually through simulation, quiz, and SQL query practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Join Configuration</h2>
              <p>Select a join type and observe how matching and unmatched rows are handled.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Link2 size={18} />
              </div>
              <div>
                <strong>{joinNames[joinType]}</strong>
                <span>
                  Join students and departments using department_id.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Join Type</label>
              <select
                value={joinType}
                onChange={(e) => setJoinType(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="inner">INNER JOIN</option>
                <option value="left">LEFT JOIN</option>
                <option value="right">RIGHT JOIN</option>
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
            <button className="er-chip active">Mode: {joinNames[joinType]}</button>
            <button className="er-chip active">Keeps: {joinMeta[joinType].keeps}</button>
            <button className="er-chip active">Unmatched: {joinMeta[joinType].unmatched}</button>
            <button className="er-chip active">Use: {joinMeta[joinType].use}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>
          <div style={{ marginTop: 18 }}>
  <MarkCompleteButton
    labSlug="dbms"
    experimentSlug="sql-joins"
    points={10}
  />
</div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DBMSJoinsOverview
                joinType={joinType}
                studentsTable={studentsTable}
                departmentsTable={departmentsTable}
              />
            )}

            {activeSection === "simulation" && (
              <DBMSJoinsSimulation
                joinType={joinType}
                studentsTable={studentsTable}
                departmentsTable={departmentsTable}
                runSimulation={runSimulation}
                reset={reset}
                loadSample={loadSample}
                message={message}
                selectedStudentId={selectedStudentId}
                selectedDepartmentId={selectedDepartmentId}
                matchedStudentIds={matchedStudentIds}
                matchedDepartmentIds={matchedDepartmentIds}
                joinedRows={joinedRows}
                stepHistory={stepHistory}
                generatedSQL={generatedSQL}
                currentStage={currentStage}
                isRunning={isRunning}
              />
            )}

            {activeSection === "quiz" && (
              <DBMSJoinsQuiz
  joinType={joinType}
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

            {activeSection === "coding" && <DBMSJoinsCoding joinType={joinType} />}
          </section>
        </div>
      </main>
    </div>
  );
}