import React, { useEffect, useMemo, useState } from "react";
import "../../../../styles/Lab.css";

import CPUSchedulingOverview from "./CPUSchedulingOverview.jsx";
import CPUSchedulingQuiz from "./CPUSchedulingQuiz.jsx";
import CPUSchedulingCoding from "./CPUSchedulingCoding.jsx";
import CPUSchedulingSimulation from "./CPUSchedullingSimulation.jsx";

const cpuQuizQuestionsByAlgorithm = {
  fcfs: [
    {
      question: "What does FCFS stand for?",
      options: [
        "Fastest Come Fastest Serve",
        "First Come First Serve",
        "First CPU First Schedule",
        "Fixed Cycle Fair Sharing"
      ],
      correct: 1
    },
    {
      question: "FCFS selects the next process based on:",
      options: [
        "Shortest burst time",
        "Highest priority",
        "Arrival order",
        "Smallest process ID"
      ],
      correct: 2
    },
    {
      question: "A common drawback of FCFS is:",
      options: [
        "Starvation of long jobs",
        "Convoy effect",
        "Needs time quantum",
        "Cannot use arrival time"
      ],
      correct: 1
    }
  ],
  sjf: [
    {
      question: "SJF selects the process with:",
      options: [
        "Highest priority",
        "Shortest burst time",
        "Earliest arrival only",
        "Largest waiting time"
      ],
      correct: 1
    },
    {
      question: "SJF usually minimizes:",
      options: [
        "Average waiting time",
        "Number of processes",
        "CPU frequency",
        "Time quantum"
      ],
      correct: 0
    },
    {
      question: "A drawback of SJF is:",
      options: [
        "Needs locking",
        "Can cause starvation of long jobs",
        "Cannot handle burst time",
        "Always preemptive"
      ],
      correct: 1
    }
  ],
  rr: [
    {
      question: "Round Robin mainly uses:",
      options: [
        "Priority number",
        "Time quantum",
        "Shortest burst first",
        "Arrival order only"
      ],
      correct: 1
    },
    {
      question: "Round Robin is best suited for:",
      options: [
        "Batch systems only",
        "Interactive time-sharing systems",
        "Disk scheduling",
        "Deadlock handling"
      ],
      correct: 1
    },
    {
      question: "If time quantum is too large, Round Robin behaves like:",
      options: ["SJF", "Priority", "FCFS", "Paging"],
      correct: 2
    }
  ],
  priority: [
    {
      question: "Priority scheduling selects the process with:",
      options: [
        "Shortest burst time",
        "Highest priority",
        "Earliest completion time",
        "Largest arrival time"
      ],
      correct: 1
    },
    {
      question: "A common drawback of Priority scheduling is:",
      options: [
        "Convoy effect only",
        "Starvation of low-priority processes",
        "Needs disk arm",
        "Cannot use CPU"
      ],
      correct: 1
    },
    {
      question: "Priority scheduling in this lab is:",
      options: [
        "Preemptive",
        "Non-preemptive",
        "Random",
        "Multi-core only"
      ],
      correct: 1
    }
  ]
};

const codingProblemByAlgorithm = {
  fcfs: {
    title: "Implement FCFS Scheduling",
    description:
      "Write logic to schedule processes in the order they arrive and compute waiting time and turnaround time."
  },
  sjf: {
    title: "Implement SJF Scheduling",
    description:
      "Write logic to choose the process with the shortest burst time among the available processes."
  },
  rr: {
    title: "Implement Round Robin Scheduling",
    description:
      "Write logic for Round Robin scheduling using a given time quantum."
  },
  priority: {
    title: "Implement Priority Scheduling",
    description:
      "Write logic to schedule processes based on priority in non-preemptive mode."
  }
};

