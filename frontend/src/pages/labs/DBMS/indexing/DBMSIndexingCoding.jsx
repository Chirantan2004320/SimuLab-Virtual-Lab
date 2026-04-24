import React from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

export default function DBMSIndexingCoding({
  searchMode,
  currentProblems,
  answers,
  results,
  generateProblems,
  handleAnswerChange,
  runAnswer,
  analyzeAnswer,
  correctAnswer
}) {
  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice {searchMode === "linear" ? "linear scan logic" : "indexed lookup logic"} through answer-based problems.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button className="sim-btn sim-btn-primary" onClick={generateProblems}>
          Generate Problems
        </button>
      </div>

      {currentProblems.length === 0 ? (
        <div className="coding-empty-state">
          No problems generated yet. Click <b>Generate Problems</b> to begin.
        </div>
      ) : null}

      {currentProblems.map((problem, index) => (
        <div key={problem.id} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <h3>Problem {index + 1}</h3>
              <p style={{ fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
                {problem.title}
              </p>
              <p>{problem.description}</p>
            </div>
          </div>

          <textarea
            value={answers[problem.id] || ""}
            onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
            placeholder="Write your answer here..."
            rows={14}
            className="coding-textarea-upgraded"
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => runAnswer(problem.id)}
            >
              <Play size={16} />
              Run Answer
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => analyzeAnswer(problem.id)}
            >
              <Sparkles size={16} />
              Analyze Answer
            </button>

            <button
              className="sim-btn sim-btn-danger"
              onClick={() => correctAnswer(problem.id)}
            >
              <Wrench size={16} />
              Correct Answer
            </button>
          </div>

          {results[problem.id] && (
            <div className="coding-result-box">
              {results[problem.id]}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}