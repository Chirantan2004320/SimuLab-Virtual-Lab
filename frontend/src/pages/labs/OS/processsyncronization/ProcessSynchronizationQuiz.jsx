import React from "react";

import {
  Brain,
  Lock,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Download,
  ShieldCheck,
  Database,
  Sparkles,
} from "lucide-react";

export default function ProcessSynchronizationQuiz({
  mode,
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizScore,
  quizSaveStatus,
  experimentRun,
  handleQuizAnswer,
  submitQuiz,
  redoQuiz,
  exportQuiz,
}) {

  const modeNames = {
    critical:
      "Critical Section",

    semaphore:
      "Semaphore",

    producerConsumer:
      "Producer Consumer",
  };

  const modeInsights = {
    critical:
      "Understand mutual exclusion, race conditions, and critical section handling.",

    semaphore:
      "Learn how wait() and signal() synchronize shared resource access.",

    producerConsumer:
      "Analyze bounded buffer synchronization between producers and consumers.",
  };

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
              Test your understanding
              after running the
              synchronization
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
            below for{" "}
            {
              modeNames[
                mode
              ]
            }{" "}
            synchronization.
          </p>

        </div>

      </div>

      <div
        className="sorting-info-box"
        style={{
          marginBottom: 22,
        }}
      >

        <Sparkles
          size={16}
          style={{
            marginRight: 10,
          }}
        />

        {
          modeInsights[
            mode
          ]
        }

      </div>

      {quizQuestions.length ===
      0 ? (

        <div className="quiz-locked-box">

          <Database
            size={18}
          />

          <span>
            No quiz questions have
            been assigned by the
            faculty yet.
          </span>

        </div>

      ) : !quizSubmitted ? (

        <div className="quiz-list">

          {quizQuestions.map(
            (q, i) => (

              <div
                key={q.id || i}
                className="quiz-card-upgraded"
                style={{
                  position:
                    "relative",

                  overflow:
                    "hidden",
                }}
              >

                <div
                  style={{
                    position:
                      "absolute",

                    top: 0,

                    left: 0,

                    width: 5,

                    height:
                      "100%",

                    background:
                      "linear-gradient(to bottom, #38bdf8, #8b5cf6)",
                  }}
                />

                <div className="quiz-question-title">

                  {i + 1}.{" "}
                  {q.question}

                </div>

                <div className="quiz-options-grid">

                  {q.options.map(
                    (
                      opt,
                      j
                    ) => (

                      <label
                        key={j}
                        className="quiz-option-card"
                        style={{
                          transition:
                            "all 0.25s ease",
                        }}
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

            <ShieldCheck
              size={16}
            />

            Submit Quiz

          </button>

        </div>

      ) : (

        <div className="quiz-result-shell">

          <div className="quiz-score-box">

            {percentage >=
            60 ? (

              <CheckCircle2
                size={24}
              />

            ) : (

              <XCircle
                size={24}
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
                    {q.question}

                  </div>

                  <div className="quiz-options-grid">

                    {q.options.map(
                      (
                        opt,
                        j
                      ) => {

                        const isCorrect =
                          opt ===
                            q.correct_answer ||
                          j ===
                            q.correct;

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
                            style={{
                              transition:
                                "all 0.25s ease",
                            }}
                          >

                            <span>
                              {opt}
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

            {exportQuiz && (

              <button
                className="sim-btn sim-btn-primary"
                onClick={
                  exportQuiz
                }
              >

                <Download
                  size={16}
                />

                Export Results

              </button>

            )}

          </div>

        </div>
      )}

    </section>
  );
}