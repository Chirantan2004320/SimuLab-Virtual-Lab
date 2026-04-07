import React, { useEffect, useMemo, useState } from "react";
import "../../../Lab.css";
import "../../../SortingLab.css";
import ProcessSynchronizationOverview from "./ProcessSynchronizationOverview.jsx";
import ProcessSynchronizationQuiz from "./ProcessSynchronizationQuiz.jsx";
import ProcessSynchronizationCoding from "./ProcessSynchronizationCoding.jsx";
import ProcessSynchronizationSimulation from "./ProcessSyncronizationSimulation.jsx";

const syncQuizQuestionsByMode = {
  critical: [
    {
      question: "The Critical Section problem occurs when:",
      options: [
        "Multiple processes access shared data concurrently",
        "CPU burst time is too long",
        "A page fault occurs",
        "Disk arm moves too far"
      ],
      correct: 0
    },
    {
      question: "A correct solution to the Critical Section problem must ensure:",
      options: [
        "Mutual exclusion",
        "Only high-priority execution",
        "Shortest job first",
        "Fast disk access"
      ],
      correct: 0
    },
    {
      question: "If two processes enter the critical section together, it may cause:",
      options: [
        "Race condition",
        "Page replacement",
        "Deadlock detection",
        "CPU idle time only"
      ],
      correct: 0
    }
  ],
  semaphore: [
    {
      question: "A semaphore is mainly used for:",
      options: [
        "Process synchronization",
        "CPU scheduling only",
        "Disk formatting",
        "Memory paging only"
      ],
      correct: 0
    },
    {
      question: "The wait operation usually:",
      options: [
        "Decrements semaphore",
        "Increments semaphore",
        "Deletes a process",
        "Creates a page fault"
      ],
      correct: 0
    },
    {
      question: "If semaphore value is not available, a process may:",
      options: [
        "Block or wait",
        "Always terminate",
        "Skip critical section automatically",
        "Become a page"
      ],
      correct: 0
    }
  ],
  producerConsumer: [
    {
      question: "In Producer-Consumer, the shared structure is usually:",
      options: [
        "A bounded buffer",
        "A page table",
        "A CPU register",
        "A disk arm"
      ],
      correct: 0
    },
    {
      question: "The producer:",
      options: [
        "Adds items to buffer",
        "Removes items from buffer",
        "Only locks memory",
        "Schedules CPU jobs"
      ],
      correct: 0
    },
    {
      question: "If the buffer is full, the producer should:",
      options: [
        "Wait",
        "Keep inserting infinitely",
        "Delete consumer",
        "Reset semaphore to zero always"
      ],
      correct: 0
    }
  ]
};

const codingProblemByMode = {
  critical: {
    title: "Implement a Critical Section simulation",
    description:
      "Write logic that allows one process at a time to enter a shared critical section."
  },
  semaphore: {
    title: "Implement semaphore wait and signal",
    description:
      "Write logic to simulate wait() and signal() operations on a semaphore."
  },
  producerConsumer: {
    title: "Implement Producer-Consumer logic",
    description:
      "Write logic to simulate a bounded buffer with producer and consumer operations."
  }
};

const syncCodeTemplates = {
  critical: {
    javascript: `function enterCriticalSection(lock, processName) {
  if (lock.isBusy) {
    return processName + " must wait";
  }

  lock.isBusy = true;
  return processName + " entered critical section";
}`,
    python: `def enter_critical_section(lock, process_name):
    if lock["isBusy"]:
        return process_name + " must wait"

    lock["isBusy"] = True
    return process_name + " entered critical section"`,
    cpp: `// Simulate one process entering the critical section at a time.`,
    c: `/* Simulate one process entering the critical section at a time. */`,
    java: `// Simulate one process entering the critical section at a time.`
  },
  semaphore: {
    javascript: `function waitSemaphore(semaphore) {
  if (semaphore.value > 0) {
    semaphore.value--;
    return "Resource acquired";
  }
  return "Process blocked";
}

function signalSemaphore(semaphore) {
  semaphore.value++;
  return "Resource released";
}`,
    python: `def wait_semaphore(semaphore):
    if semaphore["value"] > 0:
        semaphore["value"] -= 1
        return "Resource acquired"
    return "Process blocked"

def signal_semaphore(semaphore):
    semaphore["value"] += 1
    return "Resource released"`,
    cpp: `// Implement wait() and signal() for a semaphore.`,
    c: `/* Implement wait() and signal() for a semaphore. */`,
    java: `// Implement wait() and signal() for a semaphore.`
  },
  producerConsumer: {
    javascript: `function produce(buffer, item, capacity) {
  if (buffer.length >= capacity) {
    return "Buffer full";
  }

  buffer.push(item);
  return buffer;
}

function consume(buffer) {
  if (buffer.length === 0) {
    return "Buffer empty";
  }

  return buffer.shift();
}`,
    python: `def produce(buffer, item, capacity):
    if len(buffer) >= capacity:
        return "Buffer full"
    buffer.append(item)
    return buffer

def consume(buffer):
    if len(buffer) == 0:
        return "Buffer empty"
    return buffer.pop(0)`,
    cpp: `// Implement producer and consumer operations on a bounded buffer.`,
    c: `/* Implement producer and consumer operations on a bounded buffer. */`,
    java: `// Implement producer and consumer operations on a bounded buffer.`
  }
};

export default function ProcessSynchronizationLab() {
  const [mode, setMode] = useState("critical");
  const [activeSection, setActiveSection] = useState("overview");
  const [message] = useState("Process Synchronization lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const quizQuestions = useMemo(
    () => syncQuizQuestionsByMode[mode],
    [mode]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(syncCodeTemplates.critical.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    setQuizAnswers(Array(syncQuizQuestionsByMode[mode].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
    setExperimentRun(false);
  }, [mode]);

  useEffect(() => {
    setCode(syncCodeTemplates[mode][selectedLanguage]);
    setCodeResult("");
  }, [mode, selectedLanguage]);

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
      subject: "OS",
      experiment: `process-sync-${mode}`,
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
      let result;

      if (mode === "critical") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "lock",
          "processName",
          `${code}; return enterCriticalSection(lock, processName);`
        );
        result = fn({ isBusy: false }, "P1");
      } else if (mode === "semaphore") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "semaphore",
          `${code}; return { waitResult: waitSemaphore(semaphore), currentValue: semaphore.value };`
        );
        result = fn({ value: 1 });
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "buffer",
          "item",
          "capacity",
          `${code}; return produce(buffer, item, capacity);`
        );
        result = fn([], "Item1", 3);
      }

      setCodeResult(`Output:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem = codingProblemByMode[mode];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Process Synchronization</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Synchronization Mode</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
            >
              <option value="critical">Critical Section</option>
              <option value="semaphore">Semaphore</option>
              <option value="producerConsumer">Producer-Consumer</option>
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
            <ProcessSynchronizationOverview mode={mode} message={message} />
          )}

          {activeSection === "simulation" && (
            <ProcessSynchronizationSimulation
            mode={mode}
            setExperimentRun={setExperimentRun}
            />
        )}
        
          {activeSection === "quiz" && (
            <ProcessSynchronizationQuiz
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
            <ProcessSynchronizationCoding
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
        </main>
      </div>
    </div>
  );
}