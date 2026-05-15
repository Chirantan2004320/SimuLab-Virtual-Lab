import React from "react";

import {
  Brain,
  Lock,
  Trophy,
  RotateCcw
} from "lucide-react";

const questions = [
  {
    q: "GPIO stands for:",

    options: [
      "General Purpose Input Output",
      "Global Port IO",
      "General Processing Unit",
      "None"
    ],

    correct: 0
  },

  {
    q: "LED turns ON when the GPIO output is:",

    options: [
      "LOW",
      "HIGH",
      "FLOAT",
      "NONE"
    ],

    correct: 1
  },

  {
    q: "Why is a resistor connected in series with the LED?",

    options: [
      "To increase voltage",
      "To limit current and protect the LED",
      "To store data",
      "To convert AC to DC"
    ],

    correct: 1
  },

  {
    q: "If GPIO D13 is LOW, the LED will be:",

    options: [
      "ON",
      "OFF",
      "Blinking always",
      "Damaged immediately"
    ],

    correct: 1
  },

  {
    q: "For controlling an LED, the GPIO pin should be configured as:",

    options: [
      "INPUT",
      "OUTPUT",
      "ANALOG ONLY",
      "RESET"
    ],

    correct: 1
  }
];

export default function GPIOLEDQuiz({
  experimentRun,
  answers,
  submitted,
  score,
  quizSaveStatus,
  handleAnswer,
  submitQuiz,
  redoQuiz
}) {
  const total = questions.length;

  const percentage = total
    ? Math.round((score / total) * 100)
    : 0;

  return (
    <section className="quiz-shell">
      <div
        className="sorting-sim-title-wrap"
        style={{ marginBottom: 18 }}
      >
        <div className="sorting-sim-icon">
          <Brain size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Quiz
          </h2>

          <p className="sorting-sim-subtitle">
            Test your understanding of GPIO pins,
            LED control logic, HIGH/LOW states,
            and current-limiting resistors.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />

          <span>
            Please interact with the GPIO LED
            simulation before attempting the quiz.
          </span>
        </div>
      ) : !submitted ? (
        <div className="quiz-list">
          {questions.map((q, i) => (
            <div
              key={i}
              className="quiz-card-upgraded"
            >
              <div className="quiz-question-title">
                {i + 1}. {q.q}
              </div>

              <div className="quiz-options-grid">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`quiz-option-card ${
                      answers[i] === j
                        ? "selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={answers[i] === j}
                      onChange={() =>
                        handleAnswer(i, j)
                      }
                    />

                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="quiz-actions-row">
            <button
              className="sim-btn sim-btn-primary"
              onClick={submitQuiz}
              disabled={answers.includes(null)}
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
              <h3>Quiz Completed</h3>

              <p>
                Score:{" "}
                <strong>
                  {score} / {total}
                </strong>{" "}
                ({percentage}%)
              </p>
            </div>
          </div>

          {quizSaveStatus && (
            <p style={{ marginTop: 8 }}>
              {quizSaveStatus}
            </p>
          )}

          <div className="quiz-list">
            {questions.map((q, i) => (
              <div
                key={i}
                className="quiz-card-upgraded"
              >
                <div className="quiz-question-title">
                  {i + 1}. {q.q}
                </div>

                <div className="quiz-options-grid">
                  {q.options.map((opt, j) => {
                    const isCorrect =
                      j === q.correct;

                    const isWrong =
                      answers[i] === j &&
                      j !== q.correct;

                    return (
                      <div
                        key={j}
                        className={`quiz-option-card result-mode ${
                          isCorrect
                            ? "correct"
                            : isWrong
                            ? "wrong"
                            : ""
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
            <button
              className="sim-btn sim-btn-muted"
              onClick={redoQuiz}
            >
              <RotateCcw size={16} />
              Retry Quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}