import React from "react";
import { Brain, CheckCircle2, Lock, RotateCcw } from "lucide-react";

export default function DBMSQueryOptimizationQuiz({
  mode,
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizScore,
  experimentRun,
  handleQuizAnswer,
  submitQuiz,
}) {
  const total = quizQuestions.length;
  const percentage = total ? Math.round((quizScore / total) * 100) : 0;

  return (
    <section className="quiz-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Brain size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Quiz</h2>
          <p className="sorting-sim-subtitle">
            Check your understanding of {mode.toUpperCase()} optimization
            concepts.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please run the experiment at least once before attempting the quiz.</span>
        </div>
      ) : !quizSubmitted ? (
        <div className="quiz-list">
          {quizQuestions.map((q, i) => (
            <div key={i} className="quiz-card-upgraded">
              <div className="quiz-question-title">
                {i + 1}. {q.question}
              </div>

              <div className="quiz-options-grid">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`quiz-option-card ${quizAnswers[i] === j ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={quizAnswers[i] === j}
                      onChange={() => handleQuizAnswer(i, j)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            className="sim-btn sim-btn-primary"
            onClick={submitQuiz}
            disabled={quizAnswers.includes(null)}
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-result-shell">
          <div className="quiz-score-box">
            <CheckCircle2 size={22} />
            <div>
              <h3>Quiz Submitted</h3>
              <p>
                Score: <b>{quizScore}</b> / {total} ({percentage}%)
              </p>
            </div>
          </div>

          <div className="quiz-list">
            {quizQuestions.map((q, i) => (
              <div key={i} className="quiz-card-upgraded">
                <div className="quiz-question-title">
                  {i + 1}. {q.question}
                </div>

                <div className="quiz-options-grid">
                  {q.options.map((opt, j) => {
                    const isCorrect = j === q.correct;
                    const isChosen = quizAnswers[i] === j;

                    return (
                      <div
                        key={j}
                        className={`quiz-option-card result-mode ${
                          isCorrect ? "correct" : isChosen ? "wrong" : ""
                        }`}
                      >
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            className="sim-btn sim-btn-muted"
            onClick={() => window.location.reload()}
          >
            <RotateCcw size={16} />
            Retry Later
          </button>
        </div>
      )}
    </section>
  );
}