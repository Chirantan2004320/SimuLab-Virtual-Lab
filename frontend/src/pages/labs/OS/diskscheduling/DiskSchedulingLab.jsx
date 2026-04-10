import React, { useEffect, useMemo, useState } from "react";
import "../../../../styles/Lab.css";

import DiskSchedulingOverview from "./DiskSchedulingOverview.jsx";
import DiskSchedulingQuiz from "./DiskSchedulingQuiz.jsx";
import DiskSchedulingCoding from "./DiskSchedulingCoding.jsx";
import DiskSchedulingSimulation from "./DiskSchedulingSimulation.jsx";

const diskQuizQuestionsByMode = {
  fcfs: [
    {
      question: "FCFS disk scheduling serves requests in:",
      options: [
        "Shortest seek order",
        "Arrival order",
        "Circular order only",
        "Descending order"
      ],
      correct: 1
    },
    {
      question: "A drawback of FCFS disk scheduling is:",
      options: [
        "Needs future knowledge",
        "Can cause large total head movement",
        "Works only for SSDs",
        "Cannot handle more than 5 requests"
      ],
      correct: 1
    },
    {
      question: "FCFS stands for:",
      options: [
        "First Come First Serve",
        "Fastest Cylinder First Scan",
        "First Cylinder First Seek",
        "Fixed Circular File System"
      ],
      correct: 0
    }
  ],
  sstf: [
    {
      question: "SSTF selects the request that is:",
      options: [
        "Oldest",
        "Closest to current head position",
        "Largest track number",
        "Last in queue"
      ],
      correct: 1
    },
    {
      question: "SSTF may lead to:",
      options: [
        "Starvation of far requests",
        "No head movement",
        "Only circular movement",
        "Immediate deadlock"
      ],
      correct: 0
    },
    {
      question: "SSTF stands for:",
      options: [
        "Shortest Seek Time First",
        "Smallest Sector Track First",
        "Seek Scan Track Function",
        "Sector Scheduling Time Formula"
      ],
      correct: 0
    }
  ],
  scan: [
    {
      question: "SCAN is also known as:",
      options: [
        "Cyclic scheduling",
        "Elevator algorithm",
        "Round robin disk scheduling",
        "Priority seek"
      ],
      correct: 1
    },
    {
      question: "In SCAN, the disk head:",
      options: [
        "Always jumps randomly",
        "Moves in one direction servicing requests, then reverses",
        "Never reverses direction",
        "Only serves nearest request"
      ],
      correct: 1
    },
    {
      question: "SCAN improves over FCFS by:",
      options: [
        "Reducing unnecessary head movement",
        "Using no head movement at all",
        "Replacing pages",
        "Avoiding interrupts"
      ],
      correct: 0
    }
  ],
  cscan: [
    {
      question: "In C-SCAN, the disk head:",
      options: [
        "Moves back and forth servicing requests",
        "Moves in one direction and jumps back to start",
        "Always chooses nearest request",
        "Stops after first pass"
      ],
      correct: 1
    },
    {
      question: "C-SCAN provides:",
      options: [
        "More uniform waiting time",
        "No seek time",
        "No head movement",
        "Only descending traversal"
      ],
      correct: 0
    },
    {
      question: "C-SCAN differs from SCAN because it:",
      options: [
        "Never services requests",
        "Uses circular return instead of reversing service direction",
        "Works only on magnetic tapes",
        "Ignores current head position"
      ],
      correct: 1
    }
  ]
};

const codingProblemByMode = {
  fcfs: {
    title: "Implement FCFS Disk Scheduling",
    description:
      "Write logic to serve disk requests in arrival order and calculate total head movement."
  },
  sstf: {
    title: "Implement SSTF Disk Scheduling",
    description:
      "Write logic to always serve the nearest pending disk request and calculate total head movement."
  },
  scan: {
    title: "Implement SCAN Disk Scheduling",
    description:
      "Write logic to move the head in one direction, service requests, then reverse direction."
  },
  cscan: {
    title: "Implement C-SCAN Disk Scheduling",
    description:
      "Write logic to move the head in one direction, then jump back to the start and continue."
  }
};

