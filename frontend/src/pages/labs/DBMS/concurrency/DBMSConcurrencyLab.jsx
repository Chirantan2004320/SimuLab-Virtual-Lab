import React, { useEffect, useMemo, useState } from "react";
import "../../../Lab.css";
import "../../../SortingLab.css";
import DBMSConcurrencyOverview from "./DBMSConcurrencyOverview";
import DBMSConcurrencySimulation from "./DBMSConcurrencySimulation";
import DBMSConcurrencyQuiz from "./DBMSConcurrencyQuiz";
import DBMSConcurrencyCoding from "./DBMSConcurrencyCoding";

const concurrencyQuizQuestionsByType = {
  "lost-update": [
    {
      question: "What is a Lost Update problem?",
      options: [
        "A transaction is deleted permanently",
        "One transaction overwrites another transaction's update",
        "A table loses its primary key",
        "The DBMS deletes a row automatically"
      ],
      correct: 1
    },
    {
      question: "Lost Update usually happens when:",
      options: [
        "Only one transaction runs",
        "Concurrent transactions update the same data without proper control",
        "An index is created",
        "The table is normalized"
      ],
      correct: 1
    },
    {
      question: "A common way to prevent Lost Update is:",
      options: [
        "Use locking or concurrency control",
        "Remove primary keys",
        "Disable COMMIT",
        "Use more NULL values"
      ],
      correct: 0
    }
  ],
  "dirty-read": [
    {
      question: "Dirty Read means:",
      options: [
        "Reading uncommitted data from another transaction",
        "Reading data from a dirty table",
        "Reading duplicate rows",
        "Reading indexed rows only"
      ],
      correct: 0
    },
    {
      question: "Why is Dirty Read dangerous?",
      options: [
        "Because uncommitted data may later be rolled back",
        "Because it always improves performance",
        "Because it removes indexes",
        "Because it changes primary keys"
      ],
      correct: 0
    },
    {
      question: "Dirty Read is avoided using:",
      options: [
        "Proper isolation levels / locking",
        "ORDER BY",
        "Normalization",
        "Hashing"
      ],
      correct: 0
    }
  ],
  locking: [
    {
      question: "What is the purpose of a lock in concurrency control?",
      options: [
        "To block all users permanently",
        "To control safe access to shared data",
        "To delete a transaction",
        "To sort records"
      ],
      correct: 1
    },
    {
      question: "In a locking demo, if T1 holds the lock, T2 usually:",
      options: [
        "Must wait",
        "Deletes the row",
        "Commits automatically",
        "Skips the data forever"
      ],
      correct: 0
    },
    {
      question: "Locking helps prevent:",
      options: [
        "Data anomalies from simultaneous access",
        "Only syntax errors",
        "Only indexing issues",
        "Only NULL values"
      ],
      correct: 0
    }
  ]
};

const codingProblemByType = {
  "lost-update": {
    title: "Write a Lost Update example",
    description:
      "Write SQL-style steps showing how two concurrent transactions can overwrite each other's update on the same balance."
  },
  "dirty-read": {
    title: "Write a Dirty Read example",
    description:
      "Write SQL-style steps showing how one transaction reads uncommitted data from another transaction."
  },
  locking: {
    title: "Write a Locking example",
    description:
      "Write SQL-style steps showing how one transaction acquires a lock and another transaction waits until the lock is released."
  }
};

