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
  ShieldCheck,
  LockKeyhole,
  AlertTriangle,
} from "lucide-react";

import SimuLabLogo from "../../../../components/SimuLabLogo";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";

import DBMSConcurrencyOverview from "./DBMSConcurrencyOverview";
import DBMSConcurrencySimulation from "./DBMSConcurrencySimulation";
import DBMSConcurrencyComparison from "./DBMSConcurrencyComparison";
import DBMSConcurrencyQuiz from "./DBMSConcurrencyQuiz";
import DBMSConcurrencyCoding from "./DBMSConcurrencyCoding";

import {
  saveCodingSubmission,
} from "../../../../API/progressApi";

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

const codingProblemByType = {
  "lost-update": {
    title:
      "Lost Update Concurrency Scenario",

    description:
      "Write advanced SQL transaction logic showing how stale reads cause overwritten updates in concurrent banking systems.",
  },

  "dirty-read": {
    title:
      "Dirty Read Isolation Problem",

    description:
      "Write a transaction isolation scenario where one transaction reads temporary uncommitted data and explain the consequences.",
  },

  locking: {
    title:
      "Row-Level Locking Strategy",

    description:
      "Write a locking strategy using SELECT FOR UPDATE and explain how blocking prevents unsafe concurrent modifications.",
  },
};

const concurrencyCodeTemplates =
  {
    "lost-update": {
      javascript: `const example = \`
-- T1
BEGIN TRANSACTION;
SELECT balance FROM account WHERE id = 1;

-- T2
BEGIN TRANSACTION;
SELECT balance FROM account WHERE id = 1;

-- T1 updates
UPDATE account SET balance = 900 WHERE id = 1;
COMMIT;

-- T2 overwrites old value
UPDATE account SET balance = 950 WHERE id = 1;
COMMIT;
\`;`,
    },

    "dirty-read": {
      javascript: `const example = \`
-- T1
BEGIN TRANSACTION;
UPDATE account SET balance = 700 WHERE id = 1;

-- T2 reads temporary value
SELECT balance FROM account WHERE id = 1;

ROLLBACK;
\`;`,
    },

    locking: {
      javascript: `const example = \`
-- T1
BEGIN TRANSACTION;
SELECT * FROM account
WHERE id = 1 FOR UPDATE;

-- T2 waits

UPDATE account
SET balance = 900
WHERE id = 1;

COMMIT;
\`;`,
    },
  };

