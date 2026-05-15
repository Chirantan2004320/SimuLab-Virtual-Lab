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

import {
  BookOpen,
  PlayCircle,
  GitCompare,
  Brain,
  FileCode2,
  ChevronsLeft,
  Search,
  Zap,
} from "lucide-react";

import SimuLabLogo from "../../../../components/SimuLabLogo";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import {
  saveCodingSubmission,
} from "../../../../API/progressApi";

import DBMSIndexingOverview from "./DBMSIndexingOverview";
import DBMSIndexingSimulation from "./DBMSIndexingSimulation";
import DBMSIndexingComparison from "./DBMSIndexingComparison";
import DBMSIndexingQuiz from "./DBMSIndexingQuiz";
import DBMSIndexingCoding from "./DBMSIndexingCoding";

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

const indexingProblemBank = {
  linear: [
    {
      id: 1,

      title:
        "Full Table Sequential Search",

      description:
        "Write logic to search for roll number 105 using sequential row-by-row scanning. Explain the comparison flow.",

      expectedKeywords: [
        "scan",
        "row",
        "comparison",
        "one by one",
        "105",
      ],
    },

    {
      id: 2,

      title:
        "Worst Case Linear Search",

      description:
        "Explain why linear scan becomes slower when the target exists near the end of the table.",

      expectedKeywords: [
        "many rows",
        "comparisons",
        "slow",
        "end",
      ],
    },

    {
      id: 3,

      title:
        "Linear Scan Complexity",

      description:
        "Write the time complexity of linear scanning and explain why it scales poorly.",

      expectedKeywords: [
        "O(n)",
        "scan",
        "rows",
        "slow",
      ],
    },
  ],

  indexed: [
    {
      id: 4,

      title:
        "Indexed Search Flow",

      description:
        "Write how indexed lookup jumps directly to a row using roll number indexing.",

      expectedKeywords: [
        "index",
        "direct",
        "lookup",
        "jump",
        "row position",
      ],
    },

    {
      id: 5,

      title:
        "Index Performance Analysis",

      description:
        "Explain how indexing reduces comparisons during searching.",

      expectedKeywords: [
        "fewer comparisons",
        "faster",
        "lookup",
        "direct access",
      ],
    },

    {
      id: 6,

      title:
        "Create Roll Number Index",

      description:
        "Write the syntax or idea behind creating an index on roll_no column.",

      expectedKeywords: [
        "CREATE INDEX",
        "roll_no",
        "lookup",
        "index",
      ],
    },
  ],
};

const studentRecords = [
  {
    roll_no: 101,
    name: "Aarav",
    department: "CSE",
    cgpa: 8.4,
  },

  {
    roll_no: 102,
    name: "Diya",
    department: "ECE",
    cgpa: 8.9,
  },

  {
    roll_no: 103,
    name: "Kabir",
    department: "ME",
    cgpa: 7.8,
  },

  {
    roll_no: 104,
    name: "Meera",
    department: "Civil",
    cgpa: 8.2,
  },

  {
    roll_no: 105,
    name: "Rohan",
    department: "CSE",
    cgpa: 9.1,
  },

  {
    roll_no: 106,
    name: "Ishita",
    department: "ECE",
    cgpa: 8.5,
  },

  {
    roll_no: 107,
    name: "Vivaan",
    department: "IT",
    cgpa: 7.9,
  },

  {
    roll_no: 108,
    name: "Anaya",
    department: "CSE",
    cgpa: 9.3,
  },
];

