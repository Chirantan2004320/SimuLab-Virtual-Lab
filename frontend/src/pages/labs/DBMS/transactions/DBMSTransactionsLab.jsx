import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  PlayCircle,
  GitCompare,
  Brain,
  FileCode2,
  ChevronsLeft,
  ShieldCheck
} from "lucide-react";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import {saveQuizResult,saveCodingSubmission} from "../../../../API/progressApi";

import DBMSTransactionsOverview from "./DBMSTransactionsOverview";
import DBMSTransactionsSimulation from "./DBMSTransactionsSimulation";
import DBMSTransactionsComparison from "./DBMSTransactionsComparison";
import DBMSTransactionsQuiz from "./DBMSTransactionsQuiz";
import DBMSTransactionsCoding from "./DBMSTransactionsCoding";

const simulabLogo = "/assets/logo.png";

const initialAccounts = [
  { account_id: "A101", holder: "Aarav", balance: 5000 },
  { account_id: "B205", holder: "Diya", balance: 3000 }
];

const transactionQuizQuestionsByType = {
  commit: [
    {
      question: "What does COMMIT do in a transaction?",
      options: ["Cancels all changes", "Permanently saves all changes", "Deletes the table", "Locks the database forever"],
      correct: 1
    },
    {
      question: "After COMMIT, transaction changes are:",
      options: ["Temporary only", "Saved permanently", "Automatically rolled back", "Hidden"],
      correct: 1
    },
    {
      question: "COMMIT is mainly related to:",
      options: ["Durability", "Redundancy", "Indexing", "Normalization"],
      correct: 0
    }
  ],
  rollback: [
    {
      question: "What does ROLLBACK do?",
      options: ["Saves changes", "Reverses uncommitted changes", "Creates index", "Deletes database"],
      correct: 1
    },
    {
      question: "ROLLBACK is used when:",
      options: ["Everything succeeds", "Output is large", "Error occurs", "Rows are sorted"],
      correct: 2
    },
    {
      question: "After ROLLBACK, database returns to:",
      options: ["Random state", "Previous consistent state", "Deleted state", "Sorted state"],
      correct: 1
    }
  ],
  atomicity: [
    {
      question: "Atomicity means:",
      options: ["Split transaction", "All-or-nothing transaction", "One table only", "Always successful"],
      correct: 1
    },
    {
      question: "If one step fails under atomicity:",
      options: ["Ignore failed step", "Keep partial update", "Undo entire transaction", "Shutdown database"],
      correct: 2
    },
    {
      question: "A bank transfer is an example of:",
      options: ["Sorting", "Atomicity", "Hashing", "Searching"],
      correct: 1
    }
  ]
};

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "comparison", label: "Comparison", icon: GitCompare },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DBMSTransactionsLab() {
  const [transactionType, setTransactionType] = useState("commit");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [message, setMessage] = useState("Transactions lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [currentStage, setCurrentStage] = useState("");
  const [transactionState, setTransactionState] = useState("Not Started");
  const [transferAmount, setTransferAmount] = useState("1000");
  const [totalBefore, setTotalBefore] = useState(8000);
  const [totalAfter, setTotalAfter] = useState(8000);

  const quizQuestions = useMemo(
    () => transactionQuizQuestionsByType[transactionType],
    [transactionType]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");
  const [codingSaveStatus, setCodingSaveStatus] = useState({});

  useEffect(() => {
    setStepHistory([]);
    setAccounts(initialAccounts.map((acc) => ({ ...acc })));
    setSelectedAccountId(null);
    setCurrentStage("");
    setTransactionState("Not Started");
    setMessage("Transactions lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setQuizAnswers(Array(transactionQuizQuestionsByType[transactionType].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setTotalBefore(8000);
    setTotalAfter(8000);
  }, [transactionType]);

  const addStep = (text) => setStepHistory((prev) => [...prev, text]);

  const runSimulation = async () => {
    if (isRunning) return;

    const amount = Number(transferAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      setMessage("Please enter a valid positive transfer amount.");
      return;
    }

    const startingAccounts = initialAccounts.map((acc) => ({ ...acc }));
    const totalStart = startingAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    setIsRunning(true);
    setExperimentRun(true);
    setStepHistory([]);
    setAccounts(startingAccounts);
    setSelectedAccountId(null);
    setCurrentStage("Transaction Start");
    setTransactionState("Started");
    setTotalBefore(totalStart);
    setTotalAfter(totalStart);

    try {
      setMessage(`Starting ${transactionType.toUpperCase()} transaction...`);
      addStep(`Transaction started: transfer ₹${amount} from A101 to B205.`);
      await sleep(animationSpeed);

      const workingAccounts = startingAccounts.map((acc) => ({ ...acc }));
      const fromIndex = workingAccounts.findIndex((acc) => acc.account_id === "A101");
      const toIndex = workingAccounts.findIndex((acc) => acc.account_id === "B205");

      setCurrentStage("Debit Step");
      setSelectedAccountId("A101");
      setMessage(`Debiting ₹${amount} from A101...`);
      addStep(`Debit: subtract ₹${amount} from account A101.`);
      await sleep(animationSpeed);

      workingAccounts[fromIndex].balance -= amount;
      setAccounts(workingAccounts.map((acc) => ({ ...acc })));
      setTotalAfter(workingAccounts.reduce((sum, acc) => sum + acc.balance, 0));
      await sleep(animationSpeed);

      if (transactionType === "rollback") {
        setCurrentStage("Error Occurred");
        setSelectedAccountId(null);
        setTransactionState("Failed");
        setMessage("Error occurred before crediting B205.");
        addStep("Error detected after debit. Credit step failed.");
        await sleep(animationSpeed);

        setCurrentStage("Rollback");
        setTransactionState("Rolling Back");
        setMessage("ROLLBACK executing...");
        addStep("ROLLBACK executed. Undoing all uncommitted changes.");
        await sleep(animationSpeed);

        setAccounts(startingAccounts.map((acc) => ({ ...acc })));
        setTotalAfter(totalStart);
        setTransactionState("Rolled Back");
        setCurrentStage("Rollback Complete");
        setMessage("Rollback complete. Original balances restored.");
        addStep("Database restored to previous consistent state.");
      } else {
        setCurrentStage("Credit Step");
        setSelectedAccountId("B205");
        setMessage(`Crediting ₹${amount} to B205...`);
        addStep(`Credit: add ₹${amount} to account B205.`);
        await sleep(animationSpeed);

        workingAccounts[toIndex].balance += amount;
        setAccounts(workingAccounts.map((acc) => ({ ...acc })));
        setTotalAfter(workingAccounts.reduce((sum, acc) => sum + acc.balance, 0));
        await sleep(animationSpeed);

        if (transactionType === "atomicity") {
          setCurrentStage("Atomicity Check");
          setSelectedAccountId(null);
          setTransactionState("Verifying");
          setMessage("Atomicity check: both debit and credit completed together.");
          addStep("Atomicity verified: no partial update remains.");
          await sleep(animationSpeed);
        }

        setCurrentStage("Commit");
        setTransactionState("Committed");
        setSelectedAccountId(null);
        setMessage("COMMIT executed. Transaction saved permanently.");
        addStep("COMMIT executed. All changes are now durable.");
      }

      setCurrentStage("Complete");
      addStep(`${transactionType.toUpperCase()} simulation completed.`);
      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `dbms-${transactionType}-transaction`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
      setSelectedAccountId(null);
    }
  };

  const loadSample = () => {
    if (isRunning) return;
    setTransferAmount("1000");
    setAccounts(initialAccounts.map((acc) => ({ ...acc })));
    setSelectedAccountId(null);
    setCurrentStage("Sample Ready");
    setTransactionState("Ready");
    setTotalBefore(8000);
    setTotalAfter(8000);
    setStepHistory([`Sample loaded for ${transactionType.toUpperCase()} transaction demo.`]);
    setMessage(`Sample loaded for ${transactionType.toUpperCase()} transaction.`);
    setExperimentRun(true);
  };

  const reset = () => {
    if (isRunning) return;
    setAccounts(initialAccounts.map((acc) => ({ ...acc })));
    setSelectedAccountId(null);
    setCurrentStage("");
    setTransactionState("Not Started");
    setStepHistory([]);
    setTransferAmount("1000");
    setMessage("Transactions lab reset.");
    setExperimentRun(false);
    setTotalBefore(8000);
    setTotalAfter(8000);
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
      experimentSlug: "transactions",
      correctAnswers: score,
      totalQuestions: quizQuestions.length
    });

    setQuizSaveStatus("Quiz result saved to dashboard.");
  } catch (error) {
    console.error("Quiz save failed:", error);
    setQuizSaveStatus("Quiz submitted, but backend save failed.");
  }

  const scores = JSON.parse(localStorage.getItem("vlab_scores") || "[]");
  scores.push({
    subject: "DBMS",
    experiment: "transactions",
    mode: transactionType,
    correct: score,
    total: quizQuestions.length,
    time: Date.now()
  });
  localStorage.setItem("vlab_scores", JSON.stringify(scores));
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
      ? 50
      : activeSection === "comparison"
      ? 70
      : activeSection === "quiz"
      ? 85
      : 95;

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
          <div className="er-brand-logo">
            <img src={simulabLogo} alt="SimuLab" onError={(e) => (e.currentTarget.style.display = "none")} />
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
            <h1 className="er-page-title">Transactions / ACID</h1>
            <p className="er-page-subtitle">
              Explore COMMIT, ROLLBACK, and Atomicity using a bank transfer transaction.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Transaction Configuration</h2>
              <p>Choose a transaction behavior and control the bank transfer simulation.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong>{transactionType.toUpperCase()} Demo</strong>
                <span>
                  {transactionType === "commit"
                    ? "Successful transaction saved permanently."
                    : transactionType === "rollback"
                    ? "Failed transaction restored safely."
                    : "All-or-nothing transaction behavior."}
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Transaction Type</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="commit">COMMIT Demo</option>
                <option value="rollback">ROLLBACK Demo</option>
                <option value="atomicity">Atomicity Demo</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Transfer Amount</label>
              <input
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
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
            <button className="er-chip active">Accounts: 2</button>
            <button className="er-chip active">Before Total: ₹{totalBefore}</button>
            <button className="er-chip active">After Total: ₹{totalAfter}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Experiment Run" : "Not Started"}
            </button>
          </div>
          <div style={{ marginTop: 24 }}>
  <MarkCompleteButton
    labSlug="dbms"
    experimentSlug="transactions"
    points={10}
  />
</div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DBMSTransactionsOverview transactionType={transactionType} initialAccounts={initialAccounts} />
            )}

            {activeSection === "simulation" && (
              <DBMSTransactionsSimulation
                transactionType={transactionType}
                accounts={accounts}
                runSimulation={runSimulation}
                reset={reset}
                loadSample={loadSample}
                message={message}
                selectedAccountId={selectedAccountId}
                stepHistory={stepHistory}
                currentStage={currentStage}
                transactionState={transactionState}
                totalBefore={totalBefore}
                totalAfter={totalAfter}
                transferAmount={transferAmount}
                isRunning={isRunning}
              />
            )}

            {activeSection === "comparison" && (
              <DBMSTransactionsComparison transactionType={transactionType} initialAccounts={initialAccounts} />
            )}

            {activeSection === "quiz" && (
              <DBMSTransactionsQuiz
  transactionType={transactionType}
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
              <DBMSTransactionsCoding
  transactionType={transactionType}
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