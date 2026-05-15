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
  GitCompare,
  Brain,
  FileCode2,
  ChevronsLeft,
  Layers3,
} from "lucide-react";

import "../../../SortingLab.css";

import SimuLabLogo from "../../../../components/SimuLabLogo";
import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import {
  saveCodingSubmission,
} from "../../../../API/progressApi";

import DBMSNormalizationOverview from "./DBMSNormalizationOverview";
import DBMSNormalizationSimulation from "./DBMSNormalizationSimulation";
import DBMSNormalizationComparison from "./DBMSNormalizationComparison";
import DBMSNormalizationQuiz from "./DBMSNormalizationQuiz";
import DBMSNormalizationCoding from "./DBMSNormalizationCoding";

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
    label: "Coding Practice",
    icon: FileCode2,
  },
];

const unfTable = [
  {
    student_id: "S1",
    student_name: "Aarav",
    course_ids: "C101, C102",
    course_names: "DBMS, OS",
    instructor_names:
      "Dr. Sharma, Dr. Mehta",
    department_name: "CSE",
    department_office:
      "Block A",
  },

  {
    student_id: "S2",
    student_name: "Diya",
    course_ids: "C103",
    course_names: "CN",
    instructor_names:
      "Dr. Iyer",
    department_name: "ECE",
    department_office:
      "Block B",
  },
];

const firstNFTable = [
  {
    student_id: "S1",
    student_name: "Aarav",
    course_id: "C101",
    course_name: "DBMS",
    instructor_name:
      "Dr. Sharma",
    department_name: "CSE",
    department_office:
      "Block A",
  },

  {
    student_id: "S1",
    student_name: "Aarav",
    course_id: "C102",
    course_name: "OS",
    instructor_name:
      "Dr. Mehta",
    department_name: "CSE",
    department_office:
      "Block A",
  },

  {
    student_id: "S2",
    student_name: "Diya",
    course_id: "C103",
    course_name: "CN",
    instructor_name:
      "Dr. Iyer",
    department_name: "ECE",
    department_office:
      "Block B",
  },
];

const secondNFStudentCourse =
  [
    {
      student_id: "S1",
      course_id: "C101",
    },

    {
      student_id: "S1",
      course_id: "C102",
    },

    {
      student_id: "S2",
      course_id: "C103",
    },
  ];

const secondNFCourse = [
  {
    course_id: "C101",
    course_name: "DBMS",
    instructor_name:
      "Dr. Sharma",
  },

  {
    course_id: "C102",
    course_name: "OS",
    instructor_name:
      "Dr. Mehta",
  },

  {
    course_id: "C103",
    course_name: "CN",
    instructor_name:
      "Dr. Iyer",
  },
];

const secondNFStudent = [
  {
    student_id: "S1",
    student_name: "Aarav",
    department_name: "CSE",
    department_office:
      "Block A",
  },

  {
    student_id: "S2",
    student_name: "Diya",
    department_name: "ECE",
    department_office:
      "Block B",
  },
];

const thirdNFStudent = [
  {
    student_id: "S1",
    student_name: "Aarav",
    department_name: "CSE",
  },

  {
    student_id: "S2",
    student_name: "Diya",
    department_name: "ECE",
  },
];