const buildIndexMap =
  (records) => {

    const map = {};

    records.forEach(
      (
        record,
        index
      ) => {

        map[
          record.roll_no
        ] = index;
      }
    );

    return map;
  };

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function DBMSIndexingLab() {

  const {
    user,
    loading,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    searchMode,
    setSearchMode,
  ] = useState("linear");

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
    "Indexing lab initialized."
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
    targetRollNo,
    setTargetRollNo,
  ] = useState("105");

  const [
    records,
    setRecords,
  ] = useState(
    studentRecords
  );

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(null);

  const [
    foundIndex,
    setFoundIndex,
  ] = useState(null);

  const [
    currentStage,
    setCurrentStage,
  ] = useState("");

  const [
    comparisons,
    setComparisons,
  ] = useState(0);

  const [
    indexMap,
    setIndexMap,
  ] = useState(
    buildIndexMap(
      studentRecords
    )
  );

  const [
    selectedIndexKey,
    setSelectedIndexKey,
  ] = useState(null);

  const [
    foundRecord,
    setFoundRecord,
  ] = useState(null);

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

  const [
    currentProblems,
    setCurrentProblems,
  ] = useState([]);

  const [
    answers,
    setAnswers,
  ] = useState({});

  const [
    results,
    setResults,
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
                "Indexing"
          );

        const modeQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "linear"
              ).toLowerCase() ===
              searchMode
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
    }, [searchMode]);

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

    setRecords(
      studentRecords
    );

    setCurrentIndex(
      null
    );

    setFoundIndex(
      null
    );

    setCurrentStage("");

    setComparisons(0);

    setIndexMap(
      buildIndexMap(
        studentRecords
      )
    );

    setSelectedIndexKey(
      null
    );

    setFoundRecord(
      null
    );

    setMessage(
      "Indexing lab initialized."
    );

    setExperimentRun(
      false
    );

    setIsRunning(false);

    setQuizSubmitted(
      false
    );

    setQuizScore(0);

    setCurrentProblems(
      []
    );

    setAnswers({});

    setResults({});

  }, [searchMode]);

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

      const target =
        Number(
          targetRollNo
        );

      if (
        Number.isNaN(
          target
        )
      ) {

        setMessage(
          "Please enter a valid roll number."
        );

        return;
      }

      setIsRunning(true);

      setExperimentRun(
        true
      );

      setStepHistory([]);

      setCurrentIndex(
        null
      );

      setFoundIndex(
        null
      );

      setCurrentStage(
        "Search Start"
      );

      setComparisons(0);

      setSelectedIndexKey(
        null
      );

      setFoundRecord(
        null
      );

      try {

        if (
          searchMode ===
          "linear"
        ) {

          setMessage(
            `Starting linear scan for roll number ${target}...`
          );

          addStep(
            `Started linear scan for roll number ${target}.`
          );

          await sleep(
            animationSpeed
          );

          let found = -1;

          for (
            let i = 0;
            i <
            records.length;
            i++
          ) {

            setCurrentIndex(
              i
            );

            setCurrentStage(
              "Scanning Row"
            );

            setComparisons(
              (prev) =>
                prev + 1
            );

            setMessage(
              `Checking row ${i + 1}: roll_no = ${records[i].roll_no}`
            );

            addStep(
              `Checked row ${i + 1} with roll number ${records[i].roll_no}.`
            );

            await sleep(
              animationSpeed
            );

            if (
              records[i]
                .roll_no ===
              target
            ) {

              found = i;

              setFoundIndex(
                i
              );

              setFoundRecord(
                records[i]
              );

              setCurrentStage(
                "Record Found"
              );

              setMessage(
                `Record found at row ${i + 1}.`
              );

              addStep(
                `Match found at row ${i + 1}.`
              );

              break;
            }
          }

          if (
            found === -1
          ) {

            setCurrentStage(
              "Not Found"
            );

            setMessage(
              `Roll number ${target} not found.`
            );

            addStep(
              `Target roll number ${target} was not found.`
            );
          }
        }

        else {

          setMessage(
            `Using index to search roll number ${target}...`
          );

          addStep(
            `Started indexed lookup for roll number ${target}.`
          );

          await sleep(
            animationSpeed
          );

          setCurrentStage(
            "Using Index"
          );

          setSelectedIndexKey(
            target
          );

          setComparisons(
            1
          );

          addStep(
            "Used roll_no index for direct lookup."
          );

          await sleep(
            animationSpeed
          );

          if (
            Object.prototype.hasOwnProperty.call(
              indexMap,
              target
            )
          ) {

            const rowPosition =
              indexMap[
                target
              ];

            setCurrentStage(
              "Jump To Row"
            );

            setCurrentIndex(
              rowPosition
            );

            setFoundIndex(
              rowPosition
            );

            setFoundRecord(
              records[
                rowPosition
              ]
            );

            setMessage(
              `Index pointed directly to row ${rowPosition + 1}.`
            );

            addStep(
              `Index lookup returned row position ${rowPosition + 1}.`
            );

            await sleep(
              animationSpeed
            );

            setCurrentStage(
              "Record Found"
            );

            setMessage(
              "Record found quickly using index."
            );

            addStep(
              "Indexed search completed with minimal comparisons."
            );
          }

          else {

            setCurrentStage(
              "Not Found"
            );

            setMessage(
              `Roll number ${target} not found in index.`
            );

            addStep(
              `Index lookup failed for roll number ${target}.`
            );
          }
        }

        setCurrentStage(
          "Complete"
        );

        addStep(
          `${
            searchMode ===
            "linear"
              ? "Without Index"
              : "With Index"
          } simulation completed.`
        );

      } finally {

        setIsRunning(
          false
        );
      }
    };

  const loadSample =
    () => {

      if (isRunning) {
        return;
      }

      setTargetRollNo(
        searchMode ===
          "linear"
          ? "108"
          : "105"
      );

      setRecords(
        studentRecords
      );

      setCurrentIndex(
        null
      );

      setFoundIndex(
        null
      );

      setCurrentStage(
        "Sample Ready"
      );

      setComparisons(0);

      setSelectedIndexKey(
        null
      );

      setFoundRecord(
        null
      );

      setStepHistory([
        `Sample loaded for ${
          searchMode ===
          "linear"
            ? "linear scan"
            : "indexed search"
        }.`,
      ]);

      setMessage(
        `Sample loaded for ${
          searchMode ===
          "linear"
            ? "linear scan"
            : "indexed search"
        }.`
      );
    };

  const reset = () => {

    if (isRunning) {
      return;
    }

    setRecords(
      studentRecords
    );

    setCurrentIndex(
      null
    );

    setFoundIndex(
      null
    );

    setCurrentStage("");

    setComparisons(0);

    setSelectedIndexKey(
      null
    );

    setFoundRecord(
      null
    );

    setStepHistory([]);

    setTargetRollNo(
      "105"
    );

    setMessage(
      "Indexing lab reset."
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

      setQuizSubmitted(
        true
      );

      try {

        await axios.post(
          `${API_BASE_URL}/api/progress/update`,
          {
            experimentSlug:
              "indexing",

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

  const generateProblems =
    () => {

      const shuffled = [
        ...indexingProblemBank[
          searchMode
        ],
      ].sort(
        () =>
          0.5 -
          Math.random()
      );

      const selected =
        shuffled.slice(
          0,
          3
        );

      const initialAnswers =
        {};

      selected.forEach(
        (problem) => {

          initialAnswers[
            problem.id
          ] = "";
        }
      );

      setCurrentProblems(
        selected
      );

      setAnswers(
        initialAnswers
      );

      setResults({});
    };

  const handleAnswerChange =
    (
      problemId,
      value
    ) => {

      setAnswers(
        (prev) => ({
          ...prev,
          [problemId]:
            value,
        })
      );
    };

    const runAnswer =
  (problemId) => {

    const problem =
      currentProblems.find(
        (p) =>
          p.id ===
          problemId
      );

    const answer =
      (
        answers[
          problemId
        ] || ""
      )
        .toLowerCase()
        .trim();

    if (!answer) {

      setResults(
        (prev) => ({
          ...prev,
          [problemId]:
            "Please write your answer first.",
        })
      );

      return;
    }

    const matchedKeywords =
      problem.expectedKeywords.filter(
        (keyword) =>
          answer.includes(
            keyword.toLowerCase()
          )
      );

    const isGood =
      matchedKeywords.length >=
      Math.ceil(
        problem
          .expectedKeywords
          .length / 2
      );

    setResults(
      (prev) => ({
        ...prev,

        [problemId]:
          isGood
            ? `Good answer. Matched concepts: ${matchedKeywords.join(", ")}`
            : `Your answer is partially correct. Try including ideas like: ${problem.expectedKeywords.join(", ")}`,
      })
    );
  };

const analyzeAnswer =
  (problemId) => {

    const answer =
      (
        answers[
          problemId
        ] || ""
      ).trim();

    if (!answer) {

      setResults(
        (prev) => ({
          ...prev,
          [problemId]:
            "Please write an answer before analysis.",
        })
      );

      return;
    }

    setResults(
      (prev) => ({
        ...prev,

        [problemId]:
          "Analysis: Your answer should clearly explain indexing structure, lookup efficiency, search optimization, and reduced comparisons.",
      })
    );
  };

const correctAnswer =
  (problemId) => {

    const problem =
      currentProblems.find(
        (p) =>
          p.id ===
          problemId
      );

    const corrected =
      searchMode ===
      "linear"
        ? `Correct answer:\n${problem.description}\n\nA linear scan checks each row one by one until the target record is found. More rows mean more comparisons, making searching slower for large tables.`
        : `Correct answer:\n${problem.description}\n\nAn index stores search keys with row locations. The DBMS uses the index to directly jump to matching rows, reducing comparisons and improving performance.`;

    setAnswers(
      (prev) => ({
        ...prev,
        [problemId]:
          corrected,
      })
    );

    setResults(
      (prev) => ({
        ...prev,
        [problemId]:
          "Correct answer inserted.",
      })
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
            <h1 className="er-page-title">Database Indexing</h1>
            <p className="er-page-subtitle">
              Compare linear scan and indexed lookup using search simulation, performance comparison, quiz, and practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Search Configuration</h2>
              <p>Choose whether the DBMS searches row-by-row or uses an index shortcut.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                {searchMode === "linear" ? <Search size={18} /> : <Zap size={18} />}
              </div>
              <div>
                <strong>{searchMode === "linear" ? "Without Index" : "With Index"}</strong>
                <span>
                  {searchMode === "linear"
                    ? "Sequential scan checks rows one by one."
                    : "Indexed lookup jumps directly using roll_no."}
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Search Mode</label>
              <select
                value={searchMode}
                onChange={(e) => setSearchMode(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="linear">Without Index (Linear Scan)</option>
                <option value="indexed">With Index</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Target Roll No</label>
              <input
                value={targetRollNo}
                onChange={(e) => setTargetRollNo(e.target.value)}
                className="sorting-input"
                disabled={isRunning}
              />
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
            <button className="er-chip active">Table: students</button>
            <button className="er-chip active">Rows: {studentRecords.length}</button>
            <button className="er-chip active">
              Mode: {searchMode === "linear" ? "Linear Scan" : "Indexed Lookup"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>
          <div style={{ marginTop: 24 }}>
  <MarkCompleteButton
    labSlug="dbms"
    experimentSlug="indexing"
    points={10}
  />
</div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DBMSIndexingOverview
                searchMode={searchMode}
                studentRecords={studentRecords}
                indexMap={indexMap}
              />
            )}

            {activeSection === "simulation" && (
              <DBMSIndexingSimulation
                searchMode={searchMode}
                records={records}
                indexMap={indexMap}
                runSimulation={runSimulation}
                reset={reset}
                loadSample={loadSample}
                message={message}
                currentIndex={currentIndex}
                foundIndex={foundIndex}
                currentStage={currentStage}
                comparisons={comparisons}
                stepHistory={stepHistory}
                selectedIndexKey={selectedIndexKey}
                foundRecord={foundRecord}
                isRunning={isRunning}
              />
            )}

            {activeSection === "comparison" && (
              <DBMSIndexingComparison studentRecords={studentRecords} />
            )}

            {activeSection === "quiz" && (
              <DBMSIndexingQuiz
  searchMode={searchMode}
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
              <DBMSIndexingCoding
  searchMode={searchMode}
  currentProblems={currentProblems}
  answers={answers}
  results={results}
  codingSaveStatus={codingSaveStatus}
  setCodingSaveStatus={setCodingSaveStatus}
  saveCodingSubmission={saveCodingSubmission}
  generateProblems={generateProblems}
  handleAnswerChange={handleAnswerChange}
  runAnswer={runAnswer}
  analyzeAnswer={analyzeAnswer}
  correctAnswer={correctAnswer}
/>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}