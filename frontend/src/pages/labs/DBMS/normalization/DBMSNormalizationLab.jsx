import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import { FlaskConical } from "lucide-react";

import DBMSNormalizationOverview from "./DBMSNormalizationOverview";
import DBMSNormalizationSimulation from "./DBMSNormalizationSimulation";
import DBMSNormalizationComparison from "./DBMSNormalizationComparison";
import DBMSNormalizationQuiz from "./DBMSNormalizationQuiz";
import DBMSNormalizationCoding from "./DBMSNormalizationCoding";

const normalizationQuizQuestionsByStage = {
  "1nf": [
    {
      question: "What is the main rule of First Normal Form (1NF)?",
      options: [
        "Remove transitive dependency",
        "Remove partial dependency",
        "Each field must contain atomic values",
        "Every table must have 3 columns"
      ],
      correct: 2
    },
    {
      question: "Which of the following violates 1NF?",
      options: [
        "One phone number per cell",
        "One subject per row",
        "Multiple values in one cell",
        "Using a primary key"
      ],
      correct: 2
    },
    {
      question: "1NF mainly removes:",
      options: [
        "Repeating groups",
        "Foreign keys",
        "Indexes",
        "Sorting"
      ],
      correct: 0
    }
  ],
  "2nf": [
    {
      question: "Second Normal Form removes:",
      options: [
        "Repeating groups",
        "Partial dependency",
        "Transitive dependency",
        "NULL values"
      ],
      correct: 1
    },
    {
      question: "2NF applies after satisfying:",
      options: ["UNF", "1NF", "3NF", "BCNF"],
      correct: 1
    },
    {
      question: "Partial dependency happens when:",
      options: [
        "A non-key attribute depends on part of a composite key",
        "A key depends on a non-key",
        "A table has one row",
        "A column contains NULL"
      ],
      correct: 0
    }
  ],
  "3nf": [
    {
      question: "Third Normal Form removes:",
      options: [
        "Repeating groups",
        "Primary keys",
        "Transitive dependency",
        "Composite keys"
      ],
      correct: 2
    },
    {
      question: "A transitive dependency means:",
      options: [
        "A non-key depends on another non-key",
        "A key depends on another key",
        "A table depends on another table",
        "Two primary keys exist"
      ],
      correct: 0
    },
    {
      question: "3NF is achieved after satisfying:",
      options: ["Only 1NF", "Only 2NF", "1NF and 2NF", "UNF only"],
      correct: 2
    }
  ]
};

const unfTable = [
  {
    student_id: "S1",
    student_name: "Aarav",
    course_ids: "C101, C102",
    course_names: "DBMS, OS",
    instructor_names: "Dr. Sharma, Dr. Mehta",
    department_name: "CSE",
    department_office: "Block A"
  },
  {
    student_id: "S2",
    student_name: "Diya",
    course_ids: "C103",
    course_names: "CN",
    instructor_names: "Dr. Iyer",
    department_name: "ECE",
    department_office: "Block B"
  }
];

const firstNFTable = [
  {
    student_id: "S1",
    student_name: "Aarav",
    course_id: "C101",
    course_name: "DBMS",
    instructor_name: "Dr. Sharma",
    department_name: "CSE",
    department_office: "Block A"
  },
  {
    student_id: "S1",
    student_name: "Aarav",
    course_id: "C102",
    course_name: "OS",
    instructor_name: "Dr. Mehta",
    department_name: "CSE",
    department_office: "Block A"
  },
  {
    student_id: "S2",
    student_name: "Diya",
    course_id: "C103",
    course_name: "CN",
    instructor_name: "Dr. Iyer",
    department_name: "ECE",
    department_office: "Block B"
  }
];

const secondNFStudentCourse = [
  { student_id: "S1", course_id: "C101" },
  { student_id: "S1", course_id: "C102" },
  { student_id: "S2", course_id: "C103" }
];

const secondNFCourse = [
  { course_id: "C101", course_name: "DBMS", instructor_name: "Dr. Sharma" },
  { course_id: "C102", course_name: "OS", instructor_name: "Dr. Mehta" },
  { course_id: "C103", course_name: "CN", instructor_name: "Dr. Iyer" }
];

