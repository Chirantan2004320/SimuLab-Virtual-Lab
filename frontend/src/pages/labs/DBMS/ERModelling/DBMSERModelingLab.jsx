import React, { useEffect, useMemo, useState } from "react";
import "../../../Lab.css";
import "../../../SortingLab.css";
import DBMSERModelingOverview from "./DBMSERModelingOverview";
import DBMSERModelingSimulation from "./DBMSERModelingSimulation";
import DBMSERModelingQuiz from "./DBMSERModelingQuiz";
import DBMSERModelingCoding from "./DBMSERModelingCoding";
import DBMSERDiagram from "./DBMSERDiagram";
import DBMSERBuilder from "./DBMSERBuilder";

const erQuizQuestionsByMode = {
  entities: [
    {
      question: "In an ER model, an entity represents:",
      options: [
        "A sorting algorithm",
        "A real-world object or concept",
        "Only a database index",
        "A transaction log"
      ],
      correct: 1
    },
    {
      question: "An attribute in ER modeling is:",
      options: [
        "A property of an entity",
        "A foreign key only",
        "A lock type",
        "A query optimizer"
      ],
      correct: 0
    },
    {
      question: "Which of these is usually a primary key attribute?",
      options: ["name", "department", "student_id", "course_title"],
      correct: 2
    }
  ],
  relationships: [
    {
      question: "A relationship in ER modeling shows:",
      options: [
        "How entities are connected",
        "Only sorting order",
        "Only lock conflicts",
        "Only SQL syntax"
      ],
      correct: 0
    },
    {
      question: "Student enrolls in Course is an example of:",
      options: [
        "An attribute",
        "A relationship",
        "A data type",
        "A transaction"
      ],
      correct: 1
    },
    {
      question: "Many-to-many relationships are often mapped using:",
      options: [
        "No table at all",
        "A separate junction table",
        "Only one attribute",
        "A rollback"
      ],
      correct: 1
    }
  ],
  mapping: [
    {
      question: "ER to Relational Mapping means:",
      options: [
        "Converting ER design into tables",
        "Deleting entities",
        "Sorting attributes alphabetically",
        "Creating indexes only"
      ],
      correct: 0
    },
    {
      question: "A many-to-many relationship is commonly converted into:",
      options: [
        "One merged column",
        "A relationship table",
        "A deleted entity",
        "A lock manager"
      ],
      correct: 1
    },
    {
      question: "Primary keys in ER design generally become:",
      options: [
        "Table rows",
        "Table names",
        "Primary keys in relational schema",
        "Indexes only"
      ],
      correct: 2
    }
  ]
};

const codingProblemByMode = {
  entities: {
    title: "Identify entities and attributes",
    description:
      "Write the entities and their attributes for a simple Library Management System."
  },
  relationships: {
    title: "Identify relationships and cardinality",
    description:
      "Write relationships between Student, Course, and Instructor, and mention their cardinalities."
  },
  mapping: {
    title: "Convert ER model to tables",
    description:
      "Write relational tables for Student, Course, and Enrollment based on an ER diagram."
  }
};

const erCodeTemplates = {
  entities: {
    javascript: `const answer = {
  entities: [
    {
      name: "Student",
      attributes: ["student_id (PK)", "name", "email", "department"]
    },
    {
      name: "Course",
      attributes: ["course_id (PK)", "course_name", "credits"]
    }
  ]
};`,
    python: `answer = {
    "entities": [
        {
            "name": "Student",
            "attributes": ["student_id (PK)", "name", "email", "department"]
        },
        {
            "name": "Course",
            "attributes": ["course_id (PK)", "course_name", "credits"]
        }
    ]
}`,
    cpp: `string answer =
"Entities: Student(student_id, name, email, department), "
"Course(course_id, course_name, credits)";`,
    c: `char answer[] =
"Entities: Student(student_id, name, email, department), "
"Course(course_id, course_name, credits)";`,
    java: `String answer =
"Entities: Student(student_id, name, email, department), " +
"Course(course_id, course_name, credits)";`
  },
  relationships: {
    javascript: `const answer = {
  relationships: [
    "Student ENROLLS_IN Course (Many-to-Many)",
    "Instructor TEACHES Course (One-to-Many)"
  ]
};`,
    python: `answer = {
    "relationships": [
        "Student ENROLLS_IN Course (Many-to-Many)",
        "Instructor TEACHES Course (One-to-Many)"
    ]
}`,
    cpp: `string answer =
"Student ENROLLS_IN Course (M:N), Instructor TEACHES Course (1:N)";`,
    c: `char answer[] =
"Student ENROLLS_IN Course (M:N), Instructor TEACHES Course (1:N)";`,
    java: `String answer =
"Student ENROLLS_IN Course (M:N), Instructor TEACHES Course (1:N)";`
  },
  mapping: {
    javascript: `const answer = {
  tables: [
    "Student(student_id PK, name, email, department)",
    "Course(course_id PK, course_name, credits)",
    "Enrollment(student_id FK, course_id FK, semester)"
  ]
};`,
    python: `answer = {
    "tables": [
        "Student(student_id PK, name, email, department)",
        "Course(course_id PK, course_name, credits)",
        "Enrollment(student_id FK, course_id FK, semester)"
    ]
}`,
    cpp: `string answer =
"Student(student_id PK, name, email, department), "
"Course(course_id PK, course_name, credits), "
"Enrollment(student_id FK, course_id FK, semester)";`,
    c: `char answer[] =
"Student(student_id PK, name, email, department), "
"Course(course_id PK, course_name, credits), "
"Enrollment(student_id FK, course_id FK, semester)";`,
    java: `String answer =
"Student(student_id PK, name, email, department), " +
"Course(course_id PK, course_name, credits), " +
"Enrollment(student_id FK, course_id FK, semester)";`
  }
};

