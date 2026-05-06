import React from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" }
];

const concurrencyProblemSets = {
  "lost-update": [
    {
      id: 1,
      title: "Write a Lost Update example",
      description:
        "Write SQL-style steps showing how two concurrent transactions can overwrite each other's update on the same balance.",
      tag: "Core Problem"
    },
    {
      id: 2,
      title: "Identify the Lost Update anomaly",
      description:
        "Explain why the final value becomes incorrect when both transactions read the same old balance before updating.",
      tag: "Concept Check"
    },
    {
      id: 3,
      title: "Prevent Lost Update",
      description:
        "Rewrite the scenario using locking or proper isolation so that one transaction cannot overwrite the other unsafely.",
      tag: "Optimization"
    }
  ],
  "dirty-read": [
    {
      id: 1,
      title: "Write a Dirty Read example",
      description:
        "Write SQL-style steps showing how one transaction reads uncommitted data from another transaction.",
      tag: "Core Problem"
    },
    {
      id: 2,
      title: "Explain Dirty Read danger",
      description:
        "Explain why reading uncommitted data can produce an incorrect result if the first transaction rolls back later.",
      tag: "Concept Check"
    },
    {
      id: 3,
      title: "Prevent Dirty Read",
      description:
        "Rewrite the scenario using READ COMMITTED or locking so that T2 cannot read uncommitted data from T1.",
      tag: "Optimization"
    }
  ],
  locking: [
    {
      id: 1,
      title: "Write a Locking example",
      description:
        "Write SQL-style steps showing how one transaction acquires a lock and another transaction waits until the lock is released.",
      tag: "Core Problem"
    },
    {
      id: 2,
      title: "Explain waiting behavior",
      description:
        "Explain why T2 must wait when T1 already holds the lock on the shared row.",
      tag: "Concept Check"
    },
    {
      id: 3,
      title: "Show safe execution",
      description:
        "Write the final safe sequence where T1 commits first, releases the lock, and only then T2 continues.",
      tag: "Optimization"
    }
  ]
};

export default function DBMSConcurrencyCoding({
  codingProblem,
  selectedLanguage,
  setSelectedLanguage,
  code,
  setCode,
  codeResult,
  codingSaveStatus,
  setCodingSaveStatus,
  saveCodingSubmission,
  runCode,
  demoType,
  analyzeCode,
  optimizeCode
}) {
  const problems = concurrencyProblemSets[demoType] || [
    {
      id: 1,
      title: codingProblem?.title || "Concurrency Problem",
      description: codingProblem?.description || "Write your concurrency solution.",
      tag: "Core Problem"
    }
  ];

  const handleRunCode = async (problem) => {
    runCode();

    if (!code.trim()) return;

    setCodingSaveStatus?.((prev) => ({
      ...prev,
      [problem.id]: "Saving coding submission..."
    }));

    try {
      if (saveCodingSubmission) {
        await saveCodingSubmission({
          labSlug: "dbms",
          experimentSlug: "concurrency",
          problemTitle: problem.title,
          language: selectedLanguage,
          code,
          result: "attempted",
          points: 5
        });
      }

      setCodingSaveStatus?.((prev) => ({
        ...prev,
        [problem.id]: "Coding submission saved to dashboard."
      }));
    } catch (error) {
      console.error("Coding submission save failed:", error);

      setCodingSaveStatus?.((prev) => ({
        ...prev,
        [problem.id]: "Code checked, but backend save failed."
      }));
    }
  };

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice concurrency-control scenarios using SQL-style transaction steps.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Practice Mode:</strong> Write transaction steps, run the example,
        analyze the anomaly, and optimize the solution.
      </div>

      <div className="linked-coding-list">
        {problems.map((problem, index) => (
          <div key={problem.id} className="coding-card-upgraded">
            <div className="coding-card-header">
              <div>
                <h3>
                  Problem {index + 1}: {problem.title}
                </h3>
                <p>{problem.description}</p>
              </div>

              <div className="coding-language-wrap">
                <label className="sorting-label">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="sorting-select"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <span className="modern-coding-tag">{problem.tag}</span>
            </div>

            {index === 0 ? (
              <>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Write your concurrency-control logic here..."
                  rows={16}
                  className="coding-textarea-upgraded"
                />

                <div className="coding-actions-upgraded">
                  <button
                    className="sim-btn sim-btn-primary"
                    onClick={() => handleRunCode(problem)}
                  >
                    <Play size={16} />
                    Run Code
                  </button>

                  <button
                    className="sim-btn sim-btn-muted"
                    onClick={analyzeCode}
                    type="button"
                  >
                    <Sparkles size={16} />
                    Analyze
                  </button>

                  <button
                    className="sim-btn sim-btn-danger"
                    onClick={optimizeCode}
                    type="button"
                  >
                    <Wrench size={16} />
                    Optimize
                  </button>
                </div>

                {selectedLanguage !== "javascript" && (
                  <div className="modern-coding-note">
                    Execution for {selectedLanguage.toUpperCase()} will be enabled
                    later with Judge0. For now, direct execution works in JavaScript.
                  </div>
                )}

                {codeResult && (
                  <div className="coding-result-box">
                    <pre
                      style={{
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontFamily: "inherit"
                      }}
                    >
                      {codeResult}
                    </pre>
                  </div>
                )}

                {codingSaveStatus?.[problem.id] && (
                  <div className="modern-coding-note">
                    {codingSaveStatus[problem.id]}
                  </div>
                )}
              </>
            ) : (
              <div
                className="coding-result-box"
                style={{
                  marginTop: 8,
                  background: "rgba(15,23,42,0.62)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#cbd5e1"
                }}
              >
                Solve this task using the same editor above. Update the SQL-style
                steps according to this problem, then run or analyze your answer.
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}