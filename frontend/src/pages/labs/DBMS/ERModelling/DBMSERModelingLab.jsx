import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  Activity,
  GitCompare,
  Brain,
  Code2,
  Network,
  Hammer,
  ChevronsLeft,
  Database,
  Link2,
  Table2
} from "lucide-react";

import DBMSERModelingOverview from "./DBMSERModelingOverview";
import DBMSERModelingSimulation from "./DBMSERModelingSimulation";
import DBMSERModelingComparison from "./DBMSERModellingComparison";
import DBMSERModelingQuiz from "./DBMSERModelingQuiz";
import DBMSERModelingCoding from "./DBMSERModelingCoding";
import DBMSERDiagram from "./DBMSERDiagram";
import DBMSERBuilder from "./DBMSERBuilder";

const simulabLogo = "/assets/logo.png";

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

const codingProblemsByMode = {
  entities: [
    {
      title: "Identify entities and attributes",
      description:
        "Write the entities and their main attributes for a simple Library Management System."
    },
    {
      title: "Identify primary keys",
      description:
        "For Student, Book, and Librarian entities, write one suitable primary key for each."
    },
    {
      title: "Weak vs strong entities",
      description:
        "Write one example of a strong entity and one example of a weak entity from a hostel system."
    }
  ],
  relationships: [
    {
      title: "Identify relationships and cardinality",
      description:
        "Write relationships between Student, Course, and Instructor, and mention their cardinalities."
    },
    {
      title: "Relationship naming",
      description:
        "Write meaningful relationship names between Customer and Order, and between Doctor and Patient."
    },
    {
      title: "Choose cardinality",
      description:
        "For Department and Employee, decide whether the relationship is 1:1, 1:N, or M:N and explain briefly."
    }
  ],
  mapping: [
    {
      title: "Convert ER model to tables",
      description:
        "Write relational tables for Student, Course, and Enrollment based on an ER diagram."
    },
    {
      title: "Map one-to-many relationship",
      description:
        "Show how Department and Employee (1:N) are mapped into relational tables."
    },
    {
      title: "Map many-to-many relationship",
      description:
        "Show how Student and Club (M:N) are converted into relational tables."
    }
  ]
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

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: Activity },
  { key: "comparison", label: "Comparison", icon: GitCompare },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding", icon: Code2 },
  { key: "diagram", label: "ER Diagram", icon: Network },
  { key: "builder", label: "ER Builder", icon: Hammer }
];

export default function DBMSERModelingLab() {
  const [mode, setMode] = useState("entities");
  const [activeSection, setActiveSection] = useState("diagram");
  const [message, setMessage] = useState("ER Modelling lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  const [codes, setCodes] = useState([erCodeTemplates.entities.javascript]);
  const [results, setResults] = useState([""]);

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

    const starter = erCodeTemplates[mode][selectedLanguage];
    const problemCount = codingProblemsByMode[mode].length;
    setCodes(Array(problemCount).fill(starter));
    setResults(Array(problemCount).fill(""));
  }, [mode]);

  useEffect(() => {
    const starter = erCodeTemplates[mode][selectedLanguage];
    const problemCount = codingProblemsByMode[mode].length;
    setCodes((prev) => {
      if (!prev.length) return Array(problemCount).fill(starter);
      return prev.map(() => starter);
    });
    setResults(Array(problemCount).fill(""));
  }, [selectedLanguage, mode]);

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
      entities: ["entity", "entities", "attributes", "student", "course"],
      relationships: ["relationship", "enroll", "teach", "many", "one"],
      mapping: ["table", "tables", "fk", "pk", "enrollment"]
    };

    const keywords = modeChecks[mode] || [];
    const score = keywords.filter((k) => content.includes(k)).length;

    if (score >= Math.max(2, keywords.length - 1)) {
      setResultAt(
        problemIndex,
        "Analysis:\nYour answer includes the main concepts expected for this ER modelling problem."
      );
    } else {
      setResultAt(
        problemIndex,
        "Analysis:\nYour answer is partially correct, but it should include more ER terms relevant to this mode."
      );
    }
  };

  const correctCode = (problemIndex) => {
    const corrected = erCodeTemplates[mode][selectedLanguage];
    updateCodeAt(problemIndex, corrected);
    setResultAt(problemIndex, "Model answer loaded for this problem.");
  };

  const progressPercent =
    activeSection === "diagram"
      ? 65
      : activeSection === "builder"
      ? 75
      : activeSection === "coding"
      ? 55
      : 50;

  const modeMeta = {
    entities: {
      title: "Entities & Attributes",
      description: "Understand objects, fields, and identifiers.",
      icon: Database
    },
    relationships: {
      title: "Relationships",
      description: "Study cardinality and entity connections.",
      icon: Link2
    },
    mapping: {
      title: "Mapping",
      description: "Convert ER concepts into relational tables.",
      icon: Table2
    }
  };

  const ActiveModeIcon = modeMeta[mode].icon;

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
              <div className="er-brand-subtitle">DBMS Virtual Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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

            <div className="er-last-activity">
              <div className="er-last-activity-label">Last Activity</div>
              <div className="er-last-activity-row">
                <span>
                  {sidebarItems.find((i) => i.key === activeSection)?.label || "ER Modelling"}
                </span>
                <span className="dot-live">Just now</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">ER Modelling</h1>
            <p className="er-page-subtitle">
              Learn entities, attributes, relationships, ER diagrams, and relational mapping through visual exploration. ✨
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>ER Configuration</h2>
              <p>Choose the concept mode and control the animation flow for the simulation.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <ActiveModeIcon size={18} />
              </div>
              <div>
                <strong>{modeMeta[mode].title}</strong>
                <span>{modeMeta[mode].description}</span>
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
                <option value="entities">Entities & Attributes</option>
                <option value="relationships">Relationships</option>
                <option value="mapping">ER to Relational Mapping</option>
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
            <button
              className={`er-chip ${mode === "entities" ? "active" : ""}`}
              onClick={() => setMode("entities")}
            >
              <Database size={14} />
              Entities
            </button>
            <button
              className={`er-chip ${mode === "relationships" ? "active" : ""}`}
              onClick={() => setMode("relationships")}
            >
              <Link2 size={14} />
              Relationships
            </button>
            <button
              className={`er-chip ${mode === "mapping" ? "active" : ""}`}
              onClick={() => setMode("mapping")}
            >
              <Table2 size={14} />
              Mapping
            </button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DBMSERModelingOverview
                mode={mode}
                erEntities={erEntities}
                relationalTables={relationalTables}
              />
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

            {activeSection === "comparison" && (
              <DBMSERModelingComparison mode={mode} />
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
                codingProblems={codingProblemsByMode[mode]}
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

            {activeSection === "diagram" && (
              <DBMSERDiagram entities={erEntities} />
            )}

            {activeSection === "builder" && <DBMSERBuilder />}
          </section>
        </div>
      </main>
    </div>
  );
}