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
      title: "Identify the anomaly",
      description:
        "Write a short explanation of why the final value becomes incorrect when both transactions read the same old balance before updating.",
      tag: "Concept Check"
    },
    {
      id: 3,
      title: "Prevent Lost Update",
      description:
        "Rewrite the scenario using locking or proper concurrency control so that one transaction cannot overwrite the other unsafely.",
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
      title: "Explain the danger",
      description:
        "Write why reading uncommitted data can produce an incorrect result if the first transaction rolls back later.",
      tag: "Concept Check"
    },
    {
      id: 3,
      title: "Prevent Dirty Read",
      description:
        "Rewrite the scenario using proper isolation level or locking so that T2 cannot read uncommitted data from T1.",
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
        "Write why T2 must wait when T1 already holds the lock on the shared row.",
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
  runCode,
  demoType,
  analyzeCode,
  optimizeCode
}) {
  const problems = concurrencyProblemSets[demoType] || [
    {
      id: 1,
      title: codingProblem?.title || "Problem 1",
      description: codingProblem?.description || "Write your solution.",
      tag: "Core Problem"
    }
  ];

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice concurrency-control scenarios in code and SQL-style steps.
          </p>
        </div>
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
                  <button className="sim-btn sim-btn-primary" onClick={runCode}>
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
                  <div className="coding-result-box" style={{ marginTop: 14 }}>
                    Execution for {selectedLanguage.toUpperCase()} will be enabled
                    later with Judge0. For now, direct execution works in
                    JavaScript.
                  </div>
                )}

                {codeResult && (
                  <div className="coding-result-box">{codeResult}</div>
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
                Solve this problem in the same editor above. These extra questions
                are provided so the coding section feels like your other advanced
                experiments with multiple practice tasks.
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}