const concurrencyCodeTemplates = {
  "lost-update": {
    javascript: `const example = \`
-- T1
BEGIN TRANSACTION;
SELECT balance FROM account WHERE id = 1; -- reads 1000

-- T2
BEGIN TRANSACTION;
SELECT balance FROM account WHERE id = 1; -- also reads 1000

-- T1 updates
UPDATE account SET balance = 900 WHERE id = 1;
COMMIT;

-- T2 updates using old value
UPDATE account SET balance = 950 WHERE id = 1;
COMMIT;
\`;`,
    python: `example = """
-- T1
BEGIN TRANSACTION;
SELECT balance FROM account WHERE id = 1; -- reads 1000

-- T2
BEGIN TRANSACTION;
SELECT balance FROM account WHERE id = 1; -- also reads 1000

-- T1 updates
UPDATE account SET balance = 900 WHERE id = 1;
COMMIT;

-- T2 updates using old value
UPDATE account SET balance = 950 WHERE id = 1;
COMMIT;
"""`,
    cpp: `string example =
"-- T1\\n"
"BEGIN TRANSACTION;\\n"
"SELECT balance FROM account WHERE id = 1;\\n\\n"
"-- T2\\n"
"BEGIN TRANSACTION;\\n"
"SELECT balance FROM account WHERE id = 1;\\n\\n"
"-- T1 updates\\n"
"UPDATE account SET balance = 900 WHERE id = 1;\\n"
"COMMIT;\\n\\n"
"-- T2 updates using old value\\n"
"UPDATE account SET balance = 950 WHERE id = 1;\\n"
"COMMIT;";`,
    c: `char example[] =
"-- T1\\nBEGIN TRANSACTION;\\nSELECT balance FROM account WHERE id = 1;\\n\\n"
"-- T2\\nBEGIN TRANSACTION;\\nSELECT balance FROM account WHERE id = 1;\\n\\n"
"-- T1 updates\\nUPDATE account SET balance = 900 WHERE id = 1;\\nCOMMIT;\\n\\n"
"-- T2 updates using old value\\nUPDATE account SET balance = 950 WHERE id = 1;\\nCOMMIT;";`,
    java: `String example =
"-- T1\\n" +
"BEGIN TRANSACTION;\\n" +
"SELECT balance FROM account WHERE id = 1;\\n\\n" +
"-- T2\\n" +
"BEGIN TRANSACTION;\\n" +
"SELECT balance FROM account WHERE id = 1;\\n\\n" +
"-- T1 updates\\n" +
"UPDATE account SET balance = 900 WHERE id = 1;\\n" +
"COMMIT;\\n\\n" +
"-- T2 updates using old value\\n" +
"UPDATE account SET balance = 950 WHERE id = 1;\\n" +
"COMMIT;";`
  },
  "dirty-read": {
    javascript: `const example = \`
-- T1
BEGIN TRANSACTION;
UPDATE account SET balance = 700 WHERE id = 1;

-- T2 reads uncommitted value
SELECT balance FROM account WHERE id = 1; -- reads 700

-- T1 fails
ROLLBACK;
\`;`,
    python: `example = """
-- T1
BEGIN TRANSACTION;
UPDATE account SET balance = 700 WHERE id = 1;

-- T2 reads uncommitted value
SELECT balance FROM account WHERE id = 1; -- reads 700

-- T1 fails
ROLLBACK;
"""`,
    cpp: `string example =
"-- T1\\n"
"BEGIN TRANSACTION;\\n"
"UPDATE account SET balance = 700 WHERE id = 1;\\n\\n"
"-- T2 reads uncommitted value\\n"
"SELECT balance FROM account WHERE id = 1;\\n\\n"
"-- T1 fails\\n"
"ROLLBACK;";`,
    c: `char example[] =
"-- T1\\nBEGIN TRANSACTION;\\nUPDATE account SET balance = 700 WHERE id = 1;\\n\\n"
"-- T2 reads uncommitted value\\nSELECT balance FROM account WHERE id = 1;\\n\\n"
"-- T1 fails\\nROLLBACK;";`,
    java: `String example =
"-- T1\\n" +
"BEGIN TRANSACTION;\\n" +
"UPDATE account SET balance = 700 WHERE id = 1;\\n\\n" +
"-- T2 reads uncommitted value\\n" +
"SELECT balance FROM account WHERE id = 1;\\n\\n" +
"-- T1 fails\\n" +
"ROLLBACK;";`
  },
  locking: {
    javascript: `const example = \`
-- T1
BEGIN TRANSACTION;
SELECT * FROM account WHERE id = 1 FOR UPDATE;

-- T2
BEGIN TRANSACTION;
-- waits because T1 holds the lock

-- T1 updates and commits
UPDATE account SET balance = 900 WHERE id = 1;
COMMIT;

-- T2 can continue now
UPDATE account SET balance = 850 WHERE id = 1;
COMMIT;
\`;`,
    python: `example = """
-- T1
BEGIN TRANSACTION;
SELECT * FROM account WHERE id = 1 FOR UPDATE;

-- T2
BEGIN TRANSACTION;
-- waits because T1 holds the lock

-- T1 updates and commits
UPDATE account SET balance = 900 WHERE id = 1;
COMMIT;

-- T2 can continue now
UPDATE account SET balance = 850 WHERE id = 1;
COMMIT;
"""`,
    cpp: `string example =
"-- T1\\n"
"BEGIN TRANSACTION;\\n"
"SELECT * FROM account WHERE id = 1 FOR UPDATE;\\n\\n"
"-- T2\\n"
"BEGIN TRANSACTION;\\n"
"-- waits because T1 holds the lock\\n\\n"
"-- T1 updates and commits\\n"
"UPDATE account SET balance = 900 WHERE id = 1;\\n"
"COMMIT;\\n\\n"
"-- T2 can continue now\\n"
"UPDATE account SET balance = 850 WHERE id = 1;\\n"
"COMMIT;";`,
    c: `char example[] =
"-- T1\\nBEGIN TRANSACTION;\\nSELECT * FROM account WHERE id = 1 FOR UPDATE;\\n\\n"
"-- T2\\nBEGIN TRANSACTION;\\n-- waits because T1 holds the lock\\n\\n"
"-- T1 updates and commits\\nUPDATE account SET balance = 900 WHERE id = 1;\\nCOMMIT;\\n\\n"
"-- T2 can continue now\\nUPDATE account SET balance = 850 WHERE id = 1;\\nCOMMIT;";`,
    java: `String example =
"-- T1\\n" +
"BEGIN TRANSACTION;\\n" +
"SELECT * FROM account WHERE id = 1 FOR UPDATE;\\n\\n" +
"-- T2\\n" +
"BEGIN TRANSACTION;\\n" +
"-- waits because T1 holds the lock\\n\\n" +
"-- T1 updates and commits\\n" +
"UPDATE account SET balance = 900 WHERE id = 1;\\n" +
"COMMIT;\\n\\n" +
"-- T2 can continue now\\n" +
"UPDATE account SET balance = 850 WHERE id = 1;\\n" +
"COMMIT;";`
  }
};