const diskCodeTemplates = {
  fcfs: {
    javascript: `function fcfsDiskScheduling(requests, head) {
  let totalMovement = 0;
  let current = head;

  for (const request of requests) {
    totalMovement += Math.abs(request - current);
    current = request;
  }

  return totalMovement;
}`,
    python: `def fcfs_disk_scheduling(requests, head):
    total_movement = 0
    current = head

    for request in requests:
        total_movement += abs(request - current)
        current = request

    return total_movement`,
    cpp: `// Implement FCFS disk scheduling and total head movement.`,
    c: `/* Implement FCFS disk scheduling and total head movement. */`,
    java: `// Implement FCFS disk scheduling and total head movement.`
  },
  sstf: {
    javascript: `function sstfDiskScheduling(requests, head) {
  let pending = [...requests];
  let current = head;
  let totalMovement = 0;

  while (pending.length > 0) {
    let nearestIndex = 0;

    for (let i = 1; i < pending.length; i++) {
      if (
        Math.abs(pending[i] - current) <
        Math.abs(pending[nearestIndex] - current)
      ) {
        nearestIndex = i;
      }
    }

    totalMovement += Math.abs(pending[nearestIndex] - current);
    current = pending[nearestIndex];
    pending.splice(nearestIndex, 1);
  }

  return totalMovement;
}`,
    python: `def sstf_disk_scheduling(requests, head):
    pending = requests[:]
    current = head
    total_movement = 0

    while pending:
        nearest = min(pending, key=lambda x: abs(x - current))
        total_movement += abs(nearest - current)
        current = nearest
        pending.remove(nearest)

    return total_movement`,
    cpp: `// Implement SSTF disk scheduling and total head movement.`,
    c: `/* Implement SSTF disk scheduling and total head movement. */`,
    java: `// Implement SSTF disk scheduling and total head movement.`
  },
  scan: {
    javascript: `function scanDiskScheduling(requests, head) {
  return "Implement SCAN scheduling here";
}`,
    python: `def scan_disk_scheduling(requests, head):
    return "Implement SCAN scheduling here"`,
    cpp: `// Implement SCAN disk scheduling.`,
    c: `/* Implement SCAN disk scheduling. */`,
    java: `// Implement SCAN disk scheduling.`
  },
  cscan: {
    javascript: `function cscanDiskScheduling(requests, head) {
  return "Implement C-SCAN scheduling here";
}`,
    python: `def cscan_disk_scheduling(requests, head):
    return "Implement C-SCAN scheduling here"`,
    cpp: `// Implement C-SCAN disk scheduling.`,
    c: `/* Implement C-SCAN disk scheduling. */`,
    java: `// Implement C-SCAN disk scheduling.`
  }
};

export default function DiskSchedulingLab() {
  const [mode, setMode] = useState("fcfs");
  const [activeSection, setActiveSection] = useState("overview");
  const [message] = useState("Disk Scheduling lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const quizQuestions = useMemo(
    () => diskQuizQuestionsByMode[mode],
    [mode]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(diskCodeTemplates.fcfs.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    setQuizAnswers(Array(diskQuizQuestionsByMode[mode].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
    setExperimentRun(false);
  }, [mode]);

  useEffect(() => {
    setCode(diskCodeTemplates[mode][selectedLanguage]);
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
      experiment: `disk-scheduling-${mode}`,
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

      if (mode === "fcfs") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "requests",
          "head",
          `${code}; return fcfsDiskScheduling(requests, head);`
        );
        result = fn([98, 183, 37, 122, 14, 124, 65, 67], 53);
      } else if (mode === "sstf") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "requests",
          "head",
          `${code}; return sstfDiskScheduling(requests, head);`
        );
        result = fn([98, 183, 37, 122, 14, 124, 65, 67], 53);
      } else if (mode === "scan") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "requests",
          "head",
          `${code}; return scanDiskScheduling(requests, head);`
        );
        result = fn([98, 183, 37, 122, 14, 124, 65, 67], 53);
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "requests",
          "head",
          `${code}; return cscanDiskScheduling(requests, head);`
        );
        result = fn([98, 183, 37, 122, 14, 124, 65, 67], 53);
      }

      setCodeResult(`Output:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem = codingProblemByMode[mode];

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Disk Scheduling</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Disk Scheduling Mode</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
            >
              <option value="fcfs">FCFS</option>
              <option value="sstf">SSTF</option>
              <option value="scan">SCAN</option>
              <option value="cscan">C-SCAN</option>
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
            <DiskSchedulingOverview mode={mode} message={message} />
          )}

          {activeSection === "simulation" && (
  <DiskSchedulingSimulation
    mode={mode}
    setExperimentRun={setExperimentRun}
  />
)}
          {activeSection === "quiz" && (
            <DiskSchedulingQuiz
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
            <DiskSchedulingCoding
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