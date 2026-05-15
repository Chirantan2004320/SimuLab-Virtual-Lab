/* eslint-disable no-new-func */

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import "../../../SortingLab.css";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext.js";

import MarkCompleteButton from "../../../../components/MarkCompleteButton.jsx";

import SimuLabLogo from "../../../../components/SimuLabLogo";

import {
  saveCodingSubmission,
} from "../../../../API/progressApi.js";

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
  Table2,
  Sparkles,
} from "lucide-react";

import DBMSERModelingOverview from "./DBMSERModelingOverview";
import DBMSERModelingSimulation from "./DBMSERModelingSimulation";
import DBMSERModelingComparison from "./DBMSERModellingComparison";
import DBMSERModelingQuiz from "./DBMSERModelingQuiz";
import DBMSERModelingCoding from "./DBMSERModelingCoding";
import DBMSERDiagram from "./DBMSERDiagram";
import DBMSERBuilder from "./DBMSERBuilder";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const experimentSlug =
  "er-modeling";

const sidebarItems = [
  {
    key: "overview",
    label: "Overview",
    icon: BookOpen,
  },

  {
    key: "simulation",
    label: "Simulation",
    icon: Activity,
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
    label: "Coding",
    icon: Code2,
  },

  {
    key: "diagram",
    label: "ER Diagram",
    icon: Network,
  },

  {
    key: "builder",
    label: "ER Builder",
    icon: Hammer,
  },
];

const codingProblemsByMode =
  {
    entities: [
      {
        title:
          "Identify entities and attributes",

        description:
          "Write the entities and their main attributes for a Library Management System.",
      },

      {
        title:
          "Primary key selection",

        description:
          "Identify strong primary keys for Student, Book, and Faculty entities.",
      },

      {
        title:
          "Weak vs Strong entities",

        description:
          "Differentiate between strong and weak entities using a Hostel Management System.",
      },
    ],

    relationships: [
      {
        title:
          "Cardinality mapping",

        description:
          "Write relationships and cardinalities between Student, Course, and Faculty.",
      },

      {
        title:
          "Relationship naming",

        description:
          "Write meaningful relationship names for Customer-Order and Doctor-Patient.",
      },

      {
        title:
          "Relationship analysis",

        description:
          "Explain one-to-many and many-to-many relationships with examples.",
      },
    ],

    mapping: [
      {
        title:
          "ER to relational conversion",

        description:
          "Convert Student-Course ER model into relational tables.",
      },

      {
        title:
          "One-to-many mapping",

        description:
          "Map Department and Employee entities into relational schema.",
      },

      {
        title:
          "Many-to-many mapping",

        description:
          "Convert Student and Club many-to-many relationship into junction tables.",
      },
    ],
  };

const erCodeTemplates = {
  entities: {
    javascript: `const answer = {
  entities: [
    {
      name: "Student",
      attributes: [
        "student_id (PK)",
        "name",
        "email",
        "department"
      ]
    },
    {
      name: "Course",
      attributes: [
        "course_id (PK)",
        "course_name",
        "credits"
      ]
    }
  ]
};`,
  },

  relationships: {
    javascript: `const answer = {
  relationships: [
    "Student ENROLLS_IN Course (M:N)",
    "Faculty TEACHES Course (1:N)"
  ]
};`,
  },

  mapping: {
    javascript: `const answer = {
  tables: [
    "Student(student_id PK, name, department)",
    "Course(course_id PK, course_name)",
    "Enrollment(student_id FK, course_id FK)"
  ]
};`,
  },
};

const erEntities = [
  {
    name: "Student",
    key: "student",

    attributes: [
      {
        name: "student_id",
        primary: true,
      },

      {
        name: "name",
        primary: false,
      },

      {
        name: "department",
        primary: false,
      },
    ],
  },

  {
    name: "Course",
    key: "course",

    attributes: [
      {
        name: "course_id",
        primary: true,
      },

      {
        name: "course_name",
        primary: false,
      },

      {
        name: "credits",
        primary: false,
      },
    ],
  },

  {
    name: "Faculty",
    key: "faculty",

    attributes: [
      {
        name: "faculty_id",
        primary: true,
      },

      {
        name: "faculty_name",
        primary: false,
      },

      {
        name: "office",
        primary: false,
      },
    ],
  },
];