const erEntities = [
  {
    name: "Student",
    key: "student",
    attributes: [
      { name: "student_id", primary: true },
      { name: "name", primary: false },
      { name: "email", primary: false },
      { name: "department", primary: false }
    ]
  },
  {
    name: "Course",
    key: "course",
    attributes: [
      { name: "course_id", primary: true },
      { name: "course_name", primary: false },
      { name: "credits", primary: false }
    ]
  },
  {
    name: "Instructor",
    key: "instructor",
    attributes: [
      { name: "instructor_id", primary: true },
      { name: "instructor_name", primary: false },
      { name: "office", primary: false }
    ]
  }
];

const relationalTables = [
  {
    table_name: "Student",
    columns: "student_id (PK), name, email, department"
  },
  {
    table_name: "Course",
    columns: "course_id (PK), course_name, credits, instructor_id (FK)"
  },
  {
    table_name: "Instructor",
    columns: "instructor_id (PK), instructor_name, office"
  },
  {
    table_name: "Enrollment",
    columns: "student_id (FK), course_id (FK), semester"
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DBMSERModelingLab() {
  const [mode, setMode] = useState("entities");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("ER Modelling lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const [highlightedEntity, setHighlightedEntity] = useState(null);
  const [highlightedRelationship, setHighlightedRelationship] = useState(null);
  const [currentStage, setCurrentStage] = useState("");
  const [mappingRows, setMappingRows] = useState([]);
  const [observationText, setObservationText] = useState("");

  const quizQuestions = useMemo(() => erQuizQuestionsByMode[mode], [mode]);

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(erCodeTemplates.entities.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    setStepHistory([]);
    setHighlightedEntity(null);
    setHighlightedRelationship(null);
    setCurrentStage("");
    setMappingRows([]);
    setObservationText("");
    setMessage("ER Modelling lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setQuizAnswers(Array(erQuizQuestionsByMode[mode].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
  }, [mode]);

  useEffect(() => {
    setCode(erCodeTemplates[mode][selectedLanguage]);
    setCodeResult("");
  }, [mode, selectedLanguage]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const runSimulation = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setExperimentRun(true);
    setStepHistory([]);
    setHighlightedEntity(null);
    setHighlightedRelationship(null);
    setCurrentStage("Simulation Start");
    setMappingRows([]);
    setObservationText("");

    try {
      if (mode === "entities") {
        setMessage("Starting Entities & Attributes demo...");
        addStep("Started Entities & Attributes demo.");
        await sleep(animationSpeed);

        for (const entity of erEntities) {
          setHighlightedEntity(entity.key);
          setCurrentStage(`Highlighting ${entity.name}`);
          setObservationText(
            `Entity: ${entity.name} with its attributes. Primary key is marked separately.`
          );
          setMessage(`Highlighting entity ${entity.name} and its attributes.`);
          addStep(`Highlighted entity ${entity.name} and its attributes.`);
          await sleep(animationSpeed);
        }

        setHighlightedEntity(null);
      }

      if (mode === "relationships") {
        setMessage("Starting Relationships demo...");
        addStep("Started Relationships demo.");
        await sleep(animationSpeed);

        setHighlightedEntity("student");
        setHighlightedRelationship("enrolls");
        setCurrentStage("Student ENROLLS_IN Course");
        setObservationText(
          "Student and Course are connected by a many-to-many relationship called ENROLLS_IN."
        );
        setMessage("Showing Student ENROLLS_IN Course relationship.");
        addStep("Highlighted Student ENROLLS_IN Course (Many-to-Many).");
        await sleep(animationSpeed);

        setHighlightedEntity("instructor");
        setHighlightedRelationship("teaches");
        setCurrentStage("Instructor TEACHES Course");
        setObservationText(
          "Instructor and Course are connected by a one-to-many relationship called TEACHES."
        );
        setMessage("Showing Instructor TEACHES Course relationship.");
        addStep("Highlighted Instructor TEACHES Course (One-to-Many).");
        await sleep(animationSpeed);

        setHighlightedEntity(null);
        setHighlightedRelationship(null);
      }

      if (mode === "mapping") {
        setMessage("Starting ER to Relational Mapping demo...");
        addStep("Started ER to Relational Mapping demo.");
        await sleep(animationSpeed);

        setCurrentStage("Mapping Strong Entities");
        setObservationText(
          "Each strong entity becomes its own table with a primary key."
        );
        setMessage("Mapping entities into relational tables...");
        addStep("Mapped strong entities Student, Course, and Instructor into tables.");
        setMappingRows(relationalTables.slice(0, 3));
        await sleep(animationSpeed);

        setCurrentStage("Mapping Many-to-Many Relationship");
        setObservationText(
          "Many-to-many relationships are mapped into a separate relationship table."
        );
        setMessage("Mapping ENROLLS_IN relationship into Enrollment table...");
        addStep("Mapped Student ENROLLS_IN Course into Enrollment junction table.");
        setMappingRows(relationalTables);
        await sleep(animationSpeed);
      }

      setCurrentStage("Complete");
      setMessage(`${mode.toUpperCase()} simulation completed.`);
      addStep(`${mode.toUpperCase()} simulation completed successfully.`);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `dbms-er-${mode}`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
      setHighlightedEntity(null);
      setHighlightedRelationship(null);
    }
  };

  const loadSample = () => {
    if (isRunning) return;

    setHighlightedEntity(null);
    setHighlightedRelationship(null);
    setCurrentStage("Sample Ready");
    setObservationText(
      "Sample ER design is ready. Run the simulation to explore it step by step."
    );
    setMappingRows(mode === "mapping" ? relationalTables.slice(0, 1) : []);
    setStepHistory([`Sample loaded for ${mode.toUpperCase()} demo.`]);
    setMessage(`Sample loaded for ${mode.toUpperCase()} demo.`);
  };

  const reset = () => {
    if (isRunning) return;

    setHighlightedEntity(null);
    setHighlightedRelationship(null);
    setCurrentStage("");
    setMappingRows([]);
    setObservationText("");
    setStepHistory([]);
    setMessage("ER Modelling lab reset.");
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
      experiment: `er-${mode}`,
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

  const codingProblem = codingProblemByMode[mode];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – ER Modelling</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Mode</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
              disabled={isRunning}
            >
              <option value="entities">Entities & Attributes</option>
              <option value="relationships">Relationships</option>
              <option value="mapping">ER to Relational Mapping</option>
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

          <button
            className={`sorting-sidebar-item ${activeSection === "diagram" ? "active" : ""}`}
            onClick={() => setActiveSection("diagram")}
          >
            ER Diagram
          </button>
          <button
            className={`sorting-sidebar-item ${activeSection === "builder" ? "active" : ""}`}
            onClick={() => setActiveSection("builder")}
          >
            ER Builder
          </button>
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && (
            <DBMSERModelingOverview mode={mode} relationalTables={relationalTables} />
          )}

          {activeSection === "simulation" && (
            <DBMSERModelingSimulation
              mode={mode}
              erEntities={erEntities}
              relationalTables={relationalTables}
              runSimulation={runSimulation}
              reset={reset}
              loadSample={loadSample}
              message={message}
              highlightedEntity={highlightedEntity}
              highlightedRelationship={highlightedRelationship}
              currentStage={currentStage}
              observationText={observationText}
              mappingRows={mappingRows}
              stepHistory={stepHistory}
              isRunning={isRunning}
            />
          )}

          {activeSection === "quiz" && (
            <DBMSERModelingQuiz
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
            <DBMSERModelingCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              mode={mode}
            />
          )}

          {activeSection === "diagram" && (
            <DBMSERDiagram entities={erEntities} />
          )}

          {activeSection === "builder" && <DBMSERBuilder />}
        </main>
      </div>
    </div>
  );
}