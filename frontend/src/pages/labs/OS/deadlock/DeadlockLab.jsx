import React, { useEffect, useMemo, useState } from "react";
import "../../../../styles/Lab.css";

import DeadlockOverview from "./DeadlockOverview.jsx";
import DeadlockQuiz from "./DeadlockQuiz.jsx";
import DeadlockCodingSafe from "./DeadlockCodingSafe.jsx";
import DeadlockSimulation from "./DeadlockSimulation.jsx";

const deadlockQuizQuestionsByMode = {
  conditions: [
    {
      question: "Deadlock can occur only if:",
      options: [
        "At least one Coffman condition is absent",
        "All necessary deadlock conditions hold",
        "CPU scheduling fails",
        "Page replacement is optimal"
      ],
      correct: 1
    },
    {
      question: "Which of the following is one of the Coffman conditions?",
      options: ["Shortest burst first", "Circular wait", "Time quantum", "Demand paging"],
      correct: 1
    },
    {
      question: "If circular wait is prevented, deadlock is:",
      options: ["Guaranteed", "Still necessary", "Prevented", "Converted to starvation"],
      correct: 2
    }
  ],
  rag: [
    {
      question: "In a Resource Allocation Graph, processes are commonly shown as:",
      options: ["Rectangles", "Circles", "Triangles", "Arrows"],
      correct: 1
    },
    {
      question: "A cycle in a Resource Allocation Graph may indicate:",
      options: ["Deadlock", "Sorting error", "Page fault", "Cache miss"],
      correct: 0
    },
    {
      question: "An assignment edge in RAG means:",
      options: [
        "Process requests resource",
        "Resource allocated to process",
        "Process terminated",
        "Resource deleted"
      ],
      correct: 1
    }
  ],
  banker: [
    {
      question: "Banker’s Algorithm is used for:",
      options: ["Deadlock avoidance", "CPU burst prediction", "Disk optimization", "Page replacement"],
      correct: 0
    },
    {
      question: "A system is in a safe state if:",
      options: ["No process exists", "A safe sequence exists", "All resources are zero", "Only one process runs"],
      correct: 1
    },
    {
      question: "Need matrix is calculated as:",
      options: ["Allocation - Max", "Max - Allocation", "Available - Max", "Available - Allocation"],
      correct: 1
    }
  ]
};

const codingProblemByMode = {
  conditions: {
    title: "Check deadlock conditions",
    description:
      "Write logic to verify whether the necessary deadlock conditions are present in a system."
  },
  rag: {
    title: "Represent a Resource Allocation Graph",
    description:
      "Write logic to model process-resource request and assignment relationships."
  },
  banker: {
    title: "Implement Banker’s Algorithm",
    description:
      "Write logic to compute the Need matrix and determine whether a safe sequence exists."
  }
};

const deadlockCodeTemplates = {
  conditions: {
    javascript: `function canDeadlock(conditions) {
  return (
    conditions.mutualExclusion &&
    conditions.holdAndWait &&
    conditions.noPreemption &&
    conditions.circularWait
  );
}`,
    python: `def can_deadlock(conditions):
    return (
        conditions["mutualExclusion"] and
        conditions["holdAndWait"] and
        conditions["noPreemption"] and
        conditions["circularWait"]
    )`,
    cpp: `// Check whether all deadlock conditions are present.`,
    c: `/* Check whether all deadlock conditions are present. */`,
    java: `// Check whether all deadlock conditions are present.`
  },
  rag: {
    javascript: `function addRequestEdge(graph, process, resource) {
  graph.requests.push({ process, resource });
  return graph;
}`,
    python: `def add_request_edge(graph, process, resource):
    graph["requests"].append({"process": process, "resource": resource})
    return graph`,
    cpp: `// Represent request and assignment edges in a resource allocation graph.`,
    c: `/* Represent request and assignment edges in a resource allocation graph. */`,
    java: `// Represent request and assignment edges in a resource allocation graph.`
  },
  banker: {
    javascript: `function calculateNeed(max, allocation) {
  return max.map((row, i) =>
    row.map((value, j) => value - allocation[i][j])
  );
}`,
    python: `def calculate_need(max_matrix, allocation_matrix):
    need = []
    for i in range(len(max_matrix)):
        row = []
        for j in range(len(max_matrix[i])):
            row.append(max_matrix[i][j] - allocation_matrix[i][j])
        need.append(row)
    return need`,
    cpp: `// Compute Need matrix as Max - Allocation.`,
    c: `/* Compute Need matrix as Max - Allocation. */`,
    java: `// Compute Need matrix as Max - Allocation.`
  }
};

export default function DeadlockLab() {
  const [mode, setMode] = useState("conditions");
  const [activeSection, setActiveSection] = useState("overview");
  const [message] = useState("Deadlock lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const quizQuestions = useMemo(
    () => deadlockQuizQuestionsByMode[mode] || deadlockQuizQuestionsByMode.conditions,
    [mode]
  );

  const codingProblem = useMemo(
    () => codingProblemByMode[mode] || codingProblemByMode.conditions,
    [mode]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(deadlockCodeTemplates.conditions.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    const currentQuestions =
      deadlockQuizQuestionsByMode[mode] || deadlockQuizQuestionsByMode.conditions;
    setQuizAnswers(Array(currentQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
    setExperimentRun(false);
  }, [mode]);

  useEffect(() => {
    const templateGroup = deadlockCodeTemplates[mode] || deadlockCodeTemplates.conditions;
    setCode(templateGroup[selectedLanguage] || templateGroup.javascript);
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
      experiment: `deadlock-${mode}`,
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

      if (mode === "conditions") {
        // eslint-disable-next-line no-new-func
        const fn = new Function("conditions", `${code}; return canDeadlock(conditions);`);
        result = fn({
          mutualExclusion: true,
          holdAndWait: true,
          noPreemption: true,
          circularWait: true
        });
      } else if (mode === "rag") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "graph",
          "process",
          "resource",
          `${code}; return addRequestEdge(graph, process, resource);`
        );
        result = fn({ requests: [], assignments: [] }, "P1", "R1");
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function("max", "allocation", `${code}; return calculateNeed(max, allocation);`);
        result = fn(
          [
            [7, 5, 3],
            [3, 2, 2]
          ],
          [
            [0, 1, 0],
            [2, 0, 0]
          ]
        );
      }

      setCodeResult(`Output:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Deadlock</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Deadlock Mode</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
            >
              <option value="conditions">Deadlock Conditions</option>
              <option value="rag">Resource Allocation Graph</option>
              <option value="banker">Banker&apos;s Algorithm</option>
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
            <DeadlockOverview mode={mode} message={message} />
          )}

          {activeSection === "simulation" && (
            <DeadlockSimulation mode={mode} setExperimentRun={setExperimentRun} />
          )}

          {activeSection === "quiz" && (
            <DeadlockQuiz
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
  <DeadlockCodingSafe
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