const relationalTables = [
  {
    table_name:
      "Student",

    columns:
      "student_id (PK), name, department",
  },

  {
    table_name:
      "Course",

    columns:
      "course_id (PK), course_name, credits",
  },

  {
    table_name:
      "Faculty",

    columns:
      "faculty_id (PK), faculty_name, office",
  },

  {
    table_name:
      "Enrollment",

    columns:
      "student_id (FK), course_id (FK)",
  },
];

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function DBMSERModelingLab() {

  const {
    user,
    loading,
  } = useAuth();

  const navigate =
    useNavigate();

  const [mode, setMode] =
    useState("entities");

  const [
    activeSection,
    setActiveSection,
  ] = useState(
    "overview"
  );

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState(
    "ER Modelling lab initialized."
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
    highlightedEntity,
    setHighlightedEntity,
  ] = useState(null);

  const [
    highlightedRelationship,
    setHighlightedRelationship,
  ] = useState(null);

  const [
    currentStage,
    setCurrentStage,
  ] = useState("");

  const [
    mappingRows,
    setMappingRows,
  ] = useState([]);

  const [
    observationText,
    setObservationText,
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

  // =========================
  // CODING STATES
  // =========================

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState(
    "javascript"
  );

  const [
    codes,
    setCodes,
  ] = useState([]);

  const [
    results,
    setResults,
  ] = useState([]);

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
                "ER Modeling"
          );

        const modeQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "entities"
              ).toLowerCase() ===
              mode
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
    }, [mode]);

  useEffect(() => {

    fetchQuizQuestions();

  }, [fetchQuizQuestions]);

  useEffect(() => {

    if (
      !loading &&
      !user
    ) {

      navigate(
        "/login"
      );
    }

  }, [
    user,
    loading,
    navigate,
  ]);

  useEffect(() => {

    setStepHistory([]);

    setHighlightedEntity(
      null
    );

    setHighlightedRelationship(
      null
    );

    setCurrentStage("");

    setMappingRows([]);

    setObservationText("");

    setMessage(
      "ER Modelling lab initialized."
    );

    setExperimentRun(
      false
    );

    setIsRunning(false);

    setQuizSubmitted(
      false
    );

    setQuizScore(0);

    const starter =
      erCodeTemplates[
        mode
      ].javascript;

    const count =
      codingProblemsByMode[
        mode
      ].length;

    setCodes(
      Array(count).fill(
        starter
      )
    );

    setResults(
      Array(count).fill("")
    );

    setCodingSaveStatus(
      {}
    );

  }, [mode]);

  const addStep =
    useCallback(
      (text) => {

        setStepHistory(
          (prev) => [
            ...prev,
            text,
          ]
        );
      },
      []
    );

  const runSimulation =
    async () => {

      if (isRunning) {
        return;
      }

      setIsRunning(true);

      setExperimentRun(
        true
      );

      setStepHistory([]);

      setHighlightedEntity(
        null
      );

      setHighlightedRelationship(
        null
      );

      setCurrentStage(
        "Simulation Start"
      );

      setMappingRows([]);

      setObservationText("");

      try {

        if (
          mode ===
          "entities"
        ) {

          setMessage(
            "Starting entity exploration..."
          );

          addStep(
            "Started Entities & Attributes simulation."
          );

          await sleep(
            animationSpeed
          );

          for (const entity of erEntities) {

            setHighlightedEntity(
              entity.key
            );

            setCurrentStage(
              `Highlighting ${entity.name}`
            );

            setObservationText(
              `${entity.name} entity contains attributes and a primary key.`
            );

            addStep(
              `Highlighted entity ${entity.name}.`
            );

            await sleep(
              animationSpeed
            );
          }

          setHighlightedEntity(
            null
          );
        }

        if (
          mode ===
          "relationships"
        ) {

          setMessage(
            "Exploring relationships..."
          );

          addStep(
            "Started relationship simulation."
          );

          await sleep(
            animationSpeed
          );

          setHighlightedEntity(
            "student"
          );

          setHighlightedRelationship(
            "enrolls"
          );

          setCurrentStage(
            "Student ENROLLS_IN Course"
          );

          setObservationText(
            "Student and Course are connected using many-to-many relationship."
          );

          addStep(
            "Highlighted Student ENROLLS_IN Course."
          );

          await sleep(
            animationSpeed
          );

          setHighlightedEntity(
            "faculty"
          );

          setHighlightedRelationship(
            "teaches"
          );

          setCurrentStage(
            "Faculty TEACHES Course"
          );

          setObservationText(
            "Faculty TEACHES Course represents one-to-many relationship."
          );

          addStep(
            "Highlighted Faculty TEACHES Course."
          );

          await sleep(
            animationSpeed
          );

          setHighlightedEntity(
            null
          );

          setHighlightedRelationship(
            null
          );
        }

        if (
          mode ===
          "mapping"
        ) {

          setMessage(
            "Converting ER model into relational tables..."
          );

          addStep(
            "Started ER-to-Relational Mapping."
          );

          await sleep(
            animationSpeed
          );

          setCurrentStage(
            "Entity Mapping"
          );

          setMappingRows(
            relationalTables.slice(
              0,
              3
            )
          );

          setObservationText(
            "Strong entities become independent tables."
          );

          addStep(
            "Mapped strong entities into relational tables."
          );

          await sleep(
            animationSpeed
          );

          setCurrentStage(
            "Relationship Mapping"
          );

          setMappingRows(
            relationalTables
          );

          setObservationText(
            "Many-to-many relationships require junction tables."
          );

          addStep(
            "Created Enrollment junction table."
          );

          await sleep(
            animationSpeed
          );
        }

        setCurrentStage(
          "Complete"
        );

        setMessage(
          `${mode.toUpperCase()} simulation completed successfully.`
        );

        addStep(
          `${mode.toUpperCase()} simulation completed.`
        );

      } finally {

        setIsRunning(
          false
        );

        setHighlightedEntity(
          null
        );

        setHighlightedRelationship(
          null
        );
      }
    };

  const loadSample =
    () => {

      if (isRunning) {
        return;
      }

      setCurrentStage(
        "Sample Ready"
      );

      setObservationText(
        "Sample ER model loaded successfully."
      );

      setMappingRows(
        mode ===
          "mapping"
          ? relationalTables.slice(
              0,
              1
            )
          : []
      );

      setStepHistory([
        `Sample loaded for ${mode.toUpperCase()}.`,
      ]);

      setMessage(
        `Sample loaded for ${mode.toUpperCase()} mode.`
      );

      setExperimentRun(
        true
      );
    };

  const reset = () => {

    if (isRunning) {
      return;
    }

    setHighlightedEntity(
      null
    );

    setHighlightedRelationship(
      null
    );

    setCurrentStage("");

    setMappingRows([]);

    setObservationText("");

    setStepHistory([]);

    setMessage(
      "ER Modelling lab reset."
    );

    setExperimentRun(
      false
    );
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

          const selected =
            q.options?.[
              quizAnswers[i]
            ];

          if (
            selected ===
            q.correct_answer
          ) {

            score++;
          }
        }
      );

      setQuizScore(score);

      setQuizSubmitted(
        true
      );

      try {

        await axios.post(
          `${API_BASE_URL}/api/progress/update`,
          {
            experimentSlug:
              experimentSlug,

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

  const redoQuiz =
    () => {

      setQuizAnswers(
        Array(
          quizQuestions.length
        ).fill(null)
      );

      setQuizSubmitted(
        false
      );

      setQuizScore(0);

      setQuizSaveStatus(
        ""
      );
    };

  const updateCodeAt =
    (
      index,
      value
    ) => {

      setCodes(
        (prev) =>
          prev.map(
            (
              item,
              i
            ) =>
              i === index
                ? value
                : item
          )
      );
    };

  const setResultAt =
    (
      index,
      value
    ) => {

      setResults(
        (prev) =>
          prev.map(
            (
              item,
              i
            ) =>
              i === index
                ? value
                : item
          )
      );
    };

  const runCode =
    async (
      problemIndex
    ) => {

      try {

        // eslint-disable-next-line no-new-func
        const fn =
          new Function(
            `${codes[problemIndex]}; return answer;`
          );

        const result =
          fn();

        setResultAt(
          problemIndex,
          `Output:\n${JSON.stringify(
            result,
            null,
            2
          )}`
        );

        try {

          await saveCodingSubmission(
            {
              experimentSlug,

              problemTitle:
                codingProblemsByMode[
                  mode
                ][
                  problemIndex
                ].title,

              language:
                selectedLanguage,

              code:
                codes[
                  problemIndex
                ],

              result:
                "passed",

              points: 10,
            }
          );

          setCodingSaveStatus(
            (
              prev
            ) => ({
              ...prev,

              [problemIndex]:
                "Submission saved successfully.",
            })
          );

        } catch (saveError) {

          console.error(
            saveError
          );
        }

      } catch (error) {

        setResultAt(
          problemIndex,
          `Error: ${error.message}`
        );
      }
    };

  const analyzeCode =
    (
      problemIndex
    ) => {

      const content =
        (
          codes[
            problemIndex
          ] || ""
        ).toLowerCase();

      if (
        content.includes(
          "entity"
        ) ||
        content.includes(
          "relationship"
        ) ||
        content.includes(
          "table"
        )
      ) {

        setResultAt(
          problemIndex,
          "Analysis:\nYour answer includes major ER modeling concepts."
        );

      } else {

        setResultAt(
          problemIndex,
          "Analysis:\nYour answer is partially correct but missing important ER terminology."
        );
      }
    };

  const correctCode =
    (
      problemIndex
    ) => {

      updateCodeAt(
        problemIndex,
        erCodeTemplates[
          mode
        ].javascript
      );

      setResultAt(
        problemIndex,
        "Model answer loaded successfully."
      );
    };

  const progressPercent =
    activeSection ===
    "overview"
      ? 20
      : activeSection ===
        "simulation"
      ? 45
      : activeSection ===
        "comparison"
      ? 58
      : activeSection ===
        "coding"
      ? 72
      : activeSection ===
        "diagram"
      ? 85
      : activeSection ===
        "builder"
      ? 92
      : activeSection ===
        "quiz"
      ? 96
      : 50;

  const modeMeta = {
    entities: {
      title:
        "Entities & Attributes",

      description:
        "Explore entities, attributes, and keys.",

      icon: Database,
    },

    relationships: {
      title:
        "Relationships",

      description:
        "Understand cardinality and relationships.",

      icon: Link2,
    },

    mapping: {
      title:
        "ER to Relational Mapping",

      description:
        "Convert ER models into relational schema.",

      icon: Table2,
    },
  };

  const ActiveModeIcon =
    modeMeta[mode]
      ?.icon || Sparkles;

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
                  {sidebarItems.find((i) => i.key === activeSection)?.label ||
                    "ER Modelling"}
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

          <MarkCompleteButton experimentSlug={experimentSlug} />
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>ER Configuration</h2>
              <p>
                Choose the concept mode and control the animation flow for the simulation.
              </p>
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
              type="button"
            >
              <Database size={14} />
              Entities
            </button>

            <button
              className={`er-chip ${mode === "relationships" ? "active" : ""}`}
              onClick={() => setMode("relationships")}
              type="button"
            >
              <Link2 size={14} />
              Relationships
            </button>

            <button
              className={`er-chip ${mode === "mapping" ? "active" : ""}`}
              onClick={() => setMode("mapping")}
              type="button"
            >
              <Table2 size={14} />
              Mapping
            </button>

            <button className={`er-chip ${experimentRun ? "active" : ""}`} type="button">
              {experimentRun ? "Simulation Run" : "Not Started"}
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
                quizSaveStatus={quizSaveStatus}
                experimentRun={experimentRun}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && (
              <DBMSERModelingCoding
                codingProblems={codingProblemsByMode[mode]}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                codes={codes}
                results={results}
                codingSaveStatus={codingSaveStatus}
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