const initialRow = {
  item_id: "ACC-101",
  item_name:
    "Shared Balance",
  value: 1000,
};

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export default function DBMSConcurrencyLab() {

  const {
    user,
    loading,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    demoType,
    setDemoType,
  ] = useState(
    "lost-update"
  );

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
    "Concurrency Control lab initialized."
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
    sharedRow,
    setSharedRow,
  ] = useState(
    initialRow
  );

  const [
    transaction1State,
    setTransaction1State,
  ] = useState(
    "Idle"
  );

  const [
    transaction2State,
    setTransaction2State,
  ] = useState(
    "Idle"
  );

  const [
    transaction1Read,
    setTransaction1Read,
  ] = useState(null);

  const [
    transaction2Read,
    setTransaction2Read,
  ] = useState(null);

  const [
    lockHolder,
    setLockHolder,
  ] = useState("None");

  const [
    currentStage,
    setCurrentStage,
  ] = useState("");

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] = useState(null);

  const [
    anomalyText,
    setAnomalyText,
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

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState(
    "javascript"
  );

  const [
    code,
    setCode,
  ] = useState(
    concurrencyCodeTemplates[
      "lost-update"
    ].javascript
  );

  const [
    codeResult,
    setCodeResult,
  ] = useState("");

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
                "Concurrency"
          );

        const modeQuestions =
          filtered.filter(
            (q) =>
              (
                q.topic ||
                "lost-update"
              ).toLowerCase() ===
              demoType
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
    }, [demoType]);

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

    setSharedRow(
      initialRow
    );

    setTransaction1State(
      "Idle"
    );

    setTransaction2State(
      "Idle"
    );

    setTransaction1Read(
      null
    );

    setTransaction2Read(
      null
    );

    setLockHolder(
      "None"
    );

    setCurrentStage("");

    setSelectedTransaction(
      null
    );

    setAnomalyText("");

    setMessage(
      "Concurrency Control lab initialized."
    );

    setExperimentRun(
      false
    );

    setIsRunning(false);

    setQuizSubmitted(
      false
    );

    setQuizScore(0);

    setCodeResult("");

  }, [demoType]);

  useEffect(() => {

    setCode(
      concurrencyCodeTemplates[
        demoType
      ][
        selectedLanguage
      ]
    );

    setCodeResult("");

  }, [
    demoType,
    selectedLanguage,
  ]);

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

      setSharedRow(
        initialRow
      );

      setTransaction1State(
        "Started"
      );

      setTransaction2State(
        "Started"
      );

      setCurrentStage(
        "Simulation Start"
      );

      setSelectedTransaction(
        null
      );

      setAnomalyText("");

      try {

        if (
          demoType ===
          "lost-update"
        ) {

          setMessage(
            "Starting Lost Update demo..."
          );

          addStep(
            "Started Lost Update demo."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T1"
          );

          setTransaction1Read(
            1000
          );

          setTransaction1State(
            "Read"
          );

          addStep(
            "T1 reads balance 1000."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T2"
          );

          setTransaction2Read(
            1000
          );

          setTransaction2State(
            "Read"
          );

          addStep(
            "T2 also reads old balance 1000."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T1"
          );

          setSharedRow(
            (prev) => ({
              ...prev,
              value: 900,
            })
          );

          setTransaction1State(
            "Committed"
          );

          addStep(
            "T1 updates value to 900."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T2"
          );

          setSharedRow(
            (prev) => ({
              ...prev,
              value: 950,
            })
          );

          setTransaction2State(
            "Committed"
          );

          setAnomalyText(
            "Lost Update detected because T2 overwrote T1."
          );

          addStep(
            "T2 overwrote T1 using stale data."
          );

          await sleep(
            animationSpeed
          );
        }

        if (
          demoType ===
          "dirty-read"
        ) {

          setSelectedTransaction(
            "T1"
          );

          setSharedRow(
            (prev) => ({
              ...prev,
              value: 700,
            })
          );

          setTransaction1State(
            "Uncommitted"
          );

          addStep(
            "T1 updated value to 700 without commit."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T2"
          );

          setTransaction2Read(
            700
          );

          setTransaction2State(
            "Dirty Read"
          );

          addStep(
            "T2 read temporary uncommitted value."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T1"
          );

          setSharedRow(
            initialRow
          );

          setTransaction1State(
            "Rolled Back"
          );

          setAnomalyText(
            "Dirty Read occurred because T2 used uncommitted data."
          );

          addStep(
            "T1 rolled back. T2 had invalid data."
          );

          await sleep(
            animationSpeed
          );
        }

        if (
          demoType ===
          "locking"
        ) {

          setSelectedTransaction(
            "T1"
          );

          setLockHolder(
            "T1"
          );

          setTransaction1State(
            "Holding Lock"
          );

          addStep(
            "T1 acquired exclusive lock."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T2"
          );

          setTransaction2State(
            "Waiting"
          );

          addStep(
            "T2 waiting for lock."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T1"
          );

          setSharedRow(
            (prev) => ({
              ...prev,
              value: 900,
            })
          );

          setTransaction1State(
            "Committed"
          );

          addStep(
            "T1 committed changes."
          );

          await sleep(
            animationSpeed
          );

          setLockHolder(
            "None"
          );

          addStep(
            "Lock released."
          );

          await sleep(
            animationSpeed
          );

          setSelectedTransaction(
            "T2"
          );

          setLockHolder(
            "T2"
          );

          setTransaction2State(
            "Holding Lock"
          );

          setTransaction2Read(
            900
          );

          addStep(
            "T2 acquired lock safely."
          );

          await sleep(
            animationSpeed
          );

          setSharedRow(
            (prev) => ({
              ...prev,
              value: 850,
            })
          );

          setTransaction2State(
            "Committed"
          );

          setLockHolder(
            "None"
          );

          setAnomalyText(
            "Locking prevented concurrency anomaly."
          );

          addStep(
            "T2 updated safely."
          );

          await sleep(
            animationSpeed
          );
        }

        setCurrentStage(
          "Complete"
        );

        addStep(
          `${demoType.toUpperCase()} simulation completed.`
        );

      } finally {

        setIsRunning(
          false
        );

        setSelectedTransaction(
          null
        );
      }
    };

  const loadSample =
    () => {

      if (isRunning) {
        return;
      }

      setSharedRow(
        initialRow
      );

      setTransaction1State(
        "Ready"
      );

      setTransaction2State(
        "Ready"
      );

      setLockHolder(
        "None"
      );

      setCurrentStage(
        "Sample Ready"
      );

      setSelectedTransaction(
        null
      );

      setAnomalyText("");

      setStepHistory([
        `Sample loaded for ${demoType.toUpperCase()} demo.`,
      ]);

      setMessage(
        `Sample loaded for ${demoType.toUpperCase()} demo.`
      );
    };

  const reset = () => {

    if (isRunning) {
      return;
    }

    setSharedRow(
      initialRow
    );

    setTransaction1State(
      "Idle"
    );

    setTransaction2State(
      "Idle"
    );

    setLockHolder(
      "None"
    );

    setCurrentStage("");

    setSelectedTransaction(
      null
    );

    setAnomalyText("");

    setStepHistory([]);

    setMessage(
      "Concurrency Control lab reset."
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
              "concurrency",

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

  const runCode =
    () => {

      if (
        selectedLanguage !==
        "javascript"
      ) {

        setCodeResult(
          `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet.`
        );

        return;
      }

      try {

        const fn =
          new Function(
            `${code}; return example;`
          );

        const result =
          fn();

        setCodeResult(
          `Output:\n${result}`
        );

      } catch (error) {

        setCodeResult(
          `Error: ${error.message}`
        );
      }
    };

  const analyzeCode =
    () => {

      setCodeResult(
        "Analysis:\nThis transaction flow demonstrates concurrency anomalies and transaction isolation concepts."
      );
    };

  const optimizeCode =
    () => {

      setCodeResult(
        "Optimization Suggestion:\nUse row-level locking, proper isolation levels, and short transaction duration."
      );
    };

  const demoLabel =
    demoType ===
    "lost-update"
      ? "Lost Update"
      : demoType ===
        "dirty-read"
      ? "Dirty Read"
      : "Locking Demo";

  const codingProblem =
    codingProblemByType[
      demoType
    ];

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
            <h1 className="er-page-title">Concurrency Control</h1>
            <p className="er-page-subtitle">
              Understand Lost Update, Dirty Read, and Locking through concurrent transaction visualization.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Concurrency Configuration</h2>
              <p>Select a concurrency anomaly or control technique and observe how two transactions interact.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                {demoType === "locking" ? (
                  <LockKeyhole size={18} />
                ) : demoType === "dirty-read" ? (
                  <AlertTriangle size={18} />
                ) : (
                  <ShieldCheck size={18} />
                )}
              </div>
              <div>
                <strong>{demoLabel}</strong>
                <span>
                  {demoType === "lost-update" &&
                    "Two transactions overwrite shared data using stale reads."}
                  {demoType === "dirty-read" &&
                    "One transaction reads another transaction's uncommitted value."}
                  {demoType === "locking" &&
                    "Locks force safe access to shared data."}
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Demo Type</label>
              <select
                value={demoType}
                onChange={(e) => setDemoType(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="lost-update">Lost Update</option>
                <option value="dirty-read">Dirty Read</option>
                <option value="locking">Locking Demo</option>
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

            <div>
              <label className="sorting-label">Shared Value</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {sharedRow.value}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Demo: {demoLabel}</button>
            <button className="er-chip active">T1: {transaction1State}</button>
            <button className="er-chip active">T2: {transaction2State}</button>
            <button className="er-chip active">Lock: {lockHolder}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>
          <div style={{ marginTop: 24 }}>
            <MarkCompleteButton
              labSlug="dbms"
              experimentSlug="concurrency"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DBMSConcurrencyOverview demoType={demoType} initialRow={initialRow} />
            )}

            {activeSection === "simulation" && (
              <DBMSConcurrencySimulation
                demoType={demoType}
                sharedRow={sharedRow}
                runSimulation={runSimulation}
                reset={reset}
                loadSample={loadSample}
                message={message}
                transaction1State={transaction1State}
                transaction2State={transaction2State}
                transaction1Read={transaction1Read}
                transaction2Read={transaction2Read}
                lockHolder={lockHolder}
                currentStage={currentStage}
                selectedTransaction={selectedTransaction}
                anomalyText={anomalyText}
                stepHistory={stepHistory}
                isRunning={isRunning}
              />
            )}

            {activeSection === "comparison" && (
              <DBMSConcurrencyComparison demoType={demoType} />
            )}

            {activeSection === "quiz" && (
             <DBMSConcurrencyQuiz
  demoType={demoType}
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
              <DBMSConcurrencyCoding
  codingProblem={codingProblem}
  selectedLanguage={selectedLanguage}
  setSelectedLanguage={setSelectedLanguage}
  code={code}
  setCode={setCode}
  codeResult={codeResult}
  codingSaveStatus={codingSaveStatus}
  setCodingSaveStatus={setCodingSaveStatus}
  saveCodingSubmission={saveCodingSubmission}
  runCode={runCode}
  demoType={demoType}
  analyzeCode={analyzeCode}
  optimizeCode={optimizeCode}
/>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}