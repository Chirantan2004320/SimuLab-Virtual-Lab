import React from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

export default function DBMSIndexingCoding({
  searchMode,
  currentProblems,
  answers,
  results,
  codingSaveStatus,
  setCodingSaveStatus,
  saveCodingSubmission,
  generateProblems,
  handleAnswerChange,
  runAnswer,
  analyzeAnswer,
  correctAnswer
}) {
  const handleRunAnswer = async (problem) => {
    runAnswer(problem.id);

    const answer = answers[problem.id] || "";

    if (!answer.trim()) {
      return;
    }

    setCodingSaveStatus((prev) => ({
      ...prev,
      [problem.id]: "Saving coding submission..."
    }));

    try {
      await saveCodingSubmission({
        labSlug: "dbms",
        experimentSlug: "indexing",
        problemTitle: problem.title,
        language: "text-answer",
        code: answer,
        result: "attempted",
        points: 5
      });

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problem.id]: "Coding submission saved to dashboard."
      }));
    } catch (error) {
      console.error("Coding submission save failed:", error);

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problem.id]: "Answer checked, but backend save failed."
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
            Practice{" "}
            {searchMode === "linear" ? "linear scan logic" : "indexed lookup logic"}{" "}
            through answer-based problems.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Practice Mode:</strong> Generate indexing problems, write your
        explanation, run answer, analyze, and correct it.
      </div>

      <div style={{ marginBottom: 20 }}>
        <button className="sim-btn sim-btn-primary" onClick={generateProblems}>
          Generate Problems
        </button>
      </div>

      {currentProblems.length === 0 && (
        <div className="coding-empty-state">
          No problems generated yet. Click <b>Generate Problems</b> to begin.
        </div>
      )}

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
              onClick={() => handleRunAnswer(problem)}
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
            <div className="coding-result-box">{results[problem.id]}</div>
          )}

          {codingSaveStatus?.[problem.id] && (
            <div className="modern-coding-note">
              {codingSaveStatus[problem.id]}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}