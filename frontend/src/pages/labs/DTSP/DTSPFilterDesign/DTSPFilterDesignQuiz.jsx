import React from "react";
import { Brain, RotateCcw, CheckCircle2, Lock } from "lucide-react";

export default function DTSPFilterDesignQuiz({
  experimentRun,
  questions,
  answers,
  submitted,
  score,
  quizSaveStatus,
  handleAnswer,
  submitQuiz,
  redoQuiz
}) {
  const total = questions.length;
  const percentage = total ? Math.round((score / total) * 100) : 0;

  if (!experimentRun) {
    return (
      <section className="quiz-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <Brain size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Quiz</h2>
            <p className="sorting-sim-subtitle">
              Test your understanding after generating the filter.
            </p>
          </div>
        </div>

        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>
            Please generate and observe the filter at least once before attempting the quiz.
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Brain size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Quiz</h2>
          <p className="sorting-sim-subtitle">
            Answer the questions below for FIR Filter Design.
          </p>
        </div>
      </div>

      {!submitted ? (
        <div className="quiz-list">
          {questions.map((q, i) => (
            <div key={i} className="quiz-card-upgraded">
              <div className="quiz-question-title">
                {i + 1}. {q.q}
              </div>

              <div className="quiz-options-grid">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`quiz-option-card ${
                      answers[i] === j ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={j}
                      checked={answers[i] === j}
                      onChange={() => handleAnswer(i, j)}
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
            disabled={answers.includes(null)}
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
                Score: <b>{score}</b> / {total} ({percentage}%)
              </p>
            </div>
          </div>

          {quizSaveStatus && (
            <p
              className="text-sm text-muted-foreground"
              style={{ marginTop: 8 }}
            >
              {quizSaveStatus}
            </p>
          )}

          <div className="quiz-list">
            {questions.map((q, i) => (
              <div key={i} className="quiz-card-upgraded">
                <div className="quiz-question-title">
                  {i + 1}. {q.q}
                </div>

                <div className="quiz-options-grid">
                  {q.options.map((opt, j) => {
                    const isCorrect = j === q.correct;
                    const isChosen = answers[i] === j;

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

          <div className="quiz-actions-row">
            <button className="sim-btn sim-btn-muted" onClick={redoQuiz}>
              <RotateCcw size={16} />
              Redo Quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}