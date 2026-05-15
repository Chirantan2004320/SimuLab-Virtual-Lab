import React from "react";

import {
  Brain,
  Lock,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from "lucide-react";

export default function StackQuiz({
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizScore,
  quizSaveStatus,
  experimentRun,
  handleQuizAnswer,
  submitQuiz,
  redoQuiz,
}) {
  const total =
    quizQuestions.length;

  const percentage = total
    ? Math.round(
        (quizScore / total) *
          100
      )
    : 0;

  if (!experimentRun) {
    return (
      <section className="quiz-shell">
        <div
          className="sorting-sim-title-wrap"
          style={{
            marginBottom: 18,
          }}
        >
          <div className="sorting-sim-icon">
            <Brain size={18} />
          </div>

          <div>
            <h2 className="sorting-sim-title">
              Quiz
            </h2>

            <p className="sorting-sim-subtitle">
              Test your
              understanding after
              using the stack
              simulation.
            </p>
          </div>
        </div>

        <div className="quiz-locked-box">
          <Lock size={18} />

          <span>
            Please run the
            simulation at least
            once before attempting
            the quiz.
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-shell">
      <div
        className="sorting-sim-title-wrap"
        style={{
          marginBottom: 18,
        }}
      >
        <div className="sorting-sim-icon">
          <Brain size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Quiz
          </h2>

          <p className="sorting-sim-subtitle">
            Answer the questions
            below to verify your
            stack concepts.
          </p>
        </div>
      </div>

      {!quizSubmitted ? (
        <div className="quiz-list">
          {quizQuestions.map(
            (q, i) => (
              <div
                key={q.id || i}
                className="quiz-card-upgraded"
              >
                <div className="quiz-question-title">
                  {i + 1}.{" "}
                  {q.question}
                </div>

                <div className="quiz-options-grid">
                  {q.options.map(
                    (opt, j) => (
                      <label
                        key={j}
                        className="quiz-option-card"
                      >
                        <input
                          type="radio"
                          name={`q${i}`}
                          value={j}
                          checked={
                            quizAnswers[
                              i
                            ] === j
                          }
                          onChange={() =>
                            handleQuizAnswer(
                              i,
                              j
                            )
                          }
                        />

                        <span>
                          {opt}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )
          )}

          <button
            className="sim-btn sim-btn-primary"
            onClick={submitQuiz}
            disabled={
              quizAnswers.includes(
                null
              ) ||
              quizQuestions.length ===
                0
            }
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-result-shell">
          <div className="quiz-score-box">
            {percentage >=
            60 ? (
              <CheckCircle2
                size={22}
              />
            ) : (
              <XCircle
                size={22}
              />
            )}

            <div>
              <h3>
                Quiz Submitted
              </h3>

              <p>
                Score:{" "}
                <b>
                  {quizScore}
                </b>{" "}
                / {total} (
                {percentage}%)
              </p>
            </div>
          </div>

          {quizSaveStatus && (
            <p
              className="text-sm text-muted-foreground"
              style={{
                marginTop: 8,
              }}
            >
              {
                quizSaveStatus
              }
            </p>
          )}

          <div className="quiz-list">
            {quizQuestions.map(
              (q, i) => (
                <div
                  key={q.id || i}
                  className="quiz-card-upgraded"
                >
                  <div className="quiz-question-title">
                    {i + 1}.{" "}
                    {
                      q.question
                    }
                  </div>

                  <div className="quiz-options-grid">
                    {q.options.map(
                      (
                        opt,
                        j
                      ) => {
                        const isCorrect =
                          opt ===
                          q.correct_answer;

                        const isChosen =
                          quizAnswers[
                            i
                          ] === j;

                        return (
                          <div
                            key={
                              j
                            }
                            className={`quiz-option-card result-mode ${
                              isCorrect
                                ? "correct"
                                : isChosen
                                ? "wrong"
                                : ""
                            }`}
                          >
                            <span>
                              {
                                opt
                              }
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="quiz-actions-row">
            <button
              className="sim-btn sim-btn-muted"
              onClick={
                redoQuiz
              }
            >
              <RotateCcw
                size={16}
              />

              Redo Quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}