import React, { useEffect, useMemo, useState } from "react";
import "../../../SortingLab.css";
import { FlaskConical } from "lucide-react";

import DBMSTransactionsOverview from "./DBMSTransactionsOverview";
import DBMSTransactionsSimulation from "./DBMSTransactionsSimulation";
import DBMSTransactionsComparison from "./DBMSTransactionsComparison";
import DBMSTransactionsQuiz from "./DBMSTransactionsQuiz";
import DBMSTransactionsCoding from "./DBMSTransactionsCoding";

const transactionQuizQuestionsByType = {
  commit: [
    {
      question: "What does COMMIT do in a transaction?",
      options: [
        "Cancels all changes",
        "Permanently saves all changes",
        "Deletes the table",
        "Locks the database forever"
      ],
      correct: 1
    },
    {
      question: "After COMMIT, the transaction changes are:",
      options: [
        "Temporary only",
        "Saved permanently",
        "Automatically rolled back",
        "Hidden from all users"
      ],
      correct: 1
    },
    {
      question: "COMMIT is most closely related to which ACID property?",
      options: ["Durability", "Redundancy", "Indexing", "Normalization"],
      correct: 0
    }
  ],
  rollback: [
    {
      question: "What does ROLLBACK do in a transaction?",
      options: [
        "Saves all changes",
        "Reverses uncommitted changes",
        "Creates an index",
        "Drops a table"
      ],
      correct: 1
    },
    {
      question: "ROLLBACK is used when:",
      options: [
        "Everything succeeds",
        "The query output is large",
        "An error occurs and changes should be undone",
        "A table has NULL values"
      ],
      correct: 2
    },
    {
      question: "After ROLLBACK, the database returns to:",
      options: [
        "A random state",
        "The previous consistent state",
        "A deleted state",
        "A sorted state"
      ],
      correct: 1
    }
  ],
  atomicity: [
    {
      question: "Atomicity means:",
      options: [
        "A transaction is split across many databases",
        "A transaction is all-or-nothing",
        "A transaction must use one table only",
        "A transaction is always successful"
      ],
      correct: 1
    },
    {
      question: "If one step of a transaction fails under Atomicity:",
      options: [
        "Only failed step is ignored",
        "Everything stays partially updated",
        "Entire transaction is undone",
        "The database shuts down"
      ],
      correct: 2
    },
    {
      question: "A bank transfer is a common example of:",
      options: ["Sorting", "Atomicity", "Hashing", "Searching"],
      correct: 1
    }
  ]
};

const initialAccounts = [
  { account_id: "A101", holder: "Aarav", balance: 5000 },
  { account_id: "B205", holder: "Diya", balance: 3000 }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DBMSTransactionsLab() {
  const [transactionType, setTransactionType] = useState("commit");
  const [activeSection, setActiveSection] = useState("overview");
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

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    setStepHistory([]);
    setAccounts(initialAccounts);
    setSelectedAccountId(null);
    setCurrentStage("");
    setTransactionState("Not Started");
    setMessage("Transactions lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setQuizAnswers(Array(transactionQuizQuestionsByType[transactionType].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setTotalBefore(initialAccounts.reduce((sum, acc) => sum + acc.balance, 0));
    setTotalAfter(initialAccounts.reduce((sum, acc) => sum + acc.balance, 0));
    setActiveSection("overview");
  }, [transactionType]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

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
      addStep(`Transaction started for transferring ₹${amount} from A101 to B205.`);
      await sleep(animationSpeed);

      const workingAccounts = startingAccounts.map((acc) => ({ ...acc }));
      const fromIndex = workingAccounts.findIndex((acc) => acc.account_id === "A101");
      const toIndex = workingAccounts.findIndex((acc) => acc.account_id === "B205");

      setCurrentStage("Debit Step");
      setSelectedAccountId("A101");
      setMessage(`Debiting ₹${amount} from account A101...`);
      addStep(`Debit step: subtract ₹${amount} from account A101.`);
      await sleep(animationSpeed);

      workingAccounts[fromIndex].balance -= amount;
      setAccounts(workingAccounts.map((acc) => ({ ...acc })));
      setTotalAfter(workingAccounts.reduce((sum, acc) => sum + acc.balance, 0));
      await sleep(animationSpeed);

      if (transactionType === "rollback") {
        setCurrentStage("Error Occurred");
        setSelectedAccountId(null);
        setTransactionState("Failed");
        setMessage("An error occurred before crediting the second account.");
        addStep("Error detected after debit step. Credit step could not be completed.");
        await sleep(animationSpeed);

        setCurrentStage("Rollback");
        setTransactionState("Rolling Back");
        setMessage("Rolling back transaction...");
        addStep("ROLLBACK executed. Undoing all uncommitted changes.");
        await sleep(animationSpeed);

        setAccounts(startingAccounts.map((acc) => ({ ...acc })));
        setTotalAfter(totalStart);
        setTransactionState("Rolled Back");
        setCurrentStage("Rollback Complete");
        setMessage("Transaction rolled back. Database returned to previous consistent state.");
        addStep("Transaction rolled back successfully. Original balances restored.");
        await sleep(animationSpeed);
      } else {
        setCurrentStage("Credit Step");
        setSelectedAccountId("B205");
        setMessage(`Crediting ₹${amount} to account B205...`);
        addStep(`Credit step: add ₹${amount} to account B205.`);
        await sleep(animationSpeed);

        workingAccounts[toIndex].balance += amount;
        setAccounts(workingAccounts.map((acc) => ({ ...acc })));
        setTotalAfter(workingAccounts.reduce((sum, acc) => sum + acc.balance, 0));
        await sleep(animationSpeed);

        if (transactionType === "atomicity") {
          setCurrentStage("Atomicity Check");
          setSelectedAccountId(null);
          setTransactionState("Verifying");
          setMessage("Checking Atomicity: either both updates happen or neither happens.");
          addStep("Atomicity check: verified that debit and credit completed together.");
          await sleep(animationSpeed);
        }

        setCurrentStage("Commit");
        setTransactionState("Committed");
        setSelectedAccountId(null);
        setMessage("COMMIT executed. Transaction saved permanently.");
        addStep("COMMIT executed. All transaction changes saved permanently.");
        await sleep(animationSpeed);

        if (transactionType === "atomicity") {
          addStep("Atomicity preserved: no partial update remained in the database.");
        }
      }

      const finalTotal =
        transactionType === "rollback"
          ? totalStart
          : workingAccounts.reduce((sum, acc) => sum + acc.balance, 0);

      setTotalAfter(finalTotal);
      setCurrentStage("Complete");
      setMessage(`${transactionType.toUpperCase()} simulation completed.`);
      addStep(`${transactionType.toUpperCase()} transaction simulation completed successfully.`);

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
    setTotalBefore(initialAccounts.reduce((sum, acc) => sum + acc.balance, 0));
    setTotalAfter(initialAccounts.reduce((sum, acc) => sum + acc.balance, 0));
    setStepHistory([`Sample loaded for ${transactionType.toUpperCase()} transaction demo.`]);
    setMessage(`Sample loaded for ${transactionType.toUpperCase()} transaction.`);
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
    setTotalBefore(initialAccounts.reduce((sum, acc) => sum + acc.balance, 0));
    setTotalAfter(initialAccounts.reduce((sum, acc) => sum + acc.balance, 0));
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
      experiment: `${transactionType}-transaction`,
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
              Interactive Transactions Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            Transactions / ACID
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Explore COMMIT, ROLLBACK, and Atomicity through visual simulation, quiz, and SQL transaction practice.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Transaction Configuration</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16
            }}
          >
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
                <DBMSTransactionsOverview
                  transactionType={transactionType}
                  initialAccounts={initialAccounts}
                />
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
                <DBMSTransactionsComparison
                  transactionType={transactionType}
                  initialAccounts={initialAccounts}
                />
              )}

              {activeSection === "quiz" && (
                <DBMSTransactionsQuiz
                  transactionType={transactionType}
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
                <DBMSTransactionsCoding transactionType={transactionType} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}