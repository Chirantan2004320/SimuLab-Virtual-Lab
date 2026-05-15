import React from "react";

import {
  Brain,
  Lock,
  Trophy,
  RotateCcw
} from "lucide-react";

export default function DVLSISRAMCellQuiz({
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
  const total =
    questions.length;

  const percentage = total
    ? Math.round(
        (score / total) *
          100
      )
    : 0;

  return (
    <section className="quiz-shell">
      <div
        className="sorting-sim-title-wrap"
        style={{
          marginBottom: 18
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
            understanding of
            SRAM storage,
            wordline control,
            bitline operation,
            and read/write
            functionality.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />

          <span>
            Please interact
            with the SRAM
            cell simulation
            before attempting
            the quiz.
          </span>
        </div>
      ) : !submitted ? (
        <div className="quiz-list">
          {questions.map(
            (q, i) => (
              <div
                key={i}
                className="quiz-card-upgraded"
              >
                <div className="quiz-question-title">
                  {i + 1}.{" "}
                  {q.q}
                </div>

                <div className="quiz-options-grid">
                  {q.options.map(
                    (
                      opt,
                      j
                    ) => (
                      <label
                        key={j}
                        className={`quiz-option-card ${
                          answers[
                            i
                          ] === j
                            ? "selected"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${i}`}
                          checked={
                            answers[
                              i
                            ] ===
                            j
                          }
                          onChange={() =>
                            handleAnswer(
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

          <div className="quiz-actions-row">
            <button
              className="sim-btn sim-btn-primary"
              onClick={
                submitQuiz
              }
              disabled={answers.includes(
                null
              )}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-result-shell">
          <div className="quiz-score-box">
            <Trophy size={22} />

            <div>
              <h3>
                Quiz Completed
              </h3>

              <p>
                Score:{" "}
                <strong>
                  {score} /{" "}
                  {total}
                </strong>{" "}
                (
                {
                  percentage
                }
                %)
              </p>
            </div>
          </div>

          {quizSaveStatus && (
            <p
              style={{
                marginTop: 8
              }}
            >
              {
                quizSaveStatus
              }
            </p>
          )}

          <div className="quiz-list">
            {questions.map(
              (
                q,
                i
              ) => (
                <div
                  key={i}
                  className="quiz-card-upgraded"
                >
                  <div className="quiz-question-title">
                    {i + 1}.{" "}
                    {q.q}
                  </div>

                  <div className="quiz-options-grid">
                    {q.options.map(
                      (
                        opt,
                        j
                      ) => {
                        const isCorrect =
                          j ===
                          q.correct;

                        const isWrong =
                          answers[
                            i
                          ] ===
                            j &&
                          j !==
                            q.correct;

                        return (
                          <div
                            key={
                              j
                            }
                            className={`quiz-option-card result-mode ${
                              isCorrect
                                ? "correct"
                                : isWrong
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
              Retry Quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}