const secondNFStudent = [
  {
    student_id: "S1",
    student_name: "Aarav",
    department_name: "CSE",
    department_office: "Block A"
  },
  {
    student_id: "S2",
    student_name: "Diya",
    department_name: "ECE",
    department_office: "Block B"
  }
];

const thirdNFStudent = [
  { student_id: "S1", student_name: "Aarav", department_name: "CSE" },
  { student_id: "S2", student_name: "Diya", department_name: "ECE" }
];

const thirdNFDepartment = [
  { department_name: "CSE", department_office: "Block A" },
  { department_name: "ECE", department_office: "Block B" }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DBMSNormalizationLab() {
  const [normalForm, setNormalForm] = useState("1nf");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Normalization lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);
  const [currentStage, setCurrentStage] = useState("");
  const [displayTables, setDisplayTables] = useState([]);
  const [highlightedColumns, setHighlightedColumns] = useState([]);
  const [dependencyText, setDependencyText] = useState("");

  const quizQuestions = useMemo(
    () => normalizationQuizQuestionsByStage[normalForm],
    [normalForm]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    setStepHistory([]);
    setCurrentStage("");
    setDisplayTables([]);
    setHighlightedColumns([]);
    setDependencyText("");
    setMessage("Normalization lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setQuizAnswers(Array(normalizationQuizQuestionsByStage[normalForm].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [normalForm]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const runSimulation = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setExperimentRun(true);
    setStepHistory([]);
    setDisplayTables([]);
    setHighlightedColumns([]);
    setDependencyText("");
    setCurrentStage("Starting");

    try {
      setMessage("Loaded unnormalized table.");
      addStep("Started normalization from the unnormalized table.");
      setDisplayTables([
        {
          title: "Unnormalized Table",
          rows: unfTable
        }
      ]);
      await sleep(animationSpeed);

      if (normalForm === "1nf") {
        setCurrentStage("Analyzing Repeating Groups");
        setHighlightedColumns(["course_ids", "course_names", "instructor_names"]);
        setDependencyText("Problem: Multiple values are stored inside single cells.");
        setMessage("Identified repeating groups and non-atomic values.");
        addStep("Detected repeating groups in course_ids, course_names, and instructor_names.");
        await sleep(animationSpeed);

        setCurrentStage("Converting to 1NF");
        setDisplayTables([
          {
            title: "1NF Table",
            rows: firstNFTable
          }
        ]);
        setHighlightedColumns([]);
        setDependencyText("Fix: Create separate rows so each field contains only one atomic value.");
        setMessage("Converted the table to 1NF.");
        addStep("Converted the table to 1NF by making all values atomic.");
        await sleep(animationSpeed);
      }

      if (normalForm === "2nf") {
        setCurrentStage("Converting to 1NF");
        setDisplayTables([
          {
            title: "1NF Table",
            rows: firstNFTable
          }
        ]);
        setDependencyText("Composite key: (student_id, course_id)");
        setMessage("First, the table is placed into 1NF.");
        addStep("Prepared the 1NF table before checking for partial dependencies.");
        await sleep(animationSpeed);

        setCurrentStage("Finding Partial Dependencies");
        setHighlightedColumns(["course_name", "instructor_name"]);
        setDependencyText(
          "Problem: course_name and instructor_name depend only on course_id, which is part of the composite key."
        );
        setMessage("Detected partial dependency.");
        addStep("Detected partial dependency: course_name and instructor_name depend only on course_id.");
        await sleep(animationSpeed);

        setCurrentStage("Splitting into 2NF");
        setDisplayTables([
          {
            title: "StudentCourse Table",
            rows: secondNFStudentCourse
          },
          {
            title: "Course Table",
            rows: secondNFCourse
          },
          {
            title: "Student Table",
            rows: secondNFStudent
          }
        ]);
        setHighlightedColumns([]);
        setDependencyText("Fix: Move attributes that depend on only part of the composite key into separate tables.");
        setMessage("Converted the design to 2NF.");
        addStep("Split the design into StudentCourse, Course, and Student tables to achieve 2NF.");
        await sleep(animationSpeed);
      }

      if (normalForm === "3nf") {
        setCurrentStage("Preparing 2NF Design");
        setDisplayTables([
          {
            title: "Student Table (2NF)",
            rows: secondNFStudent
          },
          {
            title: "Course Table",
            rows: secondNFCourse
          },
          {
            title: "StudentCourse Table",
            rows: secondNFStudentCourse
          }
        ]);
        setDependencyText("Current design is in 2NF.");
        setMessage("Loaded the 2NF design.");
        addStep("Started with the 2NF design before checking for transitive dependency.");
        await sleep(animationSpeed);

        setCurrentStage("Finding Transitive Dependency");
        setHighlightedColumns(["department_office"]);
        setDependencyText(
          "Problem: department_office depends on department_name, not directly on student_id."
        );
        setMessage("Detected transitive dependency.");
        addStep("Detected transitive dependency: department_office depends on department_name.");
        await sleep(animationSpeed);

        setCurrentStage("Splitting into 3NF");
        setDisplayTables([
          {
            title: "Student Table",
            rows: thirdNFStudent
          },
          {
            title: "Department Table",
            rows: thirdNFDepartment
          },
          {
            title: "Course Table",
            rows: secondNFCourse
          },
          {
            title: "StudentCourse Table",
            rows: secondNFStudentCourse
          }
        ]);
        setHighlightedColumns([]);
        setDependencyText("Fix: Move department details into a separate Department table.");
        setMessage("Converted the design to 3NF.");
        addStep("Separated department details into a Department table to achieve 3NF.");
        await sleep(animationSpeed);
      }

      setCurrentStage("Complete");
      setMessage(`${normalForm.toUpperCase()} normalization simulation completed.`);
      addStep(`${normalForm.toUpperCase()} simulation completed successfully.`);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `dbms-${normalForm}-normalization`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
    }
  };

  const loadSample = () => {
    if (isRunning) return;

    setStepHistory([`Sample prepared for ${normalForm.toUpperCase()} normalization.`]);
    setDisplayTables([
      {
        title: "Unnormalized Table",
        rows: unfTable
      }
    ]);
    setHighlightedColumns([]);
    setDependencyText("Sample data loaded. Run the simulation to see decomposition.");
    setCurrentStage("Sample Ready");
    setMessage(`Sample loaded for ${normalForm.toUpperCase()} normalization.`);
  };

  const reset = () => {
    if (isRunning) return;

    setStepHistory([]);
    setCurrentStage("");
    setDisplayTables([]);
    setHighlightedColumns([]);
    setDependencyText("");
    setMessage("Normalization lab reset.");
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
      experiment: `${normalForm}-normalization`,
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
              Interactive Normalization Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            Normalization
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Explore 1NF, 2NF, and 3NF visually through decomposition, comparison, quiz, and normalization design practice.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Normalization Configuration</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16
            }}
          >
            <div>
              <label className="sorting-label">Normal Form</label>
              <select
                value={normalForm}
                onChange={(e) => setNormalForm(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="1nf">1NF</option>
                <option value="2nf">2NF</option>
                <option value="3nf">3NF</option>
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
              className={`sorting-sidebar-item ${activeSection === "comparison" ? "active" : ""}`}
              onClick={() => setActiveSection("comparison")}
            >
              Comparison
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
                <DBMSNormalizationOverview normalForm={normalForm} unfTable={unfTable} />
              )}

              {activeSection === "simulation" && (
                <DBMSNormalizationSimulation
                  normalForm={normalForm}
                  runSimulation={runSimulation}
                  reset={reset}
                  loadSample={loadSample}
                  message={message}
                  displayTables={displayTables}
                  stepHistory={stepHistory}
                  currentStage={currentStage}
                  highlightedColumns={highlightedColumns}
                  dependencyText={dependencyText}
                  isRunning={isRunning}
                />
              )}

              {activeSection === "comparison" && (
                <DBMSNormalizationComparison
                  normalForm={normalForm}
                  unfTable={unfTable}
                  firstNFTable={firstNFTable}
                  secondNFStudentCourse={secondNFStudentCourse}
                  secondNFCourse={secondNFCourse}
                  secondNFStudent={secondNFStudent}
                  thirdNFStudent={thirdNFStudent}
                  thirdNFDepartment={thirdNFDepartment}
                />
              )}

              {activeSection === "quiz" && (
                <DBMSNormalizationQuiz
                  normalForm={normalForm}
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
                <DBMSNormalizationCoding normalForm={normalForm} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}