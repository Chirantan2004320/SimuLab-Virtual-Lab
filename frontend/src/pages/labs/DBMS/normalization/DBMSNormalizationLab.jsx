import React, { useEffect, useMemo, useState } from "react";
import "../../../Lab.css";
import "../../../SortingLab.css";
import DBMSNormalizationOverview from "./DBMSNormalizationOverview";
import DBMSNormalizationSimulation from "./DBMSNormalizationSimulation";
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

const codingProblemByStage = {
  "1nf": {
    title: "Convert a table to 1NF",
    description:
      "Write the transformed 1NF design for a table where one row stores multiple subjects in the same cell."
  },
  "2nf": {
    title: "Convert a table to 2NF",
    description:
      "Write how you would split a table to remove partial dependency from a composite key."
  },
  "3nf": {
    title: "Convert a table to 3NF",
    description:
      "Write how you would split a table to remove transitive dependency so non-key attributes depend only on the key."
  }
};

const normalizationCodeTemplates = {
  "1nf": {
    javascript: `// Example answer for 1NF
const answer = {
  originalProblem: "Subjects stored as comma-separated values in one cell",
  fix: [
    "Create one row per subject",
    "Keep atomic values in each column"
  ]
};`,
    python: `# Example answer for 1NF
answer = {
    "original_problem": "Subjects stored as comma-separated values in one cell",
    "fix": [
        "Create one row per subject",
        "Keep atomic values in each column"
    ]
}`,
    cpp: `// Example answer outline for 1NF
string answer =
"Split repeating groups into separate rows and keep atomic values.";`,
    c: `/* Example answer outline for 1NF
   Split repeating groups into separate rows and keep atomic values.
*/`,
    java: `// Example answer outline for 1NF
String answer =
"Split repeating groups into separate rows and keep atomic values.";`
  },
  "2nf": {
    javascript: `// Example answer for 2NF
const answer = {
  problem: "InstructorName depends only on CourseID, not full composite key",
  fix: [
    "Create StudentCourse(StudentID, CourseID)",
    "Create Course(CourseID, CourseName, InstructorName)"
  ]
};`,
    python: `# Example answer for 2NF
answer = {
    "problem": "InstructorName depends only on CourseID, not full composite key",
    "fix": [
        "Create StudentCourse(StudentID, CourseID)",
        "Create Course(CourseID, CourseName, InstructorName)"
    ]
}`,
    cpp: `// Example answer outline for 2NF
string answer =
"Separate attributes that depend on only part of the composite key into another table.";`,
    c: `/* Example answer outline for 2NF
   Separate attributes that depend on only part of the composite key into another table.
*/`,
    java: `// Example answer outline for 2NF
String answer =
"Separate attributes that depend on only part of the composite key into another table.";`
  },
  "3nf": {
    javascript: `// Example answer for 3NF
const answer = {
  problem: "DepartmentOffice depends on DepartmentName, not directly on StudentID",
  fix: [
    "Create Student(StudentID, StudentName, DepartmentName)",
    "Create Department(DepartmentName, DepartmentOffice)"
  ]
};`,
    python: `# Example answer for 3NF
answer = {
    "problem": "DepartmentOffice depends on DepartmentName, not directly on StudentID",
    "fix": [
        "Create Student(StudentID, StudentName, DepartmentName)",
        "Create Department(DepartmentName, DepartmentOffice)"
    ]
}`,
    cpp: `// Example answer outline for 3NF
string answer =
"Move attributes with transitive dependency into a separate table.";`,
    c: `/* Example answer outline for 3NF
   Move attributes with transitive dependency into a separate table.
*/`,
    java: `// Example answer outline for 3NF
String answer =
"Move attributes with transitive dependency into a separate table.";`
  }
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

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(normalizationCodeTemplates["1nf"].javascript);
  const [codeResult, setCodeResult] = useState("");

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
    setCodeResult("");
  }, [normalForm]);

  useEffect(() => {
    setCode(normalizationCodeTemplates[normalForm][selectedLanguage]);
    setCodeResult("");
  }, [normalForm, selectedLanguage]);

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

  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${code}; return answer;`);
      const result = fn();
      setCodeResult(`Output:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem = codingProblemByStage[normalForm];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Normalization</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Normal Form</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={normalForm}
              onChange={(e) => setNormalForm(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
              disabled={isRunning}
            >
              <option value="1nf">1NF</option>
              <option value="2nf">2NF</option>
              <option value="3nf">3NF</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "#e5e7eb",
                fontWeight: 600
              }}
            >
              Animation Speed
            </label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="lab-select"
              style={{ minWidth: "180px" }}
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
        <aside className="sorting-sidebar">
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
            <DBMSNormalizationCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              normalForm={normalForm}
            />
          )}
        </main>
      </div>
    </div>
  );
}