const initialRow = {
  item_id: "ACC-101",
  item_name: "Shared Balance",
  value: 1000
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DBMSConcurrencyLab() {
  const [demoType, setDemoType] = useState("lost-update");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Concurrency Control lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const [sharedRow, setSharedRow] = useState(initialRow);
  const [transaction1State, setTransaction1State] = useState("Idle");
  const [transaction2State, setTransaction2State] = useState("Idle");
  const [transaction1Read, setTransaction1Read] = useState(null);
  const [transaction2Read, setTransaction2Read] = useState(null);
  const [lockHolder, setLockHolder] = useState("None");
  const [currentStage, setCurrentStage] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [anomalyText, setAnomalyText] = useState("");

  const quizQuestions = useMemo(
    () => concurrencyQuizQuestionsByType[demoType],
    [demoType]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(concurrencyCodeTemplates["lost-update"].javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    setStepHistory([]);
    setSharedRow(initialRow);
    setTransaction1State("Idle");
    setTransaction2State("Idle");
    setTransaction1Read(null);
    setTransaction2Read(null);
    setLockHolder("None");
    setCurrentStage("");
    setSelectedTransaction(null);
    setAnomalyText("");
    setMessage("Concurrency Control lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setQuizAnswers(Array(concurrencyQuizQuestionsByType[demoType].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
  }, [demoType]);

  useEffect(() => {
    setCode(concurrencyCodeTemplates[demoType][selectedLanguage]);
    setCodeResult("");
  }, [demoType, selectedLanguage]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const runSimulation = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setExperimentRun(true);
    setStepHistory([]);
    setSharedRow(initialRow);
    setTransaction1State("Started");
    setTransaction2State("Started");
    setTransaction1Read(null);
    setTransaction2Read(null);
    setLockHolder("None");
    setCurrentStage("Simulation Start");
    setSelectedTransaction(null);
    setAnomalyText("");

    try {
      if (demoType === "lost-update") {
        setMessage("Starting Lost Update demo...");
        addStep("Started Lost Update demo with two concurrent transactions.");
        await sleep(animationSpeed);

        setSelectedTransaction("T1");
        setCurrentStage("T1 Reads Value");
        setTransaction1Read(initialRow.value);
        setTransaction1State("Read");
        setMessage("T1 reads the shared value 1000.");
        addStep("T1 read value = 1000.");
        await sleep(animationSpeed);

        setSelectedTransaction("T2");
        setCurrentStage("T2 Reads Same Value");
        setTransaction2Read(initialRow.value);
        setTransaction2State("Read");
        setMessage("T2 also reads the same old value 1000.");
        addStep("T2 also read value = 1000 before T1 committed its update.");
        await sleep(animationSpeed);

        setSelectedTransaction("T1");
        setCurrentStage("T1 Updates");
        setSharedRow((prev) => ({ ...prev, value: 900 }));
        setTransaction1State("Committed");
        setMessage("T1 updates value to 900 and commits.");
        addStep("T1 wrote 900 and committed.");
        await sleep(animationSpeed);

        setSelectedTransaction("T2");
        setCurrentStage("T2 Overwrites");
        setSharedRow((prev) => ({ ...prev, value: 950 }));
        setTransaction2State("Committed");
        setAnomalyText("Lost Update: T2 overwrote T1's committed update using an old read value.");
        setMessage("T2 writes 950 using stale data and overwrites T1's update.");
        addStep("T2 wrote 950 using old value 1000. T1's update was lost.");
        await sleep(animationSpeed);
      }

      if (demoType === "dirty-read") {
        setMessage("Starting Dirty Read demo...");
        addStep("Started Dirty Read demo.");
        await sleep(animationSpeed);

        setSelectedTransaction("T1");
        setCurrentStage("T1 Updates But Does Not Commit");
        setSharedRow((prev) => ({ ...prev, value: 700 }));
        setTransaction1State("Uncommitted Update");
        setMessage("T1 updates the value to 700 but has not committed yet.");
        addStep("T1 changed the value from 1000 to 700 but did not commit.");
        await sleep(animationSpeed);

        setSelectedTransaction("T2");
        setCurrentStage("T2 Reads Uncommitted Value");
        setTransaction2Read(700);
        setTransaction2State("Read Uncommitted");
        setMessage("T2 reads 700 before T1 commits.");
        addStep("T2 performed a dirty read and saw uncommitted value 700.");
        await sleep(animationSpeed);

        setSelectedTransaction("T1");
        setCurrentStage("T1 Rolls Back");
        setSharedRow(initialRow);
        setTransaction1State("Rolled Back");
        setAnomalyText("Dirty Read: T2 read a value that was never committed and was later rolled back.");
        setMessage("T1 rolls back. Actual value returns to 1000.");
        addStep("T1 rolled back. Value returned to 1000, so T2 had read invalid temporary data.");
        await sleep(animationSpeed);

        setSelectedTransaction("T2");
        setTransaction2State("Incorrect Read");
      }

      if (demoType === "locking") {
        setMessage("Starting Locking demo...");
        addStep("Started locking demo.");
        await sleep(animationSpeed);

        setSelectedTransaction("T1");
        setCurrentStage("T1 Acquires Lock");
        setLockHolder("T1");
        setTransaction1State("Holding Lock");
        setMessage("T1 acquires the lock on the shared row.");
        addStep("T1 acquired an exclusive lock on the shared row.");
        await sleep(animationSpeed);

        setSelectedTransaction("T2");
        setCurrentStage("T2 Waits");
        setTransaction2State("Waiting");
        setMessage("T2 tries to access the row but must wait because T1 holds the lock.");
        addStep("T2 was blocked and waited for the lock to be released.");
        await sleep(animationSpeed);

        setSelectedTransaction("T1");
        setCurrentStage("T1 Updates And Commits");
        setSharedRow((prev) => ({ ...prev, value: 900 }));
        setTransaction1State("Committed");
        setMessage("T1 updates the value to 900 and commits.");
        addStep("T1 updated the row safely and committed.");
        await sleep(animationSpeed);

        setCurrentStage("Lock Released");
        setLockHolder("None");
        setMessage("T1 releases the lock.");
        addStep("Lock released after T1 commit.");
        await sleep(animationSpeed);

        setSelectedTransaction("T2");
        setCurrentStage("T2 Continues Safely");
        setLockHolder("T2");
        setTransaction2State("Holding Lock");
        setTransaction2Read(900);
        setMessage("T2 now acquires the lock and reads the latest value 900.");
        addStep("T2 acquired the lock after T1 and read the latest committed value 900.");
        await sleep(animationSpeed);

        setSharedRow((prev) => ({ ...prev, value: 850 }));
        setTransaction2State("Committed");
        setLockHolder("None");
        setAnomalyText("Locking prevented unsafe concurrent access by forcing T2 to wait.");
        setMessage("T2 updates safely to 850 and commits.");
        addStep("T2 updated safely after waiting. Locking prevented concurrency anomaly.");
        await sleep(animationSpeed);
      }

      setCurrentStage("Complete");
      setMessage(`${demoType.toUpperCase()} simulation completed.`);
      addStep(`${demoType.toUpperCase()} simulation completed successfully.`);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `dbms-${demoType}-concurrency`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
      setSelectedTransaction(null);
      setLockHolder((prev) => (demoType === "locking" ? prev : "None"));
    }
  };

  const loadSample = () => {
    if (isRunning) return;

    setSharedRow(initialRow);
    setTransaction1State("Ready");
    setTransaction2State("Ready");
    setTransaction1Read(null);
    setTransaction2Read(null);
    setLockHolder("None");
    setCurrentStage("Sample Ready");
    setSelectedTransaction(null);
    setAnomalyText("");
    setStepHistory([`Sample loaded for ${demoType.toUpperCase()} demo.`]);
    setMessage(`Sample loaded for ${demoType.toUpperCase()} demo.`);
  };

  const reset = () => {
    if (isRunning) return;

    setSharedRow(initialRow);
    setTransaction1State("Idle");
    setTransaction2State("Idle");
    setTransaction1Read(null);
    setTransaction2Read(null);
    setLockHolder("None");
    setCurrentStage("");
    setSelectedTransaction(null);
    setAnomalyText("");
    setStepHistory([]);
    setMessage("Concurrency Control lab reset.");
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
      experiment: `${demoType}-concurrency`,
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
      const fn = new Function(`${code}; return example;`);
      const result = fn();
      setCodeResult(`Output:\n${result}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem = codingProblemByType[demoType];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Concurrency Control</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Demo Type</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={demoType}
              onChange={(e) => setDemoType(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
              disabled={isRunning}
            >
              <option value="lost-update">Lost Update</option>
              <option value="dirty-read">Dirty Read</option>
              <option value="locking">Locking Demo</option>
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

          {activeSection === "quiz" && (
            <DBMSConcurrencyQuiz
              demoType={demoType}
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
            <DBMSConcurrencyCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              demoType={demoType}
            />
          )}
        </main>
      </div>
    </div>
  );
}