const cpuCodeTemplates = {
  fcfs: {
    javascript: `function fcfs(processes) {
  let currentTime = 0;

  return processes.map((process) => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const waitingTime = startTime - process.arrivalTime;
    const completionTime = startTime + process.burstTime;
    const turnaroundTime = completionTime - process.arrivalTime;

    currentTime = completionTime;

    return {
      ...process,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime
    };
  });
}`,
    python: `def fcfs(processes):
    current_time = 0
    result = []

    for process in processes:
        start_time = max(current_time, process["arrivalTime"])
        waiting_time = start_time - process["arrivalTime"]
        completion_time = start_time + process["burstTime"]
        turnaround_time = completion_time - process["arrivalTime"]

        current_time = completion_time

        updated = dict(process)
        updated["startTime"] = start_time
        updated["completionTime"] = completion_time
        updated["waitingTime"] = waiting_time
        updated["turnaroundTime"] = turnaround_time
        result.append(updated)

    return result`,
    cpp: `// Implement FCFS scheduling by processing jobs in arrival order.`,
    c: `/* Implement FCFS scheduling by processing jobs in arrival order. */`,
    java: `// Implement FCFS scheduling by processing jobs in arrival order.`
  },
  sjf: {
    javascript: `function sjf(processes) {
  return "Implement non-preemptive SJF here";
}`,
    python: `def sjf(processes):
    return "Implement non-preemptive SJF here"`,
    cpp: `// Implement non-preemptive SJF scheduling.`,
    c: `/* Implement non-preemptive SJF scheduling. */`,
    java: `// Implement non-preemptive SJF scheduling.`
  },
  rr: {
    javascript: `function roundRobin(processes, quantum) {
  return "Implement Round Robin here";
}`,
    python: `def round_robin(processes, quantum):
    return "Implement Round Robin here"`,
    cpp: `// Implement Round Robin scheduling using a time quantum.`,
    c: `/* Implement Round Robin scheduling using a time quantum. */`,
    java: `// Implement Round Robin scheduling using a time quantum.`
  },
  priority: {
    javascript: `function priorityScheduling(processes) {
  return "Implement non-preemptive priority scheduling here";
}`,
    python: `def priority_scheduling(processes):
    return "Implement non-preemptive priority scheduling here"`,
    cpp: `// Implement non-preemptive priority scheduling.`,
    c: `/* Implement non-preemptive priority scheduling. */`,
    java: `// Implement non-preemptive priority scheduling.`
  }
};

export default function CPUSchedulingLab() {
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [activeSection, setActiveSection] = useState("overview");
  const [message] = useState("CPU Scheduling lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const quizQuestions = useMemo(
    () => cpuQuizQuestionsByAlgorithm[algorithm],
    [algorithm]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(cpuCodeTemplates.fcfs.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    setQuizAnswers(Array(cpuQuizQuestionsByAlgorithm[algorithm].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
    setExperimentRun(false);
  }, [algorithm]);

  useEffect(() => {
    setCode(cpuCodeTemplates[algorithm][selectedLanguage]);
    setCodeResult("");
  }, [algorithm, selectedLanguage]);

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
      experiment: `cpu-scheduling-${algorithm}`,
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

      if (algorithm === "fcfs") {
        // eslint-disable-next-line no-new-func
        const fn = new Function("processes", `${code}; return fcfs(processes);`);
        result = fn([
          { pid: "P1", arrivalTime: 0, burstTime: 4 },
          { pid: "P2", arrivalTime: 1, burstTime: 3 }
        ]);
      } else if (algorithm === "sjf") {
        // eslint-disable-next-line no-new-func
        const fn = new Function("processes", `${code}; return sjf(processes);`);
        result = fn([
          { pid: "P1", arrivalTime: 0, burstTime: 6 },
          { pid: "P2", arrivalTime: 1, burstTime: 2 }
        ]);
      } else if (algorithm === "rr") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "processes",
          "quantum",
          `${code}; return roundRobin(processes, quantum);`
        );
        result = fn(
          [
            { pid: "P1", arrivalTime: 0, burstTime: 5 },
            { pid: "P2", arrivalTime: 1, burstTime: 3 }
          ],
          2
        );
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "processes",
          `${code}; return priorityScheduling(processes);`
        );
        result = fn([
          { pid: "P1", arrivalTime: 0, burstTime: 4, priority: 2 },
          { pid: "P2", arrivalTime: 1, burstTime: 3, priority: 1 }
        ]);
      }

      setCodeResult(`Output:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem = codingProblemByAlgorithm[algorithm];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – CPU Scheduling</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Scheduling Algorithm</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
            >
              <option value="fcfs">FCFS</option>
              <option value="sjf">SJF (Non-Preemptive)</option>
              <option value="rr">Round Robin</option>
              <option value="priority">Priority (Non-Preemptive)</option>
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
            <CPUSchedulingOverview algorithm={algorithm} message={message} />
          )}

          {activeSection === "simulation" && (
            <CPUSchedulingSimulation
              algorithm={algorithm}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "quiz" && (
            <CPUSchedulingQuiz
              algorithm={algorithm}
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
            <CPUSchedulingCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              algorithm={algorithm}
            />
          )}
        </main>
      </div>
    </div>
  );
}