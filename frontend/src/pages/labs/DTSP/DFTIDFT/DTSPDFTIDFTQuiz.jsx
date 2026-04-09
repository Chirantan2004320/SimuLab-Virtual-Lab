import React from "react";

export default function DTSPDFTIDFTQuiz({
  experimentRun,
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizScore,
  handleQuizAnswer,
  submitQuiz,
  redoQuiz
}) {
  return (
    <section className="card">
      <h2>Quiz</h2>

      {!experimentRun ? (
        <p>Please run the simulation at least once before attempting the quiz.</p>
      ) : (
        <div>
          {quizQuestions.map((q, i) => (
            <div key={i} className="quiz-question">
              <p>
                <strong>{i + 1}. {q.question}</strong>
              </p>

              {q.options.map((opt, j) => (
                <label
                  key={j}
                  className={`quiz-option ${
                    quizSubmitted
                      ? j === q.correct
                        ? "correct"
                        : quizAnswers[i] === j
                        ? "wrong"
                        : ""
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={j}
                    checked={quizAnswers[i] === j}
                    onChange={() => handleQuizAnswer(i, j)}
                    disabled={quizSubmitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {!quizSubmitted ? (
            <button
              className="btn primary"
              onClick={submitQuiz}
              disabled={quizAnswers.includes(null)}
            >
              Submit Quiz
            </button>
          ) : (
            <div>
              <p>Score: {quizScore} / {quizQuestions.length}</p>
              <button className="btn secondary" onClick={redoQuiz}>
                Redo Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}