const thirdNFDepartment =
  [
    {
      department_name:
        "CSE",

      department_office:
        "Block A",
    },

    {
      department_name:
        "ECE",

      department_office:
        "Block B",
    },
  ];

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function DBMSNormalizationLab() {

  const [normalForm, setNormalForm] =
    useState("1nf");

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
    "Normalization lab initialized."
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
    displayTables,
    setDisplayTables,
  ] = useState([]);

  const [
    highlightedColumns,
    setHighlightedColumns,
  ] = useState([]);

  const [
    dependencyText,
    setDependencyText,
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
                "Normalization"
          );

        const modeQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "1nf"
              ).toLowerCase() ===
              normalForm
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
    }, [normalForm]);

  useEffect(() => {

    fetchQuizQuestions();

  }, [fetchQuizQuestions]);

  const normalFormNames = {
    "1nf":
      "First Normal Form",

    "2nf":
      "Second Normal Form",

    "3nf":
      "Third Normal Form",
  };

  const normalFormMeta = {
    "1nf": {
      focus:
        "Atomic Values",

      removes:
        "Repeating Groups",

      input:
        "UNF Table",

      output:
        "1NF Table",
    },

    "2nf": {
      focus:
        "Full Key Dependency",

      removes:
        "Partial Dependency",

      input:
        "1NF Table",

      output:
        "2NF Tables",
    },

    "3nf": {
      focus:
        "Direct Key Dependency",

      removes:
        "Transitive Dependency",

      input:
        "2NF Design",

      output:
        "3NF Tables",
    },
  };

  useEffect(() => {

    setStepHistory([]);

    setCurrentStage("");

    setDisplayTables([]);

    setHighlightedColumns([]);

    setDependencyText("");

    setMessage(
      "Normalization lab initialized."
    );

    setExperimentRun(false);

    setIsRunning(false);

    setQuizSubmitted(false);

    setQuizScore(0);

  }, [normalForm]);

  const addStep =
    useCallback((text) => {

      setStepHistory(
        (prev) => [
          ...prev,
          text,
        ]
      );

    }, []);

  const runSimulation =
    async () => {

      if (isRunning) {
        return;
      }

      setIsRunning(true);

      setExperimentRun(true);

      setStepHistory([]);

      setDisplayTables([]);

      setHighlightedColumns([]);

      setDependencyText("");

      setCurrentStage(
        "Starting"
      );

      try {

        setMessage(
          "Loaded unnormalized table."
        );

        addStep(
          "Started normalization from the unnormalized table."
        );

        setDisplayTables([
          {
            title:
              "Unnormalized Table",

            rows:
              unfTable,
          },
        ]);

        await sleep(
          animationSpeed
        );

        if (
          normalForm ===
          "1nf"
        ) {

          setCurrentStage(
            "Analyzing Repeating Groups"
          );

          setHighlightedColumns([
            "course_ids",
            "course_names",
            "instructor_names",
          ]);

          setDependencyText(
            "Problem: Multiple values are stored inside single cells."
          );

          addStep(
            "Detected repeating groups in course_ids, course_names, and instructor_names."
          );

          await sleep(
            animationSpeed
          );

          setCurrentStage(
            "Converting to 1NF"
          );

          setDisplayTables([
            {
              title:
                "1NF Table",

              rows:
                firstNFTable,
            },
          ]);

          setHighlightedColumns(
            []
          );

          setDependencyText(
            "Fix: Create separate rows so each field contains only one atomic value."
          );

          addStep(
            "Converted the table to 1NF."
          );

          await sleep(
            animationSpeed
          );
        }

        if (
          normalForm ===
          "2nf"
        ) {

          setDisplayTables([
            {
              title:
                "1NF Table",

              rows:
                firstNFTable,
            },
          ]);

          addStep(
            "Prepared 1NF table before checking partial dependencies."
          );

          await sleep(
            animationSpeed
          );

          setHighlightedColumns([
            "course_name",
            "instructor_name",
          ]);

          setDependencyText(
            "Problem: course_name and instructor_name depend only on course_id."
          );

          addStep(
            "Detected partial dependency."
          );

          await sleep(
            animationSpeed
          );

          setDisplayTables([
            {
              title:
                "StudentCourse Table",

              rows:
                secondNFStudentCourse,
            },

            {
              title:
                "Course Table",

              rows:
                secondNFCourse,
            },

            {
              title:
                "Student Table",

              rows:
                secondNFStudent,
            },
          ]);

          setHighlightedColumns(
            []
          );

          addStep(
            "Split tables into 2NF design."
          );

          await sleep(
            animationSpeed
          );
        }

        if (
          normalForm ===
          "3nf"
        ) {

          setDisplayTables([
            {
              title:
                "Student Table (2NF)",

              rows:
                secondNFStudent,
            },

            {
              title:
                "Course Table",

              rows:
                secondNFCourse,
            },

            {
              title:
                "StudentCourse Table",

              rows:
                secondNFStudentCourse,
            },
          ]);

          addStep(
            "Prepared 2NF design."
          );

          await sleep(
            animationSpeed
          );

          setHighlightedColumns([
            "department_office",
          ]);

          setDependencyText(
            "Problem: department_office depends on department_name."
          );

          addStep(
            "Detected transitive dependency."
          );

          await sleep(
            animationSpeed
          );

          setDisplayTables([
            {
              title:
                "Student Table",

              rows:
                thirdNFStudent,
            },

            {
              title:
                "Department Table",

              rows:
                thirdNFDepartment,
            },

            {
              title:
                "Course Table",

              rows:
                secondNFCourse,
            },

            {
              title:
                "StudentCourse Table",

              rows:
                secondNFStudentCourse,
            },
          ]);

          setHighlightedColumns(
            []
          );

          addStep(
            "Separated department details into Department table."
          );

          await sleep(
            animationSpeed
          );
        }

        setCurrentStage(
          "Complete"
        );

        setMessage(
          `${normalForm.toUpperCase()} normalization simulation completed.`
        );

        addStep(
          `${normalForm.toUpperCase()} simulation completed successfully.`
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
        `Sample prepared for ${normalForm.toUpperCase()} normalization.`,
      ]);

      setDisplayTables([
        {
          title:
            "Unnormalized Table",

          rows:
            unfTable,
        },
      ]);

      setHighlightedColumns(
        []
      );

      setDependencyText(
        "Sample data loaded."
      );

      setCurrentStage(
        "Sample Ready"
      );

      setMessage(
        `Sample loaded for ${normalForm.toUpperCase()} normalization.`
      );
    };

  const reset = () => {

    if (isRunning) {
      return;
    }

    setStepHistory([]);

    setCurrentStage("");

    setDisplayTables([]);

    setHighlightedColumns([]);

    setDependencyText("");

    setMessage(
      "Normalization lab reset."
    );

    setExperimentRun(false);
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
              "normalization",

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

    //eslint-disable-next-line
  const redoQuiz = () => {

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
      ? 50
      : activeSection ===
        "comparison"
      ? 68
      : activeSection ===
        "quiz"
      ? 84
      : 95;

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
            <h1 className="er-page-title">Normalization</h1>
            <p className="er-page-subtitle">
              Explore 1NF, 2NF, and 3NF visually through decomposition, comparison, quiz, and normalization design practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Normalization Configuration</h2>
              <p>Select a normal form and observe how redundancy and dependency problems are removed.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Layers3 size={18} />
              </div>
              <div>
                <strong>{normalForm.toUpperCase()} - {normalFormNames[normalForm]}</strong>
                <span>{normalFormMeta[normalForm].removes}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
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

          <div className="er-chip-row">
            <button className="er-chip active">Focus: {normalFormMeta[normalForm].focus}</button>
            <button className="er-chip active">Removes: {normalFormMeta[normalForm].removes}</button>
            <button className="er-chip active">Input: {normalFormMeta[normalForm].input}</button>
            <button className="er-chip active">Output: {normalFormMeta[normalForm].output}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>
          <div style={{ marginTop: 18 }}>
  <MarkCompleteButton
    labSlug="dbms"
    experimentSlug="normalization"
    points={10}
  />
</div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
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
  quizSaveStatus={quizSaveStatus}
  experimentRun={experimentRun}
  handleQuizAnswer={handleQuizAnswer}
  submitQuiz={submitQuiz}
/>
            )}

            {activeSection === "coding" && (
              <DBMSNormalizationCoding
  normalForm={normalForm}
  codingSaveStatus={codingSaveStatus}
  setCodingSaveStatus={setCodingSaveStatus}
  saveCodingSubmission={saveCodingSubmission}
/>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}