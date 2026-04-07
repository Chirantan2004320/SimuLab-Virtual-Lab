import React, { useEffect, useMemo, useState } from "react";
import "../../../Lab.css";
import "../../../SortingLab.css";
import DBMSTransactionsOverview from "./DBMSTransactionsOverview";
import DBMSTransactionsSimulation from "./DBMSTransactionsSimulation";
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
      options: [
        "Sorting",
        "Atomicity",
        "Hashing",
        "Searching"
      ],
      correct: 1
    }
  ]
};

const codingProblemByType = {
  commit: {
    title: "Write a transaction with COMMIT",
    description:
      "Write SQL statements to transfer money from one account to another and commit the transaction after both updates succeed."
  },
  rollback: {
    title: "Write a transaction with ROLLBACK",
    description:
      "Write SQL statements to start a transaction, perform updates, and roll back the transaction if an error occurs."
  },
  atomicity: {
    title: "Write an Atomic transaction",
    description:
      "Write SQL statements for a bank transfer where both debit and credit must happen together or not happen at all."
  }
};

const transactionCodeTemplates = {
  commit: {
    javascript: `const query = \`
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 1000
WHERE account_id = 'A101';

UPDATE accounts
SET balance = balance + 1000
WHERE account_id = 'B205';

COMMIT;
\`;`,
    python: `query = """
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 1000
WHERE account_id = 'A101';

UPDATE accounts
SET balance = balance + 1000
WHERE account_id = 'B205';

COMMIT;
"""`,
    cpp: `string query =
"BEGIN TRANSACTION;\\n\\n"
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n"
"UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B205';\\n\\n"
"COMMIT;";`,
    c: `char query[] =
"BEGIN TRANSACTION;\\n\\n"
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n"
"UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B205';\\n\\n"
"COMMIT;";`,
    java: `String query =
"BEGIN TRANSACTION;\\n\\n" +
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n" +
"UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B205';\\n\\n" +
"COMMIT;";`
  },
  rollback: {
    javascript: `const query = \`
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 1000
WHERE account_id = 'A101';

-- Suppose an error happens before crediting second account

ROLLBACK;
\`;`,
    python: `query = """
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 1000
WHERE account_id = 'A101';

-- Suppose an error happens before crediting second account

ROLLBACK;
"""`,
    cpp: `string query =
"BEGIN TRANSACTION;\\n\\n"
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n"
"-- Suppose an error happens before crediting second account\\n\\n"
"ROLLBACK;";`,
    c: `char query[] =
"BEGIN TRANSACTION;\\n\\n"
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n"
"-- Suppose an error happens before crediting second account\\n\\n"
"ROLLBACK;";`,
    java: `String query =
"BEGIN TRANSACTION;\\n\\n" +
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n" +
"-- Suppose an error happens before crediting second account\\n\\n" +
"ROLLBACK;";`
  },
  atomicity: {
    javascript: `const query = \`
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 1000
WHERE account_id = 'A101';

UPDATE accounts
SET balance = balance + 1000
WHERE account_id = 'B205';

-- If any step fails, undo everything
-- Otherwise, save everything

COMMIT;
\`;`,
    python: `query = """
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 1000
WHERE account_id = 'A101';

UPDATE accounts
SET balance = balance + 1000
WHERE account_id = 'B205';

-- If any step fails, undo everything
-- Otherwise, save everything

COMMIT;
"""`,
    cpp: `string query =
"BEGIN TRANSACTION;\\n\\n"
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n"
"UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B205';\\n\\n"
"-- If any step fails, undo everything\\n"
"-- Otherwise, save everything\\n\\n"
"COMMIT;";`,
    c: `char query[] =
"BEGIN TRANSACTION;\\n\\n"
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n"
"UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B205';\\n\\n"
"-- If any step fails, undo everything\\n"
"-- Otherwise, save everything\\n\\n"
"COMMIT;";`,
    java: `String query =
"BEGIN TRANSACTION;\\n\\n" +
"UPDATE accounts SET balance = balance - 1000 WHERE account_id = 'A101';\\n\\n" +
"UPDATE accounts SET balance = balance + 1000 WHERE account_id = 'B205';\\n\\n" +
"-- If any step fails, undo everything\\n" +
"-- Otherwise, save everything\\n\\n" +
"COMMIT;";`
  }
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

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(transactionCodeTemplates.commit.javascript);
  const [codeResult, setCodeResult] = useState("");

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
    setCodeResult("");
    setTotalBefore(initialAccounts.reduce((sum, acc) => sum + acc.balance, 0));
    setTotalAfter(initialAccounts.reduce((sum, acc) => sum + acc.balance, 0));
  }, [transactionType]);

  useEffect(() => {
    setCode(transactionCodeTemplates[transactionType][selectedLanguage]);
    setCodeResult("");
  }, [transactionType, selectedLanguage]);

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
          : (transactionType === "commit" || transactionType === "atomicity")
          ? workingAccounts.reduce((sum, acc) => sum + acc.balance, 0)
          : totalStart;

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

  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${code}; return query;`);
      const result = fn();
      setCodeResult(`Output:\n${result}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem = codingProblemByType[transactionType];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Transactions / ACID</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Transaction Type</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
              disabled={isRunning}
            >
              <option value="commit">COMMIT Demo</option>
              <option value="rollback">ROLLBACK Demo</option>
              <option value="atomicity">Atomicity Demo</option>
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
              Transfer Amount
            </label>
            <input
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="lab-input"
              style={{ minWidth: "180px" }}
              disabled={isRunning}
            />
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
            <DBMSTransactionsCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              transactionType={transactionType}
            />
          )}
        </main>
      </div>
    </div>
  );
}