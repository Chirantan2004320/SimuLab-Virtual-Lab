import React from "react";

export default function ProcessSynchronizationQuiz({
  mode,
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizScore,
  experimentRun,
  handleQuizAnswer,
  submitQuiz
}) {
  return (
    <section className="card">
      <h2>
        Quiz <span style={{ color: "#38bdf8" }}>({mode.toUpperCase()})</span>
      </h2>

      {!experimentRun ? (
        <p style={{ color: "#d1d5db" }}>
          Please run the experiment at least once before attempting the quiz.
        </p>
      ) : (
        <div>
          {quizQuestions.map((q, i) => (
            <div
              key={i}
              style={{
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: "#e5e7eb", fontSize: "1.05rem" }}>
                  {i + 1}. {q.question}
                </strong>
              </div>

              <div style={{ marginLeft: 20 }}>
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                      cursor: "pointer",
                      color: "#d1d5db"
                    }}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={quizAnswers[i] === j}
                      onChange={() => handleQuizAnswer(i, j)}
                      disabled={quizSubmitted}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {!quizSubmitted ? (
            <button className="btn primary" onClick={submitQuiz}>
              Submit Quiz
            </button>
          ) : (
            <div
              style={{
                marginTop: 16,
                padding: "1rem",
                background: "rgba(56,189,248,0.1)",
                borderRadius: 8,
                borderLeft: "4px solid #38bdf8"
              }}
            >
              <strong style={{ color: "#38bdf8", fontSize: "1.1rem" }}>
                Quiz Score: {quizScore} / {quizQuestions.length}
              </strong>
            </div>
          )}
        </div>
      )}
    </section>
  );
}