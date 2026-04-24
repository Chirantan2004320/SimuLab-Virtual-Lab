import React from "react";
import { HelpCircle, Trophy, RotateCcw } from "lucide-react";

const LinkedListQuiz = ({
  listType,
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizScore,
  experimentRun,
  handleQuizAnswer,
  submitQuiz,
  redoQuiz
}) => {
  const title =
    listType === "doubly" ? "Doubly Linked List" : "Singly Linked List";

  const percentage = quizQuestions.length
    ? Math.round((quizScore / quizQuestions.length) * 100)
    : 0;

  const getRemark = () => {
    if (percentage === 100) return "Excellent work!";
    if (percentage >= 80) return "Great job!";
    if (percentage >= 60) return "Good attempt!";
    return "Keep practicing.";
  };

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <HelpCircle size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">
              Quiz <span style={{ color: "#38bdf8" }}>({title})</span>
            </h2>
            <p className="sorting-sim-subtitle">
              Test your understanding of linked list concepts and operations.
            </p>
          </div>
        </div>
      </div>

      {!experimentRun ? (
        <div className="sorting-info-box">
          Please run the simulation at least once before attempting the quiz.
        </div>
      ) : (
        <div className="modern-quiz-list">
          {quizQuestions.map((q, i) => (
            <div key={i} className="modern-quiz-card">
              <div className="modern-quiz-question">
                {i + 1}. {q.question}
              </div>

              <div className="modern-quiz-options">
                {q.options.map((opt, j) => {
                  const checked = quizAnswers[i] === j;
                  const correct = quizSubmitted && j === q.correct;
                  const wrong = quizSubmitted && checked && j !== q.correct;

                  return (
                    <label
                      key={j}
                      className={`modern-quiz-option ${checked ? "selected" : ""} ${
                        correct ? "correct" : ""
                      } ${wrong ? "wrong" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q${i}`}
                        checked={checked}
                        onChange={() => handleQuizAnswer(i, j)}
                        disabled={quizSubmitted}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {!quizSubmitted ? (
            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "8px" }}>
              <button
                className="sim-btn sim-btn-primary"
                onClick={submitQuiz}
                disabled={quizAnswers.includes(null)}
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="modern-quiz-score">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                  color: "#38bdf8",
                  fontWeight: 700,
                  fontSize: "1.1rem"
                }}
              >
                <Trophy size={18} />
                Quiz Completed
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px",
                  marginBottom: "14px"
                }}
              >
                <div className="sorting-stat-box">
                  <span className="sorting-stat-label">Score</span>
                  <span className="sorting-stat-value">
                    {quizScore}/{quizQuestions.length}
                  </span>
                </div>

                <div className="sorting-stat-box">
                  <span className="sorting-stat-label">Percentage</span>
                  <span className="sorting-stat-value">{percentage}%</span>
                </div>

                <div className="sorting-stat-box">
                  <span className="sorting-stat-label">Result</span>
                  <span
                    className="sorting-stat-value"
                    style={{
                      color:
                        percentage >= 80
                          ? "#34d399"
                          : percentage >= 60
                          ? "#fbbf24"
                          : "#f87171"
                    }}
                  >
                    {getRemark()}
                  </span>
                </div>
              </div>

              <div className="sorting-info-box" style={{ marginBottom: 0 }}>
                Review the highlighted answers above to improve your understanding.
              </div>

              {redoQuiz && (
                <div
                  style={{
                    marginTop: "14px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  <button className="sim-btn sim-btn-muted" onClick={redoQuiz}>
                    <RotateCcw size={16} />
                    Retry Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LinkedListQuiz;