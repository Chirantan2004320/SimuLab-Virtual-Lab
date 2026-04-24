import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import { FlaskConical } from "lucide-react";

import DBMSJoinsOverview from "./DBMSJoinsOverview";
import DBMSJoinsSimulation from "./DBMSJoinsSimulation";
import DBMSJoinsQuiz from "./DBMSJoinsQuiz";
import DBMSJoinsCoding from "./DBMSJoinsCoding";

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
      options: [
        "It is still shown",
        "It is duplicated",
        "It is excluded",
        "It becomes zero"
      ],
      correct: 2
    }
  ],
  left: [
    {
      question: "What does LEFT JOIN always keep?",
      options: [
        "All rows from right table",
        "Only matching rows",
        "All rows from left table",
        "No rows"
      ],
      correct: 2
    },
    {
      question: "If no right-side match is found in LEFT JOIN:",
      options: [
        "The left row is removed",
        "Right-side columns become NULL",
        "The query fails",
        "The row is sorted last"
      ],
      correct: 1
    },
    {
      question: "LEFT JOIN is useful when you want to:",
      options: [
        "Keep all left-table data",
        "Delete unmatched rows",
        "Sort rows only",
        "Create indexes"
      ],
      correct: 0
    }
  ],
  right: [
    {
      question: "What does RIGHT JOIN always keep?",
      options: [
        "All rows from left table",
        "All rows from right table",
        "Only matching rows",
        "No unmatched rows"
      ],
      correct: 1
    },
    {
      question: "If no left-side match is found in RIGHT JOIN:",
      options: [
        "Left-side columns become NULL",
        "The right row is removed",
        "The database crashes",
        "The row is duplicated"
      ],
      correct: 0
    },
    {
      question: "RIGHT JOIN is the mirror version of:",
      options: [
        "GROUP BY",
        "LEFT JOIN",
        "ORDER BY",
        "UNION"
      ],
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

  const quizQuestions = useMemo(
    () => joinQuizQuestionsByType[joinType],
    [joinType]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

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
      joinType === "inner"
        ? "INNER JOIN"
        : joinType === "left"
        ? "LEFT JOIN"
        : "RIGHT JOIN";

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
        for (let i = 0; i < studentsTable.length; i++) {
          const student = studentsTable[i];

          setSelectedStudentId(student.id);
          setSelectedDepartmentId(null);
          setCurrentStage("Scanning Student Row");
          setMessage(`Checking student ${student.name} with department_id = ${student.department_id}`);
          addStep(
            `Scanning student row: ${student.name} (department_id = ${student.department_id}).`
          );
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
              addStep(
                `Match found between student ${student.name} and department ${dept.department_name}.`
              );
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
            setMessage(`No matching department found for ${student.name}. Keeping row because this is LEFT JOIN.`);
            addStep(
              `No department match for student ${student.name}. Added row with NULL values because LEFT JOIN keeps all left-table rows.`
            );
            await sleep(animationSpeed);

            results.push({
              student_name: student.name,
              student_department_id: student.department_id,
              department_name: "NULL",
              hod: "NULL"
            });
          } else {
            setCurrentStage("No Match");
            setMessage(`No matching department found for ${student.name}. Row excluded in INNER JOIN.`);
            addStep(
              `No department match for student ${student.name}. Row excluded because INNER JOIN keeps only matching rows.`
            );
            await sleep(animationSpeed);
          }

          setJoinedRows([...results]);
        }
      }

      if (joinType === "right") {
        for (let i = 0; i < departmentsTable.length; i++) {
          const dept = departmentsTable[i];

          setSelectedDepartmentId(dept.department_id);
          setSelectedStudentId(null);
          setCurrentStage("Scanning Department Row");
          setMessage(
            `Checking department ${dept.department_name} with department_id = ${dept.department_id}`
          );
          addStep(
            `Scanning department row: ${dept.department_name} (department_id = ${dept.department_id}).`
          );
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
              addStep(
                `Match found between department ${dept.department_name} and student ${student.name}.`
              );
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
            setMessage(
              `No student matched with ${dept.department_name}. Keeping row because this is RIGHT JOIN.`
            );
            addStep(
              `No student match for department ${dept.department_name}. Added row with NULL values because RIGHT JOIN keeps all right-table rows.`
            );
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
      experiment: `${joinType}-join`,
      correct: score,
      total: quizQuestions.length,
      time: Date.now()
    });
    localStorage.setItem("vlab_scores", JSON.stringify(scores));
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
              Interactive SQL Joins Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            SQL Joins
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Explore INNER, LEFT, and RIGHT joins visually through simulation, quiz, and SQL query practice.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Join Configuration</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16
            }}
          >
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
                  experimentRun={experimentRun}
                  handleQuizAnswer={handleQuizAnswer}
                  submitQuiz={submitQuiz}
                />
              )}

              {activeSection === "coding" && (
                <DBMSJoinsCoding joinType